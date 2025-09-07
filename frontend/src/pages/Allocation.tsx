import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Users, Target, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { mockCandidates } from '@/data/mockData';

interface ApprovedCandidate {
  candidate: any;
  project: any;
  fit_score: number;
  skill_match: number;
  availability_match: number;
  seniority_match: number;
  explanation: string;
  approvedAt: string;
}

const Allocation = () => {
  const [approvedCandidates, setApprovedCandidates] = useState<ApprovedCandidate[]>([]);

  const loadApprovedCandidates = React.useCallback(() => {
    try {
      const savedApprovals = localStorage.getItem('approvedCandidates');
      console.log('Loading approved candidates from localStorage:', savedApprovals);
      if (savedApprovals) {
        const parsed = JSON.parse(savedApprovals);
        console.log('Parsed approved candidates:', parsed);
        setApprovedCandidates(parsed);
      } else {
        console.log('No approved candidates found in localStorage');
        setApprovedCandidates([]);
      }
    } catch (error) {
      console.error('Error loading approved candidates:', error);
      setApprovedCandidates([]);
    }
  }, []);

  useEffect(() => {
    loadApprovedCandidates();
    
    // Listen for storage changes (when data is updated from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'approvedCandidates') {
        console.log('Storage changed, reloading approved candidates');
        loadApprovedCandidates();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRemoveApproval = (candidateId: string, projectName: string) => {
    const updatedApprovals = approvedCandidates.filter(
      approval => !(approval.candidate.id === candidateId && approval.project.name === projectName)
    );
    setApprovedCandidates(updatedApprovals);
    localStorage.setItem('approvedCandidates', JSON.stringify(updatedApprovals));
  };

  const getStatusColor = (fitScore: number) => {
    if (fitScore >= 0.9) return 'bg-red-100 text-red-800';
    if (fitScore >= 0.8) return 'bg-orange-100 text-orange-800';
    if (fitScore >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityText = (fitScore: number) => {
    if (fitScore >= 0.9) return 'Critical Priority';
    if (fitScore >= 0.8) return 'High Priority';
    if (fitScore >= 0.7) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resource Allocation Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage approved candidates and their project assignments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {approvedCandidates.length}
              </div>
              <div className="text-sm text-gray-600">Approved Candidates</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {new Set(approvedCandidates.map(a => a.project.name)).size}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(approvedCandidates.reduce((sum, a) => sum + a.fit_score, 0) / approvedCandidates.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {approvedCandidates.filter(a => a.candidate.availability === 'Available').length}
              </div>
              <div className="text-sm text-gray-600">Available Now</div>
            </CardContent>
          </Card>
        </div>

        {/* Approved Candidates Table */}
        {approvedCandidates.length > 0 ? (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Approved Candidates
                </CardTitle>
                <Button 
                  onClick={loadApprovedCandidates}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">CANDIDATE</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">PROJECT</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">PRIORITY</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">FIT SCORE</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">STATUS</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">APPROVED DATE</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedCandidates.map((approval, index) => (
                      <tr key={`${approval.candidate.id}-${approval.project.name}`} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-semibold text-gray-900">{approval.candidate.name}</div>
                            <div className="text-sm text-gray-600">{approval.project.name}</div>
                            <div className="text-xs text-gray-500">{approval.candidate.role} • {approval.candidate.location}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{approval.project.name}</div>
                            <div className="text-sm text-gray-600">Project Assignment</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.fit_score)}`}>
                            {getPriorityText(approval.fit_score)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {approval.fit_score}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Approved</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            {new Date(approval.approvedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveApproval(approval.candidate.id, approval.project.name)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Approved Candidates</h3>
              <p className="text-gray-600 mb-6">
                Go to the Dashboard to approve candidates for project assignments.
              </p>
              <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Allocation;
