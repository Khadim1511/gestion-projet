import api from './axios';

export const getPhasesByProjet   = (projetId)    => api.get(`/projets/${projetId}/phases`);
export const getPhaseById        = (id)          => api.get(`/phases/${id}`);
export const createPhase         = (projetId, d) => api.post(`/projets/${projetId}/phases`, d);
export const updatePhase         = (id, d)       => api.put(`/phases/${id}`, d);
export const deletePhase         = (id)          => api.delete(`/phases/${id}`);
export const updateRealisation   = (id, etat)    => api.patch(`/phases/${id}/realisation`, { params: { etat } });
export const updateFacturation   = (id, etat)    => api.patch(`/phases/${id}/facturation`, { params: { etat } });
export const updatePaiement      = (id, etat)    => api.patch(`/phases/${id}/paiement`, { params: { etat } });
