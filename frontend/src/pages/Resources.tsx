import { useState } from "react";
import { Search, Filter, Star, Mail, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCandidates, Candidate } from "@/data/mockData";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(mockCandidates);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, selectedTier, selectedAvailability);
  };

  const handleTierFilter = (tier: string) => {
    setSelectedTier(tier);
    applyFilters(searchTerm, tier, selectedAvailability);
  };

  const handleAvailabilityFilter = (availability: string) => {
    setSelectedAvailability(availability);
    applyFilters(searchTerm, selectedTier, availability);
  };

  const applyFilters = (search: string, tier: string, availability: string) => {
    let filtered = mockCandidates;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.role.toLowerCase().includes(search.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply tier filter
    if (tier !== "all") {
      filtered = filtered.filter(candidate => candidate.tier === tier);
    }

    // Apply availability filter
    if (availability !== "all") {
      filtered = filtered.filter(candidate => candidate.availability === availability);
    }

    setFilteredCandidates(filtered);
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Partially Available':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Busy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankingStars = (ranking: number) => {
    const stars = Math.floor(ranking / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources</h1>
          <p className="text-lg text-gray-600">
            Browse and manage your talent pool ({mockCandidates.length} candidates available)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name, role, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 text-lg bg-white border border-gray-300 focus:border-blue-500 transition-colors duration-200 rounded-lg"
            />
          </div>

          <div className="flex gap-4">
            <Select value={selectedTier} onValueChange={handleTierFilter}>
              <SelectTrigger className="w-48 bg-white border border-gray-300 rounded-lg">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="A">Tier A</SelectItem>
                <SelectItem value="B">Tier B</SelectItem>
                <SelectItem value="C">Tier C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAvailability} onValueChange={handleAvailabilityFilter}>
              <SelectTrigger className="w-48 bg-white border border-gray-300 rounded-lg">
                <SelectValue placeholder="All Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Partially Available">Partially Available</SelectItem>
                <SelectItem value="Busy">Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200 hover:border-blue-300 rounded-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {candidate.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{candidate.role}</p>
                  </div>
                  <Badge className={`${getTierColor(candidate.tier)} text-xs px-2 py-1 rounded-full`}>
                    Tier {candidate.tier}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {getRankingStars(candidate.ranking)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {candidate.ranking}/100
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600 truncate">{candidate.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">{candidate.experience} years exp</span>
                  </div>
                </div>

                <div>
                  <Badge className={`${getAvailabilityColor(candidate.availability)} w-full justify-center text-xs px-3 py-1 rounded-full`}>
                    {candidate.availability}
                  </Badge>
                  {candidate.currentProject && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Current: {candidate.currentProject}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{candidate.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3 hover:bg-blue-600 hover:text-white transition-colors duration-200 border-gray-300 text-gray-700"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No candidates found matching your search criteria.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {filteredCandidates.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Candidates</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {filteredCandidates.filter(c => c.availability === 'Available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available Now</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {filteredCandidates.filter(c => c.tier === 'A').length}
              </div>
              <div className="text-sm text-muted-foreground">Tier A Talent</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;