import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjetById, createProjet, updateProjet } from '../../api/projetService';
import { getAllOrganismes } from '../../api/organismeService';
import { getAllEmployes } from '../../api/employeService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderKanban, 
  ArrowLeft, 
  Save, 
  Hash, 
  Type, 
  Building2, 
  User, 
  Calendar, 
  Coins, 
  FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProjetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organismes, setOrganismes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: '',
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    montant: '',
    organismeId: '',
    chefProjetId: ''
  });

  useEffect(() => {
    Promise.all([getAllOrganismes(), getAllEmployes()]).then(([orgRes, empRes]) => {
      setOrganismes(orgRes.data);
      setEmployes(empRes.data);
    });

    if (id) {
      getProjetById(id).then((res) => {
        const p = res.data;
        setForm({
          code: p.code,
          nom: p.nom,
          description: p.description || '',
          dateDebut: p.dateDebut,
          dateFin: p.dateFin,
          montant: p.montant,
          organismeId: p.organismeId,
          chefProjetId: p.chefProjetId || ''
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) await updateProjet(id, form);
      else await createProjet(form);
      toast.success(id ? 'Projet mis à jour !' : 'Projet créé !');
      navigate('/projets');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[1000px] mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/projets')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold group self-start"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Annuler et retourner
        </button>
        <div className="flex items-center gap-4 mt-2">
           <div className="w-14 h-14 bg-orange-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-orange-500/20">
              <FolderKanban className="w-7 h-7 text-white" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                {id ? 'Modifier le projet' : 'Initialiser un projet'}
              </h1>
              <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">Configurateur de mission premium</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-600/5 blur-[100px] pointer-events-none" />

          <div className="space-y-10">
            {/* Essential Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Identification du projet</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Référence Code</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="text"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder-muted-foreground disabled:opacity-50 shadow-inner"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      required
                      placeholder="PRJ-2026-X"
                      disabled={!!id}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Nom de la Mission</label>
                  <div className="relative group">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="text"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder-muted-foreground shadow-inner"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      required
                      placeholder="Nom complet du projet..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Entity Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Partenaires & Responsables</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Organisme Client</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                      <select
                        className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all appearance-none cursor-pointer shadow-inner"
                        value={form.organismeId}
                        onChange={(e) => setForm({ ...form, organismeId: e.target.value })}
                        required
                      >
                        <option value="" className="text-muted-foreground">Sélectionner un organisme</option>
                        {organismes.map((o) => (
                          <option key={o.id} value={o.id} className="bg-card">{o.nom} ({o.code})</option>
                        ))}
                      </select>
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Chef de Projet Assigné</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                      <select
                        className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all appearance-none cursor-pointer shadow-inner"
                        value={form.chefProjetId}
                        onChange={(e) => setForm({ ...form, chefProjetId: e.target.value })}
                      >
                        <option value="" className="text-muted-foreground">Assignation libre</option>
                        {employes.map((e) => (
                          <option key={e.id} value={e.id} className="bg-card">{e.nom} {e.prenom}</option>
                        ))}
                      </select>
                    </div>
                 </div>
              </div>
            </section>

            {/* Financial & Timing Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                 <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Finances & Calendrier</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Montant Global (MAD)</label>
                  <div className="relative group">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 transition-colors group-focus-within:text-emerald-500" />
                    <input
                      type="number"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder-muted-foreground shadow-inner"
                      value={form.montant}
                      onChange={(e) => setForm({ ...form, montant: e.target.value })}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Lancement (Début)</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="date"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all cursor-pointer shadow-inner [color-scheme:light_dark]"
                      value={form.dateDebut}
                      onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Échéance Finale (Fin)</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                    <input
                      type="date"
                      className="w-full bg-background border border-border/50 rounded-2xl py-4 pl-12 pr-6 text-sm text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all cursor-pointer shadow-inner [color-scheme:light_dark]"
                      value={form.dateFin}
                      onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="space-y-2.5 h-full">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Notes & Description de mission</label>
              <div className="relative group h-full">
                <FileText className="absolute left-4 top-5 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
                <textarea
                  className="w-full bg-background border border-border/50 rounded-[1.5rem] py-4 pl-12 pr-6 text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all placeholder-muted-foreground min-h-[120px] resize-none shadow-inner"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Détails du périmètre, objectifs spécifiques, etc..."
                />
              </div>
            </section>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Dernière vérification</span>
            <span className="text-muted-foreground text-xs font-bold italic">Assurez-vous que toutes les données sont certifiées.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => navigate('/projets')}
              className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-background text-muted-foreground font-bold hover:text-foreground transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {id ? 'Mettre à jour' : 'Confirmer le projet'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
