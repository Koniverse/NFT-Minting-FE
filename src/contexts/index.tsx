// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wallet, WalletAccount } from '@subwallet/wallet-connect/types';
import { EvmWallet } from '@subwallet/wallet-connect/types';
import React, {createContext} from 'react';
import {ApiPromise} from "@polkadot/api";
import {NFTCollection, NFTItem} from "../types";

export interface WalletContextInterface {
  wallet?: Wallet,
  evmWallet?: EvmWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
  walletType: 'substrate'|'evm';
}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet, walletType: 'substrate'|'evm') => {},
  walletType: 'substrate'
});

interface OpenSelectWalletInterface {
  isOpen: boolean,
  open: () => void
  close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
  isOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  open: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {}
});

export interface AppContextType {
  currentAccount?: string,
  setCurrentAccount: (account: string) => void,
  isApiReady: boolean,
  apiPromise?: ApiPromise,
  collection?: NFTCollection,
  mintedNFTs?: NFTItem[],
  setMintedNFTs: (nfts: NFTItem[]) => void
}

export const AppContext = createContext<AppContextType>({
  currentAccount: undefined,
  isApiReady: false,
  setCurrentAccount: (account: string) => {},
  setMintedNFTs(nfts: NFTItem[]): void {},
})