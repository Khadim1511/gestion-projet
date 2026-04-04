import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Plus, Calendar, Trash2, Loader2, AlertCircle, FolderKanban, Layers } from 'lucide-react';
import { getAllProjets } from '../../api/projetService';
import { getPhasesByProjet } from '../../api/phaseService';
import { getAffectationsByEmploye, createAffectation, deleteAffectation } from '../../api/affectationService';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EmployeAffectationsModal({ employe, onClose, onUpdate }) {
  const [projets, setProjets] = useState([]);
  const [phases, setPhases] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhases, setLoadingPhases] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    projetId: '',
    phaseId: '',
    dateDebut: '',
    dateFin: ''
  });

  const fetchData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        getAllProjets(),
        getAffectationsByEmploye(employe.id)
      ]);
      setProjets(pRes.data);
      setAffectations(aRes.data);
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employe) fetchData();
  }, [employe]);

  // Load phases when project is selected
  useEffect(() => {
    if (formData.projetId) {
      const fetchPhases = async () => {
        setLoadingPhases(true);
        try {
          const res = await getPhasesByProjet(formData.projetId);
          setPhases(res.data);
          // Set default dates from first phase or reset if no phases
          if (res.data.length > 0) {
            setFormData(prev => ({ 
              ...prev, 
              phaseId: res.data[0].id,
              dateDebut: res.data[0].dateDebut, 
              dateFin: res.data[0].dateFin 
            }));
          } else {
            setFormData(prev => ({ ...prev, phaseId: '' }));
          }
        } catch {
          toast.error('Erreur chargement des phases');
        } finally {
          setLoadingPhases(false);
        }
      };
      fetchPhases();
    } else {
      setPhases([]);
      setFormData(prev => ({ ...prev, phaseId: '', dateDebut: '', dateFin: '' }));
    }
  }, [formData.projetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phaseId) return toast.error('Sélectionnez une phase');
    
    setSubmitting(true);
    try {
      await createAffectation(formData.phaseId, employe.id, {
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin
      });
      toast.success('Affectation réussie');
      setFormData({ projetId: '', phaseId: '', dateDebut: '', dateFin: '' });
      fetchData();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur d\'affectation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (phaseId) => {
    if (!confirm('Retirer cet employé de cette phase ?')) return;
    try {
      await deleteAffectation(phaseId, employe.id);
      toast.success('Affectation supprimée');
      fetchData();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Erreur lors du retrait');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl bg-card border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Affectations Projets</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{employe.prenom} {employe.nom}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
          {/* Nouveau formulaire d'affectation */}
          <div className="bg-background/50 border border-border/50 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-2">
              <Plus className="w-4 h-4" />
Nouvelle affectation au projet            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 select-none flex items-center gap-2">
                    <FolderKanban className="w-3 h-3" /> Projet
                  </label>
                  <select
                    value={formData.projetId}
                    onChange={e => setFormData({ ...formData, projetId: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:border-orange-500 focus:ring-4 ring-orange-500/10 outline-none transition-all appearance-none"
                  >
                    <option value="">Sélectionner un projet...</option>
                    {projets.map(p => (
                      <option key={p.id} value={p.id}>{p.nom} ({p.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 select-none flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Phase
                  </label>
                  <select
                    value={formData.phaseId}
                    disabled={!formData.projetId || loadingPhases}
                    onChange={e => {
                      const phase = phases.find(ph => ph.id === parseInt(e.target.value));
                      setFormData({ 
                        ...formData, 
                        phaseId: e.target.value,
                        dateDebut: phase?.dateDebut || '',
                        dateFin: phase?.dateFin || ''
                      });
                    }}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:border-orange-500 focus:ring-4 ring-orange-500/10 outline-none transition-all appearance-none disabled:opacity-50"
                  >
                    {loadingPhases ? (
                      <option>Chargement...</option>
                    ) : phases.length === 0 ? (
                      <option value="">Sélectionnez un projet d'abord</option>
                    ) : (
                      phases.map(ph => (
                        <option key={ph.id} value={ph.id}>{ph.libelle} ({ph.code})</option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 block">Date Début</label>
                  <input
                    type="date"
                    value={formData.dateDebut}
                    onChange={e => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 block">Date Fin</label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={e => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || !formData.phaseId}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Assigner l'employé à ce projet
                </button>
              </div>
            </form>
          </div>

          {/* Liste des affectations actuelles */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2 px-2">
              <FolderKanban className="w-4 h-4" />
Projets en cours ({affectations.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {loading ? (
                <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
              ) : affectations.length === 0 ? (
                <div className="bg-card/20 border border-dashed border-border/50 rounded-2xl py-12 text-center text-muted-foreground italic text-sm">
                  Cet employé n'est affecté à aucun projet
                </div>
              ) : (
                affectations.map((aff, idx) => (
                  <motion.div
                    key={`${aff.phaseId}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-card/60 border border-border/50 rounded-2xl hover:border-orange-500/30 transition-all shadow-sm gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/20">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">{aff.phaseLibelle}</h4>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Phase du projet</p>
                        <div className="flex items-center gap-2 mt-2">
                           <Calendar className="w-3 h-3 text-muted-foreground" />
                           <span className="text-[10px] font-bold text-muted-foreground uppercase">{aff.dateDebut} → {aff.dateFin}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRemove(aff.phaseId)}
                          className="px-4 py-2 rounded-xl bg-background border border-border/50 text-xs font-bold text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Retirer
                        </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-background/50 border-t border-border/50 flex items-center gap-3">
           <AlertCircle className="w-4 h-4 text-orange-500" />
           <p className="text-[10px] font-bold text-muted-foreground italic uppercase">
             Gestion centralisée des interventions de l'employé sur les différentes phases projets.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
