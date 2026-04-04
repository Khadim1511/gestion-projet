import api from './axios';

export const getAllFactures    = () => api.get('/factures');
export const getFactureById   = (id) => api.get(`/factures/${id}`);
export const createFacture    = (phaseId, data) => api.post(`/phases/${phaseId}/facture`, data); 
export const updateFacture    = (id, data) => api.put(`/factures/${id}`, data);
export const deleteFacture    = (id) => api.delete(`/factures/${id}`);
