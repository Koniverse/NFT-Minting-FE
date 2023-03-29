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

const NFTItemObject = {
    "_id": "6423bc9631ed64179fd6145d",
    "nftName": null,
    "description": null,
    "avatar": null,
    "nftContractAddress": "5HDHdUUF51MKWCcz8pBm7a7Cy7gopUwttEcsjdp1eoi6jecC",
    "owner": "5ENp8Z2pquNyiPpRa59ihAeb5a871G3REMhn27Rzwp4P84SL",
    "tokenID": 4,
    "attributes": [],
    "attributesValue": [],
    "listed_date": 0,
    "price": 0,
    "is_for_sale": false,
    "nft_owner": "",
    "is_locked": false,
    "traits": null
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