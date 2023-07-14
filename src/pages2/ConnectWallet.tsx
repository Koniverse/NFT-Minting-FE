import {ThemeProps} from '../types';
import styled from 'styled-components';
import React from 'react';
import {Button, Image} from '@subwallet/react-ui';
import {useNavigate} from 'react-router';
import {EventTitles} from './shared/EventTitles';
import logo from '../assets/squircle-logo.svg';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <EventTitles/>

      <div>
        <Image className={'__logo'} width={214} height={214} src={logo}/>
      </div>

      <Button onClick={() => {
        navigate('/select-account-type');
      }}>
        Connect Subwallet
      </Button>
    </div>
  );
}

export const ConnectWallet = styled(Component)<Props>(({theme}) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };
});
