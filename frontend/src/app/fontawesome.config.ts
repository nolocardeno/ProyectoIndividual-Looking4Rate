import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  // Iconos de navegación y UI
  faHome,
  faSearch,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
  faArrowRight,
  faAngleDown,
  faAngleUp,
  
  // Iconos de usuario y autenticación
  faUser,
  faUserCircle,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faLock,
  faEnvelope,
  
  // Iconos de acciones
  faPlus,
  faMinus,
  faEdit,
  faTrash,
  faSave,
  faCheck,
  faCog,
  faEllipsisV,
  faEllipsisH,
  faShare,
  faDownload,
  faUpload,
  
  // Iconos de rating y favoritos
  faStar,
  faStarHalfAlt,
  faHeart,
  faThumbsUp,
  faThumbsDown,
  
  // Iconos de gaming
  faGamepad,
  faDesktop,
  faLaptop,
  faMobileAlt,
  
  // Información
  faInfoCircle,
  faQuestionCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faBell,
  faComment,
  faComments,
  
  // Iconos de lista y vista
  faList,
  faTh,
  faThLarge,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  
  // Iconos de tiempo y calendario
  faClock,
  faCalendar,
  faCalendarAlt,
  
  // Iconos de media
  faPlay,
  faPause,
  faStop,
  faImage,
  faImages,
  faVideo,
  
  // Iconos varios
  faGlobe,
  faLink,
  faTag,
  faTags,
  faBookmark,
  faFire,
  faTrophy,
  faCrown,
  faMedal,
  faEye,
  faEyeSlash,
  faSpinner,
  faCircleNotch,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';

// Iconos de marcas (brands)
import {
  faPlaystation,
  faXbox,
  faSteam,
  faWindows,
  faApple,
  faAndroid,
  faLinux,
  faTwitter,
  faXTwitter,
  faFacebook,
  faInstagram,
  faYoutube,
  faDiscord,
  faTwitch,
  faGithub,
  faGoogle
} from '@fortawesome/free-brands-svg-icons';

/**
 * Configura la librería de Font Awesome con todos los iconos necesarios
 * para la aplicación Looking4Rate
 */
export function configureFontAwesome(library: FaIconLibrary): void {
  library.addIcons(
    // Navegación y UI
    faHome,
    faSearch,
    faBars,
    faTimes,
    faChevronDown,
    faChevronUp,
    faChevronLeft,
    faChevronRight,
    faArrowLeft,
    faArrowRight,
    faAngleDown,
    faAngleUp,
    
    // Usuario y autenticación
    faUser,
    faUserCircle,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faLock,
    faEnvelope,
    
    // Acciones
    faPlus,
    faMinus,
    faEdit,
    faTrash,
    faSave,
    faCheck,
    faCog,
    faEllipsisV,
    faEllipsisH,
    faShare,
    faDownload,
    faUpload,
    
    // Rating y favoritos
    faStar,
    faStarHalfAlt,
    faHeart,
    faThumbsUp,
    faThumbsDown,
    
    // Gaming
    faGamepad,
    faDesktop,
    faLaptop,
    faMobileAlt,
    
    // Información
    faInfoCircle,
    faQuestionCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faBell,
    faComment,
    faComments,
    
    // Lista y vista
    faList,
    faTh,
    faThLarge,
    faFilter,
    faSort,
    faSortUp,
    faSortDown,
    
    // Tiempo y calendario
    faClock,
    faCalendar,
    faCalendarAlt,
    
    // Media
    faPlay,
    faPause,
    faStop,
    faImage,
    faImages,
    faVideo,
    
    // Varios
    faGlobe,
    faLink,
    faTag,
    faTags,
    faBookmark,
    faFire,
    faTrophy,
    faCrown,
    faMedal,
    faEye,
    faEyeSlash,
    faSpinner,
    faCircleNotch,
    faMoon,
    faSun,
    
    // Marcas (brands)
    faPlaystation,
    faXbox,
    faSteam,
    faWindows,
    faApple,
    faAndroid,
    faLinux,
    faTwitter,
    faXTwitter,
    faFacebook,
    faInstagram,
    faYoutube,
    faDiscord,
    faTwitch,
    faGithub,
    faGoogle
  );
}
