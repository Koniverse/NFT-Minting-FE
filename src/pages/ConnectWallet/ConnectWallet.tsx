import {ThemeProps} from '../../types';
import styled from 'styled-components';
import React, {useContext} from 'react';
import {Button, Image, ModalContext} from '@subwallet/react-ui';
import {SelectAccountTypeModal, SelectAccountTypeModalId} from './SelectAccountTypeModal';
import logo from '../../assets/squircle-logo.svg';
import { EventTitles } from './EventTitles';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const {activeModal, inactiveModal} = useContext(ModalContext);

  return (
    <div className={className}>
      <EventTitles className={'__event-titles'}/>

      <div className={'__logo-wrapper'}>
        <Image className={'__logo'} width={214} height={214} src={logo}/>
      </div>

      <Button className={'general-button general-button-width'} shape={'circle'} onClick={() => {
        activeModal(SelectAccountTypeModalId);
      }}>
        Connect Subwallet
      </Button>

      <SelectAccountTypeModal onCancel={() => {
        inactiveModal(SelectAccountTypeModalId);
      }}/>
    </div>
  );
}

export const ConnectWalletStep = styled(Component)<Props>(({theme}) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__event-titles': {
      marginBottom: 62
    },

    '.__logo-wrapper': {
      marginBottom: 48
    },
  };
});
