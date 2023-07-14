// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {EvmWallet, Wallet, WalletAccount} from '@subwallet/wallet-connect/types';
import React, {createContext} from 'react';
import {ApiPromise} from '@polkadot/api';
import {CollectionItem, CurrentAccountData, MintCheckResult, MintedNFTItem, NFTCollection, NFTItem} from '../types';
import {NotificationInstance} from '@subwallet/react-ui/es/notification/interface';

export interface WalletContextInterface {
  wallet?: Wallet,
  evmWallet?: EvmWallet,
  accounts: WalletAccount[],
  setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate'|'evm') => void
  walletType: 'substrate'|'evm';
  signMessage: (address: string, message: string) => Promise<string | null>
  disconnectAccount: () => void,
}

export const WalletContext = React.createContext<WalletContextInterface>({
  accounts: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWallet: (wallet, walletType: 'substrate'|'evm') => {},
  walletType: 'substrate',
  signMessage: async (address: string, message: string) => {
    return null;
  },
  disconnectAccount: () => {},
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
  currentAccountData: CurrentAccountData,
  currentAddress?: string,
  walletAccount?: WalletAccount,
  mintedNft?: MintedNFTItem,
  signature?: string,
  userId?: number,
  collectionInfo?: CollectionItem,
  setCurrentAddress: (address: string) => void,
  setCurrentAccountData: (accountData: CurrentAccountData) => void,
  setMintedNft: (nft: MintedNFTItem) => void
}

export const AppContext = createContext<AppContextType>({
  currentAccountData: {},
  setCurrentAddress: (account: string) => {},
  setCurrentAccountData: (accountData: CurrentAccountData) => {},
  setMintedNft: (nft: MintedNFTItem) => {}
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
