import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, DollarSign, User, ArrowRight, Upload, RefreshCw, Clock, Shield, Globe, AlertTriangle, Target, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProjects, Project } from "@/data/mockData";
import { ParsedProject } from "@/utils/csvParser";

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [uploadedProjects, setUploadedProjects] = useState<ParsedProject[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const loadUploadedProjects = React.useCallback(() => {
    // Load uploaded projects from localStorage
    const savedProjects = localStorage.getItem('uploadedProjects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setUploadedProjects(parsed);
        
        // Convert uploaded projects to Project format and add to all projects
        const convertedProjects: Project[] = parsed.map((project: ParsedProject, index: number) => ({
          id: `uploaded-${project.id}`,
          title: project.title,
          description: project.description || `Project uploaded from CSV - ${project.title}`,
          timeline: project.timeline,
          budget: project.budget || 'TBD',
          rolesNeeded: project.rolesNeeded,
          projectManager: {
            name: 'CSV Upload',
            email: 'csv@upload.com'
          },
          status: 'Active' as const
        }));
        
        setAllProjects(convertedProjects);
        setFilteredProjects(convertedProjects);
      } catch (error) {
        console.error('Error loading uploaded projects:', error);
      }
    } else {
      // Reset if no uploaded projects
      setUploadedProjects([]);
      setAllProjects([]);
      setFilteredProjects([]);
    }
  }, []);

  useEffect(() => {
    loadUploadedProjects();
    
    // Listen for storage changes (when projects are uploaded from Dashboard)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'uploadedProjects') {
        loadUploadedProjects();
      }
    };
    
    // Listen for custom event when projects are uploaded
    const handleProjectsUploaded = () => {
      loadUploadedProjects();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('projectsUploaded', handleProjectsUploaded);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('projectsUploaded', handleProjectsUploaded);
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = allProjects.filter(project =>
      project.title.toLowerCase().includes(value.toLowerCase()) ||
      project.description.toLowerCase().includes(value.toLowerCase()) ||
      project.projectManager.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
        return 'bg-blue-100 text-blue-800';
      case 5:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
              <p className="text-lg text-muted-foreground">
                Manage and track your uploaded projects
                {uploadedProjects.length > 0 && (
                  <span className="ml-2 text-primary">
                    • {uploadedProjects.length} projects from CSV
                  </span>
                )}
              </p>
            </div>
            <Button
              onClick={loadUploadedProjects}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search projects by name, description, or manager..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 text-lg bg-card border-2 focus:border-primary transition-colors duration-200"
            />
          </div>
        </div>


        {/* Debug Section - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Uploaded Projects Count: {uploadedProjects.length}</p>
            <p>All Projects Count: {allProjects.length}</p>
            <p>Filtered Projects Count: {filteredProjects.length}</p>
            <p>localStorage has uploadedProjects: {localStorage.getItem('uploadedProjects') ? 'Yes' : 'No'}</p>
            <Button 
              onClick={() => console.log('Uploaded Projects:', uploadedProjects)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Log to Console
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-strong transition-all duration-300 transform hover:-translate-y-1 bg-card border border-border hover:border-primary/20"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
                    {project.title}
                  </CardTitle>
                  <Badge className={`ml-2 ${getStatusColor(project.status)}`}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
                
                {/* Enhanced Project Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">Timeline:</span>
                    <span className="text-muted-foreground">{project.timeline}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium">Budget:</span>
                    <span className="text-muted-foreground">
                      {project.budgetAmount ? formatCurrency(project.budgetAmount, project.rateCard?.currency) : project.budget}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium">PM:</span>
                    <span className="text-muted-foreground">{project.projectManager.name}</span>
                  </div>

                  {/* Priority and Risk */}
                  {project.priorityLevel && (
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="font-medium">Priority:</span>
                      <Badge className={`${getPriorityColor(project.priorityLevel)} text-xs px-2 py-1 rounded-full`}>
                        Level {project.priorityLevel}
                      </Badge>
                    </div>
                  )}

                  {project.deadlineRisk && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className={`w-4 h-4 ${getDeadlineRiskColor(project.deadlineRisk)}`} />
                      <span className="font-medium">Risk:</span>
                      <span className={`font-medium ${getDeadlineRiskColor(project.deadlineRisk)}`}>
                        {project.deadlineRisk}
                      </span>
                    </div>
                  )}

                  {/* Compliance Requirements */}
                  {project.ndaRequired && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <Shield className="w-4 h-4" />
                      <span>NDA Required</span>
                    </div>
                  )}

                  {project.geoRestrictions && project.geoRestrictions.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Globe className="w-4 h-4" />
                      <span>{project.geoRestrictions.join(', ')}</span>
                    </div>
                  )}

                  {/* Milestones */}
                  {project.milestones && project.milestones.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="font-medium">Milestones:</span>
                      </div>
                      <div className="space-y-1">
                        {project.milestones.slice(0, 3).map((milestone) => (
                          <div key={milestone.id} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate">{milestone.name}</span>
                            <div className="flex items-center gap-1">
                              <Badge className={`${getMilestoneStatusColor(milestone.status)} text-xs px-1 py-0.5 rounded`}>
                                {milestone.status}
                              </Badge>
                              <span className="text-muted-foreground">{formatDate(milestone.dueDate)}</span>
                            </div>
                          </div>
                        ))}
                        {project.milestones.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{project.milestones.length - 3} more milestones
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <p className="text-sm font-medium text-foreground mb-2">Roles Needed:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.rolesNeeded.slice(0, 3).map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {project.rolesNeeded.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.rolesNeeded.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-primary hover:bg-primary/10 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project.id);
                  }}
                >
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Uploaded</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Upload a CSV file from the Dashboard to see your projects here.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;