// AI Matching Service
// Handles communication with the Python AI matching API

const API_BASE_URL = 'http://localhost:5000/api';

export interface AIMatch {
  candidate: any;
  project: any;
  fit_score: number;
  skill_match: number;
  availability_match: number;
  seniority_match: number;
  explanation: string;
}

export interface ProjectMatches {
  project: any;
  candidates: Omit<AIMatch, 'project'>[];
}

export interface AIMatchingResponse {
  success: boolean;
  matches: Record<string, ProjectMatches>;
  total_matches: number;
}

export interface CandidateAnalysis {
  project: any;
  fit_score: number;
  skill_match: number;
  availability_match: number;
  seniority_match: number;
  explanation: string;
}

export interface CandidateAnalysisResponse {
  success: boolean;
  candidate: any;
  analyses: CandidateAnalysis[];
  total_analyses: number;
}

class AIMatchingService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.makeRequest('/health');
  }

  async matchCandidatesToProjects(candidates: any[], projects: any[]): Promise<AIMatchingResponse> {
    return this.makeRequest('/match', {
      method: 'POST',
      body: JSON.stringify({ candidates, projects }),
    });
  }

  async matchCandidatesForProject(projectId: string, candidates: any[], projects: any[]): Promise<{
    success: boolean;
    project: any;
    matches: Omit<AIMatch, 'project'>[];
    total_matches: number;
  }> {
    return this.makeRequest(`/match/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ candidates, projects }),
    });
  }

  async analyzeCandidate(candidateId: string, candidate: any, projects: any[]): Promise<CandidateAnalysisResponse> {
    return this.makeRequest(`/analyze/candidate/${candidateId}`, {
      method: 'POST',
      body: JSON.stringify({ candidate, projects }),
    });
  }
}

export const aiMatchingService = new AIMatchingService();
