import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaServicio {

  /**
   * Configuración de base para alertas que respetan los estilos globales
   * - Desactiva buttonsStyling para usar nuestras clases CSS de styles.css
   */
  private AlertaBase = Swal.mixin({
    customClass: {
      confirmButton: 'boton-crear mx-2', // Usamos la clase de styles.css
      cancelButton: 'boton-eliminar mx-2', // Usamos la clase de styles.css
      popup: 'rounded-xl shadow-2xl border border-gray-100',
      title: 'text-primario font-bold',
      htmlContainer: 'text-gray-600',
      actions: 'pt-4'
    },
    buttonsStyling: false,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    allowOutsideClick: false,
    heightAuto: false // Evita saltos en layouts de Angular
  });

  /**
   * Configuración para notificaciones rápidas (Toasts)
   */
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'rounded-lg shadow-lg'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  /**
   * Muestra una alerta de éxito
   */
  success(message: string, title: string = '¡Completado!') {
    return this.AlertaBase.fire({
      icon: 'success',
      title,
      text: message,
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(message: string, title: string = 'Ha ocurrido un error') {
    return this.AlertaBase.fire({
      icon: 'error',
      title,
      text: message,
    });
  }

  /**
   * Muestra una alerta de advertencia o información
   */
  info(message: string, title: string = 'Información', icon: SweetAlertIcon = 'info') {
    return this.AlertaBase.fire({
      icon,
      title,
      text: message,
    });
  }

  /**
   * Diálogo de confirmación (Retorna true si se confirma, false si se cancela)
   */
  async confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    const result = await this.AlertaBase.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Pone el botón de confirmar a la derecha
    });
    return result.isConfirmed;
  }

  /**
   * Notificación tipo Toast (Esquina superior derecha)
   */
  toast(message: string, icon: SweetAlertIcon = 'success') {
    this.Toast.fire({
      icon,
      title: message
    });
  }

  /**
   * Lanza una alerta personalizada completa si se requiere algo específico
   */
  custom(options: SweetAlertOptions) {
    return this.AlertaBase.fire(options);
  }
}
