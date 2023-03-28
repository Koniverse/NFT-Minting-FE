import React, {useCallback, useContext} from "react";
import styled from "styled-components";
import CN from 'classnames';
import {SelectModal} from "@subwallet/react-ui";
import {ThemeProps} from "../types";
import {AppContext, WalletContext} from "../contexts";
import {WalletAccount} from "@subwallet/wallet-connect/types";
import AccountCard from "@subwallet/react-ui/es/web3-block/account-card";
import AccountItem from "@subwallet/react-ui/es/web3-block/account-item";
import {toShort} from "@subwallet/react-ui/es/_util/address";


type AccountSelectorProps = ThemeProps;

export function Component({className}: AccountSelectorProps): React.ReactElement {
  const appState = useContext(AppContext);
  const walletState = useContext(WalletContext);

  const renderAccount = useCallback(
    (account: WalletAccount, isSelected: boolean) => {
      return (
        <AccountCard address={account.address} accountName={account.name || ''} avatarIdentPrefix={42}
                     isSelected={isSelected}/>
      );
    },
    [],
  );

  const renderSelectedAccount = useCallback(
      (account: WalletAccount) => {
        return (
          <AccountItem
            className={'selected-account-item'}
            address={account.address}
            renderMiddleItem={() => {
              return <>
                <span className={'__name'}>{account.name}</span>
                <span className={'__address'}>({toShort(account.address, 0, 3)})</span>
              </>
            }}
            avatarSize={20}
            avatarIdentPrefix={0}
          />
        );
      },
      [],
    )
  ;


  return (
    <div className={className}>
      <SelectModal
        id={'account-selector'}
        title={'Select Account'}
        placeholder={'Select Account'}
        items={walletState.accounts}
        itemKey={'address'}
        selected={appState.currentAccount || ''}
        renderSelected={renderSelectedAccount}
        renderItem={renderAccount}
        onSelect={appState.setCurrentAccount}
      />
    </div>
  );
}

export const AccountSelector = styled(Component)<AccountSelectorProps>(({theme}) => {
  const token = theme.token;
  return {
    '.ant-select-modal-input-container': {
      borderRadius: '50px'
    },
    '.ant-select-modal-input-wrapper': {
      padding: '9px !important'
    },

    '.ant-account-item': {
      padding: 0,
      paddingRight: 6,
      '.ant-web3-block-middle-item': {
        width: "auto",
        flexDirection: 'row',
        justifyContent: "flex-start"
      },
    },

    '.selected-account-item': {
      '.__name': {
        color: token.colorText,
        marginRight: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 90,
      },
      '.__address': {
        display: 'inline-block'
      }
      // backgroundColor: 'red'
    }
  }
});