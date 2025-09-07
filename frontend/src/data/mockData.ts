// Mock data for OPT-MAP system

export interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  tier: 'A' | 'B' | 'C';
  ranking: number;
  availability: 'Available' | 'Partially Available' | 'Busy';
  currentProject?: string;
  role: string;
  experience: number;
  company: string;
  location: string;
  // Enhanced Resource Management
  employeeType: 'Intern' | 'FTE' | 'Senior';
  hoursPerWeek: number;
  maxCapacity: number;
  availableFrom: string; // ISO date string
  availableTo: string; // ISO date string
  timeZone: string;
  ratePerHour: number;
  ndaRequired: boolean;
  geoRestrictions: string[];
  currentCapacity: number; // Current hours allocated
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string; // ISO date string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  dependencies: string[]; // IDs of other milestones
}

export interface RateCard {
  intern: number;
  fte: number;
  senior: number;
  currency: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  timeline: string;
  budget: string;
  rolesNeeded: string[];
  projectManager: {
    name: string;
    email: string;
  };
  status: 'Active' | 'Planning' | 'Completed';
  // Enhanced Project Management
  milestones: Milestone[];
  budgetAmount: number; // Numeric budget
  rateCard: RateCard;
  priorityLevel: 1 | 2 | 3 | 4 | 5; // 1 = Critical, 5 = Low
  deadlineRisk: 'Low' | 'Medium' | 'High';
  ndaRequired: boolean;
  geoRestrictions: string[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  clientType: 'Internal' | 'External';
  complianceRequirements: string[];
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'Conflict' | 'Issue' | 'Warning';
  affectedCandidates: string[];
  status: 'Open' | 'Resolved' | 'In Progress';
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  raisedBy: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
}

// Mock candidates data (30+ profiles)
export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    tier: 'A',
    ranking: 95,
    availability: 'Available',
    role: 'Senior Full Stack Developer',
    experience: 6,
    company: 'TechCorp Solutions',
    location: 'San Francisco',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-15',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 85,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@company.com',
    skills: ['Product Strategy', 'Analytics', 'Figma', 'SQL'],
    tier: 'A',
    ranking: 92,
    availability: 'Busy',
    currentProject: 'Mobile App Redesign',
    role: 'Senior Product Manager',
    experience: 8,
    company: 'InnovateTech',
    location: 'New York',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-02-01',
    availableTo: '2024-11-30',
    timeZone: 'EST',
    ratePerHour: 95,
    ndaRequired: true,
    geoRestrictions: ['US Only'],
    currentCapacity: 35,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@company.com',
    skills: ['UI/UX Design', 'Prototyping', 'User Research', 'Figma'],
    tier: 'A',
    ranking: 89,
    availability: 'Partially Available',
    role: 'Lead UX Designer',
    experience: 7,
    company: 'Design Studio Pro',
    location: 'Austin',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-20',
    availableTo: '2024-10-15',
    timeZone: 'CST',
    ratePerHour: 75,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 20,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
    tier: 'B',
    ranking: 85,
    availability: 'Available',
    role: 'Backend Developer',
    experience: 4,
    company: 'CloudTech Systems',
    location: 'Seattle',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 65,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '5',
    name: 'Amelia Foster',
    email: 'amelia.f@datascience.com',
    skills: ['Data Analysis', 'Python', 'ML', 'Tableau'],
    tier: 'A',
    ranking: 91,
    availability: 'Available',
    role: 'Data Scientist',
    experience: 5,
    company: 'DataScience Inc',
    location: 'Boston',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 90,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '6',
    name: 'James Wright',
    email: 'james.w@devops.com',
    skills: ['DevOps', 'Kubernetes', 'CI/CD', 'Terraform'],
    tier: 'B',
    ranking: 82,
    availability: 'Busy',
    currentProject: 'Infrastructure Migration',
    role: 'DevOps Engineer',
    experience: 6,
    company: 'DevOps Solutions',
    location: 'Denver',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'MST',
    ratePerHour: 70,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 40,
  },
  {
    id: '7',
    name: 'Lisa Park',
    email: 'lisa.park@company.com',
    skills: ['React Native', 'iOS', 'Android', 'Flutter'],
    tier: 'A',
    ranking: 88,
    availability: 'Available',
    role: 'Mobile Developer',
    experience: 5,
    company: 'MobileTech Inc',
    location: 'Seattle',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 80,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '8',
    name: 'Robert Miller',
    email: 'rob.miller@company.com',
    skills: ['Project Management', 'Agile', 'Scrum', 'Jira'],
    tier: 'B',
    ranking: 80,
    availability: 'Partially Available',
    role: 'Technical Project Manager',
    experience: 9,
    company: 'ProjectCorp',
    location: 'Chicago',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 85,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 20,
  },
  {
    id: '9',
    name: 'Sophia Lee',
    email: 'sophia.lee@company.com',
    skills: ['QA Testing', 'Automation', 'Selenium', 'Jest'],
    tier: 'B',
    ranking: 78,
    availability: 'Available',
    role: 'QA Engineer',
    experience: 4,
    company: 'QualityAssurance Ltd',
    location: 'Portland',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 60,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '10',
    name: 'Thomas Anderson',
    email: 'thomas.a@company.com',
    skills: ['Cybersecurity', 'Penetration Testing', 'CISSP'],
    tier: 'A',
    ranking: 93,
    availability: 'Busy',
    currentProject: 'Security Audit',
    role: 'Security Engineer',
    experience: 8,
    company: 'SecureTech Solutions',
    location: 'Washington DC',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 100,
    ndaRequired: true,
    geoRestrictions: ['US Only'],
    currentCapacity: 40,
  },
  // ... continuing with more candidates
  {
    id: '11',
    name: 'Maya Patel',
    email: 'maya.patel@company.com',
    skills: ['Marketing Analytics', 'Google Ads', 'SEO', 'Content Strategy'],
    tier: 'B',
    ranking: 77,
    availability: 'Available',
    role: 'Marketing Specialist',
    experience: 3,
    company: 'MarketingPro Inc',
    location: 'Miami',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 55,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '12',
    name: 'Alex Thompson',
    email: 'alex.t@company.com',
    skills: ['Vue.js', 'JavaScript', 'CSS', 'Webpack'],
    tier: 'C',
    ranking: 72,
    availability: 'Available',
    role: 'Frontend Developer',
    experience: 2,
    company: 'TechStart Inc',
    location: 'Remote',
    // Enhanced Resource Management
    employeeType: 'Intern',
    hoursPerWeek: 20,
    maxCapacity: 20,
    availableFrom: '2024-06-01',
    availableTo: '2024-08-31',
    timeZone: 'EST',
    ratePerHour: 25,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '13',
    name: 'Rachel Green',
    email: 'rachel.g@company.com',
    skills: ['Business Analysis', 'Requirements Gathering', 'Process Improvement'],
    tier: 'B',
    ranking: 81,
    availability: 'Partially Available',
    role: 'Business Analyst',
    experience: 6,
    company: 'BusinessSolutions Corp',
    location: 'Atlanta',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 70,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 25,
  },
  {
    id: '14',
    name: 'Michael Brown',
    email: 'michael.b@company.com',
    skills: ['Go', 'Microservices', 'Redis', 'PostgreSQL'],
    tier: 'A',
    ranking: 87,
    availability: 'Available',
    role: 'Backend Engineer',
    experience: 7,
    company: 'BackendTech Inc',
    location: 'Seattle',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 85,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '15',
    name: 'Jennifer Liu',
    email: 'jennifer.l@company.com',
    skills: ['Graphic Design', 'Brand Identity', 'Adobe Creative Suite'],
    tier: 'C',
    ranking: 70,
    availability: 'Available',
    role: 'Graphic Designer',
    experience: 3,
    company: 'CreativeDesign Studio',
    location: 'Los Angeles',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 45,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  // Adding more to reach 30+
  {
    id: '16',
    name: 'Carlos Mendez',
    email: 'carlos.m@company.com',
    skills: ['iOS Development', 'Swift', 'Core Data', 'SwiftUI'],
    tier: 'B',
    ranking: 83,
    availability: 'Busy',
    currentProject: 'iOS App Update',
    role: 'iOS Developer',
    experience: 5,
    company: 'MobileDev Corp',
    location: 'Miami',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 75,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 40,
  },
  {
    id: '17',
    name: 'Hannah Wilson',
    email: 'hannah.w@company.com',
    skills: ['Content Writing', 'SEO', 'WordPress', 'Social Media'],
    tier: 'C',
    ranking: 68,
    availability: 'Available',
    role: 'Content Creator',
    experience: 2,
    company: 'ContentPro Agency',
    location: 'Nashville',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 35,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '18',
    name: 'Kevin Zhang',
    email: 'kevin.z@company.com',
    skills: ['Machine Learning', 'TensorFlow', 'Python', 'R'],
    tier: 'A',
    ranking: 90,
    availability: 'Partially Available',
    role: 'ML Engineer',
    experience: 6,
    company: 'ML Solutions Inc',
    location: 'San Francisco',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 95,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 20,
  },
  {
    id: '19',
    name: 'Olivia Davis',
    email: 'olivia.d@company.com',
    skills: ['Sales Strategy', 'CRM', 'Lead Generation', 'Negotiation'],
    tier: 'B',
    ranking: 79,
    availability: 'Available',
    role: 'Sales Manager',
    experience: 7,
    company: 'SalesPro Inc',
    location: 'Chicago',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 80,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '20',
    name: 'Daniel Garcia',
    email: 'daniel.g@company.com',
    skills: ['Financial Analysis', 'Excel', 'Power BI', 'SQL'],
    tier: 'B',
    ranking: 76,
    availability: 'Available',
    role: 'Financial Analyst',
    experience: 4,
    company: 'FinanceCorp',
    location: 'Dallas',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 65,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '21',
    name: 'Isabella Martinez',
    email: 'isabella.m@company.com',
    skills: ['HR Management', 'Recruitment', 'Employee Relations'],
    tier: 'C',
    ranking: 73,
    availability: 'Partially Available',
    role: 'HR Specialist',
    experience: 5,
    company: 'HR Solutions Inc',
    location: 'Phoenix',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'MST',
    ratePerHour: 50,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 15,
  },
  {
    id: '22',
    name: 'Ryan O\'Connor',
    email: 'ryan.o@company.com',
    skills: ['Network Administration', 'Cisco', 'TCP/IP', 'VPN'],
    tier: 'B',
    ranking: 84,
    availability: 'Available',
    role: 'Network Engineer',
    experience: 6,
    company: 'NetworkTech Ltd',
    location: 'Denver',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'MST',
    ratePerHour: 75,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '23',
    name: 'Grace Taylor',
    email: 'grace.t@company.com',
    skills: ['User Research', 'Usability Testing', 'Survey Design'],
    tier: 'A',
    ranking: 86,
    availability: 'Available',
    role: 'UX Researcher',
    experience: 4,
    company: 'UX Research Co',
    location: 'Austin',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 80,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '24',
    name: 'Nathan Scott',
    email: 'nathan.s@company.com',
    skills: ['Ruby on Rails', 'PostgreSQL', 'Redis', 'GraphQL'],
    tier: 'B',
    ranking: 81,
    availability: 'Busy',
    currentProject: 'API Refactoring',
    role: 'Full Stack Developer',
    experience: 5,
    company: 'WebDev Solutions',
    location: 'Portland',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 70,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 40,
  },
  {
    id: '25',
    name: 'Chloe Adams',
    email: 'chloe.a@company.com',
    skills: ['Event Planning', 'Vendor Management', 'Budget Planning'],
    tier: 'C',
    ranking: 71,
    availability: 'Available',
    role: 'Event Coordinator',
    experience: 3,
    company: 'EventPro Inc',
    location: 'Las Vegas',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 40,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '26',
    name: 'Brandon Lee',
    email: 'brandon.l@company.com',
    skills: ['Unity', 'C#', 'Game Design', '3D Modeling'],
    tier: 'C',
    ranking: 74,
    availability: 'Available',
    role: 'Game Developer',
    experience: 3,
    company: 'GameStudio Pro',
    location: 'Seattle',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 50,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '27',
    name: 'Victoria Hall',
    email: 'victoria.h@company.com',
    skills: ['Legal Research', 'Contract Review', 'Compliance'],
    tier: 'B',
    ranking: 82,
    availability: 'Partially Available',
    role: 'Legal Analyst',
    experience: 6,
    company: 'LegalCorp Associates',
    location: 'Chicago',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'CST',
    ratePerHour: 85,
    ndaRequired: true,
    geoRestrictions: ['US Only'],
    currentCapacity: 20,
  },
  {
    id: '28',
    name: 'Jason Wang',
    email: 'jason.w@company.com',
    skills: ['Blockchain', 'Solidity', 'Web3', 'Ethereum'],
    tier: 'A',
    ranking: 88,
    availability: 'Available',
    role: 'Blockchain Developer',
    experience: 4,
    company: 'BlockchainTech Inc',
    location: 'San Francisco',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 95,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '29',
    name: 'Samantha Clark',
    email: 'samantha.c@company.com',
    skills: ['Customer Success', 'Account Management', 'Training'],
    tier: 'B',
    ranking: 80,
    availability: 'Available',
    role: 'Customer Success Manager',
    experience: 5,
    company: 'CustomerFirst Inc',
    location: 'Boston',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 65,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '30',
    name: 'Tyler Mitchell',
    email: 'tyler.m@company.com',
    skills: ['Video Production', 'Editing', 'Motion Graphics', 'Adobe Premiere'],
    tier: 'C',
    ranking: 69,
    availability: 'Available',
    role: 'Video Producer',
    experience: 3,
    company: 'MediaPro Studios',
    location: 'Los Angeles',
    // Enhanced Resource Management
    employeeType: 'FTE',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 45,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  },
  {
    id: '31',
    name: 'Amanda Johnson',
    email: 'amanda.j@company.com',
    skills: ['Supply Chain', 'Logistics', 'Inventory Management'],
    tier: 'B',
    ranking: 78,
    availability: 'Partially Available',
    role: 'Operations Manager',
    experience: 7,
    company: 'SupplyChain Solutions',
    location: 'Detroit',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'EST',
    ratePerHour: 75,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 25,
  },
  {
    id: '32',
    name: 'Connor Smith',
    email: 'connor.s@company.com',
    skills: ['Rust', 'Systems Programming', 'Performance Optimization'],
    tier: 'A',
    ranking: 89,
    availability: 'Available',
    role: 'Systems Engineer',
    experience: 6,
    company: 'SystemTech Corp',
    location: 'Seattle',
    // Enhanced Resource Management
    employeeType: 'Senior',
    hoursPerWeek: 40,
    maxCapacity: 40,
    availableFrom: '2024-01-01',
    availableTo: '2024-12-31',
    timeZone: 'PST',
    ratePerHour: 90,
    ndaRequired: false,
    geoRestrictions: [],
    currentCapacity: 0,
  }
];

// Mock projects data (5+ projects)
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX and improved performance.',
    timeline: '6 months',
    budget: '$2.5M',
    rolesNeeded: ['Senior Frontend Developer', 'UX Designer', 'Backend Developer', 'DevOps Engineer'],
    projectManager: {
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com'
    },
    status: 'Active',
    // Enhanced Project Management
    milestones: [
      {
        id: 'm1-1',
        name: 'Requirements Analysis',
        description: 'Gather and analyze business requirements',
        dueDate: '2024-02-15',
        status: 'Completed',
        dependencies: []
      },
      {
        id: 'm1-2',
        name: 'UI/UX Design',
        description: 'Create wireframes and design mockups',
        dueDate: '2024-03-30',
        status: 'In Progress',
        dependencies: ['m1-1']
      },
      {
        id: 'm1-3',
        name: 'Frontend Development',
        description: 'Implement responsive frontend components',
        dueDate: '2024-06-15',
        status: 'Not Started',
        dependencies: ['m1-2']
      },
      {
        id: 'm1-4',
        name: 'Backend Integration',
        description: 'Connect frontend with backend APIs',
        dueDate: '2024-07-30',
        status: 'Not Started',
        dependencies: ['m1-3']
      }
    ],
    budgetAmount: 2500000,
    rateCard: {
      intern: 25,
      fte: 75,
      senior: 120,
      currency: 'USD'
    },
    priorityLevel: 1,
    deadlineRisk: 'High',
    ndaRequired: true,
    geoRestrictions: ['US Only', 'Canada'],
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    clientType: 'External',
    complianceRequirements: ['GDPR', 'PCI-DSS', 'SOC2']
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Native mobile applications for iOS and Android with real-time features and offline capabilities.',
    timeline: '8 months',
    budget: '$1.8M',
    rolesNeeded: ['iOS Developer', 'Android Developer', 'Backend Engineer', 'QA Engineer'],
    projectManager: {
      name: 'Marcus Johnson',
      email: 'marcus.j@company.com'
    },
    status: 'Planning'
  },
  {
    id: '3',
    title: 'Data Analytics Dashboard',
    description: 'Comprehensive analytics dashboard for business intelligence and reporting.',
    timeline: '4 months',
    budget: '$900K',
    rolesNeeded: ['Data Scientist', 'Frontend Developer', 'Backend Developer'],
    projectManager: {
      name: 'Amelia Foster',
      email: 'amelia.f@company.com'
    },
    status: 'Active'
  },
  {
    id: '4',
    title: 'Infrastructure Migration',
    description: 'Migration of legacy systems to cloud infrastructure with improved scalability and security.',
    timeline: '12 months',
    budget: '$3.2M',
    rolesNeeded: ['DevOps Engineer', 'Cloud Architect', 'Security Engineer', 'Backend Developer'],
    projectManager: {
      name: 'James Wright',
      email: 'james.w@company.com'
    },
    status: 'Active'
  },
  {
    id: '5',
    title: 'AI-Powered Recommendation System',
    description: 'Machine learning system for personalized product recommendations and user experience optimization.',
    timeline: '10 months',
    budget: '$2.1M',
    rolesNeeded: ['ML Engineer', 'Data Scientist', 'Backend Developer', 'Frontend Developer'],
    projectManager: {
      name: 'Kevin Zhang',
      email: 'kevin.z@company.com'
    },
    status: 'Planning'
  },
  {
    id: '6',
    title: 'Cybersecurity Audit & Enhancement',
    description: 'Comprehensive security audit and implementation of enhanced security measures across all systems.',
    timeline: '6 months',
    budget: '$1.5M',
    rolesNeeded: ['Security Engineer', 'Penetration Tester', 'DevOps Engineer'],
    projectManager: {
      name: 'Thomas Anderson',
      email: 'thomas.a@company.com'
    },
    status: 'Active'
  },
  {
    id: '7',
    title: 'Customer Portal Redesign',
    description: 'Complete redesign of customer-facing portal with modern UI/UX and enhanced functionality.',
    timeline: '5 months',
    budget: '$1.2M',
    rolesNeeded: ['Frontend Developer', 'UX Designer', 'Backend Developer', 'QA Engineer'],
    projectManager: {
      name: 'Elena Rodriguez',
      email: 'elena.r@company.com'
    },
    status: 'Active'
  },
  {
    id: '8',
    title: 'API Gateway Implementation',
    description: 'Implementation of centralized API gateway for microservices architecture and improved security.',
    timeline: '3 months',
    budget: '$800K',
    rolesNeeded: ['Backend Developer', 'DevOps Engineer', 'Security Engineer'],
    projectManager: {
      name: 'David Kim',
      email: 'david.kim@company.com'
    },
    status: 'Planning'
  },
  {
    id: '9',
    title: 'Mobile App Performance Optimization',
    description: 'Performance optimization and bug fixes for existing mobile applications across iOS and Android.',
    timeline: '4 months',
    budget: '$950K',
    rolesNeeded: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'QA Engineer'],
    projectManager: {
      name: 'Lisa Park',
      email: 'lisa.park@company.com'
    },
    status: 'Active'
  },
  {
    id: '10',
    title: 'Business Intelligence Dashboard',
    description: 'Advanced BI dashboard with real-time analytics, reporting, and data visualization capabilities.',
    timeline: '7 months',
    budget: '$1.8M',
    rolesNeeded: ['Data Scientist', 'Frontend Developer', 'Backend Developer', 'UX Designer'],
    projectManager: {
      name: 'Amelia Foster',
      email: 'amelia.f@company.com'
    },
    status: 'Completed'
  }
];

// Mock reports data
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Resource Allocation Conflict',
    description: 'Sarah Chen is assigned to both E-commerce Platform Redesign and Mobile App Development projects.',
    type: 'Conflict',
    affectedCandidates: ['Sarah Chen', 'Marcus Johnson'],
    status: 'Open',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Skill Gap in Security Team',
    description: 'Insufficient number of certified security engineers for the upcoming security audit project.',
    type: 'Warning',
    affectedCandidates: ['Thomas Anderson'],
    status: 'In Progress',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Over-allocation of DevOps Resources',
    description: 'James Wright is currently working on 3 concurrent projects, exceeding recommended capacity.',
    type: 'Issue',
    affectedCandidates: ['James Wright'],
    status: 'Resolved',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    title: 'Budget Variance Alert',
    description: 'AI Recommendation System project is 15% over budget in the planning phase.',
    type: 'Warning',
    affectedCandidates: ['Kevin Zhang', 'Amelia Foster'],
    status: 'Open',
    createdAt: '2024-01-14'
  },
  {
    id: '5',
    title: 'Timeline Conflict Detection',
    description: 'Multiple projects have overlapping deadlines that may affect resource availability.',
    type: 'Conflict',
    affectedCandidates: ['Sarah Chen', 'David Kim', 'Lisa Park'],
    status: 'In Progress',
    createdAt: '2024-01-11'
  }
];

// Mock tickets data
export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Development Environment Setup Issues',
    description: 'New team members are experiencing difficulties setting up local development environments.',
    raisedBy: 'Alex Thompson',
    status: 'Open',
    priority: 'Medium',
    createdAt: '2024-01-16'
  },
  {
    id: '2',
    title: 'Access Permission Request for Production Database',
    description: 'Need read-only access to production database for debugging critical performance issues.',
    raisedBy: 'Michael Brown',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    title: 'Code Review Process Improvement',
    description: 'Current code review process is causing delays in the development cycle.',
    raisedBy: 'Elena Rodriguez',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Hardware Upgrade Request',
    description: 'Current development machines are insufficient for running the new ML models efficiently.',
    raisedBy: 'Kevin Zhang',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-01-14'
  },
  {
    id: '5',
    title: 'Meeting Room Booking System Bug',
    description: 'Meeting room booking system is double-booking rooms causing scheduling conflicts.',
    raisedBy: 'Rachel Green',
    status: 'In Progress',
    priority: 'Low',
    createdAt: '2024-01-12'
  },
  {
    id: '6',
    title: 'VPN Connection Instability',
    description: 'Frequent VPN disconnections affecting remote work productivity.',
    raisedBy: 'Ryan O\'Connor',
    status: 'Open',
    priority: 'Critical',
    createdAt: '2024-01-16'
  }
];