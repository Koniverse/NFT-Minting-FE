// Load all environment variables from .env file

import MobileDetect from "mobile-detect";

export interface EnvironmentType {
  NODE_ENV: string;
  INSTRUCTION_URL: string;
  API_ENDPOINT: string;
  RMRK_COLLECTION_ID: string;
}
export const ENVIRONMENT : EnvironmentType = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  RMRK_COLLECTION_ID: process.env.RMRK_COLLECTION_ID || '80971274db0b27d618-SWLOKA',
  INSTRUCTION_URL: process.env.INSTRUCTION_URL || 'https://youtu.be/7O2XUmAPpKE',
  API_ENDPOINT: process.env.API_ENDPOINT || 'https://nft-minting-demo01.subwallet.app',
}

const detect = new MobileDetect(navigator.userAgent, 1200);
export const isAndroid = detect.os() === 'AndroidOS'
export const isIOS = detect.os() === 'iOS'
export const isMobile = isIOS || isAndroid;