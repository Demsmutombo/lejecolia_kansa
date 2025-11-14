/**
 * Store Pinia pour la gestion de l'utilisateur et des rôles
 * Gère l'authentification, les rôles (superadmin/gestionnaire) et la société active
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const SOCIETE_AUTORISEE_ID = 4;
const SOCIETE_AUTORISEE_NOM = 'Lejecolia';

export const useUserStore = defineStore('user', () => {
  // État
  const isLoggedIn = ref(false);
  const role = ref(null); // 'superadmin' | 'gestionnaire' | null
  const roleId = ref(null); // ID du rôle depuis l'API
  const roleName = ref(''); // Nom du rôle depuis l'API
  const token = ref(null);
  const userId = ref(null);
  const userName = ref('');
  const userEmail = ref('');
  const societeId = ref(null);
  const societeName = ref('');
  const userSocietes = ref([]); // Liste des sociétés pour le superadmin

  /**
   * Normaliser le rôle pour déterminer si c'est un superadmin, gestionnaire ou caissier
   * Gère différents formats de l'API
   */
  const normalizeRole = (roleValue, roleNameValue = '') => {
    const roleStr = (roleValue || roleNameValue || '').toString().toLowerCase();
    
    console.log('🔍 Normalisation du rôle:');
    console.log('   - Valeur brute:', roleValue);
    console.log('   - Nom du rôle:', roleNameValue);
    console.log('   - String normalisée:', roleStr);
    
    // Vérifications multiples pour détecter le type de rôle
    const isSuperAdminRole = roleStr.includes('super') || 
                             (roleStr.includes('admin') && !roleStr.includes('caissier')) || 
                             roleStr === 'superadmin' ||
                             roleStr === 'administrateur';
    
    const isCaissierRole = roleStr.includes('caissier') ||
                           roleStr === 'cashier' ||
                           roleStr === 'caisse';
    
    const isGestionnaireRole = roleStr.includes('gestionnaire') ||
                               roleStr.includes('manager') ||
                               roleStr.includes('gerant');
    
    let normalizedRole = 'gestionnaire'; // Par défaut
    
    if (isSuperAdminRole) {
      normalizedRole = 'superadmin';
    } else if (isCaissierRole) {
      normalizedRole = 'caissier';
    } else if (isGestionnaireRole) {
      normalizedRole = 'gestionnaire';
    }
    
    console.log('   ➡️ Rôle normalisé:', normalizedRole);
    
    return normalizedRole;
  };

  // Computed
  const isSuperAdmin = computed(() => role.value === 'superadmin');
  const isGestionnaire = computed(() => role.value === 'gestionnaire');
  const isCaissier = computed(() => role.value === 'caissier');
  const hasMultipleSocietes = computed(() => userSocietes.value.length > 1);

  /**
   * Connexion de l'utilisateur
   */
  const login = (userData) => {
    console.log('🔐 LOGIN - Données reçues:', userData);
    
    isLoggedIn.value = true;
    
    // Gérer le rôle (peut être string ou objet depuis l'API)
    if (typeof userData.role === 'object' && userData.role !== null) {
      console.log('📦 Rôle reçu comme OBJET:', userData.role);
      roleId.value = userData.role.idRole || userData.role.id;
      roleName.value = userData.role.nom || userData.role.name || '';
      role.value = normalizeRole(userData.role.nom, userData.role.name);
    } else {
      console.log('📝 Rôle reçu comme STRING:', userData.role);
      role.value = normalizeRole(userData.role, userData.roleName || userData.role_name);
      roleId.value = userData.roleId || userData.role_id;
      roleName.value = userData.roleName || userData.role_name || '';
    }
    
    console.log('✅ Rôle final stocké:', role.value);
    console.log('   - RoleId:', roleId.value);
    console.log('   - RoleName:', roleName.value);
    
    token.value = userData.token;
    userId.value = userData.id;
    userName.value = userData.name || userData.nom || '';
    userEmail.value = userData.email || '';
    const resolvedSocieteId =
      userData.societeId ??
      userData.idSociete ??
      userData.societeIdActif ??
      userData.societe?.idSociete ??
      SOCIETE_AUTORISEE_ID;

    const resolvedSocieteName =
      userData.societeName ??
      userData.nomSociete ??
      userData.societe?.nomSociete ??
      SOCIETE_AUTORISEE_NOM;

    if (Number(resolvedSocieteId) !== SOCIETE_AUTORISEE_ID) {
      console.error('❌ Société non autorisée, accès refusé:', resolvedSocieteId);
      logout();
      throw new Error('Accès refusé : société non autorisée');
    }

    const resolvedSocietesRaw = Array.isArray(userData.societes) && userData.societes.length
      ? userData.societes.map((societe) => ({
          idSociete: Number(societe.idSociete ?? societe.id ?? societe.ID ?? societe.Id ?? resolvedSocieteId),
          nomSociete: societe.nomSociete ?? societe.nom ?? societe.name ?? resolvedSocieteName,
        }))
      : [
          {
            idSociete: Number(resolvedSocieteId),
            nomSociete: resolvedSocieteName,
          },
        ];

    const filteredSocietes = resolvedSocietesRaw.filter(
      (societe) => Number(societe.idSociete) === SOCIETE_AUTORISEE_ID
    );

    societeId.value = SOCIETE_AUTORISEE_ID;
    societeName.value = SOCIETE_AUTORISEE_NOM;
    userSocietes.value = filteredSocietes.length
      ? filteredSocietes
      : [
          {
            idSociete: SOCIETE_AUTORISEE_ID,
            nomSociete: SOCIETE_AUTORISEE_NOM,
          },
        ];

    // Sauvegarder dans sessionStorage
    sessionStorage.setItem('user', JSON.stringify({
      isLoggedIn: true,
      role: role.value,
      roleId: roleId.value,
      roleName: roleName.value,
      token: token.value,
      userId: userId.value,
      userName: userName.value,
      userEmail: userEmail.value,
      societeId: SOCIETE_AUTORISEE_ID,
      societeName: SOCIETE_AUTORISEE_NOM,
      societes: userSocietes.value,
    }));
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = () => {
    console.log('🔓 Déconnexion en cours...');
    
    isLoggedIn.value = false;
    role.value = null;
    roleId.value = null;
    roleName.value = '';
    token.value = null;
    userId.value = null;
    userName.value = '';
    userEmail.value = '';
    societeId.value = null;
    societeName.value = '';
    userSocietes.value = [];

    // Nettoyer COMPLÈTEMENT le sessionStorage
    sessionStorage.clear();
    
    console.log('✅ Session nettoyée');
  };

  /**
   * Restaurer la session depuis sessionStorage
   */
  const restoreSession = () => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        isLoggedIn.value = userData.isLoggedIn || false;
        role.value = userData.role;
        roleId.value = userData.roleId;
        roleName.value = userData.roleName || '';
        token.value = userData.token;
        userId.value = userData.userId;
        userName.value = userData.userName || '';
        userEmail.value = userData.userEmail || '';
        if (Number(userData.societeId) !== SOCIETE_AUTORISEE_ID) {
          console.warn('⚠️ Session restaurée avec une société non autorisée. Déconnexion forcée.');
          logout();
          return;
        }

        const restoredSocietesRaw = Array.isArray(userData.societes) && userData.societes.length
          ? userData.societes.map((societe) => ({
              idSociete: Number(societe.idSociete ?? societe.id ?? societe.ID ?? societe.Id ?? SOCIETE_AUTORISEE_ID),
              nomSociete: societe.nomSociete ?? societe.nom ?? societe.name ?? SOCIETE_AUTORISEE_NOM,
            }))
          : [
              {
                idSociete: Number(userData.societeId ?? SOCIETE_AUTORISEE_ID),
                nomSociete: userData.societeName ?? SOCIETE_AUTORISEE_NOM,
              },
            ];

        const restoredSocietes = restoredSocietesRaw.filter(
          (societe) => Number(societe.idSociete) === SOCIETE_AUTORISEE_ID
        );

        societeId.value = SOCIETE_AUTORISEE_ID;
        societeName.value = SOCIETE_AUTORISEE_NOM;
        userSocietes.value = restoredSocietes.length
          ? restoredSocietes
          : [
              {
                idSociete: SOCIETE_AUTORISEE_ID,
                nomSociete: SOCIETE_AUTORISEE_NOM,
              },
            ];

        sessionStorage.setItem('user', JSON.stringify({
          isLoggedIn: isLoggedIn.value,
          role: role.value,
          roleId: roleId.value,
          roleName: roleName.value,
          token: token.value,
          userId: userId.value,
          userName: userName.value,
          userEmail: userEmail.value,
          societeId: SOCIETE_AUTORISEE_ID,
          societeName: SOCIETE_AUTORISEE_NOM,
          societes: userSocietes.value,
        }));
      } catch (error) {
        console.error('Erreur lors de la restauration de la session:', error);
        logout();
      }
    }
  };

  /**
   * Changer de société (pour le superadmin)
   */
  const changeSociete = (newSocieteId, newSocieteName) => {
    const numericSocieteId = Number(newSocieteId);
    if (numericSocieteId !== SOCIETE_AUTORISEE_ID) {
      console.warn('⚠️ Changement de société refusé: seule la société autorisée est accessible.', newSocieteId);
      return;
    }

    const resolvedName =
      newSocieteName ??
      userSocietes.value.find((societe) => Number(societe.idSociete) === numericSocieteId)?.nomSociete ??
      SOCIETE_AUTORISEE_NOM;

    societeId.value = SOCIETE_AUTORISEE_ID;
    societeName.value = SOCIETE_AUTORISEE_NOM;

    const savedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    savedUser.societeId = SOCIETE_AUTORISEE_ID;
    savedUser.societeName = SOCIETE_AUTORISEE_NOM;
    savedUser.societes = userSocietes.value;
    sessionStorage.setItem('user', JSON.stringify(savedUser));
  };

  /**
   * Vérifier si l'utilisateur peut accéder à une fonctionnalité
   */
  const canAccess = (requiredRole) => {
    if (!isLoggedIn.value) return false;
    if (requiredRole === 'superadmin') {
      return isSuperAdmin.value;
    }
    return true; // Les autres rôles peuvent accéder aux fonctionnalités de base
  };

  // Restaurer la session au chargement
  restoreSession();

  return {
    // État
    isLoggedIn,
    role,
    roleId,
    roleName,
    token,
    userId,
    userName,
    userEmail,
    societeId,
    societeName,
    userSocietes,
    
    // Computed
    isSuperAdmin,
    isGestionnaire,
    isCaissier,
    hasMultipleSocietes,
    
    // Actions
    login,
    logout,
    restoreSession,
    changeSociete,
    canAccess
  };
});

