/**
 * @fileoverview Resolvers Index - Exportación centralizada de resolvers
 * 
 * Los resolvers se utilizan para precargar datos antes de activar una ruta,
 * asegurando que los datos estén disponibles cuando el componente se inicialice.
 * 
 * @example
 * import { gameResolver, userResolver } from './resolvers';
 */

export {
  GameResolver,
  gameResolver,
  UserResolver,
  userResolver,
  searchResolver,
  type GameData,
  type UserData
} from './data.resolver';
