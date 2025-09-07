#!/usr/bin/env python3
"""
Flask API Server for AI Matching
Provides REST API endpoints for candidate-project matching
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from ai_matching import AIMatcher

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global matcher instance
matcher = None

def initialize_matcher():
    """Initialize the AI matcher"""
    global matcher
    if matcher is None:
        matcher = AIMatcher()
    return matcher

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "AI Matching API is running"})

@app.route('/api/match', methods=['POST'])
def match_candidates():
    """Match candidates to projects"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        candidates = data.get('candidates', [])
        projects = data.get('projects', [])
        
        if not candidates or not projects:
            return jsonify({"error": "Candidates and projects data required"}), 400
        
        # Initialize matcher
        matcher = initialize_matcher()
        
        # Run matching
        matches = matcher.match_candidates_to_projects(candidates, projects)
        
        # Group matches by project
        project_matches = {}
        for match in matches:
            project_id = match['project']['id']
            if project_id not in project_matches:
                project_matches[project_id] = {
                    'project': match['project'],
                    'candidates': []
                }
            project_matches[project_id]['candidates'].append({
                'candidate': match['candidate'],
                'fit_score': match['fit_score'],
                'skill_match': match['skill_match'],
                'availability_match': match['availability_match'],
                'seniority_match': match['seniority_match'],
                'explanation': match['explanation']
            })
        
        # Sort candidates within each project by fit score
        for project_id in project_matches:
            project_matches[project_id]['candidates'].sort(
                key=lambda x: x['fit_score'], reverse=True
            )
        
        return jsonify({
            "success": True,
            "matches": project_matches,
            "total_matches": len(matches)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/match/project/<project_id>', methods=['POST'])
def match_candidates_for_project(project_id):
    """Match candidates for a specific project"""
    try:
        data = request.get_json()
        candidates = data.get('candidates', [])
        projects = data.get('projects', [])
        
        # Find the specific project
        project = None
        for p in projects:
            if p['id'] == project_id:
                project = p
                break
        
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        # Initialize matcher
        matcher = initialize_matcher()
        
        # Run matching for this project only
        matches = []
        for candidate in candidates:
            match_result = matcher.calculate_fit_score(candidate, project)
            if match_result['fit_score'] > 0.2:
                matches.append({
                    'candidate': candidate,
                    'fit_score': match_result['fit_score'],
                    'skill_match': match_result['skill_match'],
                    'availability_match': match_result['availability_match'],
                    'seniority_match': match_result['seniority_match'],
                    'explanation': match_result['explanation']
                })
        
        # Sort by fit score
        matches.sort(key=lambda x: x['fit_score'], reverse=True)
        
        return jsonify({
            "success": True,
            "project": project,
            "matches": matches,
            "total_matches": len(matches)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze/candidate/<candidate_id>', methods=['POST'])
def analyze_candidate(candidate_id):
    """Analyze a specific candidate against all projects"""
    try:
        data = request.get_json()
        candidate = data.get('candidate')
        projects = data.get('projects', [])
        
        if not candidate:
            return jsonify({"error": "Candidate data required"}), 400
        
        # Initialize matcher
        matcher = initialize_matcher()
        
        # Analyze candidate against all projects
        analyses = []
        for project in projects:
            match_result = matcher.calculate_fit_score(candidate, project)
            analyses.append({
                'project': project,
                'fit_score': match_result['fit_score'],
                'skill_match': match_result['skill_match'],
                'availability_match': match_result['availability_match'],
                'seniority_match': match_result['seniority_match'],
                'explanation': match_result['explanation']
            })
        
        # Sort by fit score
        analyses.sort(key=lambda x: x['fit_score'], reverse=True)
        
        return jsonify({
            "success": True,
            "candidate": candidate,
            "analyses": analyses,
            "total_analyses": len(analyses)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Matching API Server...")
    print("API will be available at: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    app.run(debug=True, host='0.0.0.0', port=5000)