/**
 * Types TypeScript générés depuis les schémas Strapi
 * 
 * ⚠️  FICHIER AUTO-GÉNÉRÉ - NE PAS MODIFIER
 * 
 * Pour régénérer: npm run generate:types
 * Généré le: 2026-01-05T12:13:14.436Z
 */

// ============================================================================
// TYPES DE BASE STRAPI
// ============================================================================

export type StrapiID = number;
export type StrapiDateTime = string;
export type StrapiFileUrl = string;
export type StrapiJSON = Record<string, unknown>;

export interface StrapiMedia {
  id: StrapiID;
  url: StrapiFileUrl;
  mime?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  [key: string]: unknown;
}

export interface StrapiMediaFormat {
  url: StrapiFileUrl;
  width: number;
  height: number;
  mime: string;
  [key: string]: unknown;
}

export interface StrapiBlock {
  type: string;
  children?: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

// ============================================================================
// TYPES D'ENVELOPPE STRAPI V5
// ============================================================================

// Strapi v5 : les données sont retournées directement (plus d'attributes)
export interface StrapiEntity {
  id: StrapiID;
  documentId: string;
}

export interface StrapiResponse<T> {
  data: (T & StrapiEntity) | null;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: Array<T & StrapiEntity>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiErrorResponse {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Component: shared.navigation-link
 */
export interface NavigationLink {
  label: string;
  href: string;
}

/**
 * Component: shared.page-link
 */
export interface PageLink {
  page?: (Page & StrapiEntity);
  customLabel?: string;
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

/**
 * card
 */
export interface Card {
  title: string;
  description?: StrapiBlock[];
  image?: StrapiMedia;
  locale?: string;
  localizations?: (Card & StrapiEntity)[];
}
export type CardResponse = StrapiResponse<Card>;
export type CardCollectionResponse = StrapiCollectionResponse<Card>;

/**
 * header
 */
export interface Header {
  logo?: StrapiMedia;
  title?: string;
  navigation?: PageLink[];
  locale?: string;
  localizations?: (Header & StrapiEntity)[];
}
export type HeaderResponse = StrapiResponse<Header>;
export type HeaderCollectionResponse = StrapiCollectionResponse<Header>;

/**
 * page
 */
export interface Page {
  title: string;
  slug: string;
  heroContent?: StrapiBlock[];
  sections?: (Section & StrapiEntity)[];
  seoTitle?: string;
  seoDescription?: StrapiBlock[];
  seoImage?: StrapiMedia;
  noIndex?: boolean;
  locale?: string;
  localizations?: (Page & StrapiEntity)[];
}
export type PageResponse = StrapiResponse<Page>;
export type PageCollectionResponse = StrapiCollectionResponse<Page>;

/**
 * section
 */
export interface Section {
  title: string;
  content: StrapiBlock[];
  image?: StrapiMedia;
  order: number;
  reverse?: boolean;
  locale?: string;
  localizations?: (Section & StrapiEntity)[];
}
export type SectionResponse = StrapiResponse<Section>;
export type SectionCollectionResponse = StrapiCollectionResponse<Section>;
