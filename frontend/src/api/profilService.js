import api from './axios';

export const getAllProfils  = ()      => api.get('/profils');
export const createProfil   = (data)  => api.post('/profils', data);
export const updateProfil   = (id, d) => api.put(`/profils/${id}`, d);
export const deleteProfil   = (id)    => api.delete(`/profils/${id}`);
