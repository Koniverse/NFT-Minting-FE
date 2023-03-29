import {
  AliasToken as _AliasToken,
  GlobalToken as _GlobalToken
} from "@subwallet/react-ui/es/theme/interface";
import {ThemeConfig as _ThemeConfig, Web3LogoMap} from "@subwallet/react-ui/es/config-provider/context";

export type ThemeNames = 'dark';
export type ThemeConfig = _ThemeConfig;
export type AliasToken = _AliasToken;
export type GlobalToken = _GlobalToken;

export interface ExtraToken {
  bodyBackgroundColor: string,
  logo: string,
  defaultImagePlaceholder: string
  tokensScreenSuccessBackgroundColor: string,
  tokensScreenDangerBackgroundColor: string,
  tokensScreenInfoBackgroundColor: string,
}

export type Theme = {
  id: ThemeNames;
  name: string;
  token: GlobalToken;
  logoMap: Web3LogoMap,
};

export interface SwThemeConfig extends ThemeConfig {
  id: ThemeNames,
  name: string;

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

export interface NFTItem {
  name: string,
  collection_id: string,
}