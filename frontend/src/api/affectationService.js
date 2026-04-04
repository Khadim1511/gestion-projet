import api from './axios';

export const getAffectationsByPhase = (phaseId) => 
  api.get(`/phases/${phaseId}/employes`);

export const getAffectationsByEmploye = (employeId) => 
  api.get(`/employes/${employeId}/phases`);

export const createAffectation = (phaseId, employeId, data) => 
  api.post(`/phases/${phaseId}/employes/${employeId}`, data);

export const updateAffectation = (phaseId, employeId, data) => 
  api.put(`/phases/${phaseId}/employes/${employeId}`, data);

export const deleteAffectation = (phaseId, employeId) => 
  api.delete(`/phases/${phaseId}/employes/${employeId}`);
