"use client";

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Education, EducationForm, ManagerProps } from './types';

export default function EducationManager({ data, onSave, isSaving }: ManagerProps) {
  const educationList = data as Education[];
  const [isEditing, setIsEditing] = useState(false);
  const [educationForm, setEducationForm] = useState<EducationForm>({ 
    institution: '', 
    degree: '', 
    period: '', 
    description: '' 
  });

  // Add new education
  const addEducation = async () => {
    const newId = educationList.length > 0 
      ? Math.max(...educationList.map(e => e.id)) + 1 
      : 1;
    
    const newEducation: Education = {
      id: newId,
      institution: educationForm.institution,
      degree: educationForm.degree,
      period: educationForm.period,
      description: educationForm.description
    };

    const newEducationList = [...educationList, newEducation];
    const success = await onSave(newEducationList);
    
    if (success) {
      setEducationForm({ institution: '', degree: '', period: '', description: '' });
      setIsEditing(false);
    }
  };

  // Edit education
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

  // Save edited education
  const saveEditedEducation = async () => {
    if (!educationForm.id) return;
    
    const updatedEducation = educationList.map(e => 
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

    const success = await onSave(updatedEducation);
    
    if (success) {
      setEducationForm({ institution: '', degree: '', period: '', description: '' });
      setIsEditing(false);
    }
  };

  // Delete education
  const deleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    
    const updatedEducation = educationList.filter(e => e.id !== id);
    await onSave(updatedEducation);
  };

  // Render form
  const renderForm = () => {
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
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Education</h3>

      {/* Add item button (when not editing) */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600"
          >
            <FaPlus className="mr-2" />
            Add New Education
          </button>
        </div>
      )}

      {/* Edit form */}
      {isEditing && renderForm()}

      {/* Education list */}
      {!isEditing && (
        <div className="space-y-4">
          {educationList.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No education entries added yet.</p>
            </div>
          ) : (
            educationList.map(edu => (
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
      )}
    </div>
  );
}