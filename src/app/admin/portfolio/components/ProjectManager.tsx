"use client";

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Project, ProjectForm, ManagerProps } from './types';

export default function ProjectManager({ data, onSave, isSaving }: ManagerProps) {
  const projects = data as Project[];
  const [isEditing, setIsEditing] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectForm>({ title: '', description: '', link: '', technologies: '' });

  // Add new project
  const addProject = async () => {
    const newId = projects.length > 0 
      ? Math.max(...projects.map(p => p.id)) + 1 
      : 1;
    
    const newProject: Project = {
      id: newId,
      title: projectForm.title,
      description: projectForm.description,
      link: projectForm.link,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    const newProjects = [...projects, newProject];
    const success = await onSave(newProjects);
    
    if (success) {
      setProjectForm({ title: '', description: '', link: '', technologies: '' });
      setIsEditing(false);
    }
  };

  // Edit project
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

  // Save edited project
  const saveEditedProject = async () => {
    if (!projectForm.id) return;
    
    const updatedProjects = projects.map(p => 
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

    const success = await onSave(updatedProjects);
    
    if (success) {
      setProjectForm({ title: '', description: '', link: '', technologies: '' });
      setIsEditing(false);
    }
  };

  // Delete project
  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const updatedProjects = projects.filter(p => p.id !== id);
    await onSave(updatedProjects);
  };

  // Render form
  const renderForm = () => {
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
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Projects</h3>

      {/* Add item button (when not editing) */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            <FaPlus className="mr-2" />
            Add New Project
          </button>
        </div>
      )}

      {/* Edit form */}
      {isEditing && renderForm()}

      {/* Project list */}
      {!isEditing && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No projects added yet.</p>
            </div>
          ) : (
            projects.map(project => (
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
      )}
    </div>
  );
}