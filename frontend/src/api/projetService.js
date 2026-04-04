import api from './axios';

export const getAllProjets   = ()       => api.get('/projets');
export const getProjetById  = (id)     => api.get(`/projets/${id}`);
export const searchProjets  = (nom)    => api.get('/projets/search', { params: { nom } });
export const getProjetsEnCours  = ()   => api.get('/projets/en-cours');
export const getProjetsClotures = ()   => api.get('/projets/clotures');
export const createProjet   = (data)   => api.post('/projets', data);
export const updateProjet   = (id, d)  => api.put(`/projets/${id}`, d);
export const deleteProjet   = (id)     => api.delete(`/projets/${id}`);
