// Load all environment variables from .env file

export interface EnvironmentType {
  NODE_ENV: string;
  INSTRUCTION_URL: string;
  API_ENDPOINT: string;
}
export const ENVIRONMENT : EnvironmentType = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  INSTRUCTION_URL: process.env.INSTRUCTION_URL || 'https://youtu.be/7O2XUmAPpKE',
  API_ENDPOINT: process.env.API_ENDPOINT || 'https://nft-minting-demo01.subwallet.app',
}
