import {ThemeProps} from '../types';
import styled from 'styled-components';
import React from 'react';
import {Button} from '@subwallet/react-ui';
import {useNavigate} from 'react-router';
import {EventTitles} from './shared/EventTitles';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <EventTitles/>

      <div className={'__subtitle'}>
        Exclusive for holders of Polkadot ecosystem’s relaychain
        and parachain projects
      </div>

      <div className={'__mint-count'}>
        Already minted: 300
      </div>

      <Button onClick={() => {
        navigate('/connect-wallet');
      }}>
        Mint for Free
      </Button>
    </div>
  );
}

export const Welcome = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__subtitle': {
      fontSize: 32,
      lineHeight: 1.3,
      maxWidth: 1090,
      textAlign: 'center',
    },
    '.__mint-count': {
      fontSize: 48,
      lineHeight: 1.3,
      fontWeight: '700',
      color: token.colorSecondary
    },
  };
});
