import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const faqData = [
    {
      id: 'what-is-optmap',
      category: 'General',
      question: 'What is OPT-MAP?',
      answer: 'OPT-MAP (Optimized Talent Mapping System) is a comprehensive platform designed to help organizations efficiently map the right people to the right projects. It provides tools for resource allocation, project management, and talent optimization.'
    },
    {
      id: 'how-to-upload-data',
      category: 'Getting Started',
      question: 'How do I upload project and candidate data?',
      answer: 'You can upload data through the dashboard by clicking on the "Upload Project" or "Upload Candidates" buttons. The system accepts CSV files with predefined formats. Make sure your data includes all required fields such as names, skills, availability, and project requirements.'
    },
    {
      id: 'candidate-matching',
      category: 'Features',
      question: 'How does the candidate matching algorithm work?',
      answer: 'Our matching algorithm considers multiple factors including skill sets, experience level, availability, tier ranking, and project requirements. It uses a weighted scoring system to provide the best matches for each role, ensuring optimal resource allocation.'
    },
    {
      id: 'tier-system',
      category: 'Features',
      question: 'What do the candidate tiers (A, B, C) represent?',
      answer: 'Tier A represents top-performing candidates with highest skills and experience. Tier B includes solid performers with good capabilities. Tier C contains entry-level or developing talent. This tiering helps in making informed allocation decisions based on project complexity and requirements.'
    },
    {
      id: 'project-status',
      category: 'Projects',
      question: 'What are the different project statuses?',
      answer: 'Projects can have three statuses: Active (currently running with assigned resources), Planning (in preparation phase, resources being identified), and Completed (finished projects for reference). This helps track project lifecycle and resource availability.'
    },
    {
      id: 'conflict-resolution',
      category: 'Resource Management',
      question: 'How do I resolve resource allocation conflicts?',
      answer: 'The Reports section identifies conflicts automatically when candidates are over-allocated or double-booked. You can resolve conflicts by reassigning resources, adjusting project timelines, or finding alternative candidates with similar skill sets.'
    },
    {
      id: 'availability-status',
      category: 'Resource Management',
      question: 'What do the different availability statuses mean?',
      answer: 'Available means the candidate is ready for new assignments. Partially Available indicates they have some capacity but are working on other projects. Busy means they are fully occupied and unavailable for new projects.'
    },
    {
      id: 'ticket-system',
      category: 'Support',
      question: 'How does the ticket system work?',
      answer: 'Team members can raise tickets for various issues like technical problems, resource requests, or process improvements. Tickets are categorized by priority (Critical, High, Medium, Low) and tracked through different statuses (Open, In Progress, Resolved, Closed).'
    },
    {
      id: 'reports-analytics',
      category: 'Analytics',
      question: 'What types of reports and analytics are available?',
      answer: 'The system provides various reports including resource utilization, project timelines, conflict identification, skill gap analysis, and allocation efficiency metrics. These help in making data-driven decisions for better resource management.'
    },
    {
      id: 'data-export',
      category: 'Data Management',
      question: 'Can I export data from the system?',
      answer: 'Yes, you can export data in multiple formats including CSV and JSON. This is available in the Settings section under Data Management. You can export candidate profiles, project information, and various reports for external analysis.'
    },
    {
      id: 'permissions-access',
      category: 'Security',
      question: 'How are user permissions and access controlled?',
      answer: 'The system implements role-based access control. Different user roles have varying levels of access to features and data. Administrators can manage user permissions, while regular users have access based on their organizational role and project assignments.'
    },
    {
      id: 'notifications',
      category: 'Notifications',
      question: 'What types of notifications will I receive?',
      answer: 'You can receive notifications for project assignments, resource conflicts, deadline reminders, ticket updates, and system alerts. Notification preferences can be customized in the Settings section to receive only relevant updates.'
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Frequently Asked Questions</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about OPT-MAP
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <Card key={item.id} className="bg-card border border-border">
              <Collapsible
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {item.question}
                        </CardTitle>
                      </div>
                      {openItems.includes(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8 bg-gradient-subtle">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Still need help?
            </h3>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Contact Support
              </Button>
              <Button variant="outline">
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;