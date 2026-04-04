import { useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FolderKanban, LogIn, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { login, password });
      const { token, ...userData } = res.data;
      loginUser(token, userData);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch {
      toast.error('Identifiant ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle light streak */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-orange-500/10 via-transparent to-transparent rotate-12 pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6"
            >
              <FolderKanban className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">SuiviProjet</h1>
            <p className="text-muted-foreground font-medium">Gestion de projets premium</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Identifiant</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-orange-400 text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                  placeholder="nom.utilisateur"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Mot de passe</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-orange-400 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-foreground placeholder-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Connexion <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center space-y-4">
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Mot de passe oublié ?
            </button>
            <p className="text-muted-foreground text-xs font-semibold">
              Besoin d'aide ? Contactez votre <span className="text-orange-500">Administrateur</span>
            </p>
          </div>
        </div>
        
        {/* Subtle footer */}
        <p className="text-center mt-8 text-muted-foreground text-sm font-medium opacity-50">
          &copy; 2026 Toubkal IT. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
