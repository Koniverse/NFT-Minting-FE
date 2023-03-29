// Load all environment variables from .env file

export interface EnvironmentType {
  NODE_ENV: string;
  COLLECTION_ID: string;
  CHAIN_ENDPOINT: string;
  FAUCET_URL: string;
  INSTRUCTION_URL: string;
  ARTZERO_IMAGE_PATTERN: string;
  ARTZERO_PORTAL: string;
  ARTZERO_API_ENDPOINT: string;
}
export const ENVIRONMENT : EnvironmentType = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  COLLECTION_ID: process.env.COLLECTION_ID || '5HDHdUUF51MKWCcz8pBm7a7Cy7gopUwttEcsjdp1eoi6jecC',
  CHAIN_ENDPOINT: process.env.CHAIN_ENDPOINT || 'wss://ws.test.azero.dev',
  FAUCET_URL: process.env.FAUCET_URL || 'https://faucet.test.azero.dev',
  INSTRUCTION_URL: process.env.INSTRUCTION_URL || 'https://docs.azero.dev',
  ARTZERO_IMAGE_PATTERN: process.env.ARTZERO_IMAGE_PATTERN || 'https://imagedelivery.net/Iw4Pp5uTB3HCaJ462QFK1Q/{{id}}/500',
  ARTZERO_PORTAL: process.env.ARTZERO_PORTAL || 'https://a0-test.artzero.io',
  ARTZERO_API_ENDPOINT: process.env.ARTZERO_API_ENDPOINT || 'https://a0-test-api.artzero.io',
}