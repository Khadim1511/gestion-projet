package ma.toubkalit.suiviprojet.dto.reporting;

public class TableauDeBordResponse {
    private long totalProjets;
    private long projetsEnCours;
    private long projetsClotures;
    private long totalPhases;
    private long phasesTerminees;
    private long phasesNonFacturees;
    private long phasesFactureesNonPayees;
    private long phasesPayees;

    public TableauDeBordResponse() {}
    public long getTotalProjets() { return totalProjets; }           public void setTotalProjets(long v) { this.totalProjets = v; }
    public long getProjetsEnCours() { return projetsEnCours; }       public void setProjetsEnCours(long v) { this.projetsEnCours = v; }
    public long getProjetsClotures() { return projetsClotures; }     public void setProjetsClotures(long v) { this.projetsClotures = v; }
    public long getTotalPhases() { return totalPhases; }             public void setTotalPhases(long v) { this.totalPhases = v; }
    public long getPhasesTerminees() { return phasesTerminees; }     public void setPhasesTerminees(long v) { this.phasesTerminees = v; }
    public long getPhasesNonFacturees() { return phasesNonFacturees; } public void setPhasesNonFacturees(long v) { this.phasesNonFacturees = v; }
    public long getPhasesFactureesNonPayees() { return phasesFactureesNonPayees; } public void setPhasesFactureesNonPayees(long v) { this.phasesFactureesNonPayees = v; }
    public long getPhasesPayees() { return phasesPayees; }           public void setPhasesPayees(long v) { this.phasesPayees = v; }
}
