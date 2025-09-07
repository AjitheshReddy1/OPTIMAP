// CSV Parser for Project Data
// Handles parsing of uploaded CSV files and converts to project format

export interface CSVProject {
  name: string;
  required_skills: string;
  seniority: string;
  timeline: string;
  priority: string;
}

export interface ParsedProject {
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
  priority: string;
  seniority: string;
}

export function parseCSVContent(csvContent: string): ParsedProject[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) return [];
  
  // Parse CSV with proper handling of quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };
  
  const headers = parseCSVLine(lines[0]);
  const projects: ParsedProject[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length < headers.length) continue;
    
    const project: CSVProject = {
      name: values[0] || '',
      required_skills: values[1] || '',
      seniority: values[2] || '',
      timeline: values[3] || '',
      priority: values[4] || 'Medium'
    };
    
    // Convert to our project format
    const parsedProject: ParsedProject = {
      id: `csv-${i}`,
      title: project.name,
      description: `Project requiring ${project.required_skills}`,
      timeline: project.timeline,
      budget: 'TBD', // Not provided in CSV
      rolesNeeded: project.required_skills.split(',').map(skill => skill.trim()),
      projectManager: {
        name: 'TBD',
        email: 'tbd@company.com'
      },
      status: 'Planning',
      priority: project.priority,
      seniority: project.seniority
    };
    
    projects.push(parsedProject);
  }
  
  return projects;
}

export function validateCSVFormat(csvContent: string): { isValid: boolean; error?: string } {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return { isValid: false, error: 'CSV must have at least a header row and one data row' };
  }
  
  // Parse CSV with proper handling of quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };
  
  const headers = parseCSVLine(lines[0]).map(header => header.trim().toLowerCase());
  const requiredHeaders = ['name', 'required_skills', 'seniority', 'timeline', 'priority'];
  
  for (const requiredHeader of requiredHeaders) {
    if (!headers.includes(requiredHeader)) {
      return { 
        isValid: false, 
        error: `Missing required column: ${requiredHeader}. Required columns: ${requiredHeaders.join(', ')}` 
      };
    }
  }
  
  return { isValid: true };
}
