import { useParams, useNavigate } from "react-router-dom";
import { Calendar, DollarSign, User, ArrowLeft, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/data/mockData";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="mb-4 text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                Project Details & Information
              </p>
            </div>
            <Badge className={`${getStatusColor(project.status)} text-sm px-3 py-1`}>
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Project Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Timeline</p>
                  <p className="text-muted-foreground">{project.timeline}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Budget</p>
                  <p className="text-muted-foreground">{project.budget}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Project Manager</p>
                  <p className="text-muted-foreground">{project.projectManager.name}</p>
                  <p className="text-xs text-muted-foreground">{project.projectManager.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Roles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Required Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.rolesNeeded.map((role, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="justify-center py-2 px-4 text-sm"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Edit Project
          </Button>
          <Button variant="outline">
            Assign Team Members
          </Button>
          <Button variant="outline">
            View Timeline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;