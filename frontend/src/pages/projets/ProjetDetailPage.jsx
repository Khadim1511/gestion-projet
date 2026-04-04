import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjetById } from '../../api/projetService';
import { getPhasesByProjet, deletePhase, updateRealisation, updateFacturation, updatePaiement } from '../../api/phaseService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit3, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Wallet, 
  Calendar, 
  User, 
  Building2, 
  TrendingUp, 
  Clock, 
  Activity,
  Layers,
  ChevronRight,
  FolderKanban,
  Users,
  Link,
  Download
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import api from '../../api/axios';
import AffectationModal from '../../components/modals/AffectationModal';
import DocumentModal from '../../components/modals/DocumentModal';
import LivrableModal from '../../components/modals/LivrableModal';
import FactureModal from '../../components/modals/FactureModal';
import { getAffectationsByPhase } from '../../api/affectationService';
import { getDocumentsByProjet, deleteDocument } from '../../api/documentService';
import { getAllFactures, deleteFacture } from '../../api/factureService';
import { getLivrablesByPhase, deleteLivrable } from '../../api/livrableService';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function PhaseStatusToggle({ phase, onRefresh }) {
  const { hasRole } = useAuth();

  const toggle = async (type, current) => {
    try {
      if (type === 'realisation') await updateRealisation(phase.id, !current);
      else if (type === 'facturation') await updateFacturation(phase.id, !current);
      else if (type === 'paiement') await updatePaiement(phase.id, !current);
      toast.success('Statut mis à jour');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const StatusButton = ({ active, icon: Icon, label, color, type }) => (
    <button
      onClick={() => toggle(type, active)}
      disabled={!hasRole('ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET', 'COMPTA')}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
        active 
          ? `${color} border-current shadow-lg shadow-current/10` 
          : "bg-background/50 text-muted-foreground border-border/50 saturate-[0.1] hover:saturate-100 hover:text-foreground"
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <StatusButton 
        active={phase.etatRealisation} 
        icon={CheckCircle2} 
        label={phase.etatRealisation ? "Réalisée" : "Non réalisée"} 
        color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
        type="realisation" 
      />
      <StatusButton 
        active={phase.etatFacturation} 
        icon={FileText} 
        label={phase.etatFacturation ? "Facturée" : "Non facturée"} 
        color="bg-amber-500/10 text-amber-600 dark:text-amber-400" 
        type="facturation" 
      />
      <StatusButton 
        active={phase.etatPaiement} 
        icon={Wallet} 
        label={phase.etatPaiement ? "Payée" : "Non payée"} 
        color="bg-orange-500/10 text-orange-600 dark:text-orange-400" 
        type="paiement" 
      />
    </div>
  );
}

function PhaseAssignees({ phaseId, onRefresh }) {
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAffectationsByPhase(phaseId);
        setAssignees(res.data);
      } catch {
        // Silently fail or log
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [phaseId, onRefresh]);

  if (loading) return <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin opacity-30" />;
  if (assignees.length === 0) return <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Aucun assigné</span>;

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {assignees.slice(0, 5).map((aff, i) => (
        <div 
          key={i}
          title={aff.employeNom}
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[9px] shadow-sm uppercase ring-2 ring-background"
        >
          {aff.employeNom.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
      ))}
      {assignees.length > 5 && (
        <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-card/60 border border-border/50 text-muted-foreground font-bold text-[9px] shadow-sm ring-2 ring-background">
          +{assignees.length - 5}
        </div>
      )}
    </div>
  );
}

export default function ProjetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [projet, setProjet] = useState(null);
  const [phases, setPhases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [allFactures, setAllFactures] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('phases'); // phases, livrables, factures, documents
  
  // Modals state
  const [selectedPhaseForAffectation, setSelectedPhaseForAffectation] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedLivrable, setSelectedLivrable] = useState(null);
  const [selectedPhaseForLivrable, setSelectedPhaseForLivrable] = useState(null);
  const [showLivrableModal, setShowLivrableModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedPhaseForFacture, setSelectedPhaseForFacture] = useState(null);
  const [showFactureModal, setShowFactureModal] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAll = async () => {
    try {
      const [pRes, phRes, docRes, facRes] = await Promise.all([
        getProjetById(id), 
        getPhasesByProjet(id),
        getDocumentsByProjet(id),
        getAllFactures()
      ]);
      
      setProjet(pRes.data);
      setPhases(phRes.data);
      setDocuments(docRes.data);
      const projectPhaseIds = phRes.data.map(ph => ph.id);
      setAllFactures(facRes.data.filter(f => projectPhaseIds.includes(f.phaseId)));
      
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
      navigate('/projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleDeletePhase = async (phaseId) => {
    if (!confirm('Supprimer cette phase ?')) return;
    try {
      await deletePhase(phaseId);
      toast.success('Phase supprimée');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      await deleteDocument(docId);
      toast.success('Document supprimé');
      fetchAll();
    } catch (err) { toast.error('Erreur'); }
  };

  const handleDeleteFacture = async (facId) => {
    if (!confirm('Supprimer cette facture ?')) return;
    try {
      await deleteFacture(facId);
      toast.success('Facture supprimée');
      fetchAll();
    } catch (err) { toast.error('Erreur'); }
  };

  const handleDeleteLivrable = async (livId) => {
    if (!confirm('Supprimer ce livrable ?')) return;
    try {
      await deleteLivrable(livId);
      toast.success('Livrable supprimé');
      fetchAll();
    } catch (err) { toast.error('Erreur'); }
  };

  const handleDownload = async (path) => {
    if (!path) return toast.error("Le fichier n'est pas encore disponible");
    try {
      const response = await api.get(`/files/download`, {
        params: { path },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Erreur lors du téléchargement");
    }
  };


  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-500/20" />
    </div>
  );

  const montantPhases = phases.reduce((s, p) => s + (p.montant || 0), 0);
  const progress = projet.montant > 0 ? Math.round((montantPhases / projet.montant) * 100) : 0;

  return (
    <div className="space-y-10 pb-16 max-w-[1400px] mx-auto">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/projets')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold group mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux projets
          </button>
          <div className="flex items-center gap-3">
             <div className="bg-orange-600 shadow-xl shadow-orange-500/20 rounded-2xl p-3">
                <FolderKanban className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight uppercase truncate max-w-[600px]">{projet.nom}</h1>
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">
                  <span className="bg-card border border-border/50 px-2 py-0.5 rounded-md text-orange-500 font-black">#{projet.code}</span>
                  <span className="mx-1">•</span>
                  <Building2 className="w-3.5 h-3.5" /> {projet.organismeNom}
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          {hasRole('SEC', 'SECRETAIRE', 'ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET') && (
            <button 
              onClick={() => navigate(`/projets/${id}/modifier`)}
              className="bg-card/60 backdrop-blur border border-border/50 text-foreground px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-card transition-all shadow-xl"
            >
              <Edit3 className="w-5 h-5 text-orange-500" />
              Modifier le projet
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tabs Navigation */}
          <div className="flex items-center gap-1 bg-card/40 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 w-fit overflow-x-auto max-w-full">
            {[
              { id: 'phases', label: 'Phases', icon: Layers },
              { id: 'livrables', label: 'Livrables', icon: CheckCircle2 },
              { id: 'factures', label: 'Factures', icon: Wallet },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === 'phases' && (
                <motion.div 
                  key="phases"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Activity className="w-32 h-32" />
                    </div>
                    <h3 className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Informations Générales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-background border border-border/50 rounded-2xl shadow-sm">
                            <User className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1">Chef de Projet</span>
                            <span className="text-foreground font-bold">{projet.chefProjetNom || 'Non assigné'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-background border border-border/50 rounded-2xl shadow-sm">
                            <Calendar className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1">Période du Projet</span>
                            <span className="text-foreground font-bold">{projet.dateDebut} <span className="text-muted-foreground mx-2">→</span> {projet.dateFin}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-background border border-border/50 rounded-2xl shadow-sm">
                            <Wallet className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1">Budget Total</span>
                            <span className="text-2xl font-black text-foreground">{projet.montant?.toLocaleString('fr-MA')} <small className="text-muted-foreground text-xs">MAD</small></span>
                          </div>
                        </div>
                      </div>
                      {projet.description && (
                        <div className="col-span-1 md:col-span-2 pt-6 border-t border-border/50">
                          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter block mb-3">Description</span>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium bg-background/30 p-4 rounded-2xl border border-border/50 italic shadow-inner">
                            {projet.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-3">
                        <Layers className="w-6 h-6 text-orange-500" />
                        Phases du projet
                        <span className="text-muted-foreground font-black text-sm bg-card border border-border/50 px-2.5 py-0.5 rounded-full ml-1">
                          {phases.length}
                        </span>
                      </h2>
                      {hasRole('SEC', 'SECRETAIRE', 'ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET') && (
                        <button 
                          onClick={() => navigate(`/projets/${id}/phases/nouvelle`)}
                          className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 hover:opacity-80 transition-opacity flex items-center gap-2 group"
                        >
                          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                          Ajouter une phase
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {phases.length === 0 ? (
                        <div className="bg-card/40 border border-dashed border-border/50 rounded-[2rem] py-16 flex flex-col items-center justify-center text-muted-foreground">
                          <Layers className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-bold text-sm text-center">Aucune phase définie pour ce projet</p>
                        </div>
                      ) : (
                        phases.map((ph, idx) => (
                          <motion.div
                            key={ph.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 hover:border-orange-500/30 shadow-md transition-all"
                          >
                            <div className="flex flex-col gap-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center text-muted-foreground font-black text-[10px] group-hover:text-orange-500 transition-colors border border-border/50 uppercase shadow-inner">
                                    {ph.code}
                                  </div>
                                  <div>
                                      <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">{ph.libelle}</h4>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest">
                                          <Calendar className="w-3 h-3" /> {ph.dateDebut} → {ph.dateFin}
                                        </span>
                                        <span className="text-border">|</span>
                                        <span className="text-[10px] font-black text-orange-500 flex items-center gap-1 uppercase tracking-widest">
                                          <Wallet className="w-3 h-3" /> {ph.montant?.toLocaleString('fr-MA')} MAD
                                        </span>
                                      </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-center">
                                  {hasRole('SEC', 'SECRETAIRE', 'ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET') && (
                                    <button 
                                      onClick={() => setSelectedPhaseForAffectation(ph)}
                                      className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-md"
                                      title="Gérer les affectations"
                                    >
                                      <Users className="w-5 h-5" />
                                    </button>
                                  )}
                                  {hasRole('SEC', 'SECRETAIRE', 'ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET') && (
                                    <button 
                                      onClick={() => {
                                         // Trigger Facture Modal if phase is completed but not billed
                                         setSelectedPhaseForFacture(ph);
                                         setSelectedFacture(ph.facture);
                                         setShowFactureModal(true);
                                      }}
                                      className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-md"
                                      title="Gérer la facture"
                                    >
                                      <Wallet className="w-5 h-5" />
                                    </button>
                                  )}
                                  <button onClick={() => { setSelectedPhaseForLivrable(ph); setSelectedLivrable(null); setShowLivrableModal(true); }} className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-md" title="Ajouter Livrable"><Plus className="w-5 h-5" /></button>
                                  {hasRole('SEC', 'SECRETAIRE', 'ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR', 'CP', 'CHEF_PROJET') && (
                                    <button onClick={() => navigate(`/phases/${ph.id}/modifier`)} className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all shadow-sm" title="Modifier"><Edit3 className="w-4 h-4" /></button>
                                  )}
                                  {hasRole('ADMIN', 'ADMINISTRATEUR', 'DIR', 'DIRECTEUR') && (
                                    <button onClick={() => handleDeletePhase(ph.id)} className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all shadow-sm" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                                  )}
                                </div>
                              </div>
                              <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <PhaseStatusToggle phase={ph} onRefresh={fetchAll} />
                                    <div className="h-6 w-px bg-border/50 hidden md:block" />
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mr-2">Assignés:</span>
                                      <PhaseAssignees phaseId={ph.id} onRefresh={refreshTrigger} />
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                                    <ChevronRight className="w-5 h-5 text-border" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'livrables' && (
                <motion.div key="livrables" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        Livrables techniques
                      </h2>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      {phases.flatMap(ph => (ph.livrables || []).map(liv => ({ ...liv, phaseLibelle: ph.libelle, phaseId: ph.id }))).length === 0 ? (
                        <div className="bg-card/40 border border-dashed border-border/50 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-muted-foreground">
                          <CheckCircle2 className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-bold text-sm">Aucun livrable déposé</p>
                        </div>
                      ) : (
                        phases.map(ph => (ph.livrables || []).map(liv => (
                          <div key={liv.id} className="bg-card/40 border border-border/50 rounded-[2rem] p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                                 <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <div>
                                  <h4 className="font-bold text-foreground">{liv.libelle}</h4>
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phase : {ph.libelle}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {liv.chemin && (
                                 <a href={liv.chemin} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-emerald-500 transition-colors"><ChevronRight className="w-5 h-5" /></a>
                               )}
                               <button onClick={() => { setSelectedLivrable(liv); setSelectedPhaseForLivrable(ph); setShowLivrableModal(true); }} className="p-2 text-muted-foreground hover:text-amber-500"><Edit3 className="w-4 h-4" /></button>
                               <button onClick={() => handleDeleteLivrable(liv.id)} className="p-2 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        )))
                      )}
                   </div>
                </motion.div>
              )}

              {activeTab === 'factures' && (
                <motion.div key="factures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-amber-500" />
                        Suivi de Facturation
                      </h2>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      {allFactures.length === 0 ? (
                        <div className="bg-card/40 border border-dashed border-border/50 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-muted-foreground">
                          <Wallet className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-bold text-sm">Aucune facture générée</p>
                        </div>
                      ) : (
                        allFactures.map(fac => (
                          <div key={fac.id} className="bg-card/40 border border-border/50 rounded-[2rem] p-6 flex items-center justify-between group hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xs">
                                 {fac.code.substring(0, 3)}
                               </div>
                               <div>
                                  <h4 className="font-bold text-foreground">Facture #{fac.code}</h4>
                                  <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                                     <span>{fac.dateFacture}</span>
                                     <span>•</span>
                                     <span>Phase: {fac.phaseLibelle}</span>
                                     <span>•</span>
                                     <span className="text-amber-600">{fac.montant?.toLocaleString('fr-MA')} MAD</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {fac.chemin && (
                                 <button onClick={() => handleDownload(fac.chemin)} className="p-2 text-muted-foreground hover:text-orange-500" title="Télécharger PDF">
                                   <Download className="w-4 h-4" />
                                 </button>
                               )}
                               <button onClick={() => { setSelectedFacture(fac); setSelectedPhaseForFacture({id: fac.phaseId, libelle: fac.phaseLibelle, montant: fac.montant}); setShowFactureModal(true); }} className="p-2 text-muted-foreground hover:text-amber-500"><Edit3 className="w-4 h-4" /></button>
                               <button onClick={() => handleDeleteFacture(fac.id)} className="p-2 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))
                      )}
                   </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                      <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-3">
                        <FileText className="w-6 h-6 text-orange-500" />
                        Documents Projet
                      </h2>
                      <button onClick={() => { setSelectedDoc(null); setShowDocModal(true); }} className="text-xs font-black uppercase text-orange-500 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Ajouter Document
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.length === 0 ? (
                        <div className="col-span-full bg-card/40 border border-dashed border-border/50 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="w-12 h-12 mb-4 opacity-10" />
                          <p className="font-bold text-sm">Aucun document joint</p>
                        </div>
                      ) : (
                        documents.map(doc => (
                          <div key={doc.id} className="bg-card/40 border border-border/50 rounded-[2rem] p-6 flex flex-col gap-4 group hover:border-orange-500/30 transition-all">
                            <div className="flex items-center justify-between">
                               <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-orange-500 border border-border/50 shadow-inner font-black text-[10px]">
                                 {doc.code}
                               </div>
                               <div className="flex items-center gap-1">
                                  <button onClick={() => { setSelectedDoc(doc); setShowDocModal(true); }} className="p-2 text-muted-foreground hover:text-amber-500"><Edit3 className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </div>
                            <div>
                               <h4 className="font-bold text-foreground truncate">{doc.libelle}</h4>
                               <p className="text-xs text-muted-foreground line-clamp-2 mt-1 h-8">{doc.description || 'Pas de description'}</p>
                            </div>
                            {doc.chemin && (
                              <a href={doc.chemin} target="_blank" rel="noreferrer" className="mt-2 text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                <Link className="w-3 h-3" /> Voir la ressource
                              </a>
                            )}
                          </div>
                        ))
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Allocation & Summary */}
        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2 }}
             className="bg-orange-600 dark:bg-orange-900/40 backdrop-blur-xl border border-orange-500 rounded-[2.5rem] p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.2)]"
           >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-white" />
                Allocation Budgétaire
              </h3>
              <div className="space-y-6">
                <div className="text-center py-6">
                  <span className="text-7xl font-black text-white tracking-tighter block mb-2">{progress}%</span>
                  <span className="text-[10px] font-black uppercase text-orange-100 tracking-[0.3em]">Consommation</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold px-1">
                       <span className="text-orange-100 uppercase tracking-widest">Phases allouées</span>
                       <span className="text-white">{montantPhases.toLocaleString('fr-MA')} MAD</span>
                    </div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1.5, type: 'spring' }}
                        className={cn(
                          "h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                          progress > 100 ? "bg-red-400" : "bg-white"
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-orange-100 uppercase truncate">Reste à allouer</span>
                       <span className={cn("text-lg font-black", (projet.montant - montantPhases) < 0 ? "text-red-300" : "text-white")}>
                         {(projet.montant - montantPhases).toLocaleString('fr-MA')} <small className="text-xs">MAD</small>
                       </span>
                    </div>
                    <div className={cn(
                      "p-2 rounded-xl",
                      (projet.montant - montantPhases) < 0 ? "bg-red-500/20 text-red-100" : "bg-white/20 text-white"
                    )}>
                      {(projet.montant - montantPhases) < 0 ? <TrendingUp className="w-5 h-5 rotate-180" /> : <Clock className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <p className="text-[10px] font-bold text-white/70 leading-relaxed italic">
                    "Une gestion rigoureuse des phases garantit le succès financier du projet."
                  </p>
                </div>
              </div>
           </motion.div>

           <div className="bg-card/40 backdrop-blur border border-border/50 rounded-[2.5rem] p-8 shadow-lg">
              <h3 className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] mb-6">Résumé Statutaire</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Réalisation Globale', val: phases.filter(p => p.etatRealisation).length, total: phases.length, color: 'bg-emerald-500' },
                   { label: 'Facturation validée', val: phases.filter(p => p.etatFacturation).length, total: phases.length, color: 'bg-amber-500' },
                   { label: 'Paiements reçus', val: phases.filter(p => p.etatPaiement).length, total: phases.length, color: 'bg-orange-500' },
                 ].map((row, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="text-foreground">{row.val} / {row.total}</span>
                       </div>
                       <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border/50 shadow-inner">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", row.color)}
                            style={{ width: row.total ? `${(row.val/row.total)*100}%` : '0%' }}
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      <AnimatePresence>
        {selectedPhaseForAffectation && (
          <AffectationModal 
            phase={selectedPhaseForAffectation} 
            onClose={() => setSelectedPhaseForAffectation(null)}
            onUpdate={fetchAll}
          />
        )}
        {showDocModal && (
          <DocumentModal
            projet={projet}
            document={selectedDoc}
            onClose={() => setShowDocModal(false)}
            onUpdate={fetchAll}
          />
        )}
        {showLivrableModal && (
          <LivrableModal
            phase={selectedPhaseForLivrable}
            livrable={selectedLivrable}
            onClose={() => setShowLivrableModal(false)}
            onUpdate={fetchAll}
          />
        )}
        {showFactureModal && (
          <FactureModal
            phase={selectedPhaseForFacture}
            facture={selectedFacture}
            onClose={() => setShowFactureModal(false)}
            onUpdate={fetchAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
