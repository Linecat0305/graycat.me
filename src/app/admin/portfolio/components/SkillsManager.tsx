"use client";

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Skill, SkillForm, ManagerProps } from './types';

export default function SkillsManager({ data, onSave, isSaving }: ManagerProps) {
  const skills = data as Skill[];
  const [isEditing, setIsEditing] = useState(false);
  const [skillForm, setSkillForm] = useState<SkillForm>({ name: '', level: 50, category: '' });

  // Add new skill
  const addSkill = async () => {
    const newId = skills.length > 0 
      ? Math.max(...skills.map(s => s.id)) + 1 
      : 1;
    
    const newSkill: Skill = {
      id: newId,
      name: skillForm.name,
      level: skillForm.level,
      category: skillForm.category
    };

    const newSkills = [...skills, newSkill];
    const success = await onSave(newSkills);
    
    if (success) {
      setSkillForm({ name: '', level: 50, category: '' });
      setIsEditing(false);
    }
  };

  // Edit skill
  const editSkill = (skill: Skill) => {
    setSkillForm({
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category
    });
    setIsEditing(true);
  };

  // Save edited skill
  const saveEditedSkill = async () => {
    if (!skillForm.id) return;
    
    const updatedSkills = skills.map(s => 
      s.id === skillForm.id 
        ? {
            ...s,
            name: skillForm.name,
            level: skillForm.level,
            category: skillForm.category
          }
        : s
    );

    const success = await onSave(updatedSkills);
    
    if (success) {
      setSkillForm({ name: '', level: 50, category: '' });
      setIsEditing(false);
    }
  };

  // Delete skill
  const deleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    const updatedSkills = skills.filter(s => s.id !== id);
    await onSave(updatedSkills);
  };

  // Render form
  const renderForm = () => {
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
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Skills</h3>

      {/* Add item button (when not editing) */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600"
          >
            <FaPlus className="mr-2" />
            Add New Skill
          </button>
        </div>
      )}

      {/* Edit form */}
      {isEditing && renderForm()}

      {/* Skills list */}
      {!isEditing && (
        <div className="space-y-4">
          {skills.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
            </div>
          ) : (
            skills.map(skill => (
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
      )}
    </div>
  );
}