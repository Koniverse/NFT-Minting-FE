import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AppContext, WalletContext} from '../contexts';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import {CollectionItem, CurrentAccountData, MintedNFTItem} from '../types';
import {isEthereumAddress} from '@polkadot/util-crypto';
import {APICall} from '../api/nft';

export interface AppContextProps {
  children: React.ReactNode;
}

type GetUserCodeResponse = {
  id: number,
  randomCode: string,
};

type FetchALlCollectionResponseItem = CollectionItem & {
  campaigns: {
    id: number,
    collectionId: number,
    image: string,
    startTime: string,
    endTime: string,
  }[]
};

type MintedNftResponse = {
  id: number,
  campaignId: number,
  collectionId: number,
  userId: number,
  address: string,
  status: 'success' | 'fail' | 'minting' | 'check',
  nftId: number,
  nftName: string,
  nftImage: string,
  receiver: string,
}

type FetchALlCollectionResponse = FetchALlCollectionResponseItem[];

type FetchMintedNftResponse = MintedNftResponse[];

export function AppStateProvider({children}: AppContextProps): React.ReactElement<AppContextProps> {
  const walletContext = useContext(WalletContext);

  // Account data
  const [currentAddress, setCurrentAddress] = useLocalStorage<string|undefined>('currentAddress');
  const [currentAccountData, setCurrentAccountData] = useLocalStorage<CurrentAccountData>('currentAccountData', {});
  const [walletAccount, setWalletAccount] = useState<WalletAccount | undefined>(undefined);

  // Collection data
  const [collectionInfo, setCollectionInfo] = useState<CollectionItem | undefined>(undefined);

  // NFT Data
  const [mintedNft, setMintedNft] = useState<MintedNFTItem | undefined>(undefined);

  // Init actions
  useEffect(() => {
    APICall.fetchALlCollection()
      .then((rs: FetchALlCollectionResponse) => {
        if (rs && rs.length) {
          const collection = rs[0];
          setCollectionInfo({
            id: collection.id,
            rmrkCollectionId: collection.rmrkCollectionId,
            name: collection.name,
            description: collection.description,
            image: collection.image,
            network: collection.network,
            networkType: collection.networkType,
            networkName: collection.networkName,
            currentCampaignId: collection.campaigns[0].id,
          });
        }
      })
  }, []);

  // Fetch minted NFT when selected account
  useEffect(() => {
    let cancel = false;
    if (currentAddress && collectionInfo?.currentCampaignId) {
      APICall.fetchMintedNft(currentAddress).then((rs: FetchMintedNftResponse) => {
        if (cancel) {
          return;
        }

        const _mintedNft = rs.find(i => i.campaignId === collectionInfo.currentCampaignId);
        if (_mintedNft) {
          setMintedNft({
            id: _mintedNft.id,
            name: _mintedNft.nftName,
            image: _mintedNft.nftImage,
            campaignId: _mintedNft.campaignId,
            collectionId: _mintedNft.collectionId,
          });
        } else {
          setMintedNft(undefined);
        }
      });
    }

    return () => {
      cancel = true;
    }
  }, [currentAccountData, collectionInfo?.currentCampaignId, currentAddress]);

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

  useEffect(() => {
    let cancel = false;
    // Get user random code
    if (currentAddress && !currentAccountData.userId) {
      APICall.getUseRandomrCode(currentAddress).then(({id, randomCode}: GetUserCodeResponse) => {
        !cancel && setCurrentAccountData({...currentAccountData, userId: id, randomCode});
      });
    }

    return () => {
      cancel = true;
    }
  }, [currentAccountData, currentAddress]);

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
    //Todo: may consider not use this code (only set account if user do it manually)
    if (!walletAccount && walletAccounts.length > 0 && (!currentAddress || !walletAccounts)) {
      setWalletAccount(walletAccounts[0]);
      setCurrentAddress(walletAccounts[0].address);
    }
  }, [currentAddress, walletContext.accounts]);

  return (
    <AppContext.Provider value={{
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
