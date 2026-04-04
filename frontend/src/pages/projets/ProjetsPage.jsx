import { useEffect, useState } from 'react';
import { getAllProjets, deleteProjet, searchProjets, getProjetsEnCours, getProjetsClotures } from '../../api/projetService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  FolderKanban, 
  ChevronRight,
  TrendingUp,
  Calendar,
  Building2,
  Clock
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProjetsPage() {
  const [projets, setProjets] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('tous');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (filter === 'tous')     res = await getAllProjets();
      else if (filter === 'cours')   res = await getProjetsEnCours();
      else if (filter === 'clotures') res = await getProjetsClotures();
      setProjets(res.data);
    } catch {
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleSearch = async () => {
    if (!search.trim()) return fetchData();
    try {
      const res = await searchProjets(search);
      setProjets(res.data);
    } catch {
      toast.error('Erreur de recherche');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await deleteProjet(id);
      toast.success('Projet supprimé');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const canCreate = hasRole('SEC', 'ADMIN', 'DIR');
  const canDelete = hasRole('ADMIN', 'DIR');

  const getStatutBadge = (projet) => {
    const now = new Date();
    const fin = new Date(projet.dateFin);
    return fin >= now ? 'En cours' : 'Clôturé';
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-orange-400 font-bold text-xs uppercase tracking-[0.2em]"
          >
            <FolderKanban className="w-4 h-4" />
            Portefeuille
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-white tracking-tight"
          >
            Liste des Projets
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            Gérez vos {projets.length} projets actifs et clôturés.
          </motion.p>
        </div>

        {canCreate && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/projets/nouveau')}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all border border-orange-400/20"
          >
            <Plus className="w-5 h-5" />
            Nouveau projet
          </motion.button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-[1.5rem] shadow-xl">
        <div className="flex flex-1 w-full lg:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher un projet par nom..." 
            className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="flex items-center gap-1.5 bg-background/50 p-1.5 rounded-xl border border-border/50 w-full lg:w-auto">
          {[
            { id: 'tous', label: 'Tous', icon: FolderKanban },
            { id: 'cours', label: 'En cours', icon: TrendingUp },
            { id: 'clotures', label: 'Clôturés', icon: Clock },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                filter === btn.id 
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
            />
          </div>
        ) : projets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 bg-card/40 border border-border/50 rounded-3xl"
          >
            <FolderKanban className="w-12 h-12 opacity-20" />
            <p className="font-medium uppercase tracking-widest text-xs">Aucun projet trouvé</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projets.map((p, idx) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] hover:border-orange-500/30 transition-all duration-300 shadow-lg relative overflow-hidden flex flex-col"
              >
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="p-3 bg-orange-600/10 rounded-2xl border border-orange-500/20 shadow-inner">
                    <FolderKanban className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border",
                    getStatutBadge(p) === 'En cours' 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {getStatutBadge(p)}
                  </span>
                </div>

                <div className="relative z-10 space-y-1 mb-6 flex-1">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors line-clamp-1">{p.nom}</h2>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest bg-background/50 inline-block px-2 py-0.5 rounded-md border border-border/50">{p.code}</p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Client
                    </span>
                    <span className="text-sm font-bold text-foreground truncate">{p.organismeNom}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      Échéance
                    </span>
                    <span className="text-sm font-bold text-foreground">{p.dateFin}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between relative z-10 gap-2">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => navigate(`/projets/${p.id}`)}
                      className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
                      title="Détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canCreate && (
                      <button 
                        onClick={() => navigate(`/projets/${p.id}/modifier`)}
                        className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/projets/${p.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
                  >
                    Ouvrir
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
