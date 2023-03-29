// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useContext, useEffect, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {NFTCollection, NFTItem} from "../types";
import {ENVIRONMENT} from "../utils/environment";
import {APICall} from "../api/client";
import {ChainApiImpl} from "../api/chainApi";

export interface AppContextProps {
  children: React.ReactNode;
}

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const [currentAccount, setCurrentAccount] = useLocalStorage('currentAccount');
  const [collectionId,] = useState(ENVIRONMENT.COLLECTION_ID);
  const [collection, setCollection] = useState<NFTCollection | undefined>()
  const [mintedNFTs, setMintedNFTs] = useState<NFTItem[] | undefined>(undefined);
  const [balance, setBalance] = useState<number>(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    //Fetching collection info
    collectionId && APICall.getCollectionByAddress({collection_address: collectionId})
      .then((rs: {ret: NFTCollection[]}) => {
        setCollection(rs.ret[0])
      });
  }, [collectionId]);

  useEffect(() => {
    //Fetching minted NFTs
    currentAccount && APICall.getNFTsByOwnerAndCollection({collection_address: collectionId, owner: currentAccount})
      .then((rs: {ret: NFTItem[]}) => {
        setMintedNFTs(rs.ret)
      });
  }, [collectionId, currentAccount]);

  // Check balance
  useEffect(() => {
    const unsubPromise = currentAccount && ChainApiImpl.subscribeBalance(currentAccount, (balance) => {
      setBalance(balance);
    })

    return () => {
      unsubPromise && unsubPromise.then(unsub => unsub());
    }

    }, [currentAccount]);


  useEffect(() => {
    ChainApiImpl.api.isReady.then(() => {
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
    <AppContext.Provider value={{
      currentAccount,
      setCurrentAccount,
      isApiReady,
      apiPromise: ChainApiImpl.api,
      freeBalance: balance,
      collection,
      mintedNFTs,
      setMintedNFTs
    }}>
      {children}
    </AppContext.Provider>
  );
}
