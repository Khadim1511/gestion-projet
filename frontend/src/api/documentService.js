import api from './axios';

export const getDocumentsByProjet = (projetId) => api.get(`/projets/${projetId}/documents`);
export const getDocumentById      = (id)       => api.get(`/documents/${id}`);
export const createDocument       = (projetId, data) => api.post(`/projets/${projetId}/documents`, data);
export const updateDocument       = (id, data)       => api.put(`/documents/${id}`, data);
export const deleteDocument       = (id)             => api.delete(`/documents/${id}`);
