/**
 * Types personnalisés pour l'application
 * 
 * Ce fichier contient les types qui étendent ou complètent les types auto-générés de Strapi
 */

import type { 
  ButtonBlock, 
  CardsBlock, 
  ImageBlock, 
  TextBlock, 
  TextImageBlock 
} from './strapi'

/**
 * Union type pour tous les blocs dynamiques Strapi
 * Chaque bloc a une propriété __component qui permet de le discriminer
 */
export type DynamicBlock =
  | ({ __component: 'blocks.button-block' } & ButtonBlock)
  | ({ __component: 'blocks.cards-block' } & CardsBlock)
  | ({ __component: 'blocks.image-block' } & ImageBlock)
  | ({ __component: 'blocks.text-block' } & TextBlock)
  | ({ __component: 'blocks.text-image-block' } & TextImageBlock)
