import styled from 'styled-components';
import React from 'react';
import {ThemeProps} from '../types';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className={'__first-title'}>
        Polkadot
      </div>
      <div className={'__second-title'}>
        Power Passport
        <span aria-hidden="true">Power Passport</span>
      </div>
    </div>
  );
}

export const EventTitles = styled(Component)<Props>(({theme: {extendToken, token}}: Props) => {

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__first-title': {
      color: extendToken.colorTitle,
      fontSize: 90,
      lineHeight: 1.2,
      fontWeight: '900',
      textTransform: 'uppercase',
      marginBottom: 4,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 44,
      },
    },
    '.__second-title': {
      letterSpacing: 4.5,
      position: 'relative',
      color: '#3d3d3d',
      fontWeight: '900',
      fontSize: 90,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      marginBottom: 0,
      '-webkit-text-stroke': '5.68px #fff',
      textAlign: 'center',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 44,
        '-webkit-text-stroke': '2px #fff',
      },

      span: {
        position: 'absolute',
        left: 0,
        top: 0,
        '-webkit-text-stroke': 0,
        pointerEvents: 'none',

        [`@media(max-width:${extendToken.mobileSize})`]: {

        },
      }
    },
  };
});
