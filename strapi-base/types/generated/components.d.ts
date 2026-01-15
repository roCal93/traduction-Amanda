import type { Schema, Struct } from '@strapi/strapi';

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Call-to-action button with customizable style and link';
    displayName: 'Button';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'images'>;
    icon: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedCarouselCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_carousel_cards';
  info: {
    description: 'Card with front and back content for carousel';
    displayName: 'Carousel Card';
  };
  attributes: {
    backContent: Schema.Attribute.Blocks;
    frontContent: Schema.Attribute.Blocks;
    frontTitle: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedExternalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    description: 'A link to an external URL';
    displayName: 'External Link';
    icon: 'external-link-alt';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
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
    section: Schema.Attribute.Relation<'oneToOne', 'api::section.section'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.button': SharedButton;
      'shared.carousel-card': SharedCarouselCard;
      'shared.external-link': SharedExternalLink;
      'shared.page-link': SharedPageLink;
      'shared.timeline-image': SharedTimelineImage;
      'shared.timeline-item': SharedTimelineItem;
    }
  }
}
