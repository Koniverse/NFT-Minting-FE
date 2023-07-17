import React, {useCallback, useContext} from 'react';
import styled from 'styled-components';
import {Button, Icon, ModalContext, SwList, SwModal} from '@subwallet/react-ui';
import {ThemeProps} from '../types';
import {AppContext, WalletContext} from '../contexts';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import AccountCard from '@subwallet/react-ui/es/web3-block/account-card';
import {X} from 'phosphor-react';
import CN from 'classnames';
import {HEADER_MENU_MODAL, SELECT_ACCOUNT_MODAL} from "../constants";
import useIsMobileSize from "../hooks/useIsMobileSize";
import {Footer} from "./Footer";
import {generateModalStyle} from '../utils/styles';


type AccountSelectorModalProps = ThemeProps;

const modalId = SELECT_ACCOUNT_MODAL;
const menuModalId = HEADER_MENU_MODAL;

export const Component = ({className}: AccountSelectorModalProps): React.ReactElement => {
  const {currentAddress, setCurrentAddress} = useContext(AppContext);
  const walletState = useContext(WalletContext);
  const { inactiveModal, inactiveModals } = useContext(ModalContext);
  const isMobileSize = useIsMobileSize();

  const onSelect = useCallback((account: WalletAccount) => {
    return () => {
      setCurrentAddress(account.address);
      inactiveModals([modalId, menuModalId]);
    }
  }, [setCurrentAddress, inactiveModals])


  const renderAccount = useCallback(
    (account: WalletAccount) => {
      const isSelected = currentAddress === account.address;

      return (
        <AccountCard
          key={account.address}
          address={account.address}
          accountName={account.name || ''} avatarIdentPrefix={42}
          isSelected={isSelected}
          addressPreLength={9}
          addressSufLength={9}
          onPressItem={onSelect(account)}
        />
      );
    },
    [currentAddress, onSelect],
  );

  const onClose = useCallback(() => {
    inactiveModal(modalId)
  }, [inactiveModal])

  return (
    <SwModal
      width={'auto'}
      className={CN(className, 'account-selector-modal', { 'modal-full': isMobileSize })}
      id={modalId}
      onCancel={onClose}
      closable={false}
      transitionName='fade'
    >
      <div className="__body-container">
        <div className="__header">
          <div className="__title">
            Choose Account
          </div>
          <Button
            className={'__closer'}
            icon={(
              <Icon
                phosphorIcon={X}
                iconColor='#E7087B'
                weight='bold'
              />
            )}
            type="ghost"
            onClick={onClose}
            size={isMobileSize ? 'lg' : 'xs'}
          />
        </div>
        <SwList.Section
          displayRow={true}
          list={walletState.accounts}
          renderItem={renderAccount}
          searchMinCharactersCount={2}
          rowGap='16px'
        />

        <div className={'__button-wrapper'}>
          <Button shape={'circle'} className={'general-bordered-button general-button-width'}
                  onClick={walletState.disconnectAccount}>
            Disconnect
          </Button>
        </div>
        { isMobileSize && <Footer className='__footer'/>}
      </div>
    </SwModal>
  );
};

export const AccountSelectorModal = styled(Component)<AccountSelectorModalProps>((theme: AccountSelectorModalProps) => {
  const {theme: { extendToken}} = theme;

  return {
    '&.account-selector-modal': {
      ...generateModalStyle(theme),

      '.__button-wrapper': {
        display: 'flex',
        justifyContent: 'center',
      },

      '.ant-account-card': {
        display: 'flex'
      },

      '.ant-sw-list-section': {
        margin: '0 -16px',

        '.ant-sw-list-wrapper': {
          [`@media(max-width:${extendToken.mobileSize})`]: {
            flexBasis: 'auto'
          },
        }
      }
    },

    '.ant-account-item': {
      padding: 0,
      paddingRight: 6,
      '.ant-web3-block-middle-item': {
        width: 'auto',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      },
    },

    '.__body-container': {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      height: "100%",
      gap: 40,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        gap: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 44,
        paddingBottom: 40,
      },
    },

    '.__title': {
      fontFamily: 'Unbounded',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: '31.2px',
      textTransform: "uppercase"
    },

    '.__header': {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'space-between',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flexDirection: 'column-reverse',
        gap: 52,
        marginBottom: 16
      },
    },
    '.__footer': {
      flex: 1,
      justifyContent: 'end',
      fontWeight: 400,
      lineHeight: 1.15,

      '.__left-part': {
        flex: 'unset'
      }
    }
  };
});
