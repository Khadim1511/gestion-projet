import api from './axios';

export const getAllOrganismes  = ()      => api.get('/organismes');
export const createOrganisme   = (data)  => api.post('/organismes', data);
export const updateOrganisme   = (id, d) => api.put(`/organismes/${id}`, d);
export const deleteOrganisme   = (id)    => api.delete(`/organismes/${id}`);
