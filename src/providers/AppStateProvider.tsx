import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AppContext, WalletContext} from '../contexts';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import {CampaignItem, CollectionItem, CurrentAccountData, MintedNFTItem, MintedNftResponse} from '../types';
import {isEthereumAddress} from '@polkadot/util-crypto';
import {APICall} from '../api/nft';
import useNotification from '../hooks/useNotification';

export interface AppContextProps {
  children: React.ReactNode;
}

type GetUserCodeResponse = {
  id: number,
  randomCode: string,
};

type FetchALlCollectionResponseItem = CollectionItem & {
  campaigns: CampaignItem[]
};

type FetchALlCollectionResponse = FetchALlCollectionResponseItem[];

type FetchMintedNftResponse = MintedNftResponse[];

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const walletContext = useContext(WalletContext);
  const notify = useNotification();

  const [isAppReady, setIsAppReady] = useState(false);

  // Account data
  const [currentAddress, setCurrentAddress] = useLocalStorage<string | undefined>('currentAddress');
  const prevAddress = useRef<string | undefined>(currentAddress);
  const [currentAccountData, setCurrentAccountData] = useLocalStorage<CurrentAccountData>('currentAccountData', {});
  const fetchingCodeFor = useRef('');
  const fetchingDataFor = useRef('');
  const [walletAccount, setWalletAccount] = useState<WalletAccount | undefined>(undefined);

  // Collection data
  const [collectionInfo, setCollectionInfo] = useState<CollectionItem | undefined>(undefined);

  // NFT Data
  const [mintedNft, setMintedNft] = useState<MintedNFTItem | undefined>(undefined);

  // Reset data when change current address
  useEffect(() => {
    if (prevAddress.current !== currentAddress) {
      setIsAppReady(false);
      setCurrentAccountData({});
      setMintedNft(undefined);
      prevAddress.current = currentAddress;
    }
  }, [currentAddress]);

  // Init actions
  useEffect(() => {
    APICall.fetchALlCollection()
      .then((rs: FetchALlCollectionResponse) => {
        if (rs && rs.length) {
          const collection = rs[0];
          const now = new Date();
          const campaigns = collection.campaigns;

          // Detect campaign
          campaigns.forEach((c) => {
            campaigns.forEach((c) => {
              c.startTimeObj = new Date(c.startTime);
              c.endTimeObj = new Date(c.endTime);
            });
          })

          let currentCampaign = campaigns.find((c) => {
            return now < c.endTimeObj && now > c.startTimeObj;
          });
          if (!currentCampaign) {
            currentCampaign = campaigns[campaigns.length - 1]
          }

          setCollectionInfo({
            id: collection.id,
            rmrkCollectionId: collection.rmrkCollectionId,
            name: collection.name,
            description: collection.description,
            image: collection.image,
            network: collection.network,
            networkType: collection.networkType,
            networkName: collection.networkName,
            currentCampaignId: currentCampaign?.id || 0,
            currentCampaign: currentCampaign,
            minted: collection.minted
          });
        }
      }).catch((e) => {
      notify({
        message: e.message,
        type: 'error',
        duration: 1.5
      });
    })
  }, [notify]);

  useEffect(() => {
    let cancel = false;
    // Get user random code
    if (fetchingCodeFor.current !== currentAddress && currentAddress && !currentAccountData.userId) {
      fetchingCodeFor.current = currentAddress;
      APICall.getUserRandomCode(currentAddress).then(({id, randomCode}: GetUserCodeResponse) => {
        !cancel && setCurrentAccountData({userId: id, randomCode, signature: undefined});
      }).catch((e) => {
        notify({
          message: e.message,
          type: 'error',
          duration: 1.5
        });
      });
    }

    return () => {
      cancel = true;
    }
  }, [currentAddress, notify]);

  // Fetch minted NFT when selected account
  useEffect(() => {
    let cancel = false;
    // On change account
    if (fetchingDataFor.current !== currentAddress && currentAddress && collectionInfo?.currentCampaignId) {
      fetchingDataFor.current = currentAddress;
      APICall.fetchMintedNft(currentAddress).then((rs: FetchMintedNftResponse) => {
        if (cancel) {
          return;
        }

        const _mintedNft = rs.find(i => i.campaignId === collectionInfo.currentCampaignId);
        if (_mintedNft) {
          setMintedNft(_mintedNft);
        } else {
          setMintedNft(undefined);
        }
      }).catch((e) => {
        notify({
          message: e.message,
          type: 'error',
          duration: 1.5
        });
      }).finally(() => {
        setIsAppReady(true);
      });
    } else {
      setIsAppReady(!!collectionInfo?.currentCampaignId);
    }

    return () => {
      cancel = true;
    }
  }, [collectionInfo?.currentCampaignId, currentAddress, notify]);

  // Todo: Move to wallet context
  const signMessage = useCallback((randomCode: string, cb: (sig: string) => void): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (!currentAddress || !walletContext.walletType) {
        return;
      }

      if (isEthereumAddress(currentAddress)) {
        if (walletContext.walletType === 'evm' && walletContext.evmWallet) {
          walletContext.evmWallet.request({
            method: 'personal_sign',
            params: [randomCode, currentAccountData]
          }).then(rs => {
            cb(rs as string);
            resolve();
          }).catch(reject);
        }
      } else {
        if (walletContext.walletType === 'substrate' && walletContext.wallet) {
          walletContext.wallet.signer?.signRaw?.({
            address: currentAddress,
            type: 'payload',
            data: randomCode
          }).then(rs => {
            cb(rs.signature);
            resolve();
          }).catch(reject);
        }
      }

      return;
    });
  }, [currentAccountData, walletContext.walletType, walletContext.evmWallet, walletContext.wallet]);

  // Update when current account change
  const _setCurrentAddress = useCallback((address: string) => {
    if (address !== currentAddress) {
      setCurrentAccountData({})
      setCurrentAddress(address);
    }
  }, [currentAddress]);

  // Auto select wallet account by current address
  useEffect(() => {
    const walletAccounts = walletContext.accounts;
    let walletAccount: WalletAccount | undefined;

    // Check currentAddress with wallet accounts list
    if (currentAddress) {
      walletAccount = walletAccounts.find((a) => (a.address === currentAddress))
      if (walletAccount) {
        setWalletAccount(walletAccount);
      }
    }

    // Set default account if not found current account
    if (!walletAccount && walletAccounts.length > 0 && (!currentAddress || !walletAccounts)) {
      setWalletAccount(walletAccounts[0]);
      setCurrentAddress(walletAccounts[0].address);
    }
  }, [currentAddress, walletContext.accounts]);

  return (
    <AppContext.Provider value={{
      isAppReady,
      currentAddress,
      currentAccountData,
      walletAccount,
      setCurrentAddress: _setCurrentAddress,
      setCurrentAccountData,
      mintedNft,
      collectionInfo,
      setMintedNft
    }}>
      {children}
    </AppContext.Provider>
  );
}
