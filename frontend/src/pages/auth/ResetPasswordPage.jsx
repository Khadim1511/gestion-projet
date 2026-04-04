import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FolderKanban, Lock, CheckCircle, ArrowRight, XCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Token manquant');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Les mots de passe ne correspondent pas');
    }
    if (password.length < 6) {
      return toast.error('Le mot de passe doit faire au moins 6 caractères');
    }

    setLoading(true);
    try {
      await axios.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      toast.success('Mot de passe mis à jour !');
    } catch (err) {
      toast.error(err.response?.data || 'Une erreur est survenue ou le token a expiré');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6">
              <FolderKanban className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Nouveau Password</h1>
            <p className="text-muted-foreground font-medium text-sm">
              {success 
                ? "Votre sécurité est mise à jour. Vous pouvez maintenant vous connecter." 
                : "Définissez un mot de passe robuste pour votre compte."}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Nouveau mot de passe</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Confirmer mot de passe</label>
                  <div className="relative group/input">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>Valider le mot de passe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  Mot de passe réinitialisé avec succès !
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
