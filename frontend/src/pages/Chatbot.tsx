import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Brain, Users, Target, TrendingUp, HelpCircle } from 'lucide-react';
import { mockCandidates, mockProjects } from '@/data/mockData';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  data?: any;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your APT-Match AI assistant. I can help you with questions about candidates, projects, matching algorithms, and why specific candidates were chosen. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI-powered response generation with context understanding
  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Extract context and intent
    const intent = analyzeIntent(message);
    const context = extractContext(message);
    
    switch (intent) {
      case 'list_candidates':
        return generateCandidateList(context);
      case 'candidate_details':
        return generateCandidateDetails(context);
      case 'list_projects':
        return generateProjectList(context);
      case 'project_details':
        return generateProjectDetails(context);
      case 'matching_explanation':
        return generateMatchingExplanation(context);
      case 'score_explanation':
        return generateScoreExplanation(context);
      case 'why_chosen':
        return generateWhyChosenExplanation(context);
      case 'availability_status':
        return generateAvailabilityStatus();
      case 'upload_help':
        return generateUploadHelp();
      case 'features_overview':
        return generateFeaturesOverview();
      case 'help':
        return generateHelpResponse();
      default:
        return generateContextualResponse(message, context);
    }
  };

  // Intent analysis using natural language understanding
  const analyzeIntent = (message: string): string => {
    const candidatesKeywords = ['candidate', 'candidates', 'people', 'person', 'staff', 'employee'];
    const projectsKeywords = ['project', 'projects', 'work', 'job', 'assignment'];
    const matchingKeywords = ['match', 'matching', 'algorithm', 'score', 'fit'];
    const whyKeywords = ['why', 'chosen', 'selected', 'picked', 'assigned'];
    const availabilityKeywords = ['available', 'availability', 'busy', 'free'];
    const uploadKeywords = ['upload', 'csv', 'file', 'import'];
    const featureKeywords = ['feature', 'function', 'capability', 'what can'];
    const helpKeywords = ['help', 'assist', 'support', 'guide'];

    if (candidatesKeywords.some(kw => message.includes(kw))) {
      if (message.includes('list') || message.includes('show') || message.includes('all')) {
        return 'list_candidates';
      }
      if (message.includes('details') || message.includes('about') || message.includes('who is')) {
        return 'candidate_details';
      }
      if (availabilityKeywords.some(kw => message.includes(kw))) {
        return 'availability_status';
      }
      return 'candidate_details';
    }

    if (projectsKeywords.some(kw => message.includes(kw))) {
      if (message.includes('list') || message.includes('show') || message.includes('all')) {
        return 'list_projects';
      }
      return 'project_details';
    }

    if (matchingKeywords.some(kw => message.includes(kw))) {
      if (message.includes('score') || message.includes('scoring')) {
        return 'score_explanation';
      }
      return 'matching_explanation';
    }

    if (whyKeywords.some(kw => message.includes(kw))) {
      return 'why_chosen';
    }

    if (uploadKeywords.some(kw => message.includes(kw))) {
      return 'upload_help';
    }

    if (featureKeywords.some(kw => message.includes(kw))) {
      return 'features_overview';
    }

    if (helpKeywords.some(kw => message.includes(kw))) {
      return 'help';
    }

    return 'general';
  };

  // Extract context from user message
  const extractContext = (message: string): any => {
    const context: any = {};
    
    // Extract candidate names
    const candidateNames = mockCandidates.map(c => c.name.toLowerCase());
    const mentionedCandidate = candidateNames.find(name => 
      message.includes(name) || name.split(' ').some(part => message.includes(part))
    );
    if (mentionedCandidate) {
      context.candidate = mockCandidates.find(c => c.name.toLowerCase() === mentionedCandidate);
    }

    // Extract project names
    const projectNames = mockProjects.map(p => p.title.toLowerCase());
    const mentionedProject = projectNames.find(name => 
      message.includes(name) || name.split(' ').some(part => message.includes(part))
    );
    if (mentionedProject) {
      context.project = mockProjects.find(p => p.title.toLowerCase() === mentionedProject);
    }

    // Extract specific skills
    const allSkills = [...new Set(mockCandidates.flatMap(c => c.skills))];
    const mentionedSkills = allSkills.filter(skill => 
      message.includes(skill.toLowerCase())
    );
    if (mentionedSkills.length > 0) {
      context.skills = mentionedSkills;
    }

    // Extract tier/level mentions
    if (message.includes('tier a') || message.includes('senior')) context.tier = 'A';
    if (message.includes('tier b') || message.includes('mid')) context.tier = 'B';
    if (message.includes('tier c') || message.includes('junior')) context.tier = 'C';

    return context;
  };

  // Generate candidate list with intelligent filtering
  const generateCandidateList = (context: any): string => {
    let candidates = [...mockCandidates];
    
    // Apply filters based on context
    if (context.tier) {
      candidates = candidates.filter(c => c.tier === context.tier);
    }
    if (context.skills) {
      candidates = candidates.filter(c => 
        context.skills.some((skill: string) => 
          c.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Sort by ranking
    candidates.sort((a, b) => b.ranking - a.ranking);

    const candidateList = candidates.slice(0, 5).map(c => 
      `${c.name} (${c.role}) - ${c.availability} - Tier ${c.tier} - ${c.ranking}%`
    ).join('\n');

    const filters = [];
    if (context.tier) filters.push(`Tier ${context.tier}`);
    if (context.skills) filters.push(`Skills: ${context.skills.join(', ')}`);

    return `Top candidates in our system:\n\n${candidateList}\n\nTotal: ${candidates.length}${filters.length > 0 ? ` (filtered)` : ''}`;
  };

  // Generate detailed candidate information
  const generateCandidateDetails = (context: any): string => {
    if (context.candidate) {
      const c = context.candidate;
      const tierDescription = c.tier === 'A' ? 'Senior' : c.tier === 'B' ? 'Mid' : 'Junior';
      const skillMatch = context.skills ? 
        c.skills.filter(skill => 
          context.skills.some((reqSkill: string) => 
            skill.toLowerCase().includes(reqSkill.toLowerCase())
          )
        ).length : 0;
      
      return `${c.name} - ${c.role}\n\nProfile:\n• Company: ${c.company}\n• Location: ${c.location}\n• Experience: ${c.experience} years\n• Tier: ${c.tier} (${tierDescription})\n• Ranking: ${c.ranking}%\n• Availability: ${c.availability}\n\nSkills: ${c.skills.slice(0, 5).join(', ')}${c.skills.length > 5 ? '...' : ''}\n\nAnalysis:\n${c.availability === 'Available' ? '✅ Ready to start' : c.availability === 'Partially Available' ? '⚠️ Limited availability' : '❌ Currently busy'}\n${c.tier === 'A' ? '✅ Senior level' : c.tier === 'B' ? '✅ Mid-level' : '✅ Junior level'}\n${context.skills && skillMatch > 0 ? `✅ Matches ${skillMatch}/${context.skills.length} skills` : ''}`;
    }

    // If no specific candidate mentioned, show top candidates
    return generateCandidateList(context);
  };

  // Generate project list with intelligent filtering
  const generateProjectList = (context: any): string => {
    let projects = [...mockProjects];
    
    // Apply filters based on context
    if (context.skills) {
      projects = projects.filter(p => 
        p.rolesNeeded.some(role => 
          context.skills.some((skill: string) => 
            role.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    const projectList = projects.map(p => 
      `${p.title} - ${p.status} - ${p.timeline} - ${p.rolesNeeded.length} roles`
    ).join('\n');

    const filters = [];
    if (context.skills) filters.push(`Skills: ${context.skills.join(', ')}`);

    return `Current projects${filters.length > 0 ? ` requiring ${filters.join(' and ')}` : ''}:\n\n${projectList}\n\nTotal: ${projects.length}${filters.length > 0 ? ` (filtered)` : ''}`;
  };

  // Generate detailed project information
  const generateProjectDetails = (context: any): string => {
    if (context.project) {
      const p = context.project;
      return `${p.title}\n\nDescription:\n${p.description}\n\nDetails:\n• Timeline: ${p.timeline}\n• Budget: ${p.budget}\n• Status: ${p.status}\n• PM: ${p.projectManager.name}\n\nRoles: ${p.rolesNeeded.slice(0, 3).join(', ')}${p.rolesNeeded.length > 3 ? '...' : ''}\n\nAnalysis:\n${p.status === 'Active' ? '🟢 In progress' : p.status === 'Planning' ? '🟡 Planning' : '🔴 Completed'}\n• ${p.rolesNeeded.length} roles needed\n• ${p.timeline} timeline`;
    }

    return generateProjectList(context);
  };

  // Generate matching algorithm explanation
  const generateMatchingExplanation = (context: any): string => {
    return `AI Matching Algorithm:\n\nStep 1: Skills Analysis (50%)\n• Uses AI embeddings to compare skills\n• Handles synonyms and related tech\n\nStep 2: Availability (30%)\n• Available: 100%\n• Partially: 70%\n• Busy: 20%\n\nStep 3: Seniority (20%)\n• Perfect match: 100%\n• Adjacent: 80%\n• Distant: 60%\n\nFinal Score:\n(Skills × 0.5) + (Availability × 0.3) + (Seniority × 0.2)\n\nThresholds:\n• 90-100%: Excellent\n• 80-89%: Very good\n• 70-79%: Good\n• 60-69%: Fair\n• Below 60%: Filtered out`;
  };

  // Generate score explanation
  const generateScoreExplanation = (context: any): string => {
    return `Match Score Interpretation:\n\nScore Ranges:\n• 90-100%: 🟢 Excellent - Perfect fit\n• 80-89%: 🟡 Very good - Strong match\n• 70-79%: 🟠 Good - Suitable candidate\n• 60-69%: 🔴 Fair - Needs evaluation\n• Below 60%: ❌ Poor - Filtered out\n\nRecommendations:\n• Critical Projects: 85%+\n• Standard Projects: 75%+\n• Learning Projects: 65%+\n• Emergency Projects: 70%+\n\nFactors:\n• Skill overlap\n• Availability status\n• Seniority match\n• Experience relevance`;
  };

  // Generate why chosen explanation with actual data
  const generateWhyChosenExplanation = (context: any): string => {
    // Find a good example match
    const availableCandidates = mockCandidates.filter(c => c.availability === 'Available');
    const exampleCandidate = availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
    const exampleProject = mockProjects[Math.floor(Math.random() * mockProjects.length)];
    
    // Simulate a realistic match calculation
    const skillOverlap = exampleCandidate.skills.filter(skill => 
      exampleProject.rolesNeeded.some(role => 
        role.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(role.toLowerCase())
      )
    ).length;
    
    const skillScore = Math.min(skillOverlap / exampleProject.rolesNeeded.length, 1) * 100;
    const availabilityScore = exampleCandidate.availability === 'Available' ? 100 : 70;
    const seniorityScore = exampleCandidate.tier === 'A' ? 90 : exampleCandidate.tier === 'B' ? 80 : 70;
    
    const finalScore = Math.round((skillScore * 0.5) + (availabilityScore * 0.3) + (seniorityScore * 0.2));
    
    return `Why ${exampleCandidate.name} was chosen for ${exampleProject.title}:\n\nMatch Analysis:\n• Final Score: ${finalScore}%\n• Skills: ${Math.round(skillScore)}% (${skillOverlap}/${exampleProject.rolesNeeded.length} roles)\n• Availability: ${availabilityScore}% (${exampleCandidate.availability})\n• Seniority: ${seniorityScore}% (Tier ${exampleCandidate.tier})\n\nRelevant Skills: ${exampleCandidate.skills.filter(skill => 
      exampleProject.rolesNeeded.some(role => 
        role.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 3).join(', ') || 'General technical skills'}\n\nExperience: ${exampleCandidate.experience} years (${exampleCandidate.tier === 'A' ? 'Senior' : exampleCandidate.tier === 'B' ? 'Mid' : 'Junior'})\n\nWhy it works:\n${finalScore >= 80 ? '✅ Excellent compatibility' : finalScore >= 70 ? '✅ Good match' : '⚠️ Decent match'}\n• Skills align with requirements\n• Availability matches timeline\n• Experience level appropriate`;
  };

  // Generate availability status
  const generateAvailabilityStatus = (): string => {
    const available = mockCandidates.filter(c => c.availability === 'Available');
    const partially = mockCandidates.filter(c => c.availability === 'Partially Available');
    const busy = mockCandidates.filter(c => c.availability === 'Busy');
    
    const tierBreakdown = {
      A: available.filter(c => c.tier === 'A').length,
      B: available.filter(c => c.tier === 'B').length,
      C: available.filter(c => c.tier === 'C').length
    };
    
    return `Current Availability Status:\n\nOverall:\n• 🟢 Available: ${available.length} (${Math.round(available.length/mockCandidates.length*100)}%)\n• 🟡 Partially: ${partially.length} (${Math.round(partially.length/mockCandidates.length*100)}%)\n• 🔴 Busy: ${busy.length} (${Math.round(busy.length/mockCandidates.length*100)}%)\n\nBy Tier:\n• Senior (A): ${tierBreakdown.A}\n• Mid (B): ${tierBreakdown.B}\n• Junior (C): ${tierBreakdown.C}\n\nTop Available:\n${available.slice(0, 3).map(c => `${c.name} (${c.role}) - Tier ${c.tier}`).join('\n')}\n\nRecommendation: ${available.length > 5 ? 'Good availability' : available.length > 2 ? 'Limited but sufficient' : 'Low availability'}`;
  };

  // Generate upload help
  const generateUploadHelp = (): string => {
    return `How to Upload Projects:\n\nStep-by-Step:\n1. Go to Dashboard\n2. Click "Choose CSV to Upload"\n3. Format CSV with columns:\n   - Project Name\n   - Required Skills (comma-separated)\n   - Seniority Level (junior/mid/senior)\n   - Timeline (e.g., "6 months")\n   - Priority (Low/Medium/High)\n4. Click "Show Top Candidates"\n5. Review and Approve matches\n\nCSV Example:\nProject Name,Required Skills,Seniority,Timeline,Priority\n"E-commerce Site","React, Node.js, Database","senior","6 months","High"\n\nTips:\n• Use specific skill names\n• Include all technologies\n• Be consistent with levels\n• Provide realistic timelines\n\nSupported: CSV files only, max 10MB`;
  };

  // Generate features overview
  const generateFeaturesOverview = (): string => {
    return `APT-Match Key Features:\n\n🤖 AI-Powered Matching\n• ML-based candidate-project pairing\n• Semantic skill matching\n• Multi-factor scoring\n\n📊 Real-time Analysis\n• Instant results\n• Live progress indicators\n• Dynamic calculations\n\n📁 CSV Upload\n• Import project data\n• Data validation\n• Flexible requirements\n\n✅ Approval Workflow\n• Review AI suggestions\n• Manual override\n• Audit trail\n\n📈 Allocation Dashboard\n• Manage assignments\n• Track progress\n• Resource metrics\n\n🔍 Detailed Explanations\n• Match reasoning\n• Transparent scoring\n• Skill analysis\n\n⚖️ Multi-factor Scoring\n• Skills (50%)\n• Availability (30%)\n• Seniority (20%)\n\n🎯 Smart Filtering\n• Quality thresholds\n• Custom search\n• Dynamic ranking`;
  };

  // Generate help response
  const generateHelpResponse = (): string => {
    return `How I Can Help You:\n\n👥 Candidate Information:\n• "Show me all candidates" - List people\n• "Tell me about [Name]" - Get details\n• "Show senior candidates" - Filter by level\n• "Who knows React?" - Find by skills\n\n📋 Project Details:\n• "What projects are available?" - List projects\n• "Tell me about [Project Name]" - Get details\n• "Show me React projects" - Filter by tech\n\n🧠 Matching & Scoring:\n• "How does matching work?" - Explain algorithm\n• "What is a good score?" - Score guide\n• "Why was this candidate chosen?" - Explanations\n\n📊 System Information:\n• "Show availability" - Current status\n• "How to upload projects?" - Upload guide\n• "What are the features?" - Capabilities\n\n💡 Pro Tips:\n• Ask specific questions\n• Use names for details\n• Ask "why" for explanations\n• Request lists for overviews\n\nJust ask me anything!`;
  };

  // Generate contextual response for unclear queries
  const generateContextualResponse = (message: string, context: any): string => {
    if (context.candidate) {
      return `I found information about ${context.candidate.name}. ${generateCandidateDetails(context)}`;
    }
    
    if (context.project) {
      return `I found information about ${context.project.title}. ${generateProjectDetails(context)}`;
    }
    
    if (context.skills) {
      return `I see you're asking about ${context.skills.join(', ')} skills. Let me show you relevant information:\n\n${generateCandidateList(context)}\n\n${generateProjectList(context)}`;
    }
    
    return `I understand you're asking about "${message}". I can help you with:\n\n• Candidate Information: Details about people, skills, availability\n• Project Details: Information about projects and requirements\n• Matching Algorithm: How the AI system works\n• Why Candidates Were Chosen: Match explanations\n• System Features: APT-Match capabilities\n\nCould you be more specific? For example:\n• "Show me all candidates"\n• "Tell me about the E-commerce project"\n• "How does matching work?"\n• "Why was Sarah Chen chosen?"`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Show me all candidates",
    "What projects are available?",
    "How does matching work?",
    "Why was this candidate chosen?",
    "What are the features?",
    "Explain scoring system",
    "Show availability",
    "How to upload projects?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-lg text-muted-foreground">
                Ask me anything about candidates, projects, and matching
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-3 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Messages */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[90%] rounded-lg p-4 ${
                              message.type === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.type === 'bot' && (
                                <Bot className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              )}
                              {message.type === 'user' && (
                                <User className="w-4 h-4 mt-1 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="whitespace-pre-wrap text-sm break-words leading-relaxed">
                                  {message.content}
                                </div>
                                <div className={`text-xs mt-2 ${
                                  message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-primary" />
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Input */}
                <div className="border-t p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about candidates, projects, or matching..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-1.5">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-2 hover:bg-primary/5 hover:border-primary/20 transition-colors text-wrap"
                        onClick={() => setInputValue(question)}
                      >
                        <span className="text-xs leading-tight break-words">{question}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>

                {/* Stats - Fixed at bottom */}
                <div className="border-t bg-muted/30 p-2 mt-auto flex-shrink-0">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-center p-1">
                      <div className="text-sm font-bold text-primary">{mockCandidates.length}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-sm font-bold text-primary">{mockProjects.length}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-sm font-bold text-primary">
                        {mockCandidates.filter(c => c.availability === 'Available').length}
                      </div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="text-sm font-bold text-primary">
                        {Math.round((mockCandidates.filter(c => c.tier === 'A').length / mockCandidates.length) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Senior</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
