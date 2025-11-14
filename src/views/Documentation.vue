<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@/composables';

const { isGestionnaire, isCaissier } = useAuth();

const activeSection = ref('introduction');

const sections = computed(() => {
  const baseSections = [
    { id: 'introduction', title: '📘 Introduction', icon: 'fa-book' },
    { id: 'roles', title: '🔐 Rôles & Permissions', icon: 'fa-user-shield' },
    { id: 'modules', title: "🧭 Modules de l'application", icon: 'fa-layer-group' },
  ];

  const caissierSections = [
    { id: 'routine-caissier', title: '✅ Routine Caissier', icon: 'fa-check-circle' },
    { id: 'point-vente', title: '🛒 Point de Vente', icon: 'fa-cash-register' },
    { id: 'details', title: '🗂️ Détails par module', icon: 'fa-list-alt' },
  ];

  const gestionSections = [
    { id: 'routine-gestionnaire', title: '✅ Routine Gestionnaire', icon: 'fa-clipboard-check' },
    { id: 'dashboard', title: '📊 Dashboard', icon: 'fa-chart-line' },
    { id: 'point-vente', title: '🛒 Point de Vente', icon: 'fa-cash-register' },
    { id: 'articles', title: '📦 Articles', icon: 'fa-box' },
    { id: 'stocks', title: '📋 Stocks', icon: 'fa-warehouse' },
    { id: 'clients', title: '👥 Clients', icon: 'fa-users' },
    { id: 'commandes', title: '🛍️ Commandes', icon: 'fa-shopping-cart' },
    { id: 'reservations', title: '📅 Réservations', icon: 'fa-calendar-check' },
    { id: 'paiements', title: '💰 Paiements', icon: 'fa-credit-card' },
    { id: 'utilisateurs', title: '👤 Utilisateurs', icon: 'fa-user-cog' },
    { id: 'details', title: '🗂️ Détails par module', icon: 'fa-list-alt' },
  ];

  if (isCaissier.value) {
    return [...baseSections, ...caissierSections];
  }

  return [...baseSections, ...gestionSections];
});

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-3">
        <div class="card position-sticky" style="top: 100px;">
          <div class="card-header pb-0">
            <h5 class="mb-0">
              <i class="fas fa-book text-primary me-2"></i>
              Table des matières
            </h5>
          </div>
          <div class="card-body p-3">
            <div class="list-group">
              <a
                v-for="section in sections"
                :key="section.id"
                href="javascript:;"
                @click="scrollToSection(section.id)"
                class="list-group-item list-group-item-action border-0 px-3 py-2 mb-1"
                :class="{ 'bg-gradient-primary text-white': activeSection === section.id }"
              >
                <i :class="`fas ${section.icon} me-2`"></i>
                {{ section.title }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-9">
        <!-- Introduction -->
        <div id="introduction" class="card mb-4">
          <div class="card-header pb-0">
            <h3 class="text-primary">
              <i class="fas fa-book me-2"></i>
              Documentation Lejecolia – Gestion mono-société
            </h3>
            <p class="text-sm mb-0">
              Ce guide couvre l'ensemble des fonctionnalités disponibles pour la plateforme actuelle, organisée autour d'une seule société et de deux rôles opérationnels : Gestionnaire et Caissier.
            </p>
          </div>
          <div class="card-body">
            <div class="alert alert-info text-sm">
              <strong>💡 Conseil :</strong> L'accès à ce guide est disponible depuis le bouton « Documentation » présent dans le Dashboard et dans le menu latéral.
            </div>

            <h5 class="text-dark">🎯 Objectifs de la plateforme</h5>
            <p class="text-sm">
              Lejecolia permet de piloter l'activité d'un point de vente unique : suivi des ventes, du stock, des clients et des paiements. Toutes les données sont centralisées pour une prise de décision rapide.
            </p>

            <h6 class="mt-4">🚀 Modules accessibles</h6>
                <ul class="text-sm">
              <li><strong>Dashboard</strong> : synthèse quotidienne et mensuelle.</li>
              <li><strong>Point de Vente</strong> : enregistrement rapide des ventes.</li>
              <li><strong>Gestion</strong> : catalogues (articles, stocks, clients, commandes, réservations, paiements, utilisateurs).</li>
              <li><strong>Notifications</strong> & <strong>Documentation</strong> : support opérationnel.</li>
                </ul>
          </div>
        </div>

        <!-- Roles -->
        <div id="roles" class="card mb-4">
          <div class="card-header pb-0">
            <h4 class="text-primary">
              <i class="fas fa-user-shield me-2"></i>
              Rôles & Permissions
            </h4>
          </div>
          <div class="card-body">
            <p class="text-sm">
              Deux rôles structurent la plateforme :
            </p>

            <div class="row g-3">
              <div class="col-md-6">
                <div class="card bg-gradient-success text-white h-100">
              <div class="card-body p-3">
                <h6 class="text-white mb-2">
                      <i class="fas fa-user-tie me-2"></i>
                      Gestionnaire
                </h6>
                <p class="text-sm mb-2 opacity-8">
                      <strong>Mission :</strong> superviser l'activité du point de vente et préparer les décisions.
                </p>
                <p class="text-sm mb-0 opacity-8">
                      <strong>Accès :</strong> Dashboard, Point de Vente, Articles, Stocks, Clients, Commandes, Réservations, Paiements, Utilisateurs, Notifications, Documentation, Profil.
                    </p>
                </div>
              </div>
            </div>

              <div class="col-md-6">
                <div class="card bg-gradient-warning text-white h-100">
              <div class="card-body p-3">
                <h6 class="text-white mb-2">
                      <i class="fas fa-cash-register me-2"></i>
                      Caissier
                </h6>
                <p class="text-sm mb-2 opacity-8">
                      <strong>Mission :</strong> réaliser les ventes quotidiennes rapidement et avec précision.
                </p>
                <p class="text-sm mb-0 opacity-8">
                      <strong>Accès :</strong> Dashboard simplifié (performance personnelle), Point de Vente, Notifications, Documentation, Profil.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="alert alert-warning text-sm mt-3">
              <i class="fas fa-shield-alt me-2"></i>
              <strong>Sécurité :</strong> Le Caissier n'a accès qu'aux modules nécessaires à la vente. Toute gestion métier (articles, stock, clients, utilisateurs) est réservée au Gestionnaire.
                </div>
              </div>
            </div>

        <!-- Routine Caissier -->
        <div id="routine-caissier" class="card mb-4" v-if="isCaissier">
          <div class="card-header pb-0">
            <h4 class="text-primary">
              <i class="fas fa-check-circle me-2"></i>
              Routine quotidienne du caissier
            </h4>
          </div>
          <div class="card-body text-sm">
            <ol class="mb-0">
              <li><strong>Connexion</strong> : se connecter sur <code>/dashboard</code> et vérifier l'état de connexion.</li>
              <li><strong>Notifications</strong> : consulter la pastille bleue, ouvrir les alertes importantes (ex. rupture de stock) puis les marquer comme lues.</li>
              <li><strong>Point de Vente</strong> :
                <ul>
                  <li>Choisir le client ou en créer un à la volée.</li>
                  <li>Scanner ou rechercher les articles, ajuster les quantités/remises.</li>
                  <li>Sélectionner le mode de paiement et enregistrer la vente.</li>
                </ul>
              </li>
              <li><strong>Suivi</strong> : vérifier la carte « Ventes du jour » et le tableau « Mes 10 dernières ventes » dans le dashboard.</li>
              <li><strong>Fin de journée</strong> : s'assurer que toutes les notifications sont traitées, se déconnecter via « Mon Compte » &gt; « Déconnexion ».</li>
            </ol>
            <div class="alert alert-info mt-3 mb-0">
              <i class="fas fa-lightbulb me-2"></i>
              Astuce : le bouton <strong>Documentation</strong> du dashboard ouvre ce guide sans quitter le poste de vente.
            </div>
          </div>
        </div>

        <!-- Routine Gestionnaire -->
        <div id="routine-gestionnaire" class="card mb-4" v-if="!isCaissier">
          <div class="card-header pb-0">
            <h4 class="text-primary">
              <i class="fas fa-clipboard-check me-2"></i>
              Routine quotidienne du gestionnaire
            </h4>
          </div>
          <div class="card-body text-sm">
            <ol class="mb-0">
              <li><strong>Dashboard</strong> : analyser les indicateurs clés (ventes du jour, CA du mois, top articles, activités).</li>
              <li><strong>Notifications</strong> : traiter les alertes critiques (stock bas, paiements, relances clients).</li>
              <li><strong>Opérations</strong> :
                <ul>
                  <li>Mettre à jour le <strong>catalogue</strong> (articles, prix, stock).</li>
                  <li>Suivre les <strong>commandes</strong> et <strong>réservations</strong>.</li>
                  <li>Contrôler les <strong>paiements</strong> reçus.</li>
                </ul>
              </li>
              <li><strong>Equipe</strong> : consulter les performances des caissiers dans « Utilisateurs », gérer les accès si besoin.</li>
              <li><strong>Documentation & Support</strong> : utiliser ce guide pour former les nouveaux collaborateurs et contacter <a href="mailto:support@lejecolia.com">support@lejecolia.com</a> si nécessaire.</li>
            </ol>
            <div class="alert alert-warning mt-3 mb-0">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Pensez à vérifier le Journal des ventes et des paiements avant la clôture afin de détecter toute anomalie.
            </div>
          </div>
        </div>

        <!-- Modules table -->
        <div id="modules" class="card mb-4">
          <div class="card-header pb-0">
            <h4 class="text-primary">
              <i class="fas fa-layer-group me-2"></i>
              Vue d'ensemble des modules
            </h4>
            <p class="text-sm mb-0">
              Chaque module ci-dessous résume ses fonctionnalités principales et le rôle autorisé.
            </p>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm align-middle text-sm">
                <thead>
                  <tr>
                    <th style="width: 18%">Module</th>
                    <th>Fonctionnalités principales</th>
                    <th style="width: 22%" class="text-center">Accès</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dashboard</strong></td>
                    <td>Vue synthétique des indicateurs clés (ventes du jour, CA du mois, top articles, activités récentes).</td>
                    <td class="text-center">
                      <span class="badge bg-gradient-success">Gestionnaire</span>
                      <span class="badge bg-gradient-warning ms-1">Caissier</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Notifications</strong></td>
                    <td>Système d'alertes (ventes, stocks, paiements) avec modal détaillé et son en temps réel.</td>
                    <td class="text-center">
                      <span class="badge bg-gradient-success">Gestionnaire</span>
                      <span class="badge bg-gradient-warning ms-1">Caissier</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Point de Vente</strong></td>
                    <td>Création de ventes : panier multi-articles, gestion du client, modes de paiement, remise, impression.</td>
                    <td class="text-center">
                      <span class="badge bg-gradient-success">Gestionnaire</span>
                      <span class="badge bg-gradient-warning ms-1">Caissier</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Journal des Ventes</strong></td>
                    <td>Historique complet, filtres multi-critères, recherche globale, statistiques, export.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Journal des Paiements</strong></td>
                    <td>Suivi des encaissements, détail des paiements, rapport financier par mode.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Articles</strong></td>
                    <td>Gestion du catalogue produit, prix, TVA, photos compressées.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Stocks</strong></td>
                    <td>Inventaire, seuils d'alerte, suivis des entrées/sorties.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Clients</strong></td>
                    <td>Base clients, fiches détaillées, historique d'achat, segmentation simple.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Commandes</strong></td>
                    <td>Suivi des commandes, devis, relances, conversion en ventes.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Réservations</strong></td>
                    <td>Planification des réservations clients, confirmation, transformation en ventes.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Paiements</strong></td>
                    <td>Suivi des règlements, rapprochement comptable, montants par mode.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Utilisateurs</strong></td>
                    <td>Création et gestion des comptes Gestionnaires/Caissiers, réinitialisation, statut.</td>
                    <td class="text-center"><span class="badge bg-gradient-success">Gestionnaire</span></td>
                  </tr>
                  <tr>
                    <td><strong>Profil</strong></td>
                    <td>Informations personnelles, mot de passe, photo compressée, préférences.</td>
                    <td class="text-center">
                      <span class="badge bg-gradient-success">Gestionnaire</span>
                      <span class="badge bg-gradient-warning ms-1">Caissier</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Documentation</strong></td>
                    <td>Guide interactif, bonnes pratiques, checklist d'exploitation.</td>
                    <td class="text-center">
                      <span class="badge bg-gradient-success">Gestionnaire</span>
                      <span class="badge bg-gradient-warning ms-1">Caissier</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            </div>
            </div>

        <!-- Détails par module -->
        <div id="details" class="card mb-4">
          <div class="card-header pb-0">
            <h4 class="text-primary">
              <i class="fas fa-list-alt me-2"></i>
              Détails opérationnels
            </h4>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-lg-6" id="dashboard" v-if="!isCaissier">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-chart-line me-2 text-primary"></i>Dashboard Gestionnaire</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Cartes statistiques : ventes du jour, CA du mois, clients, employés.</li>
                      <li>Graphique de performance mensuelle et top articles.</li>
                      <li>Activités récentes et indicateurs de stock.</li>
                      <li>Bouton « Documentation » disponible dans l'entête.</li>
                    </ul>
                </div>
              </div>
            </div>

              <div class="col-lg-6" id="point-vente">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-cash-register me-2 text-success"></i>Point de Vente</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Choix du client, du site et du mode de paiement.</li>
                      <li>Panier multi-articles avec remise et calcul automatique.</li>
                      <li>Impression ou envoi de la facture, enregistrement du paiement.</li>
                      <li>Carte « Ventes du jour » intégrée pour suivi immédiat.</li>
                </ul>
            </div>
          </div>
        </div>

              <div class="col-lg-6" id="articles" v-if="!isCaissier">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-box me-2 text-info"></i>Articles & Stocks</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Création d'articles avec photos compressées en base64.</li>
                      <li>Mise à jour des prix et TVA, activation/désactivation.</li>
                      <li>Suivi des quantités en stock et alertes de seuil.</li>
                </ul>
            </div>
          </div>
        </div>

              <div class="col-lg-6" id="clients" v-if="!isCaissier">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-users me-2 text-warning"></i>Clients & Commandes</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Fiches clients complètes : coordonnées, historique, réservations.</li>
                      <li>Gestion des commandes et devis, transformation en ventes.</li>
                      <li>Journal des ventes et paiements pour analyse détaillée.</li>
                </ul>
            </div>
          </div>
        </div>

              <div class="col-lg-6" id="paiements" v-if="!isCaissier">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-credit-card me-2 text-danger"></i>Paiements</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Suivi des encaissements (espèces, mobile money, carte, virement).</li>
                      <li>Modal détail enrichi : client, opérateur, site, références.</li>
                      <li>Rapport financier et calculs automatiques par mode de paiement.</li>
                </ul>
            </div>
          </div>
        </div>

              <div class="col-lg-6" id="utilisateurs" v-if="!isCaissier">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-user-cog me-2 text-primary"></i>Utilisateurs</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Création/modification de Gestionnaires et Caissiers.</li>
                      <li>Réinitialisation de mot de passe, activation/désactivation.</li>
                      <li>Préparation des données avant envoi à l'API (nettoyage automatique).</li>
                </ul>
            </div>
          </div>
        </div>

              <div class="col-lg-6" id="documentation">
                <div class="card h-100">
          <div class="card-header pb-0">
                    <h6 class="mb-0"><i class="fas fa-book-reader me-2 text-secondary"></i>Documentation & Support</h6>
          </div>
                  <div class="card-body text-sm">
                    <ul class="mb-0">
                      <li>Disponible via le bouton du Dashboard et le menu latéral.</li>
                      <li>Table des matières interactive pour naviguer rapidement.</li>
                      <li>Checklist d'exploitation quotidienne (ventes, stock, paiements).</li>
                      <li>Contact support : <a href="mailto:support@lejecolia.com">support@lejecolia.com</a>.</li>
                </ul>
            </div>
          </div>
        </div>
          </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border-radius: 0.5rem;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.list-group-item.bg-gradient-primary:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 6px rgba(21, 101, 192, 0.3);
}

h6 {
  color: #344767;
  font-weight: 600;
  margin-top: 1rem;
}

.card {
  scroll-margin-top: 100px;
}

.gap-2 {
  gap: 0.5rem;
}
</style>

