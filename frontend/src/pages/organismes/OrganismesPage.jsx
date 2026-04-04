import { useEffect, useState } from 'react';
import { getAllOrganismes, createOrganisme, updateOrganisme, deleteOrganisme } from '../../api/organismeService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Mail, 
  User, 
  X, 
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function OrganismesPage() {
  const [organismes, setOrganismes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ 
    code: '', 
    nom: '', 
    nomContact: '', 
    emailContact: '', 
    siteWeb: '' 
  });
  const { hasRole } = useAuth();

  const fetchData = async () => {
    try {
      const res = await getAllOrganismes();
      setOrganismes(res.data);
    } catch {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ code: '', nom: '', nomContact: '', emailContact: '', siteWeb: '' }); setShowForm(true); };
  const openEdit   = (org) => { setEditing(org); setForm({ ...org }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateOrganisme(editing.id, form);
        toast.success('Organisme mis à jour !');
      } else {
        await createOrganisme(form);
        toast.success('Organisme créé !');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet organisme ?')) return;
    try {
      await deleteOrganisme(id);
      toast.success('Organisme supprimé');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredOrganismes = organismes.filter(o => 
    `${o.nom} ${o.code} ${o.nomContact}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-[0.2em]"
          >
            <Building2 className="w-4 h-4" />
            Partenaires
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-foreground tracking-tight"
          >
            Gestion des Organismes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            Répertoire des {filteredOrganismes.length} organismes enregistrés.
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
            Nouvel Organisme
          </motion.button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-[1.5rem] shadow-xl">
        <div className="flex flex-1 w-full lg:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou code..." 
            className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Modals Container */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-colors duration-500" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 flex opacity-20" />

              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-foreground">{editing ? 'Modifier Organisme' : 'Nouveau Partenaire'}</h2>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Code Identifiant</label>
                    <input 
                      required 
                      disabled={!!editing}
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 px-4 text-sm text-foreground placeholder-muted-foreground font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all disabled:opacity-50"
                      value={form.code} 
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Dénomination</label>
                    <input 
                      required 
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                      value={form.nom} 
                      onChange={(e) => setForm({ ...form, nom: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Responsable Contact</label>
                  <input 
                    className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                    value={form.nomContact} 
                    onChange={(e) => setForm({ ...form, nomContact: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Email professionnel</label>
                    <input 
                      type="email"
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                      value={form.emailContact} 
                      onChange={(e) => setForm({ ...form, emailContact: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Site Web</label>
                    <input 
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
                      value={form.siteWeb} 
                      onChange={(e) => setForm({ ...form, siteWeb: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-4 rounded-2xl bg-muted/50 text-muted-foreground font-bold transition-colors hover:text-foreground">Annuler</button>
                  <button type="submit" className="flex-[2] px-6 py-4 rounded-2xl bg-orange-600 text-white font-black transition-all hover:bg-orange-500 shadow-xl shadow-orange-500/20">
                    {editing ? 'Mettre à jour' : 'Confirmer le partenaire'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid Section */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : filteredOrganismes.length === 0 ? (
          <motion.div key="empty" className="py-32 flex flex-col items-center justify-center text-muted-foreground bg-card/20 border border-dashed border-border/50 rounded-[2.5rem]">
             <Building2 className="w-12 h-12 mb-4 opacity-10" />
             <p className="font-bold">Aucun organisme répertorié</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganismes.map((o, idx) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:border-orange-500/30 transition-all relative overflow-hidden shadow-lg"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <Building2 className="w-32 h-32" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-background border border-border/50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                     🏢
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20 tracking-[0.2em]">{o.code}</span>
                   </div>
                </div>

                <div className="space-y-1 relative z-10">
                   <h3 className="text-xl font-black text-foreground group-hover:text-orange-500 transition-colors uppercase truncate">{o.nom}</h3>
                   <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                      <User className="w-3.5 h-3.5" />
                      {o.nomContact || 'Anonyme'}
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50 relative z-10">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                      <span className="text-foreground text-xs font-bold truncate max-w-[150px]">{o.emailContact || '—'}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> Digital
                      </span>
                      {o.siteWeb ? (
                        <a href={o.siteWeb} target="_blank" rel="noreferrer" className="text-orange-500 hover:text-orange-400 text-xs font-bold flex items-center gap-1 transition-colors">
                           Vérifier <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span className="text-muted-foreground text-xs font-bold">Inexistant</span>}
                   </div>
                </div>

                <div className="pt-4 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-2">
                      {hasRole('ADMIN') && (
                        <>
                          <button 
                            onClick={() => openEdit(o)}
                            className="bg-background/50 border border-border/50 w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all scale-95 hover:scale-105"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(o.id)}
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
    </div>
  );
}
