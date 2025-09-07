import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, Target, Users, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { aiMatchingService, AIMatch, ProjectMatches } from "@/services/aiMatchingService";
import { mockCandidates, mockProjects } from "@/data/mockData";

const AIMatching = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Record<string, ProjectMatches>>({});
  const [totalMatches, setTotalMatches] = useState(0);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await aiMatchingService.healthCheck();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

  const runAIMatching = async () => {
    setIsLoading(true);
    try {
      const response = await aiMatchingService.matchCandidatesToProjects(
        mockCandidates,
        mockProjects
      );
      
      setMatches(response.matches);
      setTotalMatches(response.total_matches);
      
      toast({
        title: "AI Matching Complete",
        description: `Found ${response.total_matches} matches across ${Object.keys(response.matches).length} projects`,
      });
    } catch (error) {
      toast({
        title: "AI Matching Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 0.8) return "default";
    if (score >= 0.6) return "secondary";
    return "destructive";
  };

  if (apiStatus === 'disconnected') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>AI Matching API is not running.</strong> Please start the Python API server by running:
              <br />
              <code className="bg-red-100 px-2 py-1 rounded mt-2 inline-block">
                python api_server.py
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">AI Matching</h1>
              <p className="text-lg text-muted-foreground">
                Intelligent candidate-project matching using AI
              </p>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-500' : 
              apiStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              API Status: {apiStatus === 'connected' ? 'Connected' : 
                          apiStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>

          {/* Run Matching Button */}
          <Button
            onClick={runAIMatching}
            disabled={isLoading || apiStatus !== 'connected'}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running AI Analysis...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Run AI Matching
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {totalMatches > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{totalMatches}</div>
                  <div className="text-sm text-muted-foreground">Total Matches</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Object.keys(matches).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Projects Analyzed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {Math.round((totalMatches / (mockCandidates.length * mockProjects.length)) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Match Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Project Matches */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                {Object.keys(matches).map((projectId) => {
                  const project = matches[projectId].project;
                  return (
                    <TabsTrigger key={projectId} value={projectId}>
                      {project.title}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {Object.entries(matches).map(([projectId, projectMatches]) => (
                  <Card key={projectId}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        {projectMatches.project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {projectMatches.candidates.slice(0, 5).map((match, index) => (
                          <div
                            key={`${projectId}-${match.candidate.id}`}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{match.candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {match.candidate.role} • Tier {match.candidate.tier}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {match.explanation}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant="outline">
                                  {match.candidate.availability}
                                </Badge>
                                <Badge variant="outline">
                                  {match.candidate.experience} years exp
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(match.fit_score)}`}>
                                {Math.round(match.fit_score * 100)}%
                              </div>
                              <div className="text-xs text-muted-foreground">Fit Score</div>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Skills:</span>
                                  <Badge variant={getScoreBadgeVariant(match.skill_match)}>
                                    {Math.round(match.skill_match * 100)}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Availability:</span>
                                  <Badge variant={getScoreBadgeVariant(match.availability_match)}>
                                    {Math.round(match.availability_match * 100)}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Seniority:</span>
                                  <Badge variant={getScoreBadgeVariant(match.seniority_match)}>
                                    {Math.round(match.seniority_match * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {projectMatches.candidates.length > 5 && (
                          <div className="text-center text-sm text-muted-foreground py-2">
                            ... and {projectMatches.candidates.length - 5} more matches
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {Object.entries(matches).map(([projectId, projectMatches]) => (
                <TabsContent key={projectId} value={projectId} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        {projectMatches.project.title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {projectMatches.project.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {projectMatches.candidates.map((match, index) => (
                          <div
                            key={`${projectId}-${match.candidate.id}`}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{match.candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {match.candidate.role} • Tier {match.candidate.tier}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {match.explanation}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant="outline">
                                  {match.candidate.availability}
                                </Badge>
                                <Badge variant="outline">
                                  {match.candidate.experience} years exp
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(match.fit_score)}`}>
                                {Math.round(match.fit_score * 100)}%
                              </div>
                              <div className="text-xs text-muted-foreground">Fit Score</div>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Skills:</span>
                                  <Badge variant={getScoreBadgeVariant(match.skill_match)}>
                                    {Math.round(match.skill_match * 100)}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Availability:</span>
                                  <Badge variant={getScoreBadgeVariant(match.availability_match)}>
                                    {Math.round(match.availability_match * 100)}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span>Seniority:</span>
                                  <Badge variant={getScoreBadgeVariant(match.seniority_match)}>
                                    {Math.round(match.seniority_match * 100)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatching;
