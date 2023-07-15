import React, {useCallback, useContext, MouseEventHandler, SyntheticEvent} from 'react';
import styled from 'styled-components';
import {Button, Icon, ModalContext, SwList, SwModal} from '@subwallet/react-ui';
import {ThemeProps} from '../types';
import {AppContext, WalletContext} from '../contexts';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import AccountCard from '@subwallet/react-ui/es/web3-block/account-card';
import {Copy} from 'phosphor-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import CN from 'classnames';
import {HEADER_MENU_MODAL, SELECT_ACCOUNT_MODAL} from "../constants";
import useIsMobileSize from "../hooks/useIsMobileSize";


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
      className={CN(className, 'account-selector-modal')}
      id={modalId}
      onCancel={onClose}
      title={'Select Account'}
      footer={(
        <div className={'__button-wrapper'}>
          <Button shape={'circle'} className={'general-bordered-button general-button-width'}
                  onClick={walletState.disconnectAccount}>
            Disconnect
          </Button>
        </div>
      )}
    >
      <SwList.Section
        list={walletState.accounts}
        renderItem={renderAccount}
        searchMinCharactersCount={2}
      />
    </SwModal>
  );
};

export const AccountSelectorModal = styled(Component)<AccountSelectorModalProps>(({theme: { token }}: AccountSelectorModalProps) => {
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
      },

      '.ant-sw-header-container-center .ant-sw-header-center-part': {
        width: 'auto',
        marginLeft: 48,
        marginRight: 48,
      },

      '.__button-wrapper': {
        display: 'flex',
        justifyContent: 'center'
      },
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
  };
});
