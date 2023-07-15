import React, {useCallback, useContext, MouseEventHandler, SyntheticEvent} from 'react';
import styled from 'styled-components';
import {Button, Icon, ModalContext, SwList, SwModal} from '@subwallet/react-ui';
import {ThemeProps} from '../types';
import {AppContext, WalletContext} from '../contexts';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import AccountCard from '@subwallet/react-ui/es/web3-block/account-card';
import {Copy, X} from 'phosphor-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import CN from 'classnames';
import {HEADER_MENU_MODAL, SELECT_ACCOUNT_MODAL} from "../constants";
import useIsMobileSize from "../hooks/useIsMobileSize";
import {Footer} from "./Footer";


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

  const onCopy= useCallback((event: SyntheticEvent) => {
    event.stopPropagation();
  }, []);

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
          // renderRightItem={(dItem) => (
          //   <>
          //     {dItem}
          //     <CopyToClipboard text={account.address}>
          //       <Button
          //         icon={
          //           <Icon
          //             phosphorIcon={Copy}
          //             weight={'light'}
          //             size="sm"
          //           />
          //         }
          //         size="xs"
          //         type="ghost"
          //         onClick={onCopy}
          //       />
          //     </CopyToClipboard>
          //   </>
          // )}
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
          list={new Array(5).fill(walletState.accounts).flat()}
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

export const AccountSelectorModal = styled(Component)<AccountSelectorModalProps>(({theme: { token, extendToken }}: AccountSelectorModalProps) => {
  return {
    '&.account-selector-modal': {
      top: 0,
      maxWidth: 704,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      '.ant-sw-modal-content': {
        maxHeight: 700,
        borderRadius: 16,
        boxShadow: '0px 4px 100px 0px rgba(0, 0, 0, 0.40)',

        [`@media(max-width:${extendToken.mobileSize})`]: {
          maxHeight: 'unset',
          borderRadius: 0,
        },
      },

      '.ant-sw-header-container-center .ant-sw-header-center-part': {
        width: 'auto',
        marginLeft: 48,
        marginRight: 48,
      },

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
