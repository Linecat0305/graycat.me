"use client";

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

// Define the interfaces for the portfolio data
interface Project {
  id: number;
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialLink: string;
}

interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
}

// Form state interfaces
interface ProjectForm extends Omit<Project, 'id' | 'technologies'> {
  id?: number;
  technologies: string;
}

interface SkillForm extends Omit<Skill, 'id'> {
  id?: number;
}

interface ExperienceForm extends Omit<Experience, 'id' | 'achievements'> {
  id?: number;
  achievements: string;
}

interface EducationForm extends Omit<Education, 'id'> {
  id?: number;
}

interface CertificateForm extends Omit<Certificate, 'id'> {
  id?: number;
}

export default function PortfolioManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState<'projects' | 'skills' | 'experiences' | 'education' | 'certificates'>('projects');
  
  // State for portfolio data
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    projects: [],
    skills: [],
    experiences: [],
    education: [],
    certificates: []
  });

  // State for editing forms
  const [isEditing, setIsEditing] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>({ title: '', description: '', link: '', technologies: '' });
  const [skillForm, setSkillForm] = useState<SkillForm>({ name: '', level: 50, category: '' });
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({ role: '', company: '', period: '', description: '', achievements: '' });
  const [educationForm, setEducationForm] = useState<EducationForm>({ institution: '', degree: '', period: '', description: '' });
  const [certificateForm, setCertificateForm] = useState<CertificateForm>({ name: '', issuer: '', date: '', credentialLink: '' });

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Use API endpoints to fetch data
      const [projectsRes, skillsRes, experiencesRes, educationRes, certificatesRes] = await Promise.all([
        fetch('/api/admin/portfolio/projects'),
        fetch('/api/admin/portfolio/skills'),
        fetch('/api/admin/portfolio/experiences'),
        fetch('/api/admin/portfolio/education'),
        fetch('/api/admin/portfolio/certificates')
      ]);

      if (!projectsRes.ok || !skillsRes.ok || !experiencesRes.ok || !educationRes.ok || !certificatesRes.ok) {
        throw new Error('Failed to fetch portfolio data');
      }

      const [projects, skills, experiences, education, certificates] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        experiencesRes.json(),
        educationRes.json(),
        certificatesRes.json()
      ]);

      setPortfolioData({
        projects,
        skills,
        experiences,
        education, // API now returns the education array directly
        certificates
      });
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setError('Failed to load portfolio data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generic save function
  const saveData = async <T,>(section: string, data: T[]) => {
    try {
      setIsSaving(true);
      setError('');
      
      const response = await fetch(`/api/admin/portfolio/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to save ${section}`);
      }

      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      return true;
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      setError(`Failed to save ${section}. Please try again.`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Add new item functions
  const addProject = async () => {
    const newId = portfolioData.projects.length > 0 
      ? Math.max(...portfolioData.projects.map(p => p.id)) + 1 
      : 1;
    
    const newProject: Project = {
      id: newId,
      title: projectForm.title,
      description: projectForm.description,
      link: projectForm.link,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    const newProjects = [...portfolioData.projects, newProject];
    const success = await saveData('projects', newProjects);
    
    if (success) {
      setPortfolioData({...portfolioData, projects: newProjects});
      setProjectForm({ title: '', description: '', link: '', technologies: '' });
      setIsEditing(false);
    }
  };

  const addSkill = async () => {
    const newId = portfolioData.skills.length > 0 
      ? Math.max(...portfolioData.skills.map(s => s.id)) + 1 
      : 1;
    
    const newSkill: Skill = {
      id: newId,
      name: skillForm.name,
      level: skillForm.level,
      category: skillForm.category
    };

    const newSkills = [...portfolioData.skills, newSkill];
    const success = await saveData('skills', newSkills);
    
    if (success) {
      setPortfolioData({...portfolioData, skills: newSkills});
      setSkillForm({ name: '', level: 50, category: '' });
      setIsEditing(false);
    }
  };

  const addExperience = async () => {
    const newId = portfolioData.experiences.length > 0 
      ? Math.max(...portfolioData.experiences.map(e => e.id)) + 1 
      : 1;
    
    const newExperience: Experience = {
      id: newId,
      role: experienceForm.role,
      company: experienceForm.company,
      period: experienceForm.period,
      description: experienceForm.description,
      achievements: experienceForm.achievements.split(',').map(a => a.trim()).filter(Boolean)
    };

    const newExperiences = [...portfolioData.experiences, newExperience];
    const success = await saveData('experiences', newExperiences);
    
    if (success) {
      setPortfolioData({...portfolioData, experiences: newExperiences});
      setExperienceForm({ role: '', company: '', period: '', description: '', achievements: '' });
      setIsEditing(false);
    }
  };

  const addEducation = async () => {
    const newId = portfolioData.education.length > 0 
      ? Math.max(...portfolioData.education.map(e => e.id)) + 1 
      : 1;
    
    const newEducation: Education = {
      id: newId,
      institution: educationForm.institution,
      degree: educationForm.degree,
      period: educationForm.period,
      description: educationForm.description
    };

    const newEducationArray = [...portfolioData.education, newEducation];
    const success = await saveData('education', newEducationArray);
    
    if (success) {
      setPortfolioData({...portfolioData, education: newEducationArray});
      setEducationForm({ institution: '', degree: '', period: '', description: '' });
      setIsEditing(false);
    }
  };

  const addCertificate = async () => {
    const newId = portfolioData.certificates.length > 0 
      ? Math.max(...portfolioData.certificates.map(c => c.id)) + 1 
      : 1;
    
    const newCertificate: Certificate = {
      id: newId,
      name: certificateForm.name,
      issuer: certificateForm.issuer,
      date: certificateForm.date,
      credentialLink: certificateForm.credentialLink
    };

    const newCertificates = [...portfolioData.certificates, newCertificate];
    const success = await saveData('certificates', newCertificates);
    
    if (success) {
      setPortfolioData({...portfolioData, certificates: newCertificates});
      setCertificateForm({ name: '', issuer: '', date: '', credentialLink: '' });
      setIsEditing(false);
    }
  };

  // Edit item functions
  const editProject = (project: Project) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      link: project.link,
      technologies: project.technologies.join(', ')
    });
    setIsEditing(true);
  };

  const editSkill = (skill: Skill) => {
    setSkillForm({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
    setIsEditing(true);
  };

  const editExperience = (experience: Experience) => {
    setExperienceForm({
      id: experience.id,
      role: experience.role,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      achievements: experience.achievements.join(', ')
    });
    setIsEditing(true);
  };

  const editEducation = (education: Education) => {
    setEducationForm({
      id: education.id,
      institution: education.institution,
      degree: education.degree,
      period: education.period,
      description: education.description
    });
    setIsEditing(true);
  };

  const editCertificate = (certificate: Certificate) => {
    setCertificateForm({
      id: certificate.id,
      name: certificate.name,
      issuer: certificate.issuer,
      date: certificate.date,
      credentialLink: certificate.credentialLink
    });
    setIsEditing(true);
  };

  // Save edited item
  const saveEditedProject = async () => {
    if (!projectForm.id) return;
    
    const updatedProjects = portfolioData.projects.map(p => 
      p.id === projectForm.id 
        ? {
            ...p,
            title: projectForm.title,
            description: projectForm.description,
            link: projectForm.link,
            technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
          }
        : p
    );

    const success = await saveData('projects', updatedProjects);
    
    if (success) {
      setPortfolioData({...portfolioData, projects: updatedProjects});
      setProjectForm({ title: '', description: '', link: '', technologies: '' });
      setIsEditing(false);
    }
  };

  const saveEditedSkill = async () => {
    if (!skillForm.id) return;
    
    const updatedSkills = portfolioData.skills.map(s => 
      s.id === skillForm.id 
        ? {
            ...s,
            name: skillForm.name,
            level: skillForm.level,
            category: skillForm.category
          }
        : s
    );

    const success = await saveData('skills', updatedSkills);
    
    if (success) {
      setPortfolioData({...portfolioData, skills: updatedSkills});
      setSkillForm({ name: '', level: 50, category: '' });
      setIsEditing(false);
    }
  };

  const saveEditedExperience = async () => {
    if (!experienceForm.id) return;
    
    const updatedExperiences = portfolioData.experiences.map(e => 
      e.id === experienceForm.id 
        ? {
            ...e,
            role: experienceForm.role,
            company: experienceForm.company,
            period: experienceForm.period,
            description: experienceForm.description,
            achievements: experienceForm.achievements.split(',').map(a => a.trim()).filter(Boolean)
          }
        : e
    );

    const success = await saveData('experiences', updatedExperiences);
    
    if (success) {
      setPortfolioData({...portfolioData, experiences: updatedExperiences});
      setExperienceForm({ role: '', company: '', period: '', description: '', achievements: '' });
      setIsEditing(false);
    }
  };

  const saveEditedEducation = async () => {
    if (!educationForm.id) return;
    
    const updatedEducation = portfolioData.education.map(e => 
      e.id === educationForm.id 
        ? {
            ...e,
            institution: educationForm.institution,
            degree: educationForm.degree,
            period: educationForm.period,
            description: educationForm.description
          }
        : e
    );

    const success = await saveData('education', updatedEducation);
    
    if (success) {
      setPortfolioData({...portfolioData, education: updatedEducation});
      setEducationForm({ institution: '', degree: '', period: '', description: '' });
      setIsEditing(false);
    }
  };

  const saveEditedCertificate = async () => {
    if (!certificateForm.id) return;
    
    const updatedCertificates = portfolioData.certificates.map(c => 
      c.id === certificateForm.id 
        ? {
            ...c,
            name: certificateForm.name,
            issuer: certificateForm.issuer,
            date: certificateForm.date,
            credentialLink: certificateForm.credentialLink
          }
        : c
    );

    const success = await saveData('certificates', updatedCertificates);
    
    if (success) {
      setPortfolioData({...portfolioData, certificates: updatedCertificates});
      setCertificateForm({ name: '', issuer: '', date: '', credentialLink: '' });
      setIsEditing(false);
    }
  };

  // Delete item functions
  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const updatedProjects = portfolioData.projects.filter(p => p.id !== id);
    const success = await saveData('projects', updatedProjects);
    
    if (success) {
      setPortfolioData({...portfolioData, projects: updatedProjects});
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    const updatedSkills = portfolioData.skills.filter(s => s.id !== id);
    const success = await saveData('skills', updatedSkills);
    
    if (success) {
      setPortfolioData({...portfolioData, skills: updatedSkills});
    }
  };

  const deleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    const updatedExperiences = portfolioData.experiences.filter(e => e.id !== id);
    const success = await saveData('experiences', updatedExperiences);
    
    if (success) {
      setPortfolioData({...portfolioData, experiences: updatedExperiences});
    }
  };

  const deleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    
    const updatedEducation = portfolioData.education.filter(e => e.id !== id);
    const success = await saveData('education', updatedEducation);
    
    if (success) {
      setPortfolioData({...portfolioData, education: updatedEducation});
    }
  };

  const deleteCertificate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    const updatedCertificates = portfolioData.certificates.filter(c => c.id !== id);
    const success = await saveData('certificates', updatedCertificates);
    
    if (success) {
      setPortfolioData({...portfolioData, certificates: updatedCertificates});
    }
  };

  // Render form based on active section
  const renderForm = () => {
    switch (activeSection) {
      case 'projects':
        return (
          <div className="border border-blue-200 dark:border-blue-900 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                {projectForm.id ? 'Edit Project' : 'Add New Project'}
              </h4>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({...projectForm, link: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="React, TypeScript, Node.js"
                  required
                />
              </div>
              <button
                onClick={projectForm.id ? saveEditedProject : addProject}
                disabled={isSaving}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {projectForm.id ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div className="border border-purple-200 dark:border-purple-900 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300">
                {skillForm.id ? 'Edit Skill' : 'Add New Skill'}
              </h4>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level: {skillForm.level}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({...skillForm, level: parseInt(e.target.value)})}
                  className="w-full accent-purple-500"
                  required
                />
              </div>
              <button
                onClick={skillForm.id ? saveEditedSkill : addSkill}
                disabled={isSaving}
                className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {skillForm.id ? 'Update Skill' : 'Add Skill'}
              </button>
            </div>
          </div>
        );
      
      case 'experiences':
        return (
          <div className="border border-indigo-200 dark:border-indigo-900 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">
                {experienceForm.id ? 'Edit Experience' : 'Add New Experience'}
              </h4>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({...experienceForm, role: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({...experienceForm, company: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Period
                </label>
                <input
                  type="text"
                  value={experienceForm.period}
                  onChange={(e) => setExperienceForm({...experienceForm, period: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="2020 ~ 2023"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({...experienceForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Achievements (comma separated)
                </label>
                <input
                  type="text"
                  value={experienceForm.achievements}
                  onChange={(e) => setExperienceForm({...experienceForm, achievements: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Increased sales by 20%, Led a team of 5 developers"
                  required
                />
              </div>
              <button
                onClick={experienceForm.id ? saveEditedExperience : addExperience}
                disabled={isSaving}
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {experienceForm.id ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </div>
        );
      
      case 'education':
        return (
          <div className="border border-green-200 dark:border-green-900 p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                {educationForm.id ? 'Edit Education' : 'Add New Education'}
              </h4>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Period
                </label>
                <input
                  type="text"
                  value={educationForm.period}
                  onChange={(e) => setEducationForm({...educationForm, period: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="2018 ~ 2022"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-24"
                  required
                />
              </div>
              <button
                onClick={educationForm.id ? saveEditedEducation : addEducation}
                disabled={isSaving}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {educationForm.id ? 'Update Education' : 'Add Education'}
              </button>
            </div>
          </div>
        );
      
      case 'certificates':
        return (
          <div className="border border-amber-200 dark:border-amber-900 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                {certificateForm.id ? 'Edit Certificate' : 'Add New Certificate'}
              </h4>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={certificateForm.name}
                  onChange={(e) => setCertificateForm({...certificateForm, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issuer
                </label>
                <input
                  type="text"
                  value={certificateForm.issuer}
                  onChange={(e) => setCertificateForm({...certificateForm, issuer: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={certificateForm.date}
                  onChange={(e) => setCertificateForm({...certificateForm, date: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="2023"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credential Link
                </label>
                <input
                  type="text"
                  value={certificateForm.credentialLink}
                  onChange={(e) => setCertificateForm({...certificateForm, credentialLink: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              <button
                onClick={certificateForm.id ? saveEditedCertificate : addCertificate}
                disabled={isSaving}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaSave className="mr-2" />
                )}
                {certificateForm.id ? 'Update Certificate' : 'Add Certificate'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Portfolio Management</h2>
        
        {/* Tab navigation */}
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
          <button
            onClick={() => setActiveSection('projects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === 'projects' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveSection('skills')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === 'skills' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveSection('experiences')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === 'experiences' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Experiences
          </button>
          <button
            onClick={() => setActiveSection('education')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === 'education' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveSection('certificates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeSection === 'certificates' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Certificates
          </button>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Add item button (when not editing) */}
          {!isEditing && (
            <div className="mb-6">
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white ${
                  activeSection === 'projects' ? 'bg-blue-500 hover:bg-blue-600' :
                  activeSection === 'skills' ? 'bg-purple-500 hover:bg-purple-600' :
                  activeSection === 'experiences' ? 'bg-indigo-500 hover:bg-indigo-600' :
                  activeSection === 'education' ? 'bg-green-500 hover:bg-green-600' :
                  'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                <FaPlus className="mr-2" />
                {`Add New ${activeSection.slice(0, -1).charAt(0).toUpperCase() + activeSection.slice(0, -1).substring(1)}`}
              </button>
            </div>
          )}

          {/* Edit form */}
          {isEditing && renderForm()}

          {/* List items */}
          {!isEditing && (
            <>
              {/* Projects Section */}
              {activeSection === 'projects' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Projects</h3>
                  <div className="space-y-4">
                    {portfolioData.projects.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
                      </div>
                    ) : (
                      portfolioData.projects.map(project => (
                        <div key={project.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{project.title}</h4>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 text-blue-500 hover:text-blue-700"
                                onClick={() => editProject(project)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => deleteProject(project.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs rounded-full text-blue-800 dark:text-blue-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Skills</h3>
                  <div className="space-y-4">
                    {portfolioData.skills.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
                      </div>
                    ) : (
                      portfolioData.skills.map(skill => (
                        <div key={skill.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{skill.name}</h4>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 text-purple-500 hover:text-purple-700"
                                onClick={() => editSkill(skill)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => deleteSkill(skill.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Category: {skill.category}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Experiences Section */}
              {activeSection === 'experiences' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Experiences</h3>
                  <div className="space-y-4">
                    {portfolioData.experiences.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No experiences added yet.</p>
                      </div>
                    ) : (
                      portfolioData.experiences.map(experience => (
                        <div key={experience.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold">{experience.role}</h4>
                              <p className="text-sm">{experience.company} | {experience.period}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 text-indigo-500 hover:text-indigo-700"
                                onClick={() => editExperience(experience)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => deleteExperience(experience.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{experience.description}</p>
                          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            {experience.achievements.map((achievement, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-400">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Education</h3>
                  <div className="space-y-4">
                    {portfolioData.education.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No education entries added yet.</p>
                      </div>
                    ) : (
                      portfolioData.education.map(edu => (
                        <div key={edu.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold">{edu.degree}</h4>
                              <p className="text-sm">{edu.institution} | {edu.period}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 text-green-500 hover:text-green-700"
                                onClick={() => editEducation(edu)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => deleteEducation(edu.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{edu.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Certificates Section */}
              {activeSection === 'certificates' && (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-600 dark:text-amber-400">Certificates</h3>
                  <div className="space-y-4">
                    {portfolioData.certificates.length === 0 ? (
                      <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No certificates added yet.</p>
                      </div>
                    ) : (
                      portfolioData.certificates.map(cert => (
                        <div key={cert.id} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold">{cert.name}</h4>
                              <p className="text-sm">{cert.issuer} | {cert.date}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 text-amber-500 hover:text-amber-700"
                                onClick={() => editCertificate(cert)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() => deleteCertificate(cert.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <a href={cert.credentialLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline mt-2 inline-block">
                            View Credential
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}