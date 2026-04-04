import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Hash, Type, FileText, Link, Save } from 'lucide-react';
import { createDocument, updateDocument } from '../../api/documentService';
import toast from 'react-hot-toast';

export default function DocumentModal({ projet, document, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    libelle: '',
    description: '',
    chemin: ''
  });

  useEffect(() => {
    if (document) {
      setForm({
        code: document.code,
        libelle: document.libelle,
        description: document.description || '',
        chemin: document.chemin || ''
      });
    }
  }, [document]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (document) {
        await updateDocument(document.id, form);
        toast.success('Document mis à jour');
      } else {
        await createDocument(projet.id, form);
        toast.success('Document ajouté');
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
          <FileText className="w-32 h-32" />
        </div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
              {document ? 'Modifier Document' : 'Nouveau Document'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card/50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Référence / Code</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="DOC-001"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Nom du document</label>
              <div className="relative group">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Ex: Contrat de services"
                  value={form.libelle}
                  onChange={(e) => setForm({ ...form, libelle: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Chemin / URL du fichier</label>
              <div className="relative group">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-400 transition-colors" />
                <input
                  type="text"
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner italic"
                  placeholder="https://storage.com/contrat.pdf"
                  value={form.chemin}
                  onChange={(e) => setForm({ ...form, chemin: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Description</label>
              <textarea
                className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[100px] resize-none"
                placeholder="Détails du document..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 hover:bg-orange-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save className="w-5 h-5" /> {document ? 'Mettre à jour' : 'Enregistrer'}</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
