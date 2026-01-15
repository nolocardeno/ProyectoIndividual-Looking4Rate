import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  // Iconos de navegación y UI (realmente usados)
  faHome,
  faSearch,
  faTimes,
  faChevronDown,
  
  // Iconos de usuario y autenticación
  faUserCircle,
  faSignOutAlt,
  
  // Iconos de acciones
  faCheck,
  faCog,
  faTrash,
  
  // Iconos de gaming
  faGamepad
} from '@fortawesome/free-solid-svg-icons';

// Iconos de marcas (brands) - solo los usados en footer
import {
  faXTwitter,
  faFacebook,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

/**
 * Configura la librería de Font Awesome con SOLO los iconos necesarios
 * para la aplicación Looking4Rate.
 * 
 * OPTIMIZACIÓN: Se eliminaron iconos no utilizados para reducir el bundle size.
 * Solo se incluyen los iconos que realmente aparecen en los templates HTML.
 */
export function configureFontAwesome(library: FaIconLibrary): void {
  library.addIcons(
    // Navegación y UI
    faHome,
    faSearch,
    faTimes,
    faChevronDown,
    
    // Usuario y autenticación
    faUserCircle,
    faSignOutAlt,
    
    // Acciones
    faCheck,
    faCog,
    faTrash,
    
    // Gaming
    faGamepad,
    
    // Marcas (brands) - Footer
    faXTwitter,
    faFacebook,
    faInstagram,
    faYoutube
  );
}
