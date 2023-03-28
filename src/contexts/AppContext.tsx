// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createContext, useState} from "react";
import {BaseDotSamaWallet} from "@subwallet/wallet-connect/dotsama/BaseDotSamaWallet";

export interface AppContextProps {
  children: React.ReactNode;
}

export interface WalletAccount {
  name: string,
  address: string,
}
export interface AppContextType {
  walletConnected: boolean,
  setWalletConnected: (rs: boolean) => void,
  accountList: WalletAccount[],
  currentAccount?: string,
  setCurrentAccount: (account: string) => void,
  setAccountList: (accountList: WalletAccount[]) => void,
}

export const AppContext = createContext<AppContextType>({
  walletConnected: false,
  setWalletConnected: (rs: boolean) => {},
  currentAccount: undefined,
  setCurrentAccount(account: string): void {},
  accountList: [],
  setAccountList(accountList: WalletAccount[]): void {},
})

export function AppContextProvider ({ children }: AppContextProps): React.ReactElement<AppContextProps> {
  const [walletConnected, setWalletConnected] = useState<boolean>(false); //Todo: load and save this with localStorage
  const [currentAccount, setCurrentAccount] = useState<string | undefined>('__address1__'); //Todo: load and save this with localStorage
  const [accountList, setAccountList] = useState([{name: 'Account 01', address: '__address1__'}, {name: 'Account 02', address: '__address2__'}]);

  return (
    <AppContext.Provider value={{walletConnected, setWalletConnected, currentAccount, setCurrentAccount, accountList, setAccountList}}>
      {children}
    </AppContext.Provider>
  );
}
