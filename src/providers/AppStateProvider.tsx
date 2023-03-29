// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useContext, useEffect, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {NFTCollection, NFTItem} from "../types";
import {ENVIRONMENT} from "../utils/environment";
import {APICall} from "../api/client";
import {ChainApiImpl} from "../api/chainApi";
import {WalletAccount} from "@subwallet/wallet-connect/types";

export interface AppContextProps {
  children: React.ReactNode;
}

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const [currentAddress, setCurrentAddress] = useLocalStorage('currentAccount');
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | undefined>(undefined);
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
    currentAddress && APICall.getNFTsByOwnerAndCollection({collection_address: collectionId, owner: currentAddress})
      .then((rs: {ret: NFTItem[]}) => {
        setMintedNFTs(rs.ret)
      });
  }, [collectionId, currentAddress]);

  // Check balance
  useEffect(() => {
    const unsubPromise = currentAddress && ChainApiImpl.subscribeBalance(currentAddress, (balance) => {
      setBalance(balance);
    })

    return () => {
      unsubPromise && unsubPromise.then(unsub => unsub());
    }

    }, [currentAddress]);


  useEffect(() => {
    ChainApiImpl.api.isReady.then(() => {
      setIsApiReady(true);
    }).catch((e) => {
      console.error(e);
      setIsApiReady(false);
    });
  }, []);

  const _setCurrentAddress = useCallback((address: string) => {
    setCurrentAddress(address);
    const currentAccount = walletContext.accounts.find((x) => (x.address === address));
    setCurrentAccount(currentAccount)
  }, [setCurrentAddress, walletContext.accounts])

  useEffect(() => {
    const walletAccounts = walletContext.accounts;
    let currentAccount: WalletAccount | undefined;

    // Check currentAddress with wallet accounts list
    if (currentAddress) {
      currentAccount = walletAccounts.find((a) => (a.address === currentAddress))
      if (currentAccount) {
        setCurrentAccount(currentAccount);
      }
    }

    // Set default account if not found current account
    if (!currentAccount && walletAccounts.length > 0 && (!currentAddress || !walletAccounts)) {
      setCurrentAccount(walletAccounts[0]);
      setCurrentAddress(walletAccounts[0].address);
    }
  }, [currentAddress, setCurrentAddress, walletContext.accounts]);


  return (
    <AppContext.Provider value={{
      currentAddress,
      setCurrentAddress: _setCurrentAddress,
      currentAccount,
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
