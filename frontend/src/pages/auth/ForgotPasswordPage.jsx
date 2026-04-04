import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FolderKanban, Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Si cet email existe, un lien a été envoyé');
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]" />
      
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
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">Mot de passe oublié</h1>
            <p className="text-muted-foreground font-medium text-sm">
              {sent 
                ? "Consultez votre boîte mail pour réinitialiser votre accès." 
                : "Entrez votre email pour recevoir un lien de récupération."}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Email professionnel</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-orange-400 transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full bg-background/50 border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                  <>Envoyer le lien <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
             <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  L'email de récupération a été envoyé avec succès. N'oubliez pas de vérifier vos spams.
                </p>
             </div>
          )}

          <button 
            onClick={() => navigate('/login')}
            className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </button>
        </div>
      </motion.div>
    </div>
  );
}
