"use client";

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Experience, ExperienceForm, ManagerProps } from './types';

export default function ExperiencesManager({ data, onSave, isSaving }: ManagerProps) {
  const experiences = data as Experience[];
  const [isEditing, setIsEditing] = useState(false);
  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({ 
    role: '', 
    company: '', 
    period: '', 
    description: '', 
    achievements: '' 
  });

  // Add new experience
  const addExperience = async () => {
    const newId = experiences.length > 0 
      ? Math.max(...experiences.map(e => e.id)) + 1 
      : 1;
    
    const newExperience: Experience = {
      id: newId,
      role: experienceForm.role,
      company: experienceForm.company,
      period: experienceForm.period,
      description: experienceForm.description,
      achievements: experienceForm.achievements.split(',').map(a => a.trim()).filter(Boolean)
    };

    const newExperiences = [...experiences, newExperience];
    const success = await onSave(newExperiences);
    
    if (success) {
      setExperienceForm({ role: '', company: '', period: '', description: '', achievements: '' });
      setIsEditing(false);
    }
  };

  // Edit experience
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

  // Save edited experience
  const saveEditedExperience = async () => {
    if (!experienceForm.id) return;
    
    const updatedExperiences = experiences.map(e => 
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

    const success = await onSave(updatedExperiences);
    
    if (success) {
      setExperienceForm({ role: '', company: '', period: '', description: '', achievements: '' });
      setIsEditing(false);
    }
  };

  // Delete experience
  const deleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    const updatedExperiences = experiences.filter(e => e.id !== id);
    await onSave(updatedExperiences);
  };

  // Render form
  const renderForm = () => {
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
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Experiences</h3>

      {/* Add item button (when not editing) */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600"
          >
            <FaPlus className="mr-2" />
            Add New Experience
          </button>
        </div>
      )}

      {/* Edit form */}
      {isEditing && renderForm()}

      {/* Experiences list */}
      {!isEditing && (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No experiences added yet.</p>
            </div>
          ) : (
            experiences.map(experience => (
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
      )}
    </div>
  );
}