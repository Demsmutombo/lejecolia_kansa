/**
 * Service API centralisé utilisant Axios
 * Gère tous les appels API avec intercepteurs pour l'authentification
 */

import axios from 'axios';
import API_CONFIG from '@/config/api';
import { useUserStore } from '@/stores/user';

// Créer une instance Axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Intercepteur de requête - Ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    
    // Ajouter le token JWT si disponible
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const userStore = useUserStore();
    
    // Déconnexion automatique si token invalide
    if (error.response?.status === 401) {
      console.warn('Session expirée - Déconnexion automatique');
      userStore.logout();
      window.location.href = '/signin';
    }
    
    // Gestion des autres erreurs
    if (error.response?.status === 403) {
      console.error('Accès refusé');
    }
    
    if (error.response?.status === 500) {
      console.error('Erreur serveur');
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTHENTIFICATION ====================

/**
 * Authentifier un utilisateur
 * @param {string} login - Login/Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise} Données de l'utilisateur et token
 */
export const login = async (login, password) => {
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
    login: login,
    motDePasse: password
  });
  return response.data;
};

/**
 * Déconnexion
 */
export const logout = async () => {
  try {
    await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

// ==================== UTILISATEURS ====================

/**
 * Récupérer tous les utilisateurs (superadmin uniquement)
 */
export const getUsers = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS, { params });
  return response.data;
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données utilisateur pour l'API
 */
const prepareUserData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // 🧹 NETTOYER LES CHAMPS DE LA VUE (V_Utilisateur) qui ne doivent pas être envoyés
  const champsVue = [
    'nomComplet', 'nomSite', 'nomSociete', 'siteName', 'roleName', 
    'adresseSite', 'contact', 'idSociete', 'role'
  ];
  champsVue.forEach(champ => delete cleaned[champ]);
  
  // Convertir les IDs en number
  if (cleaned.idUtilisateur) {
    cleaned.idUtilisateur = parseInt(cleaned.idUtilisateur, 10);
  }
  if (cleaned.idSite) {
    cleaned.idSite = parseInt(cleaned.idSite, 10);
  }
  if (cleaned.idRole) {
    cleaned.idRole = parseInt(cleaned.idRole, 10);
  }
  
  // Si role est une string, on doit trouver l'idRole correspondant
  // Pour l'instant, on supprime le champ "role" s'il existe (car l'API attend idRole)
  if (cleaned.role && typeof cleaned.role === 'string') {
    delete cleaned.role;
    // L'idRole devrait déjà être présent dans les données
  }
  
  // Supprimer idUtilisateur si c'est une création
  if (!isUpdate || cleaned.idUtilisateur === 0) {
    delete cleaned.idUtilisateur;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que statut et isConnected sont des booleans
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  if (cleaned.isConnected !== undefined) {
    cleaned.isConnected = cleaned.isConnected === true || cleaned.isConnected === 'true';
  }
  
  // Formater la date de naissance
  if (cleaned.dateNaissance && typeof cleaned.dateNaissance === 'string') {
    cleaned.dateNaissance = new Date(cleaned.dateNaissance).toISOString();
  }
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données utilisateur préparées:', cleaned);
  return cleaned;
};

/**
 * Créer un utilisateur (avec préparation des données)
 */
export const createUser = async (userData) => {
  const preparedData = prepareUserData(userData, false);
  console.log('📤 POST /api/Utilisateurs avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.USERS, preparedData);
  return response.data;
};

/**
 * Mettre à jour un utilisateur (avec préparation des données)
 */
export const updateUser = async (id, userData) => {
  const preparedData = prepareUserData(userData, true);
  console.log('📤 PUT /api/Utilisateurs/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.USER_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
  return response.data;
};

// ==================== RÔLES ====================

/**
 * Récupérer tous les rôles
 */
export const getRoles = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.ROLES);
  return response.data;
};

/**
 * Récupérer un rôle par ID
 */
export const getRoleById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.ROLE_BY_ID(id));
  return response.data;
};

// ==================== SOCIÉTÉS ====================

/**
 * Récupérer toutes les sociétés
 */
export const getSocietes = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SOCIETES, { params });
  return response.data;
};

/**
 * Récupérer une société par ID
 */
export const getSocieteById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SOCIETE_BY_ID(id));
  return response.data;
};

/**
 * Créer une société
 */
export const createSociete = async (societeData) => {
  // Préparer les données pour l'API
  const preparedData = prepareSocieteData(societeData, false);
  console.log('📤 POST /api/Societes avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.SOCIETES, preparedData);
  return response.data;
};

/**
 * Mettre à jour une société
 */
export const updateSociete = async (id, societeData) => {
  // Préparer les données pour l'API
  const preparedData = prepareSocieteData(societeData, true);
  
  console.log('📤 PUT /api/Societes/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.SOCIETE_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Préparer les données de société pour l'API
 */
const prepareSocieteData = (data, isUpdate) => {
  // Créer une copie
  const cleaned = { ...data };
  
  // Convertir idSociete en number
  if (cleaned.idSociete) {
    cleaned.idSociete = parseInt(cleaned.idSociete, 10);
  }
  
  // Supprimer idSociete si c'est une création (l'API le génère)
  if (!isUpdate || cleaned.idSociete === 0) {
    delete cleaned.idSociete;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que statut est un boolean
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // Ajouter dateLastModification pour les mises à jour
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    // Ajouter dateCreation pour les créations
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données préparées (camelCase):', cleaned);
  console.log('📋 Champs:', Object.keys(cleaned));
  
  return cleaned;
};

/**
 * Supprimer une société
 */
export const deleteSociete = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.SOCIETE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer une société par nom
 */
export const getSocieteByName = async (name) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SOCIETE_BY_NAME(name));
  return response.data;
};

/**
 * Récupérer une société par site web
 */
export const getSocieteByWebsite = async (website) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SOCIETE_BY_WEBSITE(website));
  return response.data;
};

/**
 * Récupérer tous les types de sociétés
 */
export const getTypesSocietes = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.TYPES_SOCIETES);
  return response.data;
};

// ==================== SITES ====================

/**
 * Récupérer tous les sites
 */
export const getSites = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SITES, { params });
  return response.data;
};

/**
 * Récupérer un site par ID
 */
export const getSiteById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SITE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les sites d'une société
 */
export const getSitesBySociete = async (societeId) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SITES_BY_SOCIETE(societeId));
  return response.data;
};

/**
 * Rechercher des sites par nom
 */
export const searchSites = async (nom) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.SITES_SEARCH, { 
    params: { nom } 
  });
  return response.data;
};

/**
 * Créer un site
 */
export const createSite = async (siteData) => {
  const preparedData = prepareSiteData(siteData, false);
  console.log('📤 POST /api/Sites avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.SITES, preparedData);
  return response.data;
};

/**
 * Mettre à jour un site
 */
export const updateSite = async (id, siteData) => {
  const preparedData = prepareSiteData(siteData, true);
  console.log('📤 PUT /api/Sites/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.SITE_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un site
 */
export const deleteSite = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.SITE_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données de site pour l'API
 */
const prepareSiteData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idSite) {
    cleaned.idSite = parseInt(cleaned.idSite, 10);
  }
  if (cleaned.idSociete) {
    cleaned.idSociete = parseInt(cleaned.idSociete, 10);
  }
  
  // Supprimer idSite si c'est une création
  if (!isUpdate || cleaned.idSite === 0) {
    delete cleaned.idSite;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que statut est un boolean
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données site préparées:', cleaned);
  return cleaned;
};

/**
 * Rechercher des utilisateurs par nom
 */
export const searchUsers = async (nom) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.USERS_SEARCH, { 
    params: { nom } 
  });
  return response.data;
};

/**
 * Changer le mot de passe d'un utilisateur
 */
export const changeUserPassword = async (id, currentPassword, newPassword, confirmNewPassword) => {
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.USER_CHANGE_PASSWORD(id), {
    currentPassword,
    newPassword,
    confirmNewPassword
  });
  return response.data;
};

/**
 * Toggle le statut d'un utilisateur (actif/inactif)
 */
export const toggleUserStatus = async (id, statut) => {
  console.log(`📤 PUT /api/Utilisateurs/${id}/statut avec statut:`, statut);
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.USER_TOGGLE_STATUS(id), statut);
  console.log(`✅ Réponse API:`, response.data);
  return response.data;
};

// ==================== ARTICLES ====================

/**
 * Récupérer tous les articles
 */
export const getArticles = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.ARTICLES, { params });
  return response.data;
};

/**
 * Récupérer un article par ID
 */
export const getArticleById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.ARTICLE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les articles d'une société
 */
export const getArticlesBySociete = async (idSociete) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.ARTICLES_BY_SOCIETE(idSociete), {
    // Désactiver le cache pour toujours avoir les données à jour
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    // Ajouter un timestamp pour forcer le rechargement
    params: {
      _t: new Date().getTime()
    }
  });
  return response.data;
};

/**
 * Créer un article
 */
export const createArticle = async (articleData) => {
  const preparedData = prepareArticleData(articleData, false);
  console.log('📤 POST /api/Articles avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.ARTICLES, preparedData);
  return response.data;
};

/**
 * Mettre à jour un article
 */
export const updateArticle = async (id, articleData) => {
  const preparedData = prepareArticleData(articleData, true);
  console.log('📤 PUT /api/Articles/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.ARTICLE_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un article
 */
export const deleteArticle = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.ARTICLE_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données article pour l'API
 */
const prepareArticleData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idArticle) {
    cleaned.idArticle = parseInt(cleaned.idArticle, 10);
  }
  if (cleaned.idSociete) {
    cleaned.idSociete = parseInt(cleaned.idSociete, 10);
  }
  
  // Convertir les décimaux
  if (cleaned.tva !== undefined) {
    cleaned.tva = parseFloat(cleaned.tva) || 0;
  }
  if (cleaned.remise !== undefined) {
    cleaned.remise = parseFloat(cleaned.remise) || 0;
  }
  
  // Supprimer idArticle si c'est une création
  if (!isUpdate || cleaned.idArticle === 0) {
    delete cleaned.idArticle;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que les booleans sont corrects
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  if (cleaned.perissable !== undefined) {
    cleaned.perissable = cleaned.perissable === true || cleaned.perissable === 'true';
  }
  if (cleaned.withStock !== undefined) {
    cleaned.withStock = cleaned.withStock === true || cleaned.withStock === 'true';
  }
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données article préparées:', cleaned);
  return cleaned;
};

// ==================== CLIENTS ====================

/**
 * Préparer les données client pour l'API
 */
const prepareClientData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idClient) {
    cleaned.idClient = parseInt(cleaned.idClient, 10);
  } else {
    cleaned.idClient = 0; // Mettre 0 pour création (ne pas supprimer)
  }
  
  if (cleaned.idSite) {
    cleaned.idSite = parseInt(cleaned.idSite, 10);
  }
  
  // pieceIdentite toujours à null (l'API attend byte[], pas supporté pour l'instant)
  cleaned.pieceIdentite = null;
  
  // Nettoyer les champs vides (sauf idClient, idSite, pieceIdentite, statut)
  Object.keys(cleaned).forEach(key => {
    if (key === 'idClient' || key === 'idSite' || key === 'pieceIdentite' || key === 'statut') {
      return; // Garder ces champs
    }
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que statut est un boolean
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  } else {
    cleaned.statut = true; // Par défaut actif
  }
  
  // Valeurs par défaut pour les champs obligatoires
  if (!cleaned.genre) {
    cleaned.genre = 'Non précisé';
  }
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données client préparées:', cleaned);
  return cleaned;
};

/**
 * Récupérer tous les clients
 */
export const getClients = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENTS, { params });
  return response.data;
};

/**
 * Récupérer un client par ID
 */
export const getClientById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
  return response.data;
};

/**
 * Rechercher des clients
 */
export const searchClients = async (nom = '', email = '') => {
  const params = {};
  if (nom) params.nom = nom;
  if (email) params.email = email;
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.CLIENTS_SEARCH, { params });
  return response.data;
};

/**
 * Créer un client
 */
export const createClient = async (clientData) => {
  const preparedData = prepareClientData(clientData, false);
  
  console.log('📤 POST /api/Clients avec données:', preparedData);
  
  // Envoyer directement les données sans encapsulation
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.CLIENTS, preparedData);
  return response.data;
};

/**
 * Mettre à jour un client
 */
export const updateClient = async (id, clientData) => {
  const preparedData = prepareClientData(clientData, true);
  console.log('📤 PUT /api/Clients/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un client
 */
export const deleteClient = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
  return response.data;
};

// ==================== VUE CLIENTS PAR SITE (OPTIMISÉE) ====================

/**
 * Récupérer tous les clients avec infos site/société (Vue optimisée)
 */
export const getClientsParSite = async (params = {}) => {
  console.log('📊 GET /api/V_ClientsParSite avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_CLIENTS_PAR_SITE, { params });
  return response.data;
};

/**
 * Récupérer un client par ID (Vue optimisée)
 */
export const getClientParSiteById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_CLIENTS_PAR_SITE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les clients d'un site spécifique
 */
export const getClientsParSiteBySite = async (idSite) => {
  console.log('📊 GET /api/V_ClientsParSite/site/' + idSite);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_CLIENTS_PAR_SITE_BY_SITE(idSite));
  return response.data;
};

/**
 * Récupérer les clients d'une société spécifique (⚡ PLUS RAPIDE)
 */
export const getClientsParSiteBySociete = async (idSociete) => {
  console.log('📊 GET /api/V_ClientsParSite/societe/' + idSociete);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_CLIENTS_PAR_SITE_BY_SOCIETE(idSociete));
  return response.data;
};

/**
 * Récupérer les clients par genre
 */
export const getClientsParSiteByGenre = async (genre) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_CLIENTS_PAR_SITE_BY_GENRE(genre));
  return response.data;
};

// ==================== VUE JOURNAL VENTE PAR SITE (STATISTIQUES OPTIMISÉES) ====================

/**
 * Récupérer toutes les ventes par site
 */
export const getJournalVente = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE);
  return response.data;
};

/**
 * Récupérer les ventes avec filtres (site, date, utilisateur)
 */
export const getJournalVenteFilter = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/filter avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_FILTER, { params });
  return response.data;
};

/**
 * Récupérer les statistiques de vente globales
 * @param {object} params - { idSociete, idSite, idUtilisateur }
 */
export const getJournalVenteStats = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/stats avec params:', params);
  
  // Ajouter timestamp pour éviter le cache
  const paramsAvecTimestamp = {
    ...params,
    _t: Date.now()
  };
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_STATS, { 
    params: paramsAvecTimestamp,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer les statistiques de vente pour une date donnée (⚡ OPTIMISÉ DASHBOARD)
 * @param {string} date - Date au format yyyy-MM-dd
 * @param {object} params - {idSite, idUtilisateur} (optionnels)
 */
export const getJournalVenteStatsDate = async (date, params = {}) => {
  console.log(`📊 GET /api/V_JournalVenteParSite/stats/date/${date} avec params:`, params);
  
  // Ajouter timestamp pour éviter le cache
  const paramsAvecTimestamp = {
    ...params,
    _t: Date.now()
  };
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_STATS_DATE(date), { 
    params: paramsAvecTimestamp,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer les ventes groupées par article (TOP articles) ⚡
 */
export const getJournalVenteGroupedByArticle = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/grouped-by-article avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_GROUPED_BY_ARTICLE, { params });
  return response.data;
};

/**
 * Récupérer les ventes par utilisateur et date (⚡ POUR CAISSIER)
 */
export const getJournalVenteUtilisateurDate = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/utilisateur-date avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_UTILISATEUR_DATE, { params });
  return response.data;
};

/**
 * Récupérer le rapport financier (CA, marge, bénéfice) ⚡
 */
export const getJournalVenteRapportFinancier = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/rapport-financier avec params:', params);
  
  // Ajouter timestamp pour éviter le cache
  const paramsAvecTimestamp = {
    ...params,
    _t: Date.now()
  };
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_RAPPORT_FINANCIER, { 
    params: paramsAvecTimestamp,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer les ventes groupées par article pour un gestionnaire (filtré par site)
 */
export const getJournalVenteGroupedByArticleGestionnaire = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/grouped-by-article/gestionnaire avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_GROUPED_BY_ARTICLE_GESTIONNAIRE, { params });
  return response.data;
};

/**
 * Récupérer les ventes avec pagination
 * @param {object} params - { page, pageSize, idSite, dateDebut, dateFin, idUtilisateur }
 */
export const getJournalVentePaged = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/paged avec params:', params);
  
  // Ajouter timestamp pour éviter le cache
  const paramsAvecTimestamp = {
    ...params,
    _t: Date.now()
  };
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_PAGED, { 
    params: paramsAvecTimestamp,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer les ventes par utilisateur et date avec pagination
 * @param {object} params - { page, pageSize, idUtilisateur, dateDebut, dateFin, idSite }
 */
export const getJournalVenteUtilisateurDatePaged = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/utilisateur-date-paged avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_UTILISATEUR_DATE_PAGED, { params });
  return response.data;
};

/**
 * Récupérer les ventes groupées par article avec pagination
 * @param {object} params - { page, pageSize, idUtilisateur, dateDebut, dateFin, idSite }
 */
export const getJournalVenteGroupedByArticlePaged = async (params = {}) => {
  console.log('📊 GET /api/V_JournalVenteParSite/grouped-by-article-paged avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_JOURNAL_VENTE_GROUPED_BY_ARTICLE_PAGED, { params });
  return response.data;
};

// ==================== VUE PAIEMENTS (OPTIMISÉE) ====================

/**
 * Récupérer tous les paiements (avec données complètes client/site/société) ⚡
 */
export const getPaiementsVue = async () => {
  console.log('📊 GET /api/V_Paiement');
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT);
  return response.data;
};

/**
 * Récupérer tous les paiements avec filtres (ALIAS pour JournalPaiements)
 * @param {object} params - { idSociete, idSite, dateDebut, dateFin, modePaiement }
 */
export const getPaiements = async (params = {}) => {
  console.log('💰 GET /api/V_Paiement avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT, { 
    params,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer un paiement par ID (Vue optimisée)
 */
export const getPaiementVueById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_BY_ID(id));
  return response.data;
};

// Alias pour compatibilité
export const getPaiementById = getPaiementVueById;

/**
 * Récupérer les paiements d'un client
 */
export const getPaiementsVueByClient = async (idClient) => {
  console.log('📊 GET /api/V_Paiement/client/' + idClient);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_BY_CLIENT(idClient));
  return response.data;
};

// Alias pour compatibilité
export const getPaiementsByClient = getPaiementsVueByClient;

/**
 * Récupérer les paiements d'une commande
 */
export const getPaiementsVueByCommande = async (idCommande) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_BY_COMMANDE(idCommande));
  return response.data;
};

// Alias pour compatibilité
export const getPaiementsByCommande = getPaiementsVueByCommande;

/**
 * Récupérer les paiements d'un site pour une date donnée
 */
export const getPaiementsVueBySiteDate = async (idSite, date) => {
  console.log(`📊 GET /api/V_Paiement/site/${idSite}/date/${date}`);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_BY_SITE_DATE(idSite, date));
  return response.data;
};

// Alias pour compatibilité
export const getPaiementsBySiteDate = getPaiementsVueBySiteDate;

/**
 * Récupérer les paiements d'un utilisateur pour une date donnée
 */
export const getPaiementsVueByUtilisateurDate = async (idUtilisateur, date) => {
  console.log(`📊 GET /api/V_Paiement/utilisateur/${idUtilisateur}/date/${date}`);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_BY_UTILISATEUR_DATE(idUtilisateur, date));
  return response.data;
};

// Alias pour compatibilité
export const getPaiementsByUtilisateurDate = getPaiementsVueByUtilisateurDate;

/**
 * Calculer la somme des paiements (avec filtres optionnels)
 */
export const getPaiementsSomme = async (params = {}) => {
  console.log('📊 GET /api/V_Paiement/somme avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_SOMME, { params });
  return response.data;
};

/**
 * Récupérer le rapport financier des paiements
 */
export const getPaiementsRapportFinancier = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_RAPPORT_FINANCIER);
  return response.data;
};

/**
 * Récupérer les résultats financiers par site (avec filtres date/période)
 */
export const getPaiementsResultatsParSite = async (params = {}) => {
  console.log('📊 GET /api/V_Paiement/resultats-par-site avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_PAIEMENT_RESULTATS_PAR_SITE, { params });
  return response.data;
};

// ==================== VUE STOCK ARTICLE SITE (OPTIMISÉE) ====================

/**
 * Récupérer tous les stocks avec articles et sites (⚡ ULTRA RAPIDE)
 */
export const getStocksVue = async (params = {}) => {
  console.log('📊 GET /api/V_StockArticleSite avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE, { params });
  return response.data;
};

/**
 * Récupérer un stock par ID (Vue optimisée)
 */
export const getStockVueById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les stocks d'un site (avec articles déjà nommés) ⚡
 */
export const getStocksVueBySite = async (idSite) => {
  console.log('📊 GET /api/V_StockArticleSite/site/' + idSite);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE_BY_SITE(idSite));
  return response.data;
};

/**
 * Récupérer les stocks d'une société (⚡ OPTIMISÉ POUR GESTIONNAIRE)
 */
export const getStocksVueBySociete = async (idSociete) => {
  console.log('📊 GET /api/V_StockArticleSite/societe/' + idSociete);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE_BY_SOCIETE(idSociete));
  return response.data;
};

/**
 * Récupérer les stocks d'un article spécifique
 */
export const getStocksVueByArticle = async (idArticle) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE_BY_ARTICLE(idArticle));
  return response.data;
};

/**
 * Récupérer les stocks en alerte (quantité < seuil) ⚡
 */
export const getStocksVueAlerte = async () => {
  console.log('⚠️ GET /api/V_StockArticleSite/alerte');
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_STOCK_ARTICLE_SITE_ALERTE);
  return response.data;
};

// ==================== VUE UTILISATEURS (OPTIMISÉE) ====================

/**
 * Récupérer tous les utilisateurs (avec site/société inclus) ⚡
 */
export const getUtilisateursVue = async () => {
  console.log('📊 GET /api/V_Utilisateur');
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR);
  return response.data;
};

/**
 * Récupérer un utilisateur par ID (Vue optimisée)
 */
export const getUtilisateurVueById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les utilisateurs d'un site
 */
export const getUtilisateursVueBySite = async (idSite) => {
  console.log('📊 GET /api/V_Utilisateur/site/' + idSite);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR_BY_SITE(idSite));
  return response.data;
};

/**
 * Récupérer les utilisateurs d'une société (⚡ OPTIMISÉ POUR GESTIONNAIRE)
 */
export const getUtilisateursVueBySociete = async (idSociete) => {
  console.log('📊 GET /api/V_Utilisateur/societe/' + idSociete);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR_BY_SOCIETE(idSociete), {
    // Ajouter timestamp pour éviter le cache
    params: {
      _t: Date.now()
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
  return response.data;
};

/**
 * Récupérer les utilisateurs par rôle
 */
export const getUtilisateursVueByRole = async (role) => {
  console.log('📊 GET /api/V_Utilisateur/role/' + role);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR_BY_ROLE(role));
  return response.data;
};

/**
 * Rechercher des utilisateurs (nom, rôle)
 */
export const searchUtilisateursVue = async (params = {}) => {
  console.log('📊 GET /api/V_Utilisateur/search avec params:', params);
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.V_UTILISATEUR_SEARCH, { params });
  return response.data;
};

// ==================== COMMANDES ====================

/**
 * Récupérer toutes les commandes
 */
export const getCommandes = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMANDES, { params });
  return response.data;
};

/**
 * Récupérer une commande par ID
 */
export const getCommandeById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMANDE_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les commandes d'une société
 */
export const getCommandesBySociete = async (idSociete) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMANDES_BY_SOCIETE(idSociete));
  return response.data;
};

/**
 * Rechercher des commandes
 */
export const searchCommandes = async (idClient = null, idUtilisateur = null) => {
  const params = {};
  if (idClient) params.idClient = idClient;
  if (idUtilisateur) params.idUtilisateur = idUtilisateur;
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.COMMANDES_SEARCH, { params });
  return response.data;
};

/**
 * Créer une commande
 */
export const createCommande = async (commandeData) => {
  const preparedData = prepareCommandeData(commandeData, false);
  console.log('📤 POST /api/Commande avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.COMMANDES, preparedData);
  return response.data;
};

/**
 * Mettre à jour une commande
 */
export const updateCommande = async (id, commandeData) => {
  const preparedData = prepareCommandeData(commandeData, true);
  console.log('📤 PUT /api/Commande/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.COMMANDE_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer une commande
 */
export const deleteCommande = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.COMMANDE_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données commande pour l'API
 */
const prepareCommandeData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idCommande) {
    cleaned.idCommande = parseInt(cleaned.idCommande, 10);
  }
  if (cleaned.idClient) {
    cleaned.idClient = parseInt(cleaned.idClient, 10);
  }
  if (cleaned.idUtilisateur) {
    cleaned.idUtilisateur = parseInt(cleaned.idUtilisateur, 10);
  }
  
  // Supprimer idCommande si c'est une création
  if (!isUpdate || cleaned.idCommande === 0) {
    delete cleaned.idCommande;
  }
  
  // Formater dateCommande
  if (cleaned.dateCommande && typeof cleaned.dateCommande === 'string') {
    cleaned.dateCommande = new Date(cleaned.dateCommande).toISOString();
  }
  
  // Nettoyer les champs vides (sauf statut qui peut être une string)
  Object.keys(cleaned).forEach(key => {
    if (key !== 'statut' && (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined)) {
      delete cleaned[key];
    }
  });
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données commande préparées:', cleaned);
  return cleaned;
};

// ==================== LIGNES DE COMMANDE ====================

/**
 * Récupérer toutes les lignes de commande
 */
export const getLignesCommande = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.LIGNES_COMMANDE, { params });
  return response.data;
};

/**
 * Récupérer une ligne de commande par ID
 */
export const getLigneCommandeById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.LIGNE_COMMANDE_BY_ID(id));
  return response.data;
};

/**
 * Rechercher des lignes de commande
 */
export const searchLignesCommande = async (idCommande = null, idCatalogue = null) => {
  const params = {};
  if (idCommande) params.idCommande = idCommande;
  if (idCatalogue) params.idCatalogue = idCatalogue;
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.LIGNES_COMMANDE_SEARCH, { params });
  return response.data;
};

/**
 * Créer une ligne de commande
 */
export const createLigneCommande = async (ligneData) => {
  const preparedData = prepareLigneCommandeData(ligneData, false);
  console.log('📤 POST /api/LigneCommande avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.LIGNES_COMMANDE, preparedData);
  return response.data;
};

/**
 * Mettre à jour une ligne de commande
 */
export const updateLigneCommande = async (id, ligneData) => {
  const preparedData = prepareLigneCommandeData(ligneData, true);
  console.log('📤 PUT /api/LigneCommande/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.LIGNE_COMMANDE_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer une ligne de commande
 */
export const deleteLigneCommande = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.LIGNE_COMMANDE_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données ligne de commande pour l'API
 */
const prepareLigneCommandeData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idLigneCommande) {
    cleaned.idLigneCommande = parseInt(cleaned.idLigneCommande, 10);
  }
  if (cleaned.idCommande) {
    cleaned.idCommande = parseInt(cleaned.idCommande, 10);
  }
  if (cleaned.idStock) {
    cleaned.idStock = parseInt(cleaned.idStock, 10);
  }
  
  // Convertir les décimaux
  if (cleaned.quantite !== undefined) {
    cleaned.quantite = parseFloat(cleaned.quantite) || 0;
  }
  if (cleaned.prixUnitaire !== undefined) {
    cleaned.prixUnitaire = parseFloat(cleaned.prixUnitaire) || 0;
  }
  if (cleaned.tva !== undefined) {
    cleaned.tva = parseFloat(cleaned.tva) || 0;
  }
  if (cleaned.remise !== undefined) {
    cleaned.remise = parseFloat(cleaned.remise) || 0;
  }
  
  // Supprimer idLigneCommande si c'est une création
  if (!isUpdate || cleaned.idLigneCommande === 0) {
    delete cleaned.idLigneCommande;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // S'assurer que statut est un boolean
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // Ajouter les dates
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données ligne commande préparées:', cleaned);
  return cleaned;
};

// ==================== RÉSERVATIONS ====================

/**
 * Récupérer toutes les réservations
 */
export const getReservations = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS, { params });
  return response.data;
};

/**
 * Récupérer une réservation par ID
 */
export const getReservationById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATION_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les réservations d'une société
 */
export const getReservationsBySociete = async (idSociete) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS_BY_SOCIETE(idSociete));
  return response.data;
};

/**
 * Rechercher des réservations
 */
export const searchReservations = async (idArticle = null, dateDebut = null, dateFin = null) => {
  const params = {};
  if (idArticle) params.idArticle = idArticle;
  if (dateDebut) params.dateDebut = dateDebut;
  if (dateFin) params.dateFin = dateFin;
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESERVATIONS_SEARCH, { params });
  return response.data;
};

/**
 * Créer une réservation
 */
export const createReservation = async (reservationData) => {
  const preparedData = prepareReservationData(reservationData, false);
  console.log('📤 POST /api/Reservations avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.RESERVATIONS, preparedData);
  return response.data;
};

/**
 * Mettre à jour une réservation
 */
export const updateReservation = async (id, reservationData) => {
  const preparedData = prepareReservationData(reservationData, true);
  console.log('📤 PUT /api/Reservations/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.RESERVATION_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer une réservation
 */
export const deleteReservation = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.RESERVATION_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données réservation pour l'API
 */
const prepareReservationData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idReservation) {
    cleaned.idReservation = parseInt(cleaned.idReservation, 10);
  }
  if (cleaned.idArticle) {
    cleaned.idArticle = parseInt(cleaned.idArticle, 10);
  }
  
  // Convertir les montants
  if (cleaned.prixUnitaire !== undefined) {
    cleaned.prixUnitaire = parseFloat(cleaned.prixUnitaire) || 0;
  }
  if (cleaned.quantite !== undefined) {
    cleaned.quantite = parseFloat(cleaned.quantite) || 0;
  }
  if (cleaned.montantTotal !== undefined) {
    cleaned.montantTotal = parseFloat(cleaned.montantTotal) || 0;
  }
  if (cleaned.montantAvance !== undefined) {
    cleaned.montantAvance = parseFloat(cleaned.montantAvance) || 0;
  }
  
  // Formater les dates
  ['dateDebut', 'dateFin', 'dateReservation'].forEach(dateField => {
    if (cleaned[dateField] && typeof cleaned[dateField] === 'string') {
      cleaned[dateField] = new Date(cleaned[dateField]).toISOString();
    }
  });
  
  // Supprimer idReservation si c'est une création
  if (!isUpdate || cleaned.idReservation === 0) {
    delete cleaned.idReservation;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Ajouter les dates système
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données réservation préparées:', cleaned);
  return cleaned;
};

// ==================== PAIEMENTS ====================

/**
 * Récupérer tous les paiements (table directe Paiements)
 */
export const getPaiementsDirect = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAIEMENTS, { params });
  return response.data;
};

/**
 * Récupérer un paiement par ID (table directe Paiements)
 */
export const getPaiementDirectById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAIEMENT_BY_ID(id));
  return response.data;
};

/**
 * Récupérer les paiements d'une société (table directe Paiements)
 */
export const getPaiementsBySociete = async (idSociete) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAIEMENTS_BY_SOCIETE(idSociete));
  return response.data;
};

/**
 * Rechercher des paiements
 */
export const searchPaiements = async (idCommande = null, statut = null) => {
  const params = {};
  if (idCommande) params.idCommande = idCommande;
  if (statut) params.statut = statut;
  
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.PAIEMENTS_SEARCH, { params });
  return response.data;
};

/**
 * Créer un paiement
 */
export const createPaiement = async (paiementData) => {
  const preparedData = preparePaiementData(paiementData, false);
  console.log('📤 POST /api/Paiements avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.PAIEMENTS, preparedData);
  return response.data;
};

/**
 * Mettre à jour un paiement
 */
export const updatePaiement = async (id, paiementData) => {
  const preparedData = preparePaiementData(paiementData, true);
  console.log('📤 PUT /api/Paiements/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.PAIEMENT_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un paiement
 */
export const deletePaiement = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.PAIEMENT_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données paiement pour l'API
 */
const preparePaiementData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idPaiement) {
    cleaned.idPaiement = parseInt(cleaned.idPaiement, 10);
  }
  if (cleaned.idCommande) {
    cleaned.idCommande = parseInt(cleaned.idCommande, 10);
  }
  if (cleaned.idReservation) {
    cleaned.idReservation = parseInt(cleaned.idReservation, 10);
  }
  
  // Convertir le montant
  if (cleaned.montant !== undefined) {
    cleaned.montant = parseFloat(cleaned.montant) || 0;
  }
  
  // Formater la date de paiement
  if (cleaned.datePaiement && typeof cleaned.datePaiement === 'string') {
    cleaned.datePaiement = new Date(cleaned.datePaiement).toISOString();
  }
  
  // Supprimer idPaiement si c'est une création
  if (!isUpdate || cleaned.idPaiement === 0) {
    delete cleaned.idPaiement;
  }
  
  // Nettoyer les champs vides (mais pas idReservation si null)
  Object.keys(cleaned).forEach(key => {
    if (key === 'idReservation') {
      // Garder idReservation même si null (paiements de commandes)
      return;
    }
    if (cleaned[key] === '' || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Ajouter les dates système
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données paiement préparées:', cleaned);
  return cleaned;
};

// ==================== STOCKS ====================

/**
 * Récupérer tous les stocks
 */
export const getStocks = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.STOCKS, { params });
  return response.data;
};

/**
 * Récupérer un stock par ID
 */
export const getStockById = async (id) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.STOCK_BY_ID(id));
  return response.data;
};

/**
 * Récupérer le stock d'un article
 */
export const getStockByArticle = async (idArticle) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.STOCK_BY_ARTICLE(idArticle));
  return response.data;
};

/**
 * Créer un stock
 */
export const createStock = async (stockData) => {
  const preparedData = prepareStockData(stockData, false);
  console.log('📤 POST /api/Stocks avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.STOCKS, preparedData);
  return response.data;
};

/**
 * Mettre à jour un stock
 */
export const updateStock = async (id, stockData) => {
  const preparedData = prepareStockData(stockData, true);
  console.log('📤 PUT /api/Stocks/' + id + ' avec:', preparedData);
  
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.STOCK_BY_ID(id), preparedData);
  return response.data;
};

/**
 * Supprimer un stock
 */
export const deleteStock = async (id) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.STOCK_BY_ID(id));
  return response.data;
};

/**
 * Préparer les données stock pour l'API
 */
const prepareStockData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs en number
  if (cleaned.idStock) {
    cleaned.idStock = parseInt(cleaned.idStock, 10);
  }
  if (cleaned.idArticle) {
    cleaned.idArticle = parseInt(cleaned.idArticle, 10);
  }
  if (cleaned.idSite) {
    cleaned.idSite = parseInt(cleaned.idSite, 10);
  }
  if (cleaned.seuilAlerte !== undefined) {
    cleaned.seuilAlerte = parseInt(cleaned.seuilAlerte, 10) || 0;
  }
  
  // Convertir les montants
  if (cleaned.quantiteStock !== undefined) {
    cleaned.quantiteStock = parseFloat(cleaned.quantiteStock) || 0;
  }
  if (cleaned.prixAchat !== undefined) {
    cleaned.prixAchat = parseFloat(cleaned.prixAchat) || 0;
  }
  if (cleaned.prixVentHT !== undefined) {
    cleaned.prixVentHT = parseFloat(cleaned.prixVentHT) || 0;
  }
  
  // Supprimer idStock si c'est une création
  if (!isUpdate || cleaned.idStock === 0) {
    delete cleaned.idStock;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Statut
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // Ajouter les dates système
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données stock préparées:', cleaned);
  return cleaned;
};

// ==================== VENTE (POINT DE VENTE) ====================

/**
 * Enregistrer une vente complète (Client + Commande + Paiement + Lignes)
 */
export const enregistrerVente = async (venteData) => {
  const preparedData = prepareVenteData(venteData);
  console.log('📤 POST /api/Vente/enregistrer avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.VENTE_ENREGISTRER, preparedData);
  return response.data;
};

/**
 * Enregistrer une vente (méthode alternative)
 */
export const enregistrerVenteAlternative = async (venteData) => {
  const preparedData = prepareVenteData(venteData);
  console.log('📤 POST /api/Vente/enregistrer-alternative avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.VENTE_ENREGISTRER_ALTERNATIVE, preparedData);
  return response.data;
};

/**
 * Enregistrer une vente via Stored Procedure (PRIORITAIRE)
 */
export const enregistrerVenteSP = async (venteData) => {
  const preparedData = prepareVenteData(venteData);
  console.log('📤 POST /api/Vente/enregistrer-sp (Stored Procedure) avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.VENTE_ENREGISTRER_SP, preparedData);
  return response.data;
};

/**
 * Valider les données d'une vente avant enregistrement
 */
export const validerVente = async (venteData) => {
  const preparedData = prepareVenteData(venteData);
  console.log('📤 POST /api/Vente/valider avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.VENTE_VALIDER, preparedData);
  return response.data;
};

/**
 * Préparer les données de vente pour l'API
 */
const prepareVenteData = (data) => {
  const cleaned = { ...data };
  
  // Convertir les IDs
  if (cleaned.idSite) cleaned.idSite = parseInt(cleaned.idSite, 10);
  if (cleaned.idUtilisateur) cleaned.idUtilisateur = parseInt(cleaned.idUtilisateur, 10);
  if (cleaned.catalogueId) cleaned.catalogueId = parseInt(cleaned.catalogueId, 10);
  
  // Convertir le montant
  if (cleaned.montant !== undefined) {
    cleaned.montant = parseFloat(cleaned.montant) || 0;
  }
  
  // Formater les dates
  ['dateNaissance', 'dateCommande', 'datePaiement'].forEach(dateField => {
    if (cleaned[dateField] && typeof cleaned[dateField] === 'string') {
      cleaned[dateField] = new Date(cleaned[dateField]).toISOString();
    }
  });
  
  // Préparer les lignes de commande
  if (cleaned.lignesCommandes && Array.isArray(cleaned.lignesCommandes)) {
    cleaned.lignesCommandes = cleaned.lignesCommandes.map(ligne => ({
      idStock: parseInt(ligne.idStock, 10),
      quantite: parseFloat(ligne.quantite) || 0,
      prixUnitaire: parseFloat(ligne.prixUnitaire) || 0,
      tva: parseFloat(ligne.tva) || 0,
      remise: parseFloat(ligne.remise) || 0
    }));
  }
  
  console.log('✅ Données vente préparées:', cleaned);
  return cleaned;
};

// ==================== NOTIFICATIONS ====================

/**
 * Récupérer toutes les notifications
 */
export const getNotifications = async (params = {}) => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS, { params });
  return response.data;
};

/**
 * Récupérer les notifications d'un utilisateur
 */
export const getNotificationsUtilisateur = async (idUtilisateur, nonLusSeulement = false) => {
  const response = await apiClient.get(
    API_CONFIG.ENDPOINTS.NOTIFICATIONS_UTILISATEUR(idUtilisateur),
    { params: { nonLusSeulement } }
  );
  return response.data;
};

/**
 * Créer une notification
 */
export const createNotification = async (notificationData) => {
  const preparedData = prepareNotificationData(notificationData, false);
  console.log('📤 POST /api/Notifications avec:', preparedData);
  
  const response = await apiClient.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS, preparedData);
  return response.data;
};

/**
 * Marquer une notification comme lue
 */
export const marquerNotificationLue = async (id) => {
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.NOTIFICATION_MARQUER_LU(id));
  return response.data;
};

/**
 * Marquer toutes les notifications comme lues
 */
export const marquerToutLu = async (idUtilisateur) => {
  const response = await apiClient.put(API_CONFIG.ENDPOINTS.NOTIFICATIONS_TOUT_LU(idUtilisateur));
  return response.data;
};

/**
 * Purger les anciennes notifications
 */
export const purgerNotifications = async (jours = 30) => {
  const response = await apiClient.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS_PURGE, {
    params: { jours }
  });
  return response.data;
};

/**
 * Préparer les données notification pour l'API
 */
const prepareNotificationData = (data, isUpdate) => {
  const cleaned = { ...data };
  
  // Convertir les IDs
  if (cleaned.idNotification) cleaned.idNotification = parseInt(cleaned.idNotification, 10);
  if (cleaned.idUtilisateur) cleaned.idUtilisateur = parseInt(cleaned.idUtilisateur, 10);
  if (cleaned.idSite) cleaned.idSite = parseInt(cleaned.idSite, 10);
  
  // Convertir boolean
  if (cleaned.isLu !== undefined) {
    cleaned.isLu = cleaned.isLu === true || cleaned.isLu === 'true';
  }
  if (cleaned.statut !== undefined) {
    cleaned.statut = cleaned.statut === true || cleaned.statut === 'true';
  }
  
  // Formater la date de lecture
  if (cleaned.dateLecture && typeof cleaned.dateLecture === 'string') {
    cleaned.dateLecture = new Date(cleaned.dateLecture).toISOString();
  }
  
  // Supprimer idNotification si c'est une création
  if (!isUpdate || cleaned.idNotification === 0) {
    delete cleaned.idNotification;
  }
  
  // Nettoyer les champs vides
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  // Ajouter les dates système
  if (isUpdate) {
    cleaned.dateLastModification = new Date().toISOString();
  } else {
    cleaned.dateCreation = new Date().toISOString();
  }
  
  console.log('✅ Données notification préparées:', cleaned);
  return cleaned;
};

// Export de l'instance axios pour des cas d'usage personnalisés
export { apiClient };

export default {
  // Auth
  login,
  logout,
  
  // Users
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  changeUserPassword,
  toggleUserStatus,
  
  // Roles
  getRoles,
  getRoleById,
  
  // Sociétés
  getSocietes,
  getSocieteById,
  getSocieteByName,
  getSocieteByWebsite,
  createSociete,
  updateSociete,
  deleteSociete,
  getTypesSocietes,
  
  // Sites
  getSites,
  getSiteById,
  getSitesBySociete,
  searchSites,
  createSite,
  updateSite,
  deleteSite,
  
  // Articles
  getArticles,
  getArticleById,
  getArticlesBySociete,
  createArticle,
  updateArticle,
  deleteArticle,
  
  // Clients
  getClients,
  getClientById,
  searchClients,
  createClient,
  updateClient,
  deleteClient,
  
  // Vue Clients par Site (optimisée)
  getClientsParSite,
  getClientParSiteById,
  getClientsParSiteBySite,
  getClientsParSiteBySociete,
  getClientsParSiteByGenre,
  
  // Vue Journal Vente par Site (statistiques optimisées)
  getJournalVente,
  getJournalVenteFilter,
  getJournalVenteStats,
  getJournalVenteStatsDate,
  getJournalVenteGroupedByArticle,
  getJournalVenteGroupedByArticleGestionnaire,
  getJournalVenteUtilisateurDate,
  getJournalVenteRapportFinancier,
  getJournalVentePaged,
  getJournalVenteUtilisateurDatePaged,
  getJournalVenteGroupedByArticlePaged,
  
  // Vue Paiements (optimisée)
  getPaiementsVue,
  getPaiementVueById,
  getPaiementsVueByClient,
  getPaiementsVueByCommande,
  getPaiementsVueBySiteDate,
  getPaiementsVueByUtilisateurDate,
  getPaiementsSomme,
  getPaiementsRapportFinancier,
  getPaiementsResultatsParSite,
  
  // Vue Stock Article Site (optimisée)
  getStocksVue,
  getStockVueById,
  getStocksVueBySite,
  getStocksVueBySociete,
  getStocksVueByArticle,
  getStocksVueAlerte,
  
  // Vue Utilisateurs (optimisée)
  getUtilisateursVue,
  getUtilisateurVueById,
  getUtilisateursVueBySite,
  getUtilisateursVueBySociete,
  getUtilisateursVueByRole,
  searchUtilisateursVue,
  
  // Commandes
  getCommandes,
  getCommandeById,
  getCommandesBySociete,
  searchCommandes,
  createCommande,
  updateCommande,
  deleteCommande,
  
  // Lignes de Commande
  getLignesCommande,
  getLigneCommandeById,
  searchLignesCommande,
  createLigneCommande,
  updateLigneCommande,
  deleteLigneCommande,
  
  // Réservations
  getReservations,
  getReservationById,
  getReservationsBySociete,
  searchReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  
  // Paiements
  getPaiements,
  getPaiementById,
  getPaiementsBySociete,
  searchPaiements,
  createPaiement,
  updatePaiement,
  deletePaiement,
  
  // Stocks
  getStocks,
  getStockById,
  getStockByArticle,
  createStock,
  updateStock,
  deleteStock,
  
  // Vente (Point de Vente)
  enregistrerVente,
  enregistrerVenteAlternative,
  enregistrerVenteSP,
  validerVente,
  
  // Notifications
  getNotifications,
  getNotificationsUtilisateur,
  createNotification,
  marquerNotificationLue,
  marquerToutLu,
  purgerNotifications,
};

