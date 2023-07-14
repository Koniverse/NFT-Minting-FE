import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AppContext2, WalletContext} from '../contexts';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {WalletAccount} from '@subwallet/wallet-connect/types';
import {CollectionItem, MintCheckResult, MintedNFTItem} from '../types';
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
  const [currentAddress, setCurrentAddress] = useLocalStorage('currentAccount');
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | undefined>(undefined);
  const [mintedNft, setMintedNft] = useState<MintedNFTItem | undefined>(undefined);
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);
  const [collectionInfo, setCollectionInfo] = useState<CollectionItem | undefined>(undefined);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [mintCheckResult, setMintCheckResult] = useState<MintCheckResult| undefined>(undefined);
  const [isMinted, setIsMinted] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isCheckFetchMintedNftDone, setIsCheckFetchMintedNftDone] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    // todo: will update logic for this (time check)
    APICall.fetchALlCollection().then((rs: FetchALlCollectionResponse) => {
      if (rs && rs.length) {
        setCollectionInfo({
          id: rs[0].id,
          address: rs[0].address,
          name: rs[0].name,
          description: rs[0].description,
          image: rs[0].image,
          network: rs[0].network,
          networkType: rs[0].networkType,
          networkName: rs[0].networkName,
        });

        if (rs[0].campaigns && rs[0].campaigns.length) {
          setCampaignId(rs[0].campaigns[0].id);
        }
      }
    })
  }, []);

  useEffect(() => {
    if (currentAddress && campaignId) {
      APICall.fetchMintedNft(currentAddress).then((rs: FetchMintedNftResponse) => {
        const _mintedNft = rs.find(i => i.campaignId === campaignId);

        if (_mintedNft) {
          if (_mintedNft.status === 'minting') {
            setIsMinting(true);
          } else if (_mintedNft.status === 'success') {
            setMintedNft({
              id: _mintedNft.id,
              name: _mintedNft.nftName,
              image: _mintedNft.nftImage,
              campaignId: _mintedNft.campaignId,
              collectionId: _mintedNft.collectionId,
            });
            setIsMinted(true);
          }
        }

        setIsCheckFetchMintedNftDone(true);
      });
    }
  }, [currentAddress, campaignId]);

  const signMessage = useCallback((randomCode: string, cb: (sig: string) => void): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (!currentAddress || !walletContext.walletType) {
        return;
      }

      if (isEthereumAddress(currentAddress)) {
        if (walletContext.walletType === 'evm' && walletContext.evmWallet) {
          walletContext.evmWallet.request( {
            method: 'personal_sign',
            params: [ randomCode, currentAddress ]
          }).then(rs => {
            cb(rs as string);
            resolve();
          }).catch(reject);
        }
      } else {
        if (walletContext.walletType === 'substrate' && walletContext.wallet) {
          walletContext.wallet.signer?.signRaw?.( {
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
  }, [currentAddress, walletContext.walletType, walletContext.evmWallet, walletContext.wallet]);

  useEffect(() => {
    if (currentAddress && isCheckFetchMintedNftDone && !isMinted && !isMinting) {
      APICall.getUserCode(currentAddress).then(({id, randomCode}: GetUserCodeResponse) => {
        signMessage(randomCode, (sig) => {
          setUserId(id);
          setSignature(sig);
        }).catch(e => console.log(e));
      });
    }
  }, [isCheckFetchMintedNftDone, isMinted, isMinting, currentAddress, signMessage]);

  const isReadyToMintCheck =
    !mintCheckResult
    && isCheckFetchMintedNftDone
    && !isMinting
    && !isMinted
    && campaignId
    && userId
    && signature
    && currentAddress;

  useEffect(() => {
    if (isReadyToMintCheck) {
      APICall.mintCheck({campaignId,
        userId,
        signature, address: currentAddress}).then((rs: MintCheckResult) => {
          setMintCheckResult(rs);
      });
    }
  }, [isReadyToMintCheck, campaignId, userId, signature, currentAddress]);

  const reset = useCallback(() => {
    setMintedNft(undefined);
    setSignature(undefined);
    setUserId(undefined);
    setMintCheckResult(undefined);
    setIsMinted(false);
    setIsMinting(false);
    setIsCheckFetchMintedNftDone(false);
    setRecipient(undefined);
  }, []);

  const _setCurrentAddress = useCallback((address: string) => {
    setCurrentAddress(address);
    const _currentAccount = walletContext.accounts.find((x) => (x.address === address));
    setCurrentAccount(_currentAccount);
    reset();
  }, [setCurrentAddress, walletContext.accounts, reset]);

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
    //Todo: may consider not use this code (only set account if user do it manually)
    if (!currentAccount && walletAccounts.length > 0 && (!currentAddress || !walletAccounts)) {
      setCurrentAccount(walletAccounts[0]);
      setCurrentAddress(walletAccounts[0].address);
    }
  }, [currentAddress, setCurrentAddress, walletContext.accounts]);

  return (
    <AppContext2.Provider value={{
      currentAddress,
      currentAccount,
      mintedNft,
      campaignId,
      signature,
      userId,
      mintCheckResult,
      isMinted,
      isMinting,
      recipient,
      collectionInfo,
      setIsMinted,
      setRecipient,
      setCurrentAddress: _setCurrentAddress,
      setMintedNft
    }}>
      {children}
    </AppContext2.Provider>
  );
}
