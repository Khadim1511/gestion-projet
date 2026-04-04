import { useEffect, useState } from 'react';
import { getTableauDeBord } from '../../api/reportingService';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Activity, 
  TrendingUp, 
  Coins, 
  Users, 
  Building2 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 group hover:border-border transition-all cursor-default"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className="w-4 h-4" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-3xl font-bold text-foreground tracking-tighter mb-1">{value}</span>
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTableauDeBord().then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      />
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-extrabold tracking-tight text-foreground"
        >
          Tableau de bord
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground font-medium"
        >
          Aperçu global des activités et performances de vos projets.
        </motion.p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projets" 
          value={stats?.countProjets || 0} 
          icon={FolderKanban} 
          color="bg-blue-500/10 text-blue-500 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
          delay={0.1}
        />
        <StatCard 
          title="Projets en cours" 
          value={stats?.countProjetsEnCours || 0} 
          icon={Activity} 
          color="bg-orange-500/10 text-orange-500 dark:text-orange-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          delay={0.2}
        />
        <StatCard 
          title="Montant Total" 
          value={`${((stats?.totalMontant || 0) / 1000).toFixed(0)}k`} 
          icon={Coins} 
          color="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          delay={0.3}
        />
        <StatCard 
          title="Organismes" 
          value={stats?.countOrganismes || 0} 
          icon={Building2} 
          color="bg-red-500/10 text-red-500 dark:text-red-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Secondary Stats */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 flex flex-col gap-6"
          >
            <h3 className="text-muted-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Répartition temporelle
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 group hover:translate-x-1 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground text-sm font-semibold">Projets Clôturés</span>
                </div>
                <span className="text-foreground font-bold text-lg">{stats?.countProjetsClotures || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 group hover:translate-x-1 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-muted-foreground text-sm font-semibold">Phases Total</span>
                </div>
                <span className="text-foreground font-bold text-lg">{stats?.countPhases || 0}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-border/50 group hover:translate-x-1 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground text-sm font-semibold">Employés Activés</span>
                </div>
                <span className="text-foreground font-bold text-lg">{stats?.countEmployes || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Progress Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-muted-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Performances globales
            </h3>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Détails API →</button>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full max-h-[200px]">
            <div className="flex justify-between items-end mb-4">
              <span className="text-6xl font-black text-foreground tracking-tighter">
                {stats?.totalMontant ? Math.round((stats.totalMontant / 2000000) * 100) : 0}%
              </span>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Objectif annuel</span>
                <span className="text-foreground text-lg font-bold">2.0M MAD</span>
              </div>
            </div>
            
            <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden border border-border/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.round((stats?.totalMontant || 0) / 2000000 * 100), 100)}%` }}
                transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-emerald-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
              />
            </div>
            
            <p className="mt-6 text-muted-foreground text-sm font-medium italic">
              "Le succès est le résultat de la préparation, du travail acharné et de l'apprentissage des échecs."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
