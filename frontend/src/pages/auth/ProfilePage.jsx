import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Shield, ShieldCheck, Fingerprint, Calendar, Building2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const profileStats = [
    { label: 'Identifiant', value: user.login, icon: User },
    { label: 'Rôle / Profil', value: user.profil, icon: ShieldCheck },
    { label: 'Nom', value: user.nom, icon: Building2 },
    { label: 'Prénom', value: user.prenom, icon: Building2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-[0.2em]"
        >
          <Fingerprint className="w-4 h-4" />
          Mon Compte
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold text-foreground tracking-tight"
        >
          Profil Utilisateur
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
          
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-orange-500/20 relative group z-10 transition-transform duration-500 hover:scale-105">
            {user.nom?.charAt(0)}
            <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">{user.prenom} {user.nom}</h2>
            <p className="text-orange-500 font-bold text-xs uppercase tracking-widest mt-1 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block">{user.profil}</p>
          </div>
          
          <div className="w-full pt-6 border-t border-border/50 relative z-10">
             <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium tracking-tight">Poste</span>
                <span className="text-foreground font-bold uppercase tracking-tighter">{user.profil}</span>
             </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3 relative z-10">
              <Shield className="w-5 h-5 text-orange-500" />
              Informations Personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {profileStats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <stat.icon className="w-3 h-3" />
                    {stat.label}
                  </span>
                  <p className="text-foreground font-bold bg-background/50 border border-border/50 px-4 py-3 rounded-2xl shadow-inner transition-colors">
                    {stat.value || 'Non renseigné'}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account Security Tip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
               <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-1">
               <h4 className="text-foreground font-bold text-sm">Sécurité du compte</h4>
               <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                 Vos données sont protégées par un jeton de sécurité crypté (JWT). Pour toute modification de vos informations, veuillez contacter l'administrateur.
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
