import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Users, Calendar, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { getAllEmployes } from '../../api/employeService';
import { getAffectationsByPhase, createAffectation, deleteAffectation } from '../../api/affectationService';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function AffectationModal({ phase, onClose, onUpdate }) {
  const [employes, setEmployes] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    employeId: '',
    dateDebut: phase?.dateDebut || '',
    dateFin: phase?.dateFin || ''
  });

  const fetchData = async () => {
    try {
      const [eRes, aRes] = await Promise.all([
        getAllEmployes(),
        getAffectationsByPhase(phase.id)
      ]);
      setEmployes(eRes.data);
      setAffectations(aRes.data);
    } catch (err) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phase) fetchData();
  }, [phase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeId) return toast.error('Sélectionnez un employé');
    
    setSubmitting(true);
    try {
      await createAffectation(phase.id, formData.employeId, {
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin
      });
      toast.success('Employé affecté avec succès');
      setFormData({ ...formData, employeId: '' });
      fetchData();
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur d\'affectation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (employeId) => {
    if (!confirm('Retirer cet employé de la phase ?')) return;
    try {
      await deleteAffectation(phase.id, employeId);
      toast.success('Affectation supprimée');
      fetchData();
      onUpdate();
    } catch (err) {
      toast.error('Erreur lors du retrait');
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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
        className="relative w-full max-w-2xl bg-card border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Affectations</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{phase.libelle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-background/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Nouveau formulaire d'affectation */}
          <div className="bg-background/50 border border-border/50 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
Nouvelle affectation            </h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-2 block">Choisir un employé</label>
                <select
                  value={formData.employeId}
                  onChange={e => setFormData({ ...formData, employeId: e.target.value })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:border-orange-500 focus:ring-4 ring-orange-500/10 outline-none transition-all appearance-none"
                >
                  <option value="">Sélectionner...</option>
                  {employes
                    .filter(e => !affectations.some(a => a.employeId === e.id))
                    .map(e => (
                      <option key={e.id} value={e.id}>{e.nom} ({e.matricule})</option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 block">Date Début</label>
                <input
                  type="date"
                  value={formData.dateDebut}
                  onChange={e => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1 block">Date Fin</label>
                <input
                  type="date"
                  value={formData.dateFin}
                  onChange={e => setFormData({ ...formData, dateFin: e.target.value })}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Assigner au projet
                </button>
              </div>
            </form>
          </div>

          {/* Liste des affectations actuelles */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2 px-2">
              <Users className="w-4 h-4" />
Membres de l'équipe ({affectations.length})
            </h3>
            
            <div className="space-y-3">
              {loading ? (
                <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
              ) : affectations.length === 0 ? (
                <div className="bg-card/20 border border-dashed border-border/50 rounded-2xl py-10 text-center text-muted-foreground italic text-sm">
                  Aucune affectation pour le moment
                </div>
              ) : (
                affectations.map((aff, idx) => (
                  <motion.div
                    key={aff.employeId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-center justify-between p-4 bg-card/60 border border-border/50 rounded-2xl hover:border-orange-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black text-xs border border-orange-500/20">
                        {getInitials(aff.employeNom)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{aff.employeNom}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase">
                          <Calendar className="w-3 h-3" /> {aff.dateDebut} → {aff.dateFin}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(aff.employeId)}
                      className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
             L'affectation définit la période active de l'employé sur cette phase du projet.
           </p>
        </div>
      </motion.div>
    </div>
  );
}

function Plus(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}
