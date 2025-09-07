import { useState } from "react";
import { Users, Briefcase, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects, mockCandidates } from "@/data/mockData";

const Allocators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  // Extract all unique roles from projects
  const openRoles = mockProjects.flatMap(project => 
    project.rolesNeeded.map(role => ({
      role,
      project: project.title,
      projectId: project.id,
      timeline: project.timeline,
      status: project.status
    }))
  );

  // Get all unique skills
  const allSkills = Array.from(new Set(mockCandidates.flatMap(c => c.skills))).sort();

  // Filter candidates based on search and skill
  const getMatchingCandidates = () => {
    let filtered = mockCandidates.filter(candidate => candidate.availability !== 'Busy');
    
    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedSkill !== "all") {
      filtered = filtered.filter(candidate =>
        candidate.skills.includes(selectedSkill)
      );
    }
    
    return filtered;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Allocators</h1>
          <p className="text-lg text-muted-foreground">
            Match available talent with open roles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Open Roles Section */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Open Roles ({openRoles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {openRoles.map((role, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{role.role}</h3>
                        <Badge className={getStatusColor(role.status)}>
                          {role.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Project: {role.project}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Timeline: {role.timeline}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available People Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Available People
                </CardTitle>
                
                {/* Search and Filter */}
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by name, role, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {allSkills.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {getMatchingCandidates().map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getTierColor(candidate.tier)}>
                            Tier {candidate.tier}
                          </Badge>
                          <Badge variant="outline">
                            {candidate.ranking}/100
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {candidate.experience} years experience
                        </span>
                        <Button size="sm" variant="outline">
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {getMatchingCandidates().length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No available candidates match your criteria.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {openRoles.length}
              </div>
              <div className="text-sm text-muted-foreground">Open Roles</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {mockCandidates.filter(c => c.availability === 'Available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {mockCandidates.filter(c => c.availability === 'Partially Available').length}
              </div>
              <div className="text-sm text-muted-foreground">Partially Available</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {Math.round((getMatchingCandidates().length / openRoles.length) * 100) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Match Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Allocators;