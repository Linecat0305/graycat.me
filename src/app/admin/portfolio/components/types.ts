// Define the interfaces for the portfolio data
export interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialLink: string;
}

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
}

// Form state interfaces
export interface ProjectForm extends Omit<Project, 'id' | 'technologies'> {
  id?: number;
  technologies: string;
}

export interface SkillForm extends Omit<Skill, 'id'> {
  id?: number;
}

export interface ExperienceForm extends Omit<Experience, 'id' | 'achievements'> {
  id?: number;
  achievements: string;
}

export interface EducationForm extends Omit<Education, 'id'> {
  id?: number;
}

export interface CertificateForm extends Omit<Certificate, 'id'> {
  id?: number;
}

// Common props for all manager components
export interface ManagerProps {
  data: any[];
  onSave: (data: any[]) => Promise<boolean>;
  isSaving: boolean;
}