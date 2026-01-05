import type { Schema, Struct } from '@strapi/strapi';

export interface SharedNavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_navigation_links';
  info: {
    displayName: 'navigation-link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPageLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_links';
  info: {
    description: 'Link to a page with automatic slug resolution';
    displayName: 'page-link';
  };
  attributes: {
    customLabel: Schema.Attribute.String;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.navigation-link': SharedNavigationLink;
      'shared.page-link': SharedPageLink;
    }
  }
}
