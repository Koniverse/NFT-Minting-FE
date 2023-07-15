import {ThemeProps} from '../../types';
import styled from 'styled-components';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Image, ModalContext} from '@subwallet/react-ui';
import {SelectAccountTypeModal, SelectAccountTypeModalId} from './SelectAccountTypeModal';
import logo from '../../assets/squircle-logo.svg';
import {EventTitles} from './EventTitles';
import {isWalletInstalled} from '@subwallet/wallet-connect/dotsama/wallets';
import {openInNewTab} from '../../utils/common/browser';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const [isSubWalletInstalled] = useState(isWalletInstalled('subwallet-js'));
  const {activeModal, inactiveModal} = useContext(ModalContext);
  const onConnectWallet = useCallback(() => {
    activeModal(SelectAccountTypeModalId);
  }, [activeModal])

  useEffect(() => {
    if (isSubWalletInstalled) {
      onConnectWallet();
    }
  }, [isSubWalletInstalled, onConnectWallet]);

  const onInstallWallet = () => {
    openInNewTab('https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn')();
  };

  return (
    <div className={className}>
      <EventTitles className={'__event-titles'}/>

      <div className={'__logo-wrapper'}>
        <Image className={'__logo'} width='var(--logo-size)' height='var(--logo-size)' src={logo}/>
      </div>

      <Button className={'general-button general-button-width'} shape={'circle'}
              onClick={isSubWalletInstalled ? onConnectWallet : onInstallWallet}
      >
        {isSubWalletInstalled ? 'Connect Subwallet' : 'Install Wallet'}
      </Button>

      <SelectAccountTypeModal onCancel={() => {
        inactiveModal(SelectAccountTypeModalId);
      }}/>
    </div>
  );
}

export const ConnectWallet = styled(Component)<Props>(({theme: { extendToken }}: Props) => {
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

    '.__logo': {
      '--logo-size': 214,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        '--logo-size': 144,
      }
    }
  };
});
