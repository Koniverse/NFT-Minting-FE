// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {EvmWallet, Wallet, WalletAccount} from '@subwallet/wallet-connect/types';
import React, {createContext} from 'react';
import {ApiPromise} from '@polkadot/api';
import {CollectionItem, MintCheckResult, MintedNFTItem, NFTCollection, NFTItem} from '../types';
import {NotificationInstance} from '@subwallet/react-ui/es/notification/interface';

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
  currentAddress?: string,
  setCurrentAddress: (address: string) => void,
  currentAccount?: WalletAccount,
  isApiReady: boolean,
  apiPromise?: ApiPromise,
  freeBalance: number,
  collection?: NFTCollection,
  mintedNFTs?: NFTItem[],
  setMintedNFTs: (nfts: NFTItem[]) => void,
}

export interface AppContextType2 {
  currentAddress?: string,
  currentAccount?: WalletAccount,
  mintedNft?: MintedNFTItem,
  campaignId?: number,
  signature?: string,
  userId?: number,
  mintCheckResult?: MintCheckResult,
  isMinted: boolean,
  isMinting: boolean,
  setCurrentAddress: (address: string) => void,
  recipient?: string,
  collectionInfo?: CollectionItem,
  setRecipient: (address: string) => void,
  setIsMinted: (value: boolean) => void,
  setMintedNft: (nft: MintedNFTItem) => void,
}

export const AppContext2 = createContext<AppContextType2>({
  isMinted: false,
  isMinting: false,
  setRecipient: (account: string) => {},
  setCurrentAddress: (account: string) => {},
  setIsMinted: (value: boolean) => {},
  setMintedNft: (nft: MintedNFTItem) => {}
})

export const AppContext = createContext<AppContextType>({
  currentAddress: undefined,
  isApiReady: false,
  freeBalance: 0,
  setCurrentAddress: (account: string) => {},
  setMintedNFTs(nfts: NFTItem[]): void {}
})

export const NotificationContext = createContext<NotificationInstance>({} as unknown as NotificationInstance)

export enum Screens {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export type ScreenContextType = {
  screenType: `${Screens}`
}

export const ScreenContext = createContext<ScreenContextType>({screenType: Screens.XL});
