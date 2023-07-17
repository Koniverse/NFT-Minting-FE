import {Button, Image, ModalContext, SwIconProps, SwModal} from '@subwallet/react-ui';
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {WalletContext} from '../../contexts';
import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import ethereumLogo from '../../assets/network/ethereum.png';
import polkadotLogo from '../../assets/network/polkadot.png';
import logo from '../../assets/squircle-logo.svg';
import {generateModalStyle} from '../../utils/styles';
import {HEADER_MENU_MODAL, SELECT_ACCOUNT_TYPE_MODAL} from "../../constants";

export type ActionItemType = {
  key: string,
  icon: SwIconProps['phosphorIcon'],
  iconBackgroundColor: string,
  title: string,
  onClick?: () => void
};

type Props = ThemeProps;

const modalId = SELECT_ACCOUNT_TYPE_MODAL;

function Component({className = ''}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);
  const { inactiveModals } = useContext(ModalContext);
  const [loadingKey, setLoadingKey] = useState<'substrate' | 'evm' | null>(null);

  const onClose = useCallback(() => {
    inactiveModals([modalId, HEADER_MENU_MODAL]);
  }, [inactiveModals])

  const onConnectSubstrateWallet = useCallback(() => {
    setLoadingKey('substrate')
    const wallet = getWalletBySource('subwallet-js');
    walletContext.setWallet(wallet, 'substrate').then(() => {
      onClose();
    }).finally(() => {
      setLoadingKey(null);
    });
  }, [onClose, walletContext]);

  const onConnectEvmWallet = useCallback(() => {
    setLoadingKey('evm')
    const wallet = getEvmWalletBySource('SubWallet');
    walletContext.setWallet(wallet, 'evm').then(() => {
      onClose();
    }).finally(() => {
      setLoadingKey(null);
    });
  }, [onClose, walletContext]);

  return (
    <SwModal
      className={className}
      width={'auto'}
      closable={false}
      id={SELECT_ACCOUNT_TYPE_MODAL}
      onCancel={!loadingKey ? onClose : undefined}
      transitionName='fade'
    >
      <div className={'__content-container'}>
        <div className={'__image-wrapper'}>
          <Image className={'__logo'} width={180} height={180} src={logo}/>
        </div>
        <Button
          loading={loadingKey === 'substrate'}
          disabled={!!loadingKey}
          icon={
            <Image
              src={polkadotLogo}
              shape="circle"
              width={32}
              height={32}
            />
          }
          shape={'circle'} onClick={onConnectSubstrateWallet}
          className={'general-bordered-button general-button-width __button __button-1'}>
          Substrate Account
        </Button>
        <Button
          loading={loadingKey === 'evm'}
          disabled={!!loadingKey}
          icon={
            <Image
              src={ethereumLogo}
              shape="circle"
              width={32}
              height={32}
            />
          }
          shape={'circle'} onClick={onConnectEvmWallet}
          className={'general-bordered-button general-button-width __button __button-2'}>
          EVM Account
        </Button>
      </div>
    </SwModal>
  );
}

export const SelectAccountTypeModal = styled(Component)<Props>((theme: Props) => {
  const {theme: { extendToken}} = theme;

  return ({
    ...generateModalStyle(theme),

    '.__content-container': {
      display: 'flex',
      paddingBottom: 30,
      paddingTop: 30,
      flexDirection: 'column',
      alignItems: 'center',
    },

    '.__image-wrapper': {
      marginBottom: 88,
    },

    '.__button': {
      gap: 10,
    },

    '.__button-1': {
      marginBottom: 24,
    },
  });
});
