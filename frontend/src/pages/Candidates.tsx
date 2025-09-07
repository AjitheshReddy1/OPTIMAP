import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, MoreHorizontal, Clock, DollarSign, Shield, Globe } from "lucide-react";
import { mockCandidates } from "@/data/mockData";

const Candidates = () => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Partially Available':
        return 'bg-yellow-100 text-yellow-800';
      case 'Busy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (ranking: number) => {
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

  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case 'Senior':
        return 'bg-purple-100 text-purple-800';
      case 'FTE':
        return 'bg-blue-100 text-blue-800';
      case 'Intern':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-lg text-gray-600">
            Manage and view all available candidates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {candidate.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getEmployeeTypeColor(candidate.employeeType)} text-xs px-2 py-1 rounded-full`}>
                        {candidate.employeeType}
                      </Badge>
                      <Badge className={`${getAvailabilityColor(candidate.availability)} text-xs px-2 py-1 rounded-full`}>
                        {candidate.availability}
                      </Badge>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {candidate.location} • {candidate.timeZone}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatDate(candidate.availableFrom)} - {formatDate(candidate.availableTo)}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className={`font-medium ${getCapacityColor(candidate.currentCapacity, candidate.maxCapacity)}`}>
                    {candidate.currentCapacity}/{candidate.maxCapacity}h
                  </span>
                  <span className="text-gray-500">per week</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">${candidate.ratePerHour}/hr</span>
                </div>

                {candidate.ndaRequired && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Shield className="w-4 h-4" />
                    <span>NDA Required</span>
                  </div>
                )}

                {candidate.geoRestrictions.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Globe className="w-4 h-4" />
                    <span>{candidate.geoRestrictions.join(', ')}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {getRatingStars(candidate.ranking)}
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    /5.0
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
