#!/usr/bin/env python3
"""
AI Matching Script for Candidate-Project Matching
Uses sentence transformers for skill matching and weighted scoring
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from typing import List, Dict, Tuple
import sys
import os

class AIMatcher:
    def __init__(self):
        """Initialize the AI matcher with sentence transformer model"""
        print("Loading AI model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully!")
    
    def parse_skills(self, skills_text: str) -> List[str]:
        """Parse skills from text format"""
        if not skills_text or pd.isna(skills_text):
            return []
        
        skills = []
        # Handle format: "skill1:proficiency1,skill2:proficiency2"
        skill_pairs = skills_text.split(',')
        for pair in skill_pairs:
            if ':' in pair:
                skill = pair.split(':')[0].strip()
                skills.append(skill)
            else:
                skills.append(pair.strip())
        return skills
    
    def get_skill_embeddings(self, skills: List[str]) -> np.ndarray:
        """Get embeddings for a list of skills"""
        if not skills:
            return np.zeros((1, 384))  # Default embedding size for all-MiniLM-L6-v2
        
        # Join skills with separator for better context
        skills_text = ', '.join(skills)
        embeddings = self.model.encode([skills_text])
        return embeddings
    
    def calculate_skill_similarity(self, candidate_skills: List[str], required_skills: List[str]) -> float:
        """Calculate skill similarity using embeddings"""
        if not candidate_skills or not required_skills:
            return 0.0
        
        # Get embeddings
        candidate_emb = self.get_skill_embeddings(candidate_skills)
        required_emb = self.get_skill_embeddings(required_skills)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(candidate_emb, required_emb)[0][0]
        return float(similarity)
    
    def calculate_availability_match(self, availability: str) -> float:
        """Calculate availability match score"""
        availability_lower = availability.lower() if availability else ""
        
        if 'available' in availability_lower:
            return 1.0
        elif 'partially available' in availability_lower:
            return 0.7
        elif 'busy' in availability_lower or 'unavailable' in availability_lower:
            return 0.2
        else:
            return 0.5  # Default for unknown status
    
    def calculate_seniority_match(self, candidate_tier: str, required_seniority: str) -> float:
        """Calculate seniority match score based on tier and seniority"""
        if not candidate_tier or not required_seniority:
            return 0.5
        
        # Map tiers to seniority levels
        tier_levels = {'A': 3, 'B': 2, 'C': 1}
        candidate_level = tier_levels.get(candidate_tier, 2)
        
        # Map seniority requirements to levels
        seniority_levels = {
            'junior': 1,
            'mid': 2,
            'senior': 3,
            'lead': 4,
            'principal': 5
        }
        
        required_level = seniority_levels.get(required_seniority.lower(), 2)
        
        # Calculate proximity score
        level_diff = abs(candidate_level - required_level)
        if level_diff == 0:
            return 1.0
        elif level_diff == 1:
            return 0.8
        elif level_diff == 2:
            return 0.6
        else:
            return 0.3
    
    def calculate_fit_score(self, candidate: Dict, project: Dict) -> Dict:
        """Calculate overall fit score for a candidate-project pair"""
        # Parse skills
        candidate_skills = candidate.get('skills', [])
        required_skills = self.parse_skills(project.get('required_skills', ''))
        
        # Calculate individual scores
        skill_match = self.calculate_skill_similarity(candidate_skills, required_skills)
        availability_match = self.calculate_availability_match(candidate.get('availability', ''))
        seniority_match = self.calculate_seniority_match(
            candidate.get('tier', ''), 
            project.get('seniority', '')
        )
        
        # Weighted fit score
        fit_score = 0.5 * skill_match + 0.3 * availability_match + 0.2 * seniority_match
        
        # Generate explanation
        explanation = self.generate_explanation(
            candidate, project, skill_match, availability_match, seniority_match
        )
        
        return {
            'fit_score': round(fit_score, 3),
            'skill_match': round(skill_match, 3),
            'availability_match': round(availability_match, 3),
            'seniority_match': round(seniority_match, 3),
            'explanation': explanation
        }
    
    def generate_explanation(self, candidate: Dict, project: Dict, 
                           skill_match: float, availability_match: float, seniority_match: float) -> str:
        """Generate human-readable explanation for the match"""
        candidate_name = candidate.get('name', 'Unknown')
        project_name = project.get('name', 'Unknown')
        
        # Skill explanation
        candidate_skills = candidate.get('skills', [])
        required_skills = self.parse_skills(project.get('required_skills', ''))
        
        matching_skills = []
        for req_skill in required_skills:
            for cand_skill in candidate_skills:
                if req_skill.lower() in cand_skill.lower() or cand_skill.lower() in req_skill.lower():
                    matching_skills.append(req_skill)
                    break
        
        skill_explanation = f"Skills match: {len(matching_skills)}/{len(required_skills)} required skills"
        if matching_skills:
            skill_explanation += f" ({', '.join(matching_skills)})"
        
        # Availability explanation
        availability = candidate.get('availability', 'Unknown')
        availability_explanation = f"Availability: {availability}"
        
        # Seniority explanation
        candidate_tier = candidate.get('tier', 'Unknown')
        required_seniority = project.get('seniority', 'Unknown')
        seniority_explanation = f"Seniority: {candidate_tier} vs {required_seniority} required"
        
        return f"{skill_explanation}. {availability_explanation}. {seniority_explanation}."
    
    def match_candidates_to_projects(self, candidates: List[Dict], projects: List[Dict]) -> List[Dict]:
        """Match all candidates to all projects"""
        matches = []
        
        print(f"Matching {len(candidates)} candidates to {len(projects)} projects...")
        
        for i, project in enumerate(projects):
            print(f"Processing project {i+1}/{len(projects)}: {project.get('name', 'Unknown')}")
            
            for candidate in candidates:
                match_result = self.calculate_fit_score(candidate, project)
                
                # Only include matches with reasonable fit score
                if match_result['fit_score'] > 0.2:
                    match_data = {
                        'candidate': candidate,
                        'project': project,
                        **match_result
                    }
                    matches.append(match_data)
        
        # Sort by fit score
        matches.sort(key=lambda x: x['fit_score'], reverse=True)
        
        print(f"Generated {len(matches)} matches")
        return matches

def main():
    """Main function to run AI matching"""
    if len(sys.argv) != 3:
        print("Usage: python ai_matching.py <candidates.json> <projects.json>")
        sys.exit(1)
    
    candidates_file = sys.argv[1]
    projects_file = sys.argv[2]
    
    # Load data
    print("Loading data...")
    with open(candidates_file, 'r') as f:
        candidates = json.load(f)
    with open(projects_file, 'r') as f:
        projects = json.load(f)
    
    # Initialize matcher
    matcher = AIMatcher()
    
    # Run matching
    matches = matcher.match_candidates_to_projects(candidates, projects)
    
    # Save results
    output_file = 'ai_matches.json'
    with open(output_file, 'w') as f:
        json.dump(matches, f, indent=2)
    
    print(f"Results saved to {output_file}")
    
    # Print top matches
    print("\nTop 10 Matches:")
    print("-" * 80)
    for i, match in enumerate(matches[:10]):
        candidate = match['candidate']
        project = match['project']
        print(f"{i+1}. {candidate['name']} → {project['name']}")
        print(f"   Fit Score: {match['fit_score']:.1%}")
        print(f"   Skills: {match['skill_match']:.1%}, Availability: {match['availability_match']:.1%}, Seniority: {match['seniority_match']:.1%}")
        print(f"   Explanation: {match['explanation']}")
        print()

if __name__ == "__main__":
    main()