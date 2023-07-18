import {Button, Icon, Image, ModalContext, SwIconProps, SwModal} from '@subwallet/react-ui';
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {WalletContext} from '../../contexts';
import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import SubWalletLogo from '../../assets/subwallet.png';
import {generateModalStyle} from '../../utils/styles';
import {HEADER_MENU_MODAL, SELECT_ACCOUNT_TYPE_MODAL} from "../../constants";
import {X} from "phosphor-react";
import useIsMobileSize from "../../hooks/useIsMobileSize";
import CN from "classnames";
import {Footer} from "../../components/Footer";

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
  const {inactiveModals} = useContext(ModalContext);
  const [loadingKey, setLoadingKey] = useState<'substrate' | 'evm' | null>(null);
  const isMobileSize = useIsMobileSize();

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
      className={CN(className, {'modal-full': isMobileSize})}
      width={'auto'}
      closable={false}
      id={SELECT_ACCOUNT_TYPE_MODAL}
      onCancel={!loadingKey ? onClose : undefined}
      transitionName='fade'
    >
      <div className={'__body-container'}>
        <div className="__header">
          <div className="__title">
            Choose Your Wallet
          </div>
          <Button
            className={'__closer'}
            icon={(
              <Icon
                phosphorIcon={X}
                iconColor='#777'
                weight='bold'
              />
            )}
            type="ghost"
            onClick={onClose}
            size={isMobileSize ? 'lg' : 'xs'}
          />
        </div>
        <div className="__modal-body">
          <Button
            loading={loadingKey === 'substrate'}
            disabled={!!loadingKey}
            size={'lg'}
            contentAlign={'left'}
            type={'dashed'}
            block
            icon={
              <Image
                className={'wallet-logo'}
                src={SubWalletLogo}
                shape="default"
                width={48}
                height={48}
              />
            }
            shape={'default'} onClick={onConnectSubstrateWallet}
            className={'select-account-btn'}>
            SubWallet
          </Button>
          <Button
            loading={loadingKey === 'evm'}
            disabled={!!loadingKey}
            size={'lg'}
            contentAlign={'left'}
            block
            type={'dashed'}
            icon={
              <Image
                className={'wallet-logo'}
                src={SubWalletLogo}
                shape="default"
                width={48}
                height={48}
              />
            }
            shape={'default'} onClick={onConnectEvmWallet}
            className={'select-account-btn'}>
            SubWallet - EVM
          </Button>
        </div>
        {isMobileSize && <Footer className='__footer'/>}
      </div>
    </SwModal>
  );
}

export const SelectAccountTypeModal = styled(Component)<Props>((theme: Props) => {
  const {theme: {token, extendToken}} = theme;

  return ({
    ...generateModalStyle(theme),

    '.__body-container': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 24px 10px',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        height: '100%',
      },
    },

    '.__header': {
      width: '100%',
      display: 'flex',
      marginBottom: 4,

      '.__title': {
        flex: 1,
        fontWeight: 700,
        fontSize: 20,
        lineHeight: '31px',
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        paddingTop: 40,
        gap: 30,
        paddingBottom: 40
      },
    },

    '.__modal-body': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flex: '1 1 200px',
      },
    },


    '.select-account-btn.ant-btn-dashed': {
      padding: 16,
      backgroundColor: '#151515',
      borderRadius: 12,
      height: 72,

      '&:hover': {
        backgroundColor: token.colorPrimary
      }
    },

    '.__footer': {
      paddingTop: 30,
      paddingBottom: 30,
    }
  });
});
