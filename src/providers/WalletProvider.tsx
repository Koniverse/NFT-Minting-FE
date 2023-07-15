// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {getWalletBySource} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import {EvmWallet, Wallet, WalletAccount} from '@subwallet/wallet-connect/types';
import React, {useCallback, useEffect, useState} from 'react';

import {WalletContext, WalletContextInterface} from '../contexts';
import {useLocalStorage} from "../hooks/useLocalStorage";
import {windowReload} from "../utils/window";
import {toShort} from '@subwallet/react-ui/es/_util/address';

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
        setAccounts(_accounts.map(a => ({address: a, name: toShort(a, 8, 8), source: walletKey})));
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

  const signMessage = useCallback(async (address: string, message: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!currentWallet) {
        return null;
      }

      if (walletType === 'evm') {
        if (currentWallet) {
          (currentWallet as EvmWallet).request({
            method: 'personal_sign',
            params: [message, address]
          }).then(rs => {
            resolve(rs as unknown as string);
          }).catch(reject);
        }
      } else {
        if (walletType === 'substrate' && currentWallet) {
          (currentWallet as Wallet).signer?.signRaw?.({
            address: address,
            type: 'payload',
            data: message
          }).then(rs => {
            resolve(rs.signature);
          }).catch(reject);
        }
      }
    });
  }, [currentWallet, walletType]);


  const walletContext: WalletContextInterface = {
    wallet: getWalletBySource(walletKey),
    evmWallet: getEvmWalletBySource(walletKey),
    signMessage,
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
        setCurrentWallet(wallet);
        setTimeout(() => {
          if (wallet && wallet?.installed) {
            // eslint-disable-next-line no-void
            void afterSelectWallet(wallet);
          }
        }, 150);
      } else {
        const evmWallet = getEvmWalletBySource(walletKey);
        setCurrentWallet(evmWallet);
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
