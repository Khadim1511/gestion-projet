



# SuiviProjet 
  ### Système de Pilotage et Suivi Opérationnel de Projets
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%204.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

  **Une solution premium et intuitive pour gérer le cycle de vie complet de vos projets, de l'initialisation à la facturation automatisée.**
</div>

---

## Vision & Proposition de Valeur

**SuiviProjet** n'est pas qu'un simple outil de gestion. C'est une plateforme conçue pour apporter une clarté absolue sur l'avancement technique et financier de vos missions. Grâce à une interface minimaliste et des automatisations intelligentes, elle permet aux équipes de se concentrer sur l'essentiel : **la livraison de valeur.**

### Points Forts
- **Expérience Utilisateur (UX) Premium** : Animations fluides (Framer Motion) et design adaptatif (mode sombre inclus).
- **Automatisation Documentaire** : Génération instantanée de factures PDF professionnelles.
- **Transparence Financière** : Suivi précis des consommations budgétaires par phase.
- **Sécurité de pointe** : Architecture Stateless basée sur JWT (JSON Web Tokens).

---

## Fonctionnalités Clés

### Gestion de Projets à 360°
- **Structure par Phases** : Découpage granulaire des projets (Conception, Dev, Test, etc.).
- **Cycle de Vie Dynamique** : Suivi en temps réel des statuts (Réalisé, Facturé, Payé).
- **Affectations** : Attribution précise des ressources sur chaque phase.

### Facturation & Documents (Automatisé)
- **Génération PDF** : Création automatique d'une facture PDF dès l'émission.
- **Archivage Intelligent** : Chaque facture est automatiquement classée dans la section "Documents" du projet.
- **Livrables Techniques** : Centralisation des preuves de livraison par phase.

### Business Intelligence (Dashboard)
- **Reporting Visuel** : Indicateurs clés de performance (KPIs) en temps réel.
- **Alertes de Facturation** : Ne ratez plus aucune phase prête à être facturée.
- **Graphiques de Consommation** : Visualisation de l'utilisation du budget global.

---

## Stack Technique

### Backend (Architecture Clean)
- **Framework** : Spring Boot 3.2.3 (Java 17)
- **Sécurité** : Spring Security + JWT
- **Persistance** : Spring Data JPA + MySQL 8
- **PDF Core** : OpenPDF (Génération PDF haute fidélité)
- **API Documentation** : Swagger UI / OpenAPI 3

### Frontend (Modern Stack)
- **Core** : React 19 (Vite)
- **Styling** : Tailwind CSS 4 + Lucide React
- **Animations** : Framer Motion
- **Networking** : Axios (Intercepteurs JWT)

---

## Démonstration Vidéo

> [!TIP]
> **Démonstration Vidéo Professionnelle.**  
> Découvrez le fonctionnement en temps réel du dashboard, de la gestion des phases et de la facturation PDF automatisée.


https://github.com/user-attachments/assets/764dd53b-85c7-44e5-a6ff-9278a34a56f0



---

## Installation & Déploiement

### Option A : Déploiement Docker (Recommandé)
Le projet est prêt pour la production via Docker Compose.
```bash
docker-compose up --build
```
*Accès :*
- Frontend : `http://localhost:80`
- Backend / API : `http://localhost:8080`
- Swagger UI : `http://localhost:8080/swagger-ui.html`

### Option B : Installation Manuelle

1. **Clonage** :
   ```bash
   git clone https://github.com/votre-user/gestion-projet.git
   ```
2. **Backend** :
   - Configurer MySQL dans `src/main/resources/application.yml`.
   - Exécuter : `mvn clean install && mvn spring-boot:run`
3. **Frontend** :
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/7f3b4c7f-b055-474b-948e-4c1ffb5dfa63" />
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/eef42da5-4bb3-4394-a659-46de54b03b48" />
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/2338b444-52ab-47b2-bb58-18779d0f37b7" />
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/1d551cac-9a14-4aea-b491-b34c561de3ed" />
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/07bea793-1ad8-4af6-9874-34a35eb7e015" />
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/11716222-3c23-429d-84bc-b86a753d5b95" />

---

## Identifiants de Test (Défaut)
> [!NOTE]
> Au premier lancement, la base de données est initialisée avec ces comptes :
> - **Compte Admin** : `admin` / `admin123`
> - **Compte CP (Chef de Projet)** : `rayan` / `rayan`

---

## Auteurs & Contribution

Ce projet a été réalisé avec passion par :
- [**khadim1511**](https://github.com/khadim1511) 
- [**rayan-sedaoui**](https://github.com/rayan-sedaoui) 
- [**farah-sahraoui**](https://github.com/farah-sahraoui) 

 Dans le cadre d'un projet académique de Gestion de Projets.
