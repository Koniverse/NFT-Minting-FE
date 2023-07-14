// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import {EvmWallet, Wallet, WalletAccount} from '@subwallet/wallet-connect/types';
import React, {useCallback, useEffect, useState} from 'react';

import {WalletContext, WalletContextInterface} from '../contexts';
import {useLocalStorage} from "../hooks/useLocalStorage";
import {windowReload} from "../utils/window";

interface Props {
  children: React.ReactElement;
}

export function WalletProvider({children}: Props) {
  const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
  const [walletType, setWalletType] = useLocalStorage('wallet-type', 'substrate');
  const [currentWallet, setCurrentWallet] = useState<Wallet | EvmWallet | undefined>(getWalletBySource(walletKey));
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);

  const afterSelectWallet = useCallback(
    async (wallet: Wallet) => {
      const infos = await wallet.getAccounts();

      infos && setAccounts(infos);
    },
    []
  );

  const selectWallet = useCallback(
    async (wallet: Wallet) => {
      setCurrentWallet(currentWallet);

      await wallet.enable();
      setWalletKey(wallet.extensionName);

      await afterSelectWallet(wallet);
    },
    [afterSelectWallet, currentWallet, setWalletKey]
  );

  const afterSelectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await wallet?.enable(); // Quick call extension?.request({ method: 'eth_requestAccounts' });
      const _accounts = await wallet?.request({ method: 'eth_accounts' }) as string[];

      if (_accounts) {
        setAccounts(_accounts.map(a => ({address: a, source: walletKey})));
      }
    },
    []
  );

  const selectEvmWallet = useCallback(
    async (wallet: EvmWallet) => {
      await afterSelectEvmWallet(wallet);

      setCurrentWallet(currentWallet);

      setWalletKey(wallet.extensionName);

      //todo: do need reload ?
      // windowReload();
    },
    [afterSelectEvmWallet, currentWallet, setWalletKey]
  );

  const walletContext: WalletContextInterface = {
    wallet: getWalletBySource(walletKey),
    evmWallet: getEvmWalletBySource(walletKey),
    accounts,
    setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate' | 'evm') => {
      if (walletType === 'substrate') {
        wallet && selectWallet(wallet as Wallet);
      } else {
        wallet && selectEvmWallet(wallet as EvmWallet);
      }

      wallet && setWalletType(walletType);
    },
    walletType: walletType as WalletContextInterface['walletType'],
    disconnectAccount: () => {
      window.localStorage.clear();
      windowReload();
    }
  };

  useEffect(() => {
      if (walletType === 'substrate') {
        const wallet = getWalletBySource(walletKey);

        setTimeout(() => {
          if (wallet && wallet?.installed) {
            // eslint-disable-next-line no-void
            void afterSelectWallet(wallet);
          }
        }, 150);
      } else {
        const evmWallet = getEvmWalletBySource(walletKey);

        evmWallet && evmWallet?.isReady.then(() => {
          afterSelectEvmWallet(evmWallet).catch(console.error);
        });
      }
    },
    [afterSelectEvmWallet, afterSelectWallet, walletKey, walletType]);

  return <WalletContext.Provider value={walletContext}>
    {children}
  </WalletContext.Provider>;
}
