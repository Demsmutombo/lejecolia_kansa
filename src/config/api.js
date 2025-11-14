/**
 * Configuration centralisée de l'API
 * Tous les endpoints et paramètres API sont définis ici
 */

export const API_CONFIG = {
  // URL de base de l'API
  // En développement, Vite proxy redirige automatiquement /api vers le backend
  // En production, utiliser l'URL complète
  BASE_URL: import.meta.env.DEV ? '' : 'https://mombongov2.asdc-rdc.org',
  
  // Endpoints
  ENDPOINTS: {
    // Authentification
    LOGIN: '/api/Utilisateurs/Authentifier',
    LOGOUT: '/api/Utilisateurs/Logout',
    
    // Utilisateurs
    USERS: '/api/Utilisateurs',
    USER_BY_ID: (id) => `/api/Utilisateurs/${id}`,
    
    // Rôles
    ROLES: '/api/Roles',
    ROLE_BY_ID: (id) => `/api/Roles/${id}`,
    
    // Sociétés
    SOCIETES: '/api/Societes',
    SOCIETE_BY_ID: (id) => `/api/Societes/${id}`,
    SOCIETE_BY_NAME: (name) => `/api/Societes/nomSociete/${name}`,
    SOCIETE_BY_WEBSITE: (website) => `/api/Societes/siteWeb/${website}`,
    TYPES_SOCIETES: '/api/TypesSocietes',
    
    // Sites
    SITES: '/api/Sites',
    SITE_BY_ID: (id) => `/api/Sites/${id}`,
    SITES_BY_SOCIETE: (id) => `/api/Sites/societe/${id}`,
    SITES_SEARCH: '/api/Sites/search',
    
  // Utilisateurs
  USERS: '/api/Utilisateurs',
  USER_BY_ID: (id) => `/api/Utilisateurs/${id}`,
  USERS_SEARCH: '/api/Utilisateurs/search',
  USER_CHANGE_PASSWORD: (id) => `/api/Utilisateurs/${id}/change-password`,
  USER_TOGGLE_STATUS: (id) => `/api/Utilisateurs/${id}/statut`,

  // Articles
  ARTICLES: '/api/Articles',
  ARTICLE_BY_ID: (id) => `/api/Articles/${id}`,
  ARTICLES_BY_SOCIETE: (idSociete) => `/api/Articles/societe/${idSociete}`,

  // Clients
  CLIENTS: '/api/Clients',
  CLIENT_BY_ID: (id) => `/api/Clients/${id}`,
  CLIENTS_SEARCH: '/api/Clients/search',
  
  // Vue Clients par Site (optimisée)
  V_CLIENTS_PAR_SITE: '/api/V_ClientsParSite',
  V_CLIENTS_PAR_SITE_BY_ID: (id) => `/api/V_ClientsParSite/${id}`,
  V_CLIENTS_PAR_SITE_BY_SITE: (idSite) => `/api/V_ClientsParSite/site/${idSite}`,
  V_CLIENTS_PAR_SITE_BY_SOCIETE: (idSociete) => `/api/V_ClientsParSite/societe/${idSociete}`,
  V_CLIENTS_PAR_SITE_BY_GENRE: (genre) => `/api/V_ClientsParSite/genre/${genre}`,
  
  // Vue Journal Vente par Site (statistiques optimisées)
  V_JOURNAL_VENTE: '/api/V_JournalVenteParSite',
  V_JOURNAL_VENTE_FILTER: '/api/V_JournalVenteParSite/filter',
  V_JOURNAL_VENTE_PAGED: '/api/V_JournalVenteParSite/paged',
  V_JOURNAL_VENTE_STATS: '/api/V_JournalVenteParSite/stats',
  V_JOURNAL_VENTE_STATS_DATE: (date) => `/api/V_JournalVenteParSite/stats/date/${date}`,
  V_JOURNAL_VENTE_GROUPED_BY_ARTICLE: '/api/V_JournalVenteParSite/grouped-by-article',
  V_JOURNAL_VENTE_GROUPED_BY_ARTICLE_PAGED: '/api/V_JournalVenteParSite/grouped-by-article-paged',
  V_JOURNAL_VENTE_GROUPED_BY_ARTICLE_GESTIONNAIRE: '/api/V_JournalVenteParSite/grouped-by-article/gestionnaire',
  V_JOURNAL_VENTE_UTILISATEUR_DATE: '/api/V_JournalVenteParSite/utilisateur-date',
  V_JOURNAL_VENTE_UTILISATEUR_DATE_PAGED: '/api/V_JournalVenteParSite/utilisateur-date-paged',
  V_JOURNAL_VENTE_RAPPORT_FINANCIER: '/api/V_JournalVenteParSite/rapport-financier',
  
  // Vue Paiements (optimisée avec données complètes)
  V_PAIEMENT: '/api/V_Paiement',
  V_PAIEMENT_BY_ID: (id) => `/api/V_Paiement/${id}`,
  V_PAIEMENT_BY_CLIENT: (idClient) => `/api/V_Paiement/client/${idClient}`,
  V_PAIEMENT_BY_COMMANDE: (idCommande) => `/api/V_Paiement/commande/${idCommande}`,
  V_PAIEMENT_BY_SITE_DATE: (idSite, date) => `/api/V_Paiement/site/${idSite}/date/${date}`,
  V_PAIEMENT_BY_UTILISATEUR_DATE: (idUtilisateur, date) => `/api/V_Paiement/utilisateur/${idUtilisateur}/date/${date}`,
  V_PAIEMENT_SOMME: '/api/V_Paiement/somme',
  V_PAIEMENT_RAPPORT_FINANCIER: '/api/V_Paiement/rapport-financier',
  V_PAIEMENT_RESULTATS_PAR_SITE: '/api/V_Paiement/resultats-par-site',
  
  // Vue Stock Article Site (optimisée avec libellés)
  V_STOCK_ARTICLE_SITE: '/api/V_StockArticleSite',
  V_STOCK_ARTICLE_SITE_BY_ID: (id) => `/api/V_StockArticleSite/${id}`,
  V_STOCK_ARTICLE_SITE_BY_SITE: (idSite) => `/api/V_StockArticleSite/site/${idSite}`,
  V_STOCK_ARTICLE_SITE_BY_SOCIETE: (idSociete) => `/api/V_StockArticleSite/societe/${idSociete}`,
  V_STOCK_ARTICLE_SITE_BY_ARTICLE: (idArticle) => `/api/V_StockArticleSite/article/${idArticle}`,
  V_STOCK_ARTICLE_SITE_ALERTE: '/api/V_StockArticleSite/alerte',
  
  // Vue Utilisateurs (optimisée avec site/société)
  V_UTILISATEUR: '/api/V_Utilisateur',
  V_UTILISATEUR_BY_ID: (id) => `/api/V_Utilisateur/${id}`,
  V_UTILISATEUR_BY_SITE: (idSite) => `/api/V_Utilisateur/site/${idSite}`,
  V_UTILISATEUR_BY_SOCIETE: (idSociete) => `/api/V_Utilisateur/societe/${idSociete}`,
  V_UTILISATEUR_BY_ROLE: (role) => `/api/V_Utilisateur/role/${role}`,
  V_UTILISATEUR_SEARCH: '/api/V_Utilisateur/search',

  // Commandes
  COMMANDES: '/api/Commande',
  COMMANDE_BY_ID: (id) => `/api/Commande/${id}`,
  COMMANDES_BY_SOCIETE: (id) => `/api/Commande/societe/${id}`,
  COMMANDES_SEARCH: '/api/Commande/search',

  // Lignes de Commande
  LIGNES_COMMANDE: '/api/LigneCommande',
  LIGNE_COMMANDE_BY_ID: (id) => `/api/LigneCommande/${id}`,
  LIGNES_COMMANDE_SEARCH: '/api/LigneCommande/search',

  // Réservations
  RESERVATIONS: '/api/Reservations',
  RESERVATION_BY_ID: (id) => `/api/Reservations/${id}`,
  RESERVATIONS_BY_SOCIETE: (id) => `/api/Reservations/societe/${id}`,
  RESERVATIONS_SEARCH: '/api/Reservations/search',

  // Paiements
  PAIEMENTS: '/api/Paiements',
  PAIEMENT_BY_ID: (id) => `/api/Paiements/${id}`,
  PAIEMENTS_BY_SOCIETE: (id) => `/api/Paiements/societe/${id}`,
  PAIEMENTS_SEARCH: '/api/Paiements/search',

  // Stocks
  STOCKS: '/api/Stocks',
  STOCK_BY_ID: (id) => `/api/Stocks/${id}`,
  STOCK_BY_ARTICLE: (id) => `/api/Stocks/article/${id}`,

  // Vente (Point de Vente)
  VENTE_ENREGISTRER: '/api/Vente/enregistrer',
  VENTE_ENREGISTRER_ALTERNATIVE: '/api/Vente/enregistrer-alternative',
  VENTE_ENREGISTRER_SP: '/api/Vente/enregistrer-sp',
  VENTE_VALIDER: '/api/Vente/valider',

  // Notifications
  NOTIFICATIONS: '/api/Notifications',
  NOTIFICATIONS_UTILISATEUR: (idUtilisateur) => `/api/Notifications/utilisateur/${idUtilisateur}`,
  NOTIFICATION_MARQUER_LU: (id) => `/api/Notifications/${id}/marquer-lu`,
  NOTIFICATIONS_TOUT_LU: (idUtilisateur) => `/api/Notifications/utilisateur/${idUtilisateur}/tout-lu`,
  NOTIFICATIONS_PURGE: '/api/Notifications/purge',
    
    // Autres endpoints à ajouter selon vos besoins
  },
  
  // Configuration des requêtes
  TIMEOUT: 60000, // 60 secondes (pour les uploads)
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

export default API_CONFIG;

