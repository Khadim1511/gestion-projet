import { useEffect, useState } from 'react';
import { getAllEmployes, deleteEmploye } from '../../api/employeService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Mail, 
  ShieldCheck, 
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import EmployeAffectationsModal from '../../components/modals/EmployeAffectationsModal';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EmployesPage() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEmployeForAffectation, setSelectedEmployeForAffectation] = useState(null);
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployes();
      setEmployes(res.data);
    } catch {
      toast.error('Erreur de chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet employé ?')) return;
    try {
      await deleteEmploye(id);
      toast.success('Employé supprimé');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredEmployes = employes.filter(e => 
    `${e.nom} ${e.prenom} ${e.matricule} ${e.login}`.toLowerCase().includes(search.toLowerCase())
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
            <Users className="w-4 h-4" />
            Ressources Humaines
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-foreground tracking-tight"
          >
            Annuaire des Employés
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            Gérez les {employes.length} collaborateurs de l'organisation.
          </motion.p>
        </div>

        {hasRole('ADMIN') && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/employes/nouveau')}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all border border-orange-400/20"
          >
            <Plus className="w-5 h-5" />
            Nouvel employé
          </motion.button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-xl border border-border/50 p-3 rounded-[1.5rem] shadow-xl">
        <div className="flex flex-1 w-full lg:w-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule, login..." 
            className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 pl-11 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
        ) : filteredEmployes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 bg-card/40 border border-border/50 rounded-3xl"
          >
            <Users className="w-12 h-12 opacity-20" />
            <p className="font-medium uppercase tracking-widest text-xs">Aucun employé trouvé</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEmployes.map((e, idx) => (
              <motion.div
                layout
                key={e.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] hover:border-orange-500/30 transition-all duration-300 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20">
                    {e.nom?.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Matricule</span>
                    <span className="px-3 py-1 bg-background/50 border border-border/50 rounded-lg text-xs font-bold text-foreground">
                       {e.matricule}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 relative z-10 font-sans">
                  <div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors uppercase truncate">
                      {e.prenom} {e.nom}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{e.profilCode || e.profil}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <div className="flex items-center gap-3 text-sm text-foreground font-medium p-2 rounded-xl bg-background/30 border border-border/50">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="truncate">{e.email || 'Pas d\'email'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Login</span>
                    <span className="text-sm font-bold text-foreground">{e.login}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasRole('ADMIN') && (
                      <>
                        <button 
                          onClick={() => navigate(`/employes/${e.id}/modifier`)}
                          className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all shadow-sm"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(e.id)}
                          className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all shadow-sm"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedEmployeForAffectation(e)}
                      className="p-2.5 rounded-xl bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                      title="Affectations Projets"
                    >
                      <Briefcase className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/employes/${e.id}/modifier`)}
                      className="p-2.5 rounded-xl bg-background/50 border border-border/50 text-muted-foreground hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmployeForAffectation && (
          <EmployeAffectationsModal 
            employe={selectedEmployeForAffectation} 
            onClose={() => setSelectedEmployeForAffectation(null)}
            onUpdate={fetchData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
