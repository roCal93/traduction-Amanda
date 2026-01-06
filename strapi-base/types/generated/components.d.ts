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
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
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

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Call-to-action button with customizable style and link';
    displayName: 'Button';
  };
  attributes: {
    icon: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'ghost']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
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
      'blocks.button-block': BlocksButtonBlock;
      'blocks.cards-block': BlocksCardsBlock;
      'blocks.image-block': BlocksImageBlock;
      'blocks.text-block': BlocksTextBlock;
      'blocks.text-image-block': BlocksTextImageBlock;
      'shared.button': SharedButton;
      'shared.page-link': SharedPageLink;
    }
  }
}
