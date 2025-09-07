import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, Users, Briefcase, Star } from 'lucide-react';
import { mockCandidates, mockProjects } from '@/data/mockData';
import GanttChart from '@/components/GanttChart';
import DemandSupplyHeatmap from '@/components/DemandSupplyHeatmap';

const Reports = () => {
  // Calculate skills distribution from candidates
  const skillsData = useMemo(() => {
    const skillCount: { [key: string]: number } = {};
    
    mockCandidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  // Calculate match quality distribution based on actual candidate data
  const matchQualityData = useMemo(() => {
    const totalCandidates = mockCandidates.length;
    
    // Calculate match quality based on actual candidate attributes
    const excellent = mockCandidates.filter(c => 
      c.tier === 'A' && c.availability === 'Available' && c.ranking >= 90
    ).length;
    
    const good = mockCandidates.filter(c => 
      (c.tier === 'A' && c.ranking >= 80) || 
      (c.tier === 'B' && c.availability === 'Available' && c.ranking >= 70)
    ).length;
    
    const fair = mockCandidates.filter(c => 
      (c.tier === 'B' && c.ranking >= 60) || 
      (c.tier === 'C' && c.availability === 'Available' && c.ranking >= 50)
    ).length;
    
    const poor = totalCandidates - excellent - good - fair;

    return [
      { name: 'Excellent (80-100%)', value: excellent, percentage: Math.round((excellent / totalCandidates) * 100) },
      { name: 'Good (60-79%)', value: good, percentage: Math.round((good / totalCandidates) * 100) },
      { name: 'Fair (40-59%)', value: fair, percentage: Math.round((fair / totalCandidates) * 100) },
      { name: 'Poor (0-39%)', value: poor, percentage: Math.round((poor / totalCandidates) * 100) }
    ];
  }, []);

  // Calculate project status distribution
  const projectStatusData = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    
    mockProjects.forEach(project => {
      statusCount[project.status] = (statusCount[project.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({ status, count }));
  }, []);

  // Generate Gantt chart data
  const ganttData = useMemo(() => {
    const tasks = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    // Add projects as tasks with realistic timelines
    mockProjects.slice(0, 6).forEach((project, index) => {
      const projectStart = new Date(project.startDate || new Date(startDate.getTime() + index * 30 * 24 * 60 * 60 * 1000));
      const projectDuration = 60 + (index * 15); // 60-135 days
      const projectEnd = new Date(projectStart.getTime() + projectDuration * 24 * 60 * 60 * 1000);
      
      tasks.push({
        id: `project-${project.id}`,
        name: project.title.length > 25 ? project.title.substring(0, 25) + '...' : project.title,
        start: projectStart,
        end: projectEnd,
        progress: project.status === 'Completed' ? 100 : project.status === 'Active' ? 60 + (index * 5) : 20,
        type: 'project' as const,
        color: project.priorityLevel === 1 ? '#ef4444' : project.priorityLevel === 2 ? '#f97316' : '#3b82f6'
      });

      // Add milestones for first 3 projects
      if (project.milestones && index < 3) {
        project.milestones.slice(0, 2).forEach((milestone, mIndex) => {
          const milestoneDate = new Date(projectStart.getTime() + (mIndex + 1) * 20 * 24 * 60 * 60 * 1000);
          const milestoneEnd = new Date(milestoneDate.getTime() + 3 * 24 * 60 * 60 * 1000);
          
          tasks.push({
            id: `milestone-${milestone.id}`,
            name: milestone.name.length > 20 ? milestone.name.substring(0, 20) + '...' : milestone.name,
            start: milestoneDate,
            end: milestoneEnd,
            progress: milestone.status === 'Completed' ? 100 : milestone.status === 'In Progress' ? 50 : 0,
            type: 'milestone' as const,
            color: milestone.status === 'Completed' ? '#10b981' : milestone.status === 'Delayed' ? '#ef4444' : '#6b7280'
          });
        });
      }
    });

    // Add resource allocations
    mockCandidates.slice(0, 4).forEach((candidate, index) => {
      const allocationStart = new Date(candidate.availableFrom);
      const allocationEnd = new Date(candidate.availableTo);
      
      tasks.push({
        id: `allocation-${candidate.id}`,
        name: `${candidate.name} (${candidate.employeeType})`,
        start: allocationStart,
        end: allocationEnd,
        progress: Math.min((candidate.currentCapacity / candidate.maxCapacity) * 100, 100),
        type: 'allocation' as const,
        color: candidate.employeeType === 'Senior' ? '#8b5cf6' : candidate.employeeType === 'FTE' ? '#3b82f6' : '#10b981'
      });
    });

    return tasks;
  }, []);

  // Generate heatmap data for demand vs supply
  const heatmapData = useMemo(() => {
    const resourceTypes = ['Frontend Dev', 'Backend Dev', 'UI/UX Designer', 'DevOps Engineer', 'Data Scientist', 'Product Manager'];
    const timePeriods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
    
    return resourceTypes.map(resourceType => ({
      id: resourceType,
      data: timePeriods.map(period => {
        // Simulate demand based on project requirements and resource availability
        const demand = Math.floor(Math.random() * 100);
        return {
          x: period,
          y: demand
        };
      })
    }));
  }, []);

  // Calculate skill demand vs supply analysis
  const skillDemandSupply = useMemo(() => {
    const skillSupply: { [key: string]: number } = {};
    const skillDemand: { [key: string]: number } = {};
    
    // Calculate supply (candidates with skills)
    mockCandidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillSupply[skill] = (skillSupply[skill] || 0) + 1;
      });
    });
    
    // Calculate demand (projects requiring skills) - map roles to common skills
    const roleToSkillsMap: { [key: string]: string[] } = {
      'Senior Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
      'Frontend Developer': ['React', 'JavaScript', 'HTML', 'CSS'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL'],
      'Full Stack Developer': ['React', 'Node.js', 'JavaScript', 'Python'],
      'UX Designer': ['Figma', 'User Research', 'Prototyping', 'UI/UX Design'],
      'UI Designer': ['Figma', 'UI Design', 'Prototyping'],
      'DevOps Engineer': ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      'Data Scientist': ['Python', 'Data Analysis', 'ML', 'SQL'],
      'Mobile Developer': ['React Native', 'iOS', 'Android', 'Flutter'],
      'QA Engineer': ['Testing', 'Automation', 'Selenium'],
      'Product Manager': ['Product Strategy', 'Analytics', 'Figma', 'SQL'],
      'iOS Developer': ['iOS', 'Swift', 'Xcode'],
      'Android Developer': ['Android', 'Java', 'Kotlin'],
      'Backend Engineer': ['Node.js', 'Python', 'Java', 'SQL'],
      'QA Engineer': ['Testing', 'Automation', 'Selenium']
    };
    
    mockProjects.forEach(project => {
      project.rolesNeeded.forEach(role => {
        const skills = roleToSkillsMap[role] || [];
        skills.forEach(skill => {
          skillDemand[skill] = (skillDemand[skill] || 0) + 1;
        });
      });
    });
    
    // Find skills with both supply and demand
    const skills = [...new Set([...Object.keys(skillSupply), ...Object.keys(skillDemand)])];
    return skills.map(skill => ({
      skill,
      supply: skillSupply[skill] || 0,
      demand: skillDemand[skill] || 0,
      ratio: skillSupply[skill] && skillDemand[skill] ? 
        Math.round((skillSupply[skill] / skillDemand[skill]) * 100) / 100 : 0
    })).filter(s => s.supply > 0 && s.demand > 0).sort((a, b) => b.demand - a.demand).slice(0, 8);
  }, []);

  // Calculate availability trends
  const availabilityTrends = useMemo(() => {
    const availabilityCount: { [key: string]: number } = {};
    const tierAvailability: { [key: string]: { [key: string]: number } } = {};
    
    mockCandidates.forEach(candidate => {
      availabilityCount[candidate.availability] = (availabilityCount[candidate.availability] || 0) + 1;
      
      if (!tierAvailability[candidate.tier]) {
        tierAvailability[candidate.tier] = {
          'Available': 0,
          'Partially Available': 0,
          'Busy': 0
        };
      }
      tierAvailability[candidate.tier][candidate.availability] = 
        (tierAvailability[candidate.tier][candidate.availability] || 0) + 1;
    });
    
    return {
      overall: Object.entries(availabilityCount).map(([status, count]) => ({ status, count })),
      byTier: tierAvailability
    };
  }, []);

  // Calculate tier distribution
  const tierDistribution = useMemo(() => {
    const tierCount: { [key: string]: number } = {};
    
    mockCandidates.forEach(candidate => {
      tierCount[candidate.tier] = (tierCount[candidate.tier] || 0) + 1;
    });

    return Object.entries(tierCount).map(([tier, count]) => ({ tier, count }));
  }, []);

  // Get most popular skill
  const mostPopularSkill = skillsData[0];
  
  // Get most common match quality
  const mostCommonQuality = matchQualityData.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );

  // Calculate total unique skills
  const totalSkills = skillsData.length;

  // Calculate skill shortage (high demand, low supply)
  const skillShortage = skillDemandSupply.filter(s => s.ratio < 1).sort((a, b) => a.ratio - b.ratio)[0];
  
  // Calculate average candidate ranking
  const averageRanking = Math.round(
    mockCandidates.reduce((sum, c) => sum + c.ranking, 0) / mockCandidates.length
  );
  
  // Calculate project completion rate
  const completedProjects = mockProjects.filter(p => p.status === 'Completed').length;
  const completionRate = Math.round((completedProjects / mockProjects.length) * 100);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-lg text-muted-foreground">
                Data insights and performance metrics for your talent matching system
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Skills Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Skills Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="skill" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={11}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Candidates']}
                      labelFormatter={(label) => `Skill: ${label}`}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Match Quality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Match Quality Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={matchQualityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percentage }) => `${percentage}%`}
                    >
                      {matchQualityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [value, 'Candidates']}
                      labelFormatter={(label) => `Quality: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {matchQualityData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Most Popular Skill */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Most Popular Skill</p>
                  <p className="text-2xl font-bold text-primary">{mostPopularSkill?.skill || 'N/A'}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {mostPopularSkill?.count || 0} candidates
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Shortage Alert */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skill Shortage</p>
                  <p className="text-2xl font-bold text-red-600">{skillShortage?.skill || 'N/A'}</p>
                  <p className="text-sm text-red-600 font-medium">
                    {skillShortage ? `${skillShortage.supply}/${skillShortage.demand} ratio` : 'No shortage'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Ranking */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Candidate Ranking</p>
                  <p className="text-2xl font-bold text-blue-600">{averageRanking}%</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {averageRanking >= 80 ? 'Excellent' : averageRanking >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Completion Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                  <p className="text-sm text-green-600 font-medium">
                    {completedProjects}/{mockProjects.length} projects
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Demand vs Supply Heatmap - Centered */}
        <div className="mb-8">
          <DemandSupplyHeatmap data={heatmapData} />
        </div>

        {/* Project Timeline & Allocations - Centered */}
        <div className="mb-8">
          <GanttChart 
            tasks={ganttData}
            startDate={new Date('2024-01-01')}
            endDate={new Date('2024-12-31')}
          />
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockCandidates.length}</div>
                  <div className="text-sm text-muted-foreground">Total Candidates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockCandidates.filter(c => c.availability === 'Available').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Available Now</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((mockCandidates.filter(c => c.tier === 'A').length / mockCandidates.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Senior Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((mockCandidates.filter(c => c.availability === 'Partially Available').length / mockCandidates.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Partially Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round((mockCandidates.filter(c => c.availability === 'Busy').length / mockCandidates.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Currently Busy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
