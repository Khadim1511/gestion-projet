import api from './axios';

export const getLivrablesByPhase = (phaseId) => api.get(`/phases/${phaseId}/livrables`);
export const getLivrableById     = (id)      => api.get(`/livrables/${id}`);
export const createLivrable     = (phaseId, data) => api.post(`/phases/${phaseId}/livrables`, data);
export const updateLivrable     = (id, data)      => api.put(`/livrables/${id}`, data);
export const deleteLivrable     = (id)           => api.delete(`/livrables/${id}`);
