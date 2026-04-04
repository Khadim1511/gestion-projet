import api from './axios';

export const getAllEmployes  = ()      => api.get('/employes');
export const getEmployeById = (id)    => api.get(`/employes/${id}`);
export const createEmploye  = (data)  => api.post('/employes', data);
export const updateEmploye  = (id, d) => api.put(`/employes/${id}`, d);
export const deleteEmploye  = (id)    => api.delete(`/employes/${id}`);
