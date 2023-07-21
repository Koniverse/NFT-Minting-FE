import {ThemeProps} from '../../types';
import styled from 'styled-components';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Icon, ModalContext} from '@subwallet/react-ui';
import {isWalletInstalled} from '@subwallet/wallet-connect/dotsama/wallets';
import {DOWNLOAD_URL, SELECT_ACCOUNT_TYPE_MODAL} from '../../constants';
import {openInNewTab} from '../../utils/common/browser';
import {EventTitles} from '../EventTitles';
import {Wallet} from 'phosphor-react';
import {AppContext} from '../../contexts';
import {WalletContext} from '../../contexts';
import {isMobile} from "../../utils/environment";

type Props = ThemeProps;

const openLink = function(url: string) {
    window.location.replace(url)
}

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const {collectionInfo} = useContext(AppContext);
  const [isSubWalletInstalled] = useState(isWalletInstalled('subwallet-js'));
  const {activeModal} = useContext(ModalContext);
  const walletContext = useContext(WalletContext);
  const onConnectWallet = useCallback(() => {
    activeModal(SELECT_ACCOUNT_TYPE_MODAL);
  }, [activeModal]);

  useEffect(() => {
    const to = setTimeout(() => {
      if (!walletContext.currentWallet && isSubWalletInstalled) {
        onConnectWallet();
      }
    }, 300);

    return () => {
      clearTimeout(to);
    };
  }, [isSubWalletInstalled, onConnectWallet, walletContext.currentWallet]);

  const onInstallWallet = () => {
    isMobile ? openLink('https://mobile.subwallet.app/browser?url=https%3A%2F%2Fnft.dotinvietnam.com') : openInNewTab(DOWNLOAD_URL)();
  };

  return (
    <div className={className}>
      <EventTitles className={'__event-titles'}/>

      <div className={'__subtitle'}>
        Exclusive for holders of 62 Polkadot ecosystem’s relaychain and parachain projects
      </div>

      <Button
        className={'__button general-button'}
        shape={'circle'}
        icon={<Icon phosphorIcon={Wallet} weight="fill"/>}
        onClick={isSubWalletInstalled ? onConnectWallet : onInstallWallet}
      >
        {isSubWalletInstalled ? 'Connect Subwallet' : isMobile ? 'Open SubWallet' : 'Install Wallet'}
      </Button>

      <div className={'__mint-count'}>
        Already minted: {collectionInfo?.minted}
      </div>
    </div>
  );
}

export const ConnectWallet = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__event-titles': {
      marginBottom: 20,
    },

    '.__subtitle': {
      fontSize: 20,
      color: token.colorTextLight2,
      lineHeight: '28px',
      fontWeight: '700',
      marginBottom: 56,
      textAlign: 'center',
    },

    '.__button': {
      marginBottom: 40,
    },

    '.__mint-count': {
      color: token.colorSuccess,
      fontSize: 16,
      lineHeight: 1.3,
      fontWeight: '700',
    },

    [`@media(max-width:${extendToken.mobileSize})`]: {
      '.__subtitle': {
        fontSize: token.fontSizeLG,
        lineHeight: token.lineHeightLG,
      },
    },
  };
});
