import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPhaseById, createPhase, updatePhase } from '../../api/phaseService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Hash, 
  Type, 
  Calendar, 
  Coins, 
  ArrowLeft, 
  Save, 
  Activity,
  FolderKanban
} from 'lucide-react';

export default function PhaseFormPage() {
  const { projetId, phaseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    libelle: '',
    dateDebut: '',
    dateFin: '',
    montant: '',
    projetId: projetId || ''
  });

  useEffect(() => {
    if (phaseId) {
      getPhaseById(phaseId).then((res) => {
        const ph = res.data;
        setForm({
          code: ph.code,
          libelle: ph.libelle,
          dateDebut: ph.dateDebut,
          dateFin: ph.dateFin,
          montant: ph.montant,
          projetId: ph.projetId
        });
      });
    }
  }, [phaseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (phaseId) await updatePhase(phaseId, form);
      else await createPhase(form.projetId, form);
      toast.success(phaseId ? 'Phase mise à jour !' : 'Phase ajoutée !');
      navigate(`/projets/${form.projetId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[800px] mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate(`/projets/${form.projetId}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold group self-start"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Annuler et retourner au projet
        </button>
        <div className="flex items-center gap-4 mt-2">
           <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
              <Layers className="w-7 h-7 text-white" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                {phaseId ? 'Modifier Phase' : 'Ajouter une Phase'}
              </h1>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                <FolderKanban className="w-3 h-3 text-orange-500" /> Profil de Mission #{form.projetId}
              </p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/5 blur-[80px] pointer-events-none" />

          <div className="space-y-10 relative z-10">
            {/* Section: Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Identification d'étape</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Réf Phase</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="text"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      required
                      placeholder="PH-01"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Libellé de l'étape</label>
                  <div className="relative group">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="text"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner"
                      value={form.libelle}
                      onChange={(e) => setForm({ ...form, libelle: e.target.value })}
                      required
                      placeholder="Ex: Conception & UX Flow"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Commercial & Timing */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Facturation & Délai</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Montant Alloué (MAD)</label>
                  <div className="relative group">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="number"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner"
                      value={form.montant}
                      onChange={(e) => setForm({ ...form, montant: e.target.value })}
                      required
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Début Phase</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="date"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer shadow-inner [color-scheme:light_dark]"
                      value={form.dateDebut}
                      onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Fin Phase</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="date"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer shadow-inner [color-scheme:light_dark]"
                      value={form.dateFin}
                      onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                 <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Contrôle de conformité</span>
                 <span className="text-muted-foreground text-xs font-bold font-italic">Données prêtes pour injection système.</span>
              </div>
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
           >
             {loading ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
             ) : (
               <>
                 <Save className="w-5 h-5" />
                 {phaseId ? 'Enregistrer les modifications' : 'Confirmer la Phase'}
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
}
