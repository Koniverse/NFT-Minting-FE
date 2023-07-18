import React, {useCallback, useContext} from 'react';
import styled from 'styled-components';
import {Button, Icon, ModalContext, SwList, SwModal} from '@subwallet/react-ui';
import {ThemeProps} from '../types';
import {AppContext, WalletContext} from '../contexts';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import AccountCard from '@subwallet/react-ui/es/web3-block/account-card';
import {Plugs, X} from 'phosphor-react';
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
          addressPreLength={isMobileSize ? 12 : 18}
          addressSufLength={isMobileSize ? 12 : 18}
          onPressItem={onSelect(account)}
        />
      );
    },
    [currentAddress, isMobileSize, onSelect],
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
                iconColor='#777'
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
          rowGap='12px'
        />

        <div className={'__button-wrapper'}>
          <Button shape={'circle'}
                  className={'general-button'}
                  icon={<Icon phosphorIcon={Plugs} weight={'fill'}/>}
                  schema={'primary'}
                  size={'sm'}
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
  const {theme: { token, extendToken}} = theme;

  return {
    '&.account-selector-modal': {
      ...generateModalStyle(theme),

      '.__button-wrapper': {
        display: 'flex',
        justifyContent: 'center',
      },

      '.ant-account-card': {
        backgroundColor: '#151515',
        display: 'flex',
        padding: 20,
        transition: 'background-color 0.3s ease',

        '&:hover': {
          backgroundColor: 'rgba(15,15,15,0.3)',
        },

        '.ant-account-card-address': {
          fontWeight: 300,
        }
      },

      '.ant-sw-list-section': {
        margin: '0 8px',

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
      gap: 24,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        gap: 32,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 44,
        paddingBottom: 40,
      },
    },

    '.__title': {
      fontWeight: 700,
      fontSize: 20,
      lineHeight: '31px',
    },

    '.__header': {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'space-between',
      padding: "0px 24px",

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flexDirection: 'column-reverse',
        gap: 24,
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
