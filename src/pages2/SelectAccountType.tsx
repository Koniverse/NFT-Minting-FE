import {ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useCallback, useContext} from 'react';
import {Button, Image} from '@subwallet/react-ui';
import {WalletContext} from '../contexts';
import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import logo from '../assets/squircle-logo.svg';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const walletContext = useContext(WalletContext);

  const onConnectSubstrateWallet = useCallback(() => {
    const wallet = getWalletBySource('subwallet-js');
    walletContext.setWallet(wallet, 'substrate');
  }, [walletContext]);

  const onConnectEvmWallet = useCallback(() => {
    const wallet = getEvmWalletBySource('SubWallet');
    walletContext.setWallet(wallet, 'evm');
  }, [walletContext]);

  return (
    <div className={className}>
      <div className={'__box'}>
        <div className={'__image-wrapper'}>
          <Image className={'__logo'} width={180} height={180} src={logo}/>
        </div>
        <Button onClick={onConnectSubstrateWallet} className={'__button __button-1'}>
          Subtrate Account
        </Button>
        <Button onClick={onConnectEvmWallet} className={'__button __button-2'}>
          EVM Account
        </Button>
      </div>
    </div>
  );
}

export const SelectAccountType = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    '.__box': {
      paddingTop: 114,
      paddingBottom: 111,
      maxWidth: 704,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },

    '.__image-wrapper': {
      marginBottom: 88,
    },

    '.__button': {
      width: '100%',
      maxWidth: 396,
    },

    '.__button-1': {
      marginBottom: 24,
    },
  };
});
