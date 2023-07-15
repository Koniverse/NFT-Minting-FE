import {Button, Image, SwIconProps, SwModal} from '@subwallet/react-ui';
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {WalletContext} from '../../contexts';
import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import ethereumLogo from '../../assets/network/ethereum.png';
import polkadotLogo from '../../assets/network/polkadot.png';
import logo from '../../assets/squircle-logo.svg';

export type ActionItemType = {
  key: string,
  icon: SwIconProps['phosphorIcon'],
  iconBackgroundColor: string,
  title: string,
  onClick?: () => void
};

type Props = ThemeProps & {
  onCancel: () => void,
}

export const SelectAccountTypeModalId = 'SelectAccountTypeModalId';

function Component({className = '', onCancel}: Props): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);
  const [loadingKey, setLoadingKey] = useState<'substrate' | 'evm' | null>(null);

  const onConnectSubstrateWallet = useCallback(() => {
    setLoadingKey('substrate')
    const wallet = getWalletBySource('subwallet-js');
    walletContext.setWallet(wallet, 'substrate').then(() => {
      onCancel();
    }).finally(() => {
      setLoadingKey(null);
    });
  }, [walletContext]);

  const onConnectEvmWallet = useCallback(() => {
    setLoadingKey('evm')
    const wallet = getEvmWalletBySource('SubWallet');
    walletContext.setWallet(wallet, 'evm').then(() => {
      onCancel();
    }).finally(() => {
      setLoadingKey(null);
    });
  }, [walletContext]);

  return (
    <SwModal
      className={className}
      width={'auto'}
      closable={false}
      id={SelectAccountTypeModalId}
      onCancel={!loadingKey ? onCancel : undefined}
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

export const SelectAccountTypeModal = styled(Component)<Props>(({theme: {token, logoMap}}: Props) => {
  console.log('theme.logoMap', logoMap);

  return ({
    top: 0,
    maxWidth: 704,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '.ant-sw-modal-content': {
      maxHeight: 700
    },

    '.__content-container': {
      display: 'flex',
      paddingBottom: 30,
      paddingTop: 30,
      flexDirection: 'column',
      alignItems: 'center',
    },

    '.ant-sw-header-container-center .ant-sw-header-center-part': {
      width: 'auto',
      marginLeft: 48,
      marginRight: 48,
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
