import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../../types';
import {generateBoxStyle} from './util';

type Props = ThemeProps;

function Component({className}: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <img className={'__image-background'} src="/images/effects/blue-1.png" alt="effect"/>
      <div className={'__text-box'}>
        <div className={'__text'}>
          <img className={'__image'} src="/images/accessories/accessory-1.png" alt="mock up"/>
          Receive premier swag when participating
          in <span className={'__text-highlight'}>Polkadot Decoded 2023</span> Vietnam Satellite Event
        </div>
      </div>
    </div>
  );
}

export const BoxItem1 = styled(Component)<Props>((theme: Props) => {
  const {theme: {extendToken, token}} = theme;

  const {
    container,
    textBox,
    text,
    textHighlight,
  } = generateBoxStyle(theme);

  return {
    ...container,
    '.__image-background': {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: 'auto',
    },

    '.__text-box': {
      ...textBox,
      paddingTop: 78,
      backgroundImage: 'radial-gradient(320.42% 113.05% at -0.00% 0%, #E6007A 0%, #6D3AEE 100%)',
    },

    '.__image': {
      position: 'absolute',
      left: '100%',
      bottom: '100%',
      marginBottom: -70,
      marginLeft: -330,
    },

    '.__text': {
      ...text
    },

    '.__text-highlight': {
      ...textHighlight
    },

    [`@media(max-width:1599px)`]: {
      height: 400,

      '.__image': {
        width: 268,
        marginBottom: -50,
        marginLeft: -242,
      },

      '.__text-box': {
        paddingTop: 56,
        height: 174,
      },
    },
  };
});
