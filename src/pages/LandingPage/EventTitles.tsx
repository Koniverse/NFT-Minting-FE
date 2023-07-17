import styled from 'styled-components';
import React from 'react';
import {ThemeProps} from '../../types';

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
      color: token.colorTextLight1,
      fontSize: 116,
      lineHeight: '87px',
      fontWeight: '900',
      marginBottom: 28,
      letterSpacing: 5.6,
      textTransform: 'uppercase',
      height: 87,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 44,
        marginBottom: 21,
        padding: `0 ${token.paddingXL}px`
      },
    },
    '.__second-title': {
      height: 84,
      lineHeight: '84px',
      letterSpacing: 5.6,
      position: 'relative',
      color: '#38374c',
      fontWeight: '900',
      fontSize: 112,
      textTransform: 'uppercase',
      marginBottom: 0,
      '-webkit-text-stroke': '5.68px #fff',
      textAlign: 'center',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 44,
        lineHeight: '43px',
        padding: `0 ${token.paddingXL}px`
      },

      span: {
        position: 'absolute',
        left: 0,
        top: 0,
        '-webkit-text-stroke': 0,
        pointerEvents: 'none',

        [`@media(max-width:${extendToken.mobileSize})`]: {
          padding: `0 ${token.paddingXL}px`
        },
      }
    },
  };
});
