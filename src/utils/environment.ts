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
  COLLECTION_ID: '5DVG2kveDY5msL6stCh83QAz6pNN1yLa2D3yfJnLVprYWsAq',
  CHAIN_ENDPOINT: 'wss://ws.test.azero.dev',
  FAUCET_URL: 'https://faucet.test.azero.dev',
  INSTRUCTION_URL: 'https://youtu.be/7O2XUmAPpKE',
  ARTZERO_IMAGE_PATTERN: 'https://imagedelivery.net/Iw4Pp5uTB3HCaJ462QFK1Q/{{id}}/500',
  ARTZERO_PORTAL: 'https://a0-test.artzero.io',
  ARTZERO_API_ENDPOINT: 'https://a0-test-api.artzero.io',
}