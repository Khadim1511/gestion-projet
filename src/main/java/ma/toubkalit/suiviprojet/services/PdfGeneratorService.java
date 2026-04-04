package ma.toubkalit.suiviprojet.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import ma.toubkalit.suiviprojet.entities.Facture;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.Color;

@Service
public class PdfGeneratorService {

    public byte[] generateFacturePdf(Facture facture) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Font configurations
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

            // Header Section
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            
            PdfPCell companyCell = new PdfPCell(new Phrase("ToubkalIT Solutions", titleFont));
            companyCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(companyCell);

            PdfPCell invoiceTitleCell = new PdfPCell(new Phrase("FACTURE", titleFont));
            invoiceTitleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            invoiceTitleCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(invoiceTitleCell);
            
            document.add(headerTable);
            document.add(new Paragraph("\n"));

            // Company & Client Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            
            String companyInfo = "Adresse: Casablanca, Maroc\nEmail: contact@toubkalit.ma\nICE: 000123456789";
            PdfPCell cInfoCell = new PdfPCell(new Phrase(companyInfo, normalFont));
            cInfoCell.setBorder(Rectangle.NO_BORDER);
            infoTable.addCell(cInfoCell);

            String clientInfo = "Client: " + (facture.getPhase().getProjet().getOrganisme() != null ? 
                    facture.getPhase().getProjet().getOrganisme().getNom() : "N/A") + 
                    "\nProjet: " + facture.getPhase().getProjet().getNom() + 
                    "\nCode Projet: #" + facture.getPhase().getProjet().getCode();
            PdfPCell clInfoCell = new PdfPCell(new Phrase(clientInfo, normalFont));
            clInfoCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            clInfoCell.setBorder(Rectangle.NO_BORDER);
            infoTable.addCell(clInfoCell);
            
            document.add(infoTable);
            document.add(new Paragraph("\n\n"));

            // Invoice details (Reference & Date)
            Paragraph pRef = new Paragraph("Référence Facture: " + facture.getCode(), subTitleFont);
            Paragraph pDate = new Paragraph("Date d'émission: " + facture.getDateFacture(), normalFont);
            document.add(pRef);
            document.add(pDate);
            document.add(new Paragraph("\n"));

            // Table for Phase details
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3, 1});

            PdfPCell h1 = new PdfPCell(new Phrase("Désignation / Phase", headerFont));
            h1.setBackgroundColor(Color.DARK_GRAY);
            h1.setPadding(8);
            table.addCell(h1);

            PdfPCell h2 = new PdfPCell(new Phrase("Montant (MAD)", headerFont));
            h2.setBackgroundColor(Color.DARK_GRAY);
            h2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            h2.setPadding(8);
            table.addCell(h2);

            PdfPCell d1 = new PdfPCell(new Phrase(facture.getPhase().getLibelle(), normalFont));
            d1.setPadding(8);
            table.addCell(d1);

            PdfPCell d2 = new PdfPCell(new Phrase(String.format("%,.2f", facture.getPhase().getMontant()), normalFont));
            d2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            d2.setPadding(8);
            table.addCell(d2);
            
            document.add(table);
            document.add(new Paragraph("\n"));

            // Totals
            PdfPTable totalTable = new PdfPTable(2);
            totalTable.setWidthPercentage(30);
            totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            totalTable.addCell(new PdfPCell(new Phrase("TOTAL HT", subTitleFont)));
            PdfPCell totalVal = new PdfPCell(new Phrase(String.format("%,.2f", facture.getPhase().getMontant()), subTitleFont));
            totalVal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalTable.addCell(totalVal);
            
            document.add(totalTable);

            // Footer
            Paragraph footer = new Paragraph("\n\n\nMerci de votre confiance.\nToubkalIT Solutions - www.toubkalit.ma", normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage());
        }
    }
}
