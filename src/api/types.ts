export interface MintCheckInput {
  address: string,
  userId: number,
  signature: string,
  campaignId: number
}

export interface MintSubmitInput {
  requestId: number,
  recipient: string,
}