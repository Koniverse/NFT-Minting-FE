// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useContext, useEffect, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {ApiPromise, WsProvider} from "@polkadot/api";
import {NFTCollection, NFTItem} from "../types";
import {ArtZeroApi} from "../utils/ArtZeroApi";
import {ENVIRONMENT} from "../utils/environment";

export interface AppContextProps {
  children: React.ReactNode;
}

const chainApi = new ApiPromise({provider: new WsProvider(ENVIRONMENT.CHAIN_ENDPOINT)});

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const [currentAccount, setCurrentAccount] = useLocalStorage('currentAccount');
  const [collectionId, ] = useState(ENVIRONMENT.COLLECTION_ID);
  const [collection, setCollection] = useState<NFTCollection | undefined>()
  const [mintedNFTs, setMintedNFTs] = useState<NFTItem[] | undefined>(undefined);
  const walletContext = useContext(WalletContext);
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    ArtZeroApi.fetchCollection(collectionId).then(setCollection);
  }, [collectionId]);


  useEffect(() => {
    chainApi.isReady.then(() => {
      setIsApiReady(true);
    }).catch((e) => {
      console.error(e);
      setIsApiReady(false);
    });
  }, []);
  
  useEffect(() => {
    const walletAccounts = walletContext.accounts;
    if (walletAccounts.length > 0 && (!currentAccount || !walletAccounts)) {
      setCurrentAccount(walletAccounts[0].address);
    }
  }, [currentAccount, setCurrentAccount, walletContext.accounts]);


  return (
    <AppContext.Provider value={{currentAccount, setCurrentAccount, isApiReady, apiPromise: chainApi, collection, mintedNFTs, setMintedNFTs}}>
      {children}
    </AppContext.Provider>
  );
}
