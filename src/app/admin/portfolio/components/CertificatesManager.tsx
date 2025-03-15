"use client";

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Certificate, CertificateForm, ManagerProps } from './types';

export default function CertificatesManager({ data, onSave, isSaving }: ManagerProps) {
  const certificates = data as Certificate[];
  const [isEditing, setIsEditing] = useState(false);
  const [certificateForm, setCertificateForm] = useState<CertificateForm>({ 
    name: '', 
    issuer: '', 
    date: '', 
    credentialLink: '' 
  });

  // Add new certificate
  const addCertificate = async () => {
    const newId = certificates.length > 0 
      ? Math.max(...certificates.map(c => c.id)) + 1 
      : 1;
    
    const newCertificate: Certificate = {
      id: newId,
      name: certificateForm.name,
      issuer: certificateForm.issuer,
      date: certificateForm.date,
      credentialLink: certificateForm.credentialLink
    };

    const newCertificates = [...certificates, newCertificate];
    const success = await onSave(newCertificates);
    
    if (success) {
      setCertificateForm({ name: '', issuer: '', date: '', credentialLink: '' });
      setIsEditing(false);
    }
  };

  // Edit certificate
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

  // Save edited certificate
  const saveEditedCertificate = async () => {
    if (!certificateForm.id) return;
    
    const updatedCertificates = certificates.map(c => 
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

    const success = await onSave(updatedCertificates);
    
    if (success) {
      setCertificateForm({ name: '', issuer: '', date: '', credentialLink: '' });
      setIsEditing(false);
    }
  };

  // Delete certificate
  const deleteCertificate = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    const updatedCertificates = certificates.filter(c => c.id !== id);
    await onSave(updatedCertificates);
  };

  // Render form
  const renderForm = () => {
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
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-amber-600 dark:text-amber-400">Certificates</h3>

      {/* Add item button (when not editing) */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-amber-500 hover:bg-amber-600"
          >
            <FaPlus className="mr-2" />
            Add New Certificate
          </button>
        </div>
      )}

      {/* Edit form */}
      {isEditing && renderForm()}

      {/* Certificates list */}
      {!isEditing && (
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No certificates added yet.</p>
            </div>
          ) : (
            certificates.map(cert => (
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
      )}
    </div>
  );
}