import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Hash, Type, FileCheck, Link, Save } from 'lucide-react';
import { createLivrable, updateLivrable } from '../../api/livrableService';
import toast from 'react-hot-toast';

export default function LivrableModal({ phase, livrable, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    libelle: '',
    description: '',
    chemin: ''
  });

  useEffect(() => {
    if (livrable) {
      setForm({
        code: livrable.code,
        libelle: livrable.libelle,
        description: livrable.description || '',
        chemin: livrable.chemin || ''
      });
    }
  }, [livrable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (livrable) {
        await updateLivrable(livrable.id, form);
        toast.success('Livrable mis à jour');
      } else {
        await createLivrable(phase.id, form);
        toast.success('Livrable ajouté');
      }
      onUpdate();
      onClose();
    } catch (err) {
      toast.error('Erreur lors de l’enregistrement');
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
          <FileCheck className="w-32 h-32" />
        </div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                {livrable ? 'Modifier Livrable' : 'Nouveau Livrable'}
              </h2>
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">
                Phase: {phase.libelle}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card/50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Réf Livrable</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="DEL-01"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Nom du livrable</label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Ex: Cahier de spécifications"
                  value={form.libelle}
                  onChange={(e) => setForm({ ...form, libelle: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Lien du livrable</label>
              <div className="relative group">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner italic"
                  placeholder="https://drive.com/share/..."
                  value={form.chemin}
                  onChange={(e) => setForm({ ...form, chemin: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Détails techniques</label>
              <textarea
                className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-none"
                placeholder="Description du contenu du livrable..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-5 h-5" /> {livrable ? 'Éditer Livrable' : 'Ajouter le Livrable'}</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
