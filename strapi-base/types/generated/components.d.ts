import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksButtonBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_button_blocks';
  info: {
    description: 'One or multiple buttons with alignment';
    displayName: 'Button Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'space-between']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    buttons: Schema.Attribute.Component<'shared.button', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksCardsBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards_blocks';
  info: {
    description: 'Display a grid of cards';
    displayName: 'Cards Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    cards: Schema.Attribute.Relation<'oneToMany', 'api::card.card'> &
      Schema.Attribute.Required;
    columns: Schema.Attribute.Enumeration<['1', '2', '3', '4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'3'>;
  };
}

export interface BlocksCarouselBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_carousel_blocks';
  info: {
    description: 'Carousel with flippable cards';
    displayName: 'Carousel Block';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    autoplayDelay: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1000;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5000>;
    cards: Schema.Attribute.Component<'shared.carousel-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    showControls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndicators: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface BlocksContactFormBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact_form_blocks';
  info: {
    description: 'Contact form with name, email and message fields';
    displayName: 'Contact Form Block';
  };
  attributes: {
    blockAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    description: Schema.Attribute.Text;
    maxWidth: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
    submitButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Envoyer'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Contactez-nous'>;
  };
}

export interface BlocksHeroBlockSimpleText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero_block_simple_texts';
  info: {
    description: 'Hero section with optional title and text content';
    displayName: 'Hero Block Simple Text';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    height: Schema.Attribute.Enumeration<['medium', 'large', 'full']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'large'>;
    textAlignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_blocks';
  info: {
    description: 'Image with caption and alignment';
    displayName: 'Image Block';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large', 'full']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

export interface BlocksTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_blocks';
  info: {
    description: 'Rich text content block';
    displayName: 'Text Block';
  };
  attributes: {
    blockAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full'>;
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    maxWidth: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full'>;
    textAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'justify']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface BlocksTextImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_image_blocks';
  info: {
    description: 'Combine text content with an image side by side';
    displayName: 'Text + Image Block';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'right'>;
    imageSize: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'medium'>;
    roundedImage: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    textAlignment: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'justify']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    verticalAlignment: Schema.Attribute.Enumeration<
      ['top', 'center', 'bottom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
  };
}

export interface BlocksTimelineBlock extends Struct.ComponentSchema {
  collectionName: 'components_common_timeline_blocks';
  info: {
    description: 'A timeline block with steps, images, and descriptions.';
    displayName: 'Timeline Block';
    icon: 'calendar-alt';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.timeline-item', true>;
  };
}

export interface BlocksWorkBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_work_blocks';
  info: {
    description: 'Display work items (projects, case studies, services, etc.) with filtering by category';
    displayName: 'Work Block';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'3'>;
    filterByCategories: Schema.Attribute.Relation<
      'oneToMany',
      'api::work-category.work-category'
    >;
    filterByItemType: Schema.Attribute.Enumeration<
      [
        'all',
        'project',
        'case-study',
        'service',
        'product',
        'article',
        'achievement',
        'custom',
      ]
    > &
      Schema.Attribute.DefaultTo<'all'>;
    layout: Schema.Attribute.Enumeration<['grid', 'masonry', 'list']> &
      Schema.Attribute.DefaultTo<'grid'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<12>;
    showAllCategories: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showFeaturedOnly: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    showFilters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

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
  };
}

export interface SharedTimelineImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_timeline_images';
  info: {
    description: 'An image for the timeline with an optional external link';
    displayName: 'Timeline Image';
    icon: 'image';
  };
  attributes: {
    image: Schema.Attribute.Media & Schema.Attribute.Required;
    link: Schema.Attribute.Component<'shared.external-link', false>;
  };
}

export interface SharedTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_common_timeline_items';
  info: {
    description: 'A single item/step in the timeline.';
    displayName: 'Timeline Item';
    icon: 'dot-circle';
  };
  attributes: {
    date: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Component<'shared.timeline-image', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTimelineImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_timeline_images';
  info: {
    description: 'An image for the timeline with an optional external link';
    displayName: 'Timeline Image';
    icon: 'image';
  };
  attributes: {
    image: Schema.Attribute.Media & Schema.Attribute.Required;
    link: Schema.Attribute.Component<'shared.external-link', false>;
  };
}

export interface SharedTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_common_timeline_items';
  info: {
    description: 'A single item/step in the timeline.';
    displayName: 'Timeline Item';
    icon: 'dot-circle';
  };
  attributes: {
    date: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Component<'shared.timeline-image', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.button-block': BlocksButtonBlock;
      'blocks.cards-block': BlocksCardsBlock;
      'blocks.carousel-block': BlocksCarouselBlock;
      'blocks.contact-form-block': BlocksContactFormBlock;
      'blocks.hero-block-simple-text': BlocksHeroBlockSimpleText;
      'blocks.image-block': BlocksImageBlock;
      'blocks.text-block': BlocksTextBlock;
      'blocks.text-image-block': BlocksTextImageBlock;
      'blocks.timeline-block': BlocksTimelineBlock;
      'blocks.work-block': BlocksWorkBlock;
      'shared.button': SharedButton;
      'shared.carousel-card': SharedCarouselCard;
      'shared.external-link': SharedExternalLink;
      'shared.page-link': SharedPageLink;
      'shared.timeline-image': SharedTimelineImage;
      'shared.timeline-item': SharedTimelineItem;
    }
  }
}
