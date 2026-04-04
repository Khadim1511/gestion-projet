import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Hash, Calendar, Wallet, Save, AlertCircle } from 'lucide-react';
import { createFacture, updateFacture } from '../../api/factureService';
import toast from 'react-hot-toast';

export default function FactureModal({ phase, facture, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    dateFacture: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (facture) {
      setForm({
        code: facture.code,
        dateFacture: facture.dateFacture
      });
    }
  }, [facture]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation souple : on laisse passer mais on prévient l'utilisateur via le UI

    setLoading(true);
    try {
      if (facture) {
        await updateFacture(facture.id, form);
        toast.success('Facture mise à jour');
      } else {
        await createFacture(phase.id, form);
        toast.success('Facture générée avec succès');
      }
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la facturation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl w-full max-w-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Wallet className="w-32 h-32" />
        </div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                {facture ? 'Modifier Facture' : 'Facturer la Phase'}
              </h2>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">
                Phase: {phase.libelle} ({phase.montant?.toLocaleString('fr-MA')} MAD)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card/50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {!phase.etatRealisation && !facture && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
              Note : Cette phase n'est pas encore marquée comme "Réalisée", mais vous pouvez tout de même générer une facture (acompte ou avance).
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Numéro de Facture</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  placeholder="FAC-2024-001"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Date de facturation</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                <input
                  type="date"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={form.dateFacture}
                  onChange={(e) => setForm({ ...form, dateFacture: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Montant à facturer</span>
                 <span className="text-xl font-black text-amber-600 dark:text-amber-400">{phase.montant?.toLocaleString('fr-MA')} MAD</span>
               </div>
               <p className="text-[9px] text-muted-foreground font-bold italic">Le montant est récupéré automatiquement depuis le budget de la phase.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:bg-amber-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-5 h-5" /> {facture ? 'Mettre à jour' : 'Générer la facture'}</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
