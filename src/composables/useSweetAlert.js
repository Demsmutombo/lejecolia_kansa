/**
 * Composable pour SweetAlert2 - Alertes élégantes réutilisables
 * Usage: const { showSuccess, showError, showWarning, showWelcome } = useSweetAlert()
 */
import Swal from 'sweetalert2';

export function useSweetAlert() {
  
  /**
   * Alerte de succès
   */
  const showSuccess = (title, text = '', options = {}) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      width: '400px',
      padding: '1.5rem',
      ...options
    });
  };

  /**
   * Alerte d'erreur
   */
  const showError = (title, text = '', options = {}) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      width: '400px',
      padding: '1.5rem',
      ...options
    });
  };

  /**
   * Alerte d'avertissement
   */
  const showWarning = (title, text = '', options = {}) => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#f0ad4e',
      confirmButtonText: 'OK',
      width: '400px',
      padding: '1.5rem',
      ...options
    });
  };

  /**
   * Alerte d'information
   */
  const showInfo = (title, text = '', options = {}) => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonColor: '#5bc0de',
      confirmButtonText: 'OK',
      width: '400px',
      padding: '1.5rem',
      ...options
    });
  };

  /**
   * Message de bienvenue personnalisé avec identité utilisateur
   */
  const showWelcome = (userName, role, societeName = '', options = {}) => {
    const roleText = role === 'superadmin' ? 'Super Administrateur' : 'Gestionnaire';
    const societyText = societeName ? `<small class="text-muted">${societeName}</small>` : '';
    
    return Swal.fire({
      icon: 'success',
      title: `Bienvenue ${userName} !`,
      html: `
        <div class="text-center">
          <p class="mb-1" style="font-size: 0.9rem;">
            <strong>${roleText}</strong>
          </p>
          ${societyText}
        </div>
      `,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      width: '400px',
      padding: '1.5rem',
      customClass: {
        popup: 'swal2-compact',
        title: 'swal2-title-compact'
      },
      ...options
    });
  };

  /**
   * Confirmation avec choix Oui/Non
   */
  const showConfirm = (title, text = '', options = {}) => {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      width: '400px',
      padding: '1.5rem',
      ...options
    });
  };

  /**
   * Alerte de chargement
   */
  const showLoading = (title = 'Chargement en cours...', text = '') => {
    return Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };

  /**
   * Fermer l'alerte en cours
   */
  const close = () => {
    Swal.close();
  };

  /**
   * Toast (notification discrète)
   */
  const showToast = (title, icon = 'success', position = 'top-end') => {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    return Toast.fire({
      icon: icon,
      title: title
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showWelcome,
    showConfirm,
    showLoading,
    showToast,
    close
  };
}

