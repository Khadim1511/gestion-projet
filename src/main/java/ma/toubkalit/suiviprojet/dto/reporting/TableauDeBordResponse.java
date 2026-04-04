package ma.toubkalit.suiviprojet.dto.reporting;

public class TableauDeBordResponse {
    private long countProjets;
    private long countProjetsEnCours;
    private long countProjetsClotures;
    private long countPhases;
    private long countOrganismes;
    private long countEmployes;
    private double totalMontant;

    private long phasesTerminees;
    private long phasesNonFacturees;
    private long phasesFactureesNonPayees;
    private long phasesPayees;

    public TableauDeBordResponse() {}

    public long getCountProjets() { return countProjets; }
    public void setCountProjets(long countProjets) { this.countProjets = countProjets; }

    public long getCountProjetsEnCours() { return countProjetsEnCours; }
    public void setCountProjetsEnCours(long countProjetsEnCours) { this.countProjetsEnCours = countProjetsEnCours; }

    public long getCountProjetsClotures() { return countProjetsClotures; }
    public void setCountProjetsClotures(long countProjetsClotures) { this.countProjetsClotures = countProjetsClotures; }

    public long getCountPhases() { return countPhases; }
    public void setCountPhases(long countPhases) { this.countPhases = countPhases; }

    public long getCountOrganismes() { return countOrganismes; }
    public void setCountOrganismes(long countOrganismes) { this.countOrganismes = countOrganismes; }

    public long getCountEmployes() { return countEmployes; }
    public void setCountEmployes(long countEmployes) { this.countEmployes = countEmployes; }

    public double getTotalMontant() { return totalMontant; }
    public void setTotalMontant(double totalMontant) { this.totalMontant = totalMontant; }

    public long getPhasesTerminees() { return phasesTerminees; }
    public void setPhasesTerminees(long phasesTerminees) { this.phasesTerminees = phasesTerminees; }

    public long getPhasesNonFacturees() { return phasesNonFacturees; }
    public void setPhasesNonFacturees(long phasesNonFacturees) { this.phasesNonFacturees = phasesNonFacturees; }

    public long getPhasesFactureesNonPayees() { return phasesFactureesNonPayees; }
    public void setPhasesFactureesNonPayees(long phasesFactureesNonPayees) { this.phasesFactureesNonPayees = phasesFactureesNonPayees; }

    public long getPhasesPayees() { return phasesPayees; }
    public void setPhasesPayees(long phasesPayees) { this.phasesPayees = phasesPayees; }
}
