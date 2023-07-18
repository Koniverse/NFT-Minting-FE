import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../../types';
import {generateBoxStyle} from './util';

type Props = ThemeProps;

function Component({className}: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <img className={'__image-effect'} src="/images/effects/green-2.png" alt="effect"/>
      <div className="bgi-effect-logos"></div>
      <div className={'__text-box'}>
        <img className={'__image'} src="/images/accessories/polkadot.png" alt="mock up"/>

        <div className={'__text'}>
          Gain early access to campaigns
          that <span className={'__text-highlight'}>SubWallet</span> collaborates
          with Polkadot ecosystem projects
        </div>
      </div>
    </div>
  );
}

export const BoxItem3 = styled(Component)<Props>((theme: Props) => {
  const {theme: {extendToken, token}} = theme;

  const {
    container,
    textBox,
    text,
    textHighlight,
  } = generateBoxStyle(theme);

  return {
    ...container,

    '.__image-effect': {
      position: 'absolute',
      zIndex: 2,
      width: 500,
      right: -100,
      transform: 'rotate(-5.253deg)',
      height: 'auto',
    },

    '.bgi-effect-logos': {
      backgroundSize: '100% auto',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
    },

    '.__text-box': {
      ...textBox,
      paddingTop: 60,
      backgroundColor: 'rgba(0, 15, 54, 0.5)',
    },

    '.__image': {
      position: 'absolute',
      right: 60,
      bottom: '100%',
      marginBottom: -46,
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
        width: 116,
        right: 40,
        height: 'auto',
      },

      '.__text-box': {
        height: 174,
      },
    },
  };
});
