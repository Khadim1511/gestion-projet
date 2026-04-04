import api from './axios';

export const getTableauDeBord          = ()            => api.get('/reporting/tableau-de-bord');
export const getPhasesTermineesNonFact = ()            => api.get('/reporting/phases/terminees-non-facturees');
export const getPhasesFactureesNonPay  = ()            => api.get('/reporting/phases/facturees-non-payees');
export const getPhasesPayees           = ()            => api.get('/reporting/phases/payees');
export const getPhasesParPeriode       = (d, f)        => api.get('/reporting/phases/par-periode', { params: { dateDebut: d, dateFin: f } });
