import React, {useCallback, useContext} from "react";
import styled from "styled-components";
import {ThemeProps} from "../contexts/ThemeContext";
import CN from 'classnames';
import {SelectModal} from "@subwallet/react-ui";
import {AppContext, WalletAccount} from "../contexts/AppContext";


type AccountSelectorProps = ThemeProps;

export function Component({className}: AccountSelectorProps): React.ReactElement {
  const appState = useContext(AppContext);

  const renderItem = useCallback(
    (account: WalletAccount) => {
      return (
        <div className={'account-item'}>
          <div className={'account-name'}>{account.name}</div>
        </div>
      );
    },
    [],
  );


  return (
    <div className={CN('main-header', className)}>
      <SelectModal
        id={'account-selector'}
        items={appState.accountList}
        itemKey={'address'}
        selected={appState.currentAccount || ''}
        renderItem={renderItem}
        onSelect={appState.setCurrentAccount}
      />
    </div>
  );
}

export const AccountSelector = styled(Component)<AccountSelectorProps>(({theme}) => {
  const token = theme.token;

  return {
    display: "flex",
  }
});