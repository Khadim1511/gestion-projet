import { useEffect, useState } from 'react';
import { getAllProfils, createProfil, updateProfil, deleteProfil } from '../../api/profilService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  Hash, 
  X,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProfilsPage() {
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ code: '', libelle: '' });
  const { hasRole } = useAuth();

  const fetchData = async () => {
    try {
      const res = await getAllProfils();
      setProfils(res.data);
    } catch {
      toast.error('Erreur de chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ code: '', libelle: '' }); setShowForm(true); };
  const openEdit   = (p)  => { setEditing(p); setForm({ code: p.code, libelle: p.libelle }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProfil(editing.id, form);
        toast.success('Profil mis à jour !');
      } else {
        await createProfil(form);
        toast.success('Profil créé !');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce profil ?')) return;
    try {
      await deleteProfil(id);
      toast.success('Profil supprimé');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredProfils = profils.filter(p => 
    `${p.libelle} ${p.code}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Shield className="w-4 h-4" />
            Sécurité & Rôles
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-foreground tracking-tight"
          >
            Profils Utilisateurs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            Définissez les niveaux d'accès de votre organisation.
          </motion.p>
        </div>

        {hasRole('ADMIN') && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all border border-orange-400/20"
          >
            <Plus className="w-5 h-5" />
            Nouveau Profil
          </motion.button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-[1.5rem] shadow-xl">
        <div className="flex flex-1 w-full lg:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par libellé ou code..." 
            className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : filteredProfils.length === 0 ? (
          <motion.div key="empty" className="py-32 flex flex-col items-center justify-center text-muted-foreground bg-card/20 border border-dashed border-border/50 rounded-[2.5rem]">
             <Shield className="w-12 h-12 mb-4 opacity-10" />
             <p className="font-bold">Aucun profil configuré</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProfils.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:border-orange-500/30 transition-all relative overflow-hidden shadow-lg"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Activity className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-orange-500 font-black shadow-inner group-hover:scale-105 transition-transform duration-500">
                     <ShieldCheck className="w-7 h-7" />
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20 tracking-widest">{p.code}</span>
                   </div>
                </div>

                <div className="space-y-1 relative z-10">
                   <h3 className="text-xl font-black text-foreground group-hover:text-orange-500 transition-colors tracking-tight truncate uppercase">{p.libelle}</h3>
                   <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      <Hash className="w-3 h-3" /> ID #{p.id}
                   </p>
                </div>

                <div className="pt-6 border-t border-border/50 flex items-center justify-between relative z-10 mt-auto">
                   <div className="flex items-center gap-2">
                      {hasRole('ADMIN') && (
                        <>
                          <button 
                            onClick={() => openEdit(p)}
                            className="bg-background/50 border border-border/50 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all scale-95 hover:scale-105"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="bg-background/50 border border-border/50 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all scale-95 hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                   </div>
                   <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 transition-colors duration-500">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowForm(false)}
               className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border/50 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-foreground">{editing ? 'Modifier Profil' : 'Nouveau Profil'}</h2>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Code Système</label>
                  <input 
                    required 
                    placeholder="Ex: ADMIN, CP, DIR..."
                    className="w-full bg-background border border-border/50 rounded-2xl py-4 px-5 text-sm text-foreground placeholder-muted-foreground font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all disabled:opacity-50"
                    value={form.code} 
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} 
                    disabled={!!editing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Libellé descriptif</label>
                  <input 
                    required 
                    placeholder="Ex: Administrateur"
                    className="w-full bg-background border border-border/50 rounded-2xl py-4 px-5 text-sm text-foreground placeholder-muted-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-sans"
                    value={form.libelle} 
                    onChange={(e) => setForm({ ...form, libelle: e.target.value })} 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl bg-muted/50 text-muted-foreground font-bold hover:text-foreground transition-colors">Annuler</button>
                  <button type="submit" className="flex-[2] py-4 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20">
                    {editing ? 'Enregistrer' : 'Créer le profil'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
