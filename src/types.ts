import {
  AliasToken as _AliasToken,
  GlobalToken as _GlobalToken
} from '@subwallet/react-ui/es/theme/interface';
import {ThemeConfig as _ThemeConfig, Web3LogoMap} from '@subwallet/react-ui/es/config-provider/context';

export type ThemeNames = 'dark';
export type ThemeConfig = _ThemeConfig;
export type AliasToken = _AliasToken;
export type GlobalToken = _GlobalToken;

export interface ExtraToken {
  colorTitle: string,
}

export type Theme = {
  id: ThemeNames;
  name: string;
  token: GlobalToken;
  logoMap: Web3LogoMap,
  extendToken: ExtraToken,
};

export interface SwThemeConfig extends ThemeConfig {
  id: ThemeNames,
  name: string;

  generateExtraTokens: (token: AliasToken) => ExtraToken;

  customTokens: (token: AliasToken) => AliasToken;
  logoMap: Web3LogoMap
}

export interface ThemeProps {
  theme: Theme;
  className?: string;
}

export interface NFTCollection {
  _id: string,
  index: number,
  collectionOwner: string,
  nftContractAddress: string,
  contractType: string,
  isCollectRoyaltyFee: boolean,
  royaltyFee: number,
  isActive: boolean,
  showOnChainMetadata: boolean,
  name: string,
  description: string,
  avatarImage: string,
  squareImage: string,
  headerImage: string,
  website: string,
  twitter: string,
  discord: string,
  telegram: string,
  volume: number,
  nft_count: number,
  isDoxxed: boolean,
  isDuplicationChecked: boolean
}

export interface CurrentAccountData {
  userId?: number,
  signature?: string,
  randomCode?: string,
}

export interface NFTItem {
  _id: string,
  nftName: string,
  description: string,
  avatar: string,
  nftContractAddress: string,
  owner: string,
  tokenID: number,
  attributes: string[],
  attributesValue: string[],
  listed_date: number,
  price: number,
  is_for_sale: boolean,
  nft_owner: string,
  is_locked: boolean,
  traits: any
}

export enum NetworkType {
  SUBSTRATE = 'substrate',
  ETHEREUM = 'ethereum',
}

export interface CollectionItem {
  id: number,
  rmrkCollectionId: string,
  name: string,
  description: string,
  image: string,
  network: string,
  networkType: NetworkType,
  networkName: string,
  currentCampaignId: number,
}

export interface MintedNFTItem {
  id: number;
  nftName: string,
  nftImage: string,
  campaignId: number,
  collectionId: number,
  rmrkNftId: string,
}

export interface MintedNftResponse extends MintedNFTItem {
  userId: number,
  address: string,
  status: 'success' | 'fail' | 'minting' | 'check',
  nftId: number,
  recipient: string,
  extrinsicHash: string,
  blockNumber: number
}

export type MintCheckResult = {
  requestId: number | null,
  validUser: boolean,
  validCampaign: boolean,
  isOwner: boolean,
  hasBalance: boolean,
  notDuplicated: boolean,
};
