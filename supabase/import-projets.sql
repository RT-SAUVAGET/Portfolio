-- =====================================================================
--  Import des 4 projets du portfolio V4
--  Supabase > SQL Editor > New query > coller ce fichier > Run
--  (à exécuter UNE SEULE FOIS, sinon les projets seront en double)
-- =====================================================================

insert into public.projets (ordre, titre, contexte, resume, technologies, competences, description) values

-- ---------------------------------------------------------------------
(1,
 'Audit cybersécurité, nettoyage Active Directory & GPO',
 'Entreprise — SAPRENA',
 'Audit de sécurité avec PingCastle, restructuration de l''AD, suppression des comptes obsolètes et déploiement de GPO de sécurité.',
 array['PingCastle','GPOZaurr','Active Directory','Windows Server','GPO','PowerShell'],
 array['B1.1','B1.2','B1.4','B1.5'],
$d$## Contexte
Dans le cadre de ma formation et en collaboration avec mes collègues, j'ai réalisé un audit complet de cybersécurité du système d'information de SAPRENA. L'objectif était d'identifier les vulnérabilités, de nettoyer l'annuaire Active Directory et de renforcer la sécurité par des politiques de groupe (GPO).

## Objectifs
- Analyser l'infrastructure Active Directory et identifier les vulnérabilités
- Auditer et nettoyer l'annuaire AD (comptes obsolètes, droits excessifs, OU mal structurées)
- Créer et déployer des GPO de sécurité adaptées aux besoins de SAPRENA
- Proposer un plan d'action correctif documenté

## Réalisations techniques
- Scan de vulnérabilités avec PingCastle — analyse du score de sécurité AD
- Analyse approfondie de l'Active Directory avec GPOZaurr — rapport détaillé des GPO existantes, conflits et redondances
- Identification et suppression des comptes utilisateurs inactifs ou orphelins
- Restructuration des unités d'organisation (OU) de l'Active Directory
- Vérification et correction des droits d'accès et des groupes de sécurité
- Création et déploiement de GPO : politique de mots de passe, mise en veille automatique des sessions, blocage d'extensions navigateur, installation automatique du coffre-fort de mots de passe
- Rédaction d'un rapport d'audit détaillé avec recommandations priorisées

## GPO déployées
- Politique de mots de passe
- Mise en veille automatique des sessions
- Blocage des extensions navigateur
- Installation automatique du coffre-fort de mots de passe

## Résultats
L'audit a permis d'identifier plusieurs vulnérabilités critiques dans l'AD et les GPO. Les mesures correctives ont amélioré le score PingCastle et renforcé la posture de sécurité de SAPRENA. Ce projet m'a permis de développer une approche méthodique de l'audit et une maîtrise approfondie des GPO Windows Server.

## Compétences BTS SIO mobilisées
**B1.1 — Gérer le patrimoine informatique**
- Exploiter des référentiels et standards adoptés par le prestataire informatique
- Mettre en place et vérifier les niveaux d'habilitation associés à un service
- Vérifier le respect des règles d'utilisation des ressources numériques
- Recenser et identifier les ressources numériques (audit des comptes AD)

**B1.2 — Répondre aux incidents et aux demandes**
- Traiter des demandes concernant les services réseau et système
- Méthodologie de repérage de la cause d'un incident (analyse AD avec GPOZaurr)
- Rédaction d'un compte rendu d'intervention clair (rapport d'audit)

**B1.4 — Travailler en mode projet**
- Analyser les objectifs et modalités d'organisation du projet
- Planifier les activités et mobiliser les ressources
- Produire des livrables conformes (rapport d'audit + GPO documentées)

**B1.5 — Mettre à disposition un service informatique**
- Déployer un service (déploiement des GPO en production)
- Réaliser les tests d'intégration et d'acceptation (test d'application des GPO)
- Accompagner les utilisateurs dans la mise en place (communication sur les nouvelles règles)$d$),

-- ---------------------------------------------------------------------
(2,
 'Migration de machines virtuelles',
 'Entreprise — SAPRENA · En cours',
 'Inventaire des VMs, étude comparative Azure vs serveurs mutualisés, fusion de VMs existantes et création d''une VM ERP.',
 array['Hyper-V','Windows Server 2022','Azure','Virtualisation','ERP'],
 array['B1.1','B1.4','B1.5'],
$d$## Contexte
SAPRENA souhaite moderniser son infrastructure virtualisée afin de réduire les coûts, d'optimiser les ressources et d'accueillir un nouvel ERP. Le projet est actuellement en phase d'étude et d'inventaire. La décision finale entre une migration vers Azure (cloud) ou vers des serveurs mutualisés (on-premise) est en cours d'arbitrage.

## Statut du projet
Phase d'inventaire et d'étude comparative terminée. **En attente de décision** entre Azure et serveurs mutualisés avant la planification de la migration.

## Objectifs
- Inventorier l'ensemble des machines virtuelles existantes et évaluer leurs besoins en ressources (RAM, CPU, stockage)
- Analyser et comparer les offres Azure vs serveurs mutualisés (coûts, performances, contraintes)
- Fusionner deux VMs existantes redondantes en une seule
- Créer une nouvelle VM dédiée à l'ERP
- Planifier la migration complète une fois la solution retenue

## Réalisations effectuées à ce jour
- Inventaire complet des machines virtuelles Hyper-V existantes — recensement des ressources allouées et consommées (RAM, CPU, stockage)
- Analyse des besoins de chaque VM : identification des services hébergés, des dépendances et des SLA associés
- Identification de deux VMs éligibles à la fusion (rôles redondants, ressources sous-utilisées)
- Spécification des besoins de la nouvelle VM ERP (dimensionnement, OS, réseau, stockage)
- Début de l'étude comparative Azure vs serveurs mutualisés

## Prochaines étapes
- Finaliser l'étude comparative et présenter les recommandations à la direction
- Procéder à la fusion des deux VMs redondantes
- Créer et configurer la VM ERP
- Planifier et exécuter la migration vers la solution retenue

## Compétences BTS SIO mobilisées
**B1.1 — Gérer le patrimoine informatique**
- Recenser et identifier les ressources numériques (inventaire exhaustif des VMs)
- Exploiter des référentiels et standards pour évaluer les offres (Azure, on-premise)
- Vérifier les conditions de la continuité d'un service informatique (analyse des SLA)

**B1.4 — Travailler en mode projet**
- Analyser les objectifs et les modalités d'organisation du projet
- Planifier les activités et mobiliser les ressources humaines et matérielles
- Évaluer les indicateurs de suivi — analyse des écarts entre offres

**B1.5 — Mettre à disposition un service informatique**
- Principes d'architecture d'un service (dimensionnement de la VM ERP)
- Techniques et outils de déploiement des services informatiques (Hyper-V)$d$),

-- ---------------------------------------------------------------------
(3,
 'Enrôlement MDM du parc mobile',
 'Entreprise — SAPRENA',
 'Pilotage de l''enrôlement du parc de téléphones mobiles de SAPRENA via SOTI MobiControl : administration à distance, déploiement d''applications et politiques de sécurité.',
 array['SOTI MobiControl','MDM','Android','Gestion de parc','Administration à distance'],
 array['B1.1','B1.2','B1.4','B1.5'],
$d$## Contexte
SAPRENA dispose d'un parc de téléphones mobiles utilisés par ses équipes sur le terrain. Afin d'en assurer la gestion centralisée, la sécurité et l'administration à distance, j'ai piloté l'enrôlement de l'ensemble de ce parc dans la solution MDM (Mobile Device Management) SOTI MobiControl.

## Objectifs
- Recenser l'ensemble des terminaux mobiles du parc de SAPRENA
- Enrôler les appareils dans SOTI MobiControl pour les placer sous gestion centralisée
- Permettre l'administration à distance des téléphones (configuration, applications, sécurité)
- Appliquer des profils et politiques de sécurité uniformes sur l'ensemble du parc
- Documenter la procédure d'enrôlement pour les futurs appareils

## Réalisations techniques
- Inventaire du parc mobile existant — recensement des modèles, OS, utilisateurs associés
- Configuration de SOTI MobiControl pour accueillir les nouveaux appareils
- Enrôlement des téléphones mobiles dans la console SOTI MobiControl
- Création et déploiement de profils de configuration (Wi-Fi, restrictions d'usage)
- Déploiement d'applications métier à distance sur l'ensemble du parc
- Mise en place de politiques de sécurité : verrouillage écran, chiffrement, effacement à distance en cas de perte ou vol
- Rédaction de la procédure d'enrôlement pour les futurs appareils et les nouveaux arrivants

## Fonctionnalités MDM déployées
- Enrôlement centralisé
- Profils Wi-Fi et restrictions d'usage
- Déploiement d'applications
- Verrouillage écran et chiffrement
- Effacement à distance

## Résultats
L'ensemble du parc mobile de SAPRENA est désormais administré de manière centralisée via SOTI MobiControl. Ce projet m'a permis de comprendre les enjeux de la gestion de parc mobile en entreprise, l'importance des politiques de sécurité sur les terminaux nomades, et de maîtriser un outil MDM professionnel.

## Compétences BTS SIO mobilisées
**B1.1 — Gérer le patrimoine informatique**
- Recenser et identifier les ressources numériques (inventaire du parc mobile)
- Mettre en place et vérifier les niveaux d'habilitation associés à un service
- Vérifier le respect des règles d'utilisation des ressources numériques (politiques MDM)
- Utilisation d'un logiciel de gestion de parc (SOTI MobiControl)

**B1.2 — Répondre aux incidents et aux demandes**
- Traiter des demandes concernant les services réseau et système (gestion des terminaux)
- Prise de contrôle d'un équipement utilisateur à distance
- Rédaction d'un compte rendu d'intervention (procédure d'enrôlement documentée)

**B1.4 — Travailler en mode projet**
- Analyser les objectifs et les modalités d'organisation du projet
- Planifier les activités et mobiliser les ressources (coordination avec les utilisateurs)
- Produire des livrables conformes (procédure d'enrôlement, documentation)

**B1.5 — Mettre à disposition un service informatique**
- Déployer un service (mise en production de la gestion MDM sur le parc complet)
- Accompagner les utilisateurs dans la mise en place du service
- Réaliser les tests d'intégration et d'acceptation (vérification des profils appliqués)$d$),

-- ---------------------------------------------------------------------
(4,
 'GrandLine TCG — Infrastructure réseau virtualisée',
 'Projet personnel',
 'Infrastructure virtualisée complète sous Hyper-V : 4 VMs Debian 13, segmentation DMZ/LAN, reverse proxy Nginx SSL, pare-feu UFW.',
 array['Hyper-V','Windows Server 2022','Debian 13 Trixie','Nginx','UFW','SSL/TLS','OpenSSL','Fail2ban','NAT / iptables','SSH','PM2','SCP'],
 array['B1.1','B1.2','B1.4','B1.5'],
$d$## Contexte
Dans le cadre de mon BTS SIO SISR, j'ai conçu et déployé une infrastructure réseau complète pour héberger une plateforme web communautaire dédiée au jeu de cartes One Piece TCG. Ce projet personnel m'a permis d'appliquer concrètement les compétences SISR : virtualisation, segmentation réseau, sécurisation des flux et administration système Linux.

## Architecture réseau
```
Internet
   ↓ HTTPS :443
vSwitch External (DMZ 192.168.10.0/24)
└─ VM1-Proxy   192.168.10.2
      Nginx + SSL + UFW + NAT
         ↓ :3000 (LAN uniquement)
vSwitch LAN (privé 192.168.20.0/24)
├─ VM2-App     192.168.20.10
├─ VM3-BDD     192.168.20.20
└─ VM4-Admin   192.168.20.30
```

## Architecture Hyper-V
- Hôte physique : Windows Server 2022 avec rôle Hyper-V
- 2 commutateurs virtuels : vSwitch External (DMZ 192.168.10.0/24) relié à la carte réseau physique, vSwitch LAN (192.168.20.0/24) purement interne
- 4 VMs Debian 13 Trixie : VM1 Reverse Proxy (192.168.10.2), VM2 Applicatif (192.168.20.10), VM3 Base de données (192.168.20.20), VM4 Supervision (192.168.20.30)
- VM1 est la seule avec 2 cartes réseau — une sur chaque vSwitch — elle fait le pont contrôlé entre DMZ et LAN
- NAT configuré sur VM1 (iptables via UFW) pour permettre l'accès Internet aux VMs du LAN

## Segmentation réseau & pare-feu
- UFW déployé sur les 4 VMs avec matrice de flux stricte : seuls les flux nécessaires sont autorisés
- Internet → VM1 uniquement sur ports 80 et 443 — toutes autres connexions entrantes bloquées
- VM1 → VM2 uniquement sur port 3000 (applicatif) depuis le LAN
- VM2 → VM3 uniquement sur port 3306 (base de données) — jamais exposé à l'extérieur
- VM4 accessible en SSH depuis le LAN uniquement pour l'administration
- Forwarding IP activé sur VM1 (net.ipv4.ip_forward) pour le routage NAT LAN → Internet

## Matrice de flux UFW
```
Internet → VM1   :80 / :443   ALLOW
VM1      → VM2   :3000        ALLOW
VM2      → VM3   :3306        ALLOW
LAN      → VM4   :22          ALLOW
VM3      → Internet           DENY
```

## Sécurisation des services
- Nginx configuré en reverse proxy sur VM1 — redirige le trafic entrant vers VM2 sans exposer directement l'applicatif
- Certificat SSL auto-signé (OpenSSL) — chiffrement TLS 1.2/1.3 activé, redirection HTTP → HTTPS forcée
- SSH sécurisé : PermitRootLogin désactivé, connexion par compte utilisateur standard puis su
- Fail2ban installé sur VM1 pour bloquer les tentatives de brute-force SSH et HTTP
- IPs statiques configurées via /etc/network/interfaces sur chaque VM Debian
- Sources APT corrigées (suppression du dépôt cdrom) et résolution DNS configurée (/etc/resolv.conf)

## Administration système
- Installation et configuration de Debian 13 Trixie en mode serveur minimal (sans interface graphique) sur 4 VMs
- Gestion des interfaces réseau Linux (ip a, ip route, ifup/ifdown)
- Diagnostic réseau : ping, curl, journalctl, tail sur les logs Nginx
- PM2 configuré pour maintenir les services actifs après redémarrage des VMs
- SSH entre VMs via rebond (Windows → VM1 → VMs LAN) pour l'administration
- SCP pour les transferts de fichiers entre VMs

## Compétences BTS SIO mobilisées
**B1.1 — Gérer le patrimoine informatique**
- Recenser et identifier les ressources numériques (4 VMs, vSwitch, adressage IP documenté)
- Mettre en place et vérifier les niveaux d'habilitation (UFW, règles de flux par VM)
- Vérifier les conditions de continuité d'un service (PM2, redémarrage automatique)
- Vérifier le respect des règles d'utilisation des ressources numériques

**B1.2 — Répondre aux incidents et aux demandes**
- Traiter des demandes concernant les services réseau et système
- Méthodologie de diagnostic (logs Nginx, journalctl, ip route, ping)
- Bases du réseau : adressage, routage, NAT, segments réseau, composants matériels virtuels

**B1.4 — Travailler en mode projet**
- Analyser les objectifs et les modalités d'organisation du projet
- Planifier les activités par phases (Hyper-V → VMs → réseau → sécurité → services)
- Évaluer les indicateurs de suivi et analyser les écarts lors des incidents

**B1.5 — Mettre à disposition un service informatique**
- Réaliser les tests d'intégration et d'acceptation (tests ping, curl, connectivité inter-VMs)
- Déployer un service (mise en production de l'infrastructure complète)
- Principes d'architecture d'un service (DMZ/LAN, reverse proxy, isolation BDD)
- Services et protocoles réseaux : SSH, HTTP/HTTPS, DNS, NAT, SSL/TLS$d$);
