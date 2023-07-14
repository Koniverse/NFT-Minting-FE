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

export const EventTitles = styled(Component)<Props>(({theme: {extendToken}}: Props) => {

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__first-title': {
      color: extendToken.colorTitle,
      fontSize: 112,
      lineHeight: '84px',
      fontWeight: '900',
      marginBottom: 28,
      letterSpacing: 5.6,
      textTransform: 'uppercase',
    },
    '.__second-title': {
      lineHeight: '84px',
      letterSpacing: 5.6,
      position: 'relative',
      color: '#39384d',
      fontWeight: '900',
      fontSize: 109.16,
      textTransform: 'uppercase',
      marginBottom: 0,
      '-webkit-text-stroke': '5.68px #fff',

      span: {
        position: 'absolute',
        left: 0,
        top: 0,
        '-webkit-text-stroke': 0,
        pointerEvents: 'none',
      }
    },
  };
});
