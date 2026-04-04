import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeById, createEmploye, updateEmploye } from '../../api/employeService';
import { getAllProfils } from '../../api/profilService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ArrowLeft, 
  Save, 
  Hash, 
  User, 
  UserCircle, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EmployeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    login: '',
    email: '',
    telephone: '',
    password: '',
    profilId: ''
  });

  useEffect(() => {
    getAllProfils().then((res) => setProfils(res.data));

    if (id) {
      getEmployeById(id).then((res) => {
        const e = res.data;
        setForm({
          matricule: e.matricule,
          nom: e.nom,
          prenom: e.prenom,
          login: e.login,
          email: e.email || '',
          telephone: e.telephone || '',
          password: '', // On ne récupère pas le password
          profilId: e.profilId
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await updateEmploye(id, form);
      else await createEmploye(form);
      toast.success(id ? 'Collaborateur mis à jour !' : 'Nouveau collaborateur créé !');
      navigate('/employes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[900px] mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/employes')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-bold group self-start"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'annuaire
        </button>
        <div className="flex items-center gap-4 mt-2">
           <div className="w-14 h-14 bg-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-orange-500/20">
              <UserCircle className="w-7 h-7 text-white" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tight uppercase tracking-tighter">
                {id ? 'Profil Collaborateur' : 'Enrôlement Employé'}
              </h1>
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                <Fingerprint className="w-3 h-3 text-orange-400" /> Gestion des identités système
              </p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/5 blur-[80px] pointer-events-none" />

          <div className="space-y-12 relative z-10">
            {/* Identity Group */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6 text-zinc-500 font-black text-xs uppercase tracking-[0.2em] px-2">
                 <User className="w-4 h-4 text-orange-500" /> État Civil & Matricule
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Matricule Unique</label>
                    <div className="relative group">
                       <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400" />
                       <input
                        type="text"
                        required
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-12 shadow-inner text-sm text-white font-black tracking-widest uppercase focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all"
                        value={form.matricule}
                        onChange={(e) => setForm({ ...form, matricule: e.target.value.toUpperCase() })}
                        placeholder="M-000"
                        disabled={!!id}
                       />
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Nom de famille</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 px-6 shadow-inner text-sm text-white font-bold tracking-tight focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all placeholder:text-zinc-800"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      placeholder="Nom"
                    />
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Prénom</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 px-6 shadow-inner text-sm text-white font-bold tracking-tight focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 outline-none transition-all placeholder:text-zinc-800"
                      value={form.prenom}
                      onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                      placeholder="Prénom"
                    />
                 </div>
              </div>
            </section>

            {/* Access & Security Group */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6 text-zinc-500 font-black text-xs uppercase tracking-[0.2em] px-2">
                 <ShieldCheck className="w-4 h-4 text-orange-500" /> Paramètres d'Accès & Sécurité
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Login Système</label>
                    <div className="relative group">
                       <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400" />
                       <input
                        type="text"
                        required
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 shadow-inner text-sm text-orange-400 font-black tracking-widest focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                        value={form.login}
                        onChange={(e) => setForm({ ...form, login: e.target.value.toLowerCase() })}
                        placeholder="login"
                       />
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Mot de passe {!id && <span className="text-red-500">*</span>}</label>
                    <div className="relative group">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400" />
                       <input
                        type="password"
                        required={!id}
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 shadow-inner text-sm text-white font-black tracking-widest focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-zinc-800"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                       />
                    </div>
                    {id && <p className="text-[9px] font-bold text-zinc-600 ml-2 uppercase italic">Laisser vide pour ne pas modifier.</p>}
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Droits & Profil</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400 pointer-events-none" />
                      <select
                        required
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 shadow-inner text-sm text-white font-bold tracking-tight focus:ring-2 focus:ring-orange-500/20 outline-none transition-all appearance-none cursor-pointer"
                        value={form.profilId}
                        onChange={(e) => setForm({ ...form, profilId: e.target.value })}
                      >
                        <option value="">Sélectionner un profil</option>
                        {profils.map((p) => (
                          <option key={p.id} value={p.id}>{p.libelle} ({p.code})</option>
                        ))}
                      </select>
                    </div>
                 </div>
              </div>
            </section>

            {/* Contact Information Group */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6 text-zinc-500 font-black text-xs uppercase tracking-[0.2em] px-2">
                 <Mail className="w-4 h-4 text-orange-500" /> Coordonnées Professionnelles
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Email Pro</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400" />
                       <input
                        type="email"
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 shadow-inner text-sm text-zinc-200 font-medium tracking-tight focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-zinc-800"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="exemple@toubkalit.ma"
                       />
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest pl-2">Mobile</label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 transition-colors group-focus-within:text-orange-400" />
                       <input
                        type="text"
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 shadow-inner text-sm text-zinc-200 font-medium tracking-tight focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-zinc-800"
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        placeholder="+212 6..."
                       />
                    </div>
                 </div>
              </div>
            </section>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
        >
           <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase text-orange-400 tracking-[0.2em] mb-1">Confirmation d'enrôlement</span>
              <span className="text-zinc-500 text-xs font-bold leading-relaxed">Le collaborateur aura un accès système immédiat après validation.</span>
           </div>

           <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={() => navigate('/employes')}
                className="flex-1 sm:flex-none px-10 py-4 font-bold text-zinc-600 hover:text-zinc-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 sm:flex-none px-12 py-4 rounded-2xl bg-white text-zinc-950 font-black hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {id ? 'Mettre à jour' : 'Confirmer Enrôlement'}
                  </>
                )}
              </button>
           </div>
        </motion.div>
      </form>
    </div>
  );
}
