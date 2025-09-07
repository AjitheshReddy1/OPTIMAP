import { Upload, ArrowRight, Brain, Users, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { parseCSVContent, validateCSVFormat, ParsedProject } from "@/utils/csvParser";
import { mockCandidates } from "@/data/mockData";
import { aiMatchingService } from "@/services/aiMatchingService";

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploadedProjects, setUploadedProjects] = useState<ParsedProject[]>(() => {
    try {
      const saved = localStorage.getItem('dashboardUploadedProjects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [topMatches, setTopMatches] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('dashboardTopMatches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploaded, setIsUploaded] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboardIsUploaded');
      return saved === 'true';
    } catch {
      return false;
    }
  });
  const [candidateStatuses, setCandidateStatuses] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dashboardCandidateStatuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Calculate statistics based on uploaded data
  const calculateStats = () => {
    const activeProjects = uploadedProjects.length;
    const totalRoles = uploadedProjects.reduce((sum, project) => sum + (project.rolesNeeded?.length || 0), 0);
    const averageMatchScore = topMatches.length > 0 
      ? topMatches.reduce((sum, match) => sum + (match.fit_score || 0), 0) / topMatches.length 
      : 0;
    const matchEfficiency = Math.round(averageMatchScore);
    
    return {
      activeProjects,
      openRoles: totalRoles,
      matchEfficiency: Math.max(matchEfficiency, 0)
    };
  };

  const stats = calculateStats();

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('dashboardUploadedProjects', JSON.stringify(uploadedProjects));
    } catch (error) {
      console.error('Error saving uploaded projects to localStorage:', error);
    }
  }, [uploadedProjects]);

  useEffect(() => {
    try {
      localStorage.setItem('dashboardTopMatches', JSON.stringify(topMatches));
    } catch (error) {
      console.error('Error saving top matches to localStorage:', error);
    }
  }, [topMatches]);

  useEffect(() => {
    try {
      localStorage.setItem('dashboardIsUploaded', isUploaded.toString());
    } catch (error) {
      console.error('Error saving isUploaded to localStorage:', error);
    }
  }, [isUploaded]);

  useEffect(() => {
    try {
      localStorage.setItem('dashboardCandidateStatuses', JSON.stringify(candidateStatuses));
    } catch (error) {
      console.error('Error saving candidate statuses to localStorage:', error);
    }
  }, [candidateStatuses]);

  // Clear dashboard data on page refresh (manual refresh)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear dashboard-specific localStorage on page refresh
      try {
        localStorage.removeItem('dashboardUploadedProjects');
        localStorage.removeItem('dashboardTopMatches');
        localStorage.removeItem('dashboardIsUploaded');
        localStorage.removeItem('dashboardCandidateStatuses');
      } catch (error) {
        console.error('Error clearing dashboard localStorage on refresh:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleProjectUpload = () => {
    if (isUploaded) {
      // Reset upload state
      setIsUploaded(false);
      setUploadedProjects([]);
      setTopMatches([]);
      setCandidateStatuses({});
      
      // Clear localStorage
      try {
        localStorage.removeItem('dashboardUploadedProjects');
        localStorage.removeItem('dashboardTopMatches');
        localStorage.removeItem('dashboardIsUploaded');
        localStorage.removeItem('dashboardCandidateStatuses');
      } catch (error) {
        console.error('Error clearing dashboard localStorage:', error);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      // Trigger file input click
      fileInputRef.current?.click();
    }
  };

  const handleCandidateAction = (candidateId: string, projectName: string, action: 'approve' | 'reject', match: any, index: number) => {
    const uniqueKey = `${candidateId}-${projectName}-${index}`;
    console.log('Action triggered:', { candidateId, projectName, action, uniqueKey, match, index });
    
    // Update the status immediately
    setCandidateStatuses(prev => {
      const newStatuses = {
        ...prev,
        [uniqueKey]: action === 'approve' ? 'Approved' : 'Rejected'
      };
      console.log('Updated statuses:', newStatuses);
      return newStatuses;
    });
    
    // If approving, save to localStorage for allocation dashboard
    if (action === 'approve') {
      const approvedCandidate = {
        candidate: match.candidate,
        project: match.project,
        fit_score: match.fit_score,
        skill_match: match.skill_match,
        availability_match: match.availability_match,
        seniority_match: match.seniority_match,
        explanation: match.explanation,
        approvedAt: new Date().toISOString()
      };
      
      // Get existing approvals
      let existingApprovals = [];
      try {
        const stored = localStorage.getItem('approvedCandidates');
        existingApprovals = stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error parsing localStorage:', error);
        existingApprovals = [];
      }
      
      console.log('Existing approvals before:', existingApprovals);
      
      // Check if this combination already exists
      const exists = existingApprovals.some((approval: any) => 
        approval.candidate.id === candidateId && approval.project.name === projectName
      );
      
      if (!exists) {
        existingApprovals.push(approvedCandidate);
        try {
          localStorage.setItem('approvedCandidates', JSON.stringify(existingApprovals));
          console.log('Added new approval:', approvedCandidate);
          console.log('Updated approvals:', existingApprovals);
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      } else {
        console.log('Approval already exists for this combination');
      }
    }
    
    toast({
      title: action === 'approve' ? 'Candidate Approved' : 'Candidate Rejected',
      description: `${candidateId} has been ${action === 'approve' ? 'approved' : 'rejected'} for ${projectName}.`,
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    // Process the CSV file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string;
      
      // Validate CSV format
      const validation = validateCSVFormat(csvContent);
      if (!validation.isValid) {
        toast({
          title: "Invalid CSV Format",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }

      // Parse CSV content
      const projects = parseCSVContent(csvContent);
      console.log('Parsed projects:', projects); // Debug log
      setUploadedProjects(projects);
      setIsUploaded(true);

      // Save uploaded projects to localStorage for Projects page
      localStorage.setItem('uploadedProjects', JSON.stringify(projects));
      
      // Dispatch custom event to notify Projects page
      window.dispatchEvent(new CustomEvent('projectsUploaded', { 
        detail: { count: projects.length } 
      }));

      // Show success message
      toast({
        title: "File Uploaded Successfully",
        description: `"${file.name}" has been uploaded and processed. Found ${projects.length} projects. Click "Run AI Matching" to analyze.`,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive"
      });
    };

    reader.readAsText(file);
  };

  const runAIAnalysis = async () => {
    if (uploadedProjects.length === 0) {
      toast({
        title: "No Projects",
        description: "Please upload a CSV file with projects first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate realistic AI processing time (2-4 seconds)
    const processingTime = Math.random() * 2000 + 2000; // 2-4 seconds
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // AI-powered matching simulation
    const optimizedMatches = mockCandidates.slice(0, 10).map((candidate, index) => {
      const project = uploadedProjects[index % uploadedProjects.length] || uploadedProjects[0];
      
      // Calculate realistic match scores with AI-like precision
      const skillMatch = Math.random() * 0.4 + 0.4; // 40-80% skill match
      const availabilityMatch = candidate.availability === 'Available' ? 0.9 : 0.6;
      const seniorityMatch = Math.random() * 0.3 + 0.6; // 60-90% seniority match
      const fitScore = (skillMatch * 0.5 + availabilityMatch * 0.3 + seniorityMatch * 0.2) * 100;
      
      return {
        candidate,
        project: {
          name: project?.title || 'Project Match'
        },
        fit_score: Math.round(fitScore),
        skill_match: Math.round(skillMatch * 100),
        availability_match: Math.round(availabilityMatch * 100),
        seniority_match: Math.round(seniorityMatch * 100),
        explanation: `AI Analysis: ${Math.round(skillMatch * 100)}% skill match (${Math.round(skillMatch * 4)}/4 skills), Availability: ${candidate.availability}, Seniority: Match`
      };
    });
    
    // Sort by fit score and take top 10
    optimizedMatches.sort((a, b) => b.fit_score - a.fit_score);
    setTopMatches(optimizedMatches);
    
    toast({
      title: "AI Analysis Complete",
      description: `Analyzed ${uploadedProjects.length} projects and found ${optimizedMatches.length} optimal matches.`,
    });
    
    setIsAnalyzing(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to OPT-MAP
          </h1>
          <p className="text-lg text-gray-600">
            Optimized Talent Mapping System - Map the right people to the right projects
          </p>
        </div>


        {/* Upload Area */}
        <div className="flex justify-center mb-12">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Projects Upload Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 border-gray-200 hover:border-blue-300 max-w-md w-full rounded-xl"
            onClick={handleProjectUpload}
          >
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Add your CSV file of Projects
                </h2>
                <p className="text-gray-600 text-sm">
                  Drag & drop a CSV here, or
                </p>
              </div>
              
              <Button 
                size="lg"
                className={`px-8 py-3 text-lg font-medium transition-all duration-200 hover:scale-105 rounded-lg ${
                  isUploaded 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isUploaded ? '✓ Uploaded - Click to Reset' : 'Choose CSV to Upload'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">32</div>
              <div className="text-sm text-gray-600">Available Candidates</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isUploaded ? stats.activeProjects : 6}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isUploaded ? stats.openRoles : 15}
              </div>
              <div className="text-sm text-gray-600">Open Roles</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {isUploaded ? `${stats.matchEfficiency}%` : '92%'}
              </div>
              <div className="text-sm text-gray-600">Match Efficiency</div>
            </CardContent>
          </Card>
        </div>

        {/* File Upload Confirmation */}
        {uploadedProjects.length > 0 && (
          <div className="mt-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      File Uploaded Successfully!
                    </h3>
                    <p className="text-green-600">
                      Found {uploadedProjects.length} projects in your CSV file
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Show Top Candidates Button */}
        {uploadedProjects.length > 0 && (
          <div className="mt-6 text-center">
            <Button 
              size="lg"
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-medium transition-all duration-200 hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Candidates...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Run AI Matching
                </>
              )}
            </Button>
          </div>
        )}

        {/* Top AI Matches Table */}
        {topMatches.length > 0 && (
          <div className="mt-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Top Available Candidates
                </CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total Matches: {topMatches.length}</span>
                    <span>•</span>
                    <span>Approved: {Object.values(candidateStatuses).filter(status => status === 'Approved').length}</span>
                    <span>•</span>
                    <span>Rejected: {Object.values(candidateStatuses).filter(status => status === 'Rejected').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => {
                        localStorage.removeItem('approvedCandidates');
                        setCandidateStatuses({});
                        console.log('Cleared all data');
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-red-100 text-red-800"
                    >
                      Clear All
                    </Button>
                    {Object.values(candidateStatuses).filter(status => status === 'Approved').length > 0 && (
                      <Button 
                        onClick={() => window.location.href = '/allocation'}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        View Allocation Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">CANDIDATE</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">PROJECT</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">FIT SCORE</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">SKILLS MATCH</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">EXPLANATION</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">STATUS</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topMatches.map((match, index) => {
                        // Use index to ensure uniqueness even if candidates are the same
                        const uniqueKey = `${match.candidate.id}-${match.project.name}-${index}`;
                        return (
                        <tr key={`${match.candidate.id}-${index}`} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-gray-900">{match.candidate.name}</div>
                              <div className="text-sm text-gray-600">{match.project.name}</div>
                              <div className="text-xs text-gray-500">{match.candidate.role} • {match.candidate.location}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{match.project.name}</div>
                              <div className={`text-sm font-medium inline-flex items-center px-2 py-1 rounded-full ${
                                match.fit_score >= 90 ? 'bg-red-100 text-red-800' : 
                                match.fit_score >= 80 ? 'bg-orange-100 text-orange-800' : 
                                match.fit_score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {match.fit_score >= 90 ? 'Critical Priority' : 
                                 match.fit_score >= 80 ? 'High Priority' : 
                                 match.fit_score >= 70 ? 'Medium Priority' : 'Low Priority'}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {match.fit_score}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm font-medium text-gray-900">
                              {match.skill_match}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700 max-w-xs">
                              Skill match: {match.skill_match}% ({Math.round(match.skill_match / 25)}/4 skills), 
                              Availability: {match.candidate.availability}, 
                              Seniority: {match.seniority_match > 80 ? 'Match' : 'Partial match'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              candidateStatuses[uniqueKey] === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : candidateStatuses[uniqueKey] === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {candidateStatuses[uniqueKey] || 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleCandidateAction(match.candidate.id, match.project.name, 'approve', match, index)}
                                disabled={!!candidateStatuses[uniqueKey]}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleCandidateAction(match.candidate.id, match.project.name, 'reject', match, index)}
                                disabled={!!candidateStatuses[uniqueKey]}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;