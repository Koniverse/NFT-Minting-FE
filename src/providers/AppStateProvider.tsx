// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useContext, useEffect, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {ApiRx, WsProvider} from "@polkadot/api";
import {useArtZeroApi} from "../hooks/useArtZeroApi";
import {NFTCollection} from "../types";

const _collectionId = '5EcYrfdLPZWHdXWtSdacVQjPfBfUhydzs2CYFwJRUEmdCRZB';
const chainEndpoint = 'wss://ws.test.azero.dev'

export interface AppContextProps {
  children: React.ReactNode;
}

const chainApi = new ApiRx({provider: new WsProvider(chainEndpoint)});

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const [currentAccount, setCurrentAccount] = useLocalStorage('currentAccount');
  const [collectionId, setCollectionId] = useState(_collectionId);
  const [collection, setCollection] = useState<NFTCollection | undefined>()
  const walletContext = useContext(WalletContext);
  const [isApiReady, setIsApiReady] = useState(false);
  const artZeroApi = useArtZeroApi();

  console.log(collection)

  useEffect(() => {
    artZeroApi.fetchCollection(collectionId).then(setCollection);
  }, []);


  useEffect(() => {
    const sub = chainApi.isReady.subscribe((ready) => {
      setIsApiReady(true);
    });

    return () => {
      sub.unsubscribe();
    }
  }, []);
  
  useEffect(() => {
    const walletAccounts = walletContext.accounts;
    if (walletAccounts.length > 0 && (!currentAccount || !walletAccounts)) {
      setCurrentAccount(walletAccounts[0].address);
    }
  }, [currentAccount, setCurrentAccount, walletContext.accounts]);


  return (
    <AppContext.Provider value={{currentAccount, setCurrentAccount, isApiReady: isApiReady, apiRx: chainApi, collection}}>
      {children}
    </AppContext.Provider>
  );
}
