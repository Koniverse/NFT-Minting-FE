import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../../types';
import {generateBoxStyle} from './util';

type Props = ThemeProps;

function Component({className}: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <img className={'__image-background'} src="/images/effects/green-1.png" alt="effect"/>
      <div className={'__text-box'}>
        <img className={'__image'} src="/images/accessories/accessory-2.png" alt="mock up"/>
        <div className={'__text'}>
          Gain early access
          to <span className={'__text-highlight'}>Polkadot Metaverse 2.5D</span> (ETA Q1 2024)
        </div>
      </div>
    </div>
  );
}

export const BoxItem2 = styled(Component)<Props>((theme: Props) => {
  const {theme: { extendToken, token}} = theme;

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
      right: 0,
      width: '100%',
      height: 'auto',
    },

    '.__text-box': {
      ...textBox,
      paddingTop: 118,
      backgroundColor: 'rgba(0, 15, 54, 0.5)',
    },

    '.__image': {
      position: 'absolute',
      left: '100%',
      bottom: '100%',
      marginBottom: -90,
      marginLeft: -350,
    },

    '.__text': {
      ...text
    },

    '.__text-highlight': {
      ...textHighlight
    },

    [`@media(max-width:1599px)`]: {
      height: 400,

      '.__image-background': {
        marginRight: -70,
      },

      '.__image': {
        width: 231,
        height: 'auto',
        marginBottom: -67,
        marginLeft: -250,
      },

      '.__text-box': {
        height: 174,
        paddingTop: 90,
      },
    },
  };
});
