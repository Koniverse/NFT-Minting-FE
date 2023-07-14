import {ApiPromise, WsProvider} from "@polkadot/api";
import {ENVIRONMENT} from "../utils/environment";
import "@polkadot/api-augment"
import {convertStringToPrice, getPublicCurrentAccount, strToNumber} from "../utils";
import launchpad_psp34_nft_standard_calls from "../libs/launchpad-psp34-nft-standard-calls";
import {ContractPromise} from "@polkadot/api-contract";
import launchpad_psp34_nft_standard from "../libs/launchpad-psp34-nft-standard";
import BN from "bn.js";
import {WalletAccount} from "@subwallet/wallet-connect/types";

// Mint API helper
const fetchPublicPhasesInfoData = async () => {
  try {
    const totalPhase =
      await launchpad_psp34_nft_standard_calls.getLastPhaseId(
        getPublicCurrentAccount()
      );

    const allPhases = await Promise.all(
      [...new Array(totalPhase)].map(async (_, index) => {
        const totalCountWLAddress =
          await launchpad_psp34_nft_standard_calls.getPhaseAccountLastIndex(
            getPublicCurrentAccount(),
            index + 1
          );

        const data =
          await launchpad_psp34_nft_standard_calls.getPhaseScheduleById(
            getPublicCurrentAccount(),
            index + 1
          );

        const formattedData = {
          ...data,
          id: index + 1,

          publicClaimedAmount: strToNumber(data.publicClaimedAmount),
          publicRemainAmount:
            strToNumber(data.publicMintingAmount) -
            strToNumber(data.publicClaimedAmount),
          publicMintingFee: strToNumber(data.publicMintingFee),
          publicMintingAmount: strToNumber(data.publicMintingAmount),
          publicMaxMintingAmount: strToNumber(data.publicMaxMintingAmount),

          totalCountWLAddress: strToNumber(totalCountWLAddress),
          whitelistAmount: strToNumber(data.whitelistAmount),

          claimedAmount: strToNumber(data.claimedAmount),
          totalAmount: strToNumber(data.totalAmount),

          startTime: strToNumber(data.startTime),
          endTime: strToNumber(data.endTime),
        };

        return formattedData;
      })
    );
    return allPhases.filter((p) => p.isActive === true);
  } catch (error) {

    // setLoadingPhaseInfo(false);
  }
}
const fetchCurrentPhaseIdData = async (launchpad_psp34_nft_standard_contract: any) => {
  try {
    launchpad_psp34_nft_standard_calls.setContract(
      launchpad_psp34_nft_standard_contract
    );
    const id = await launchpad_psp34_nft_standard_calls.getCurrentPhase(
      getPublicCurrentAccount()
    );
    const publicPhases = await fetchPublicPhasesInfoData();
    const currentPhase = publicPhases?.find((p) => p.id === parseInt(id));
    return {id, currentPhase};
  } catch (error) {
    console.log(error);
    return {id: false, currentPhase: null};
  }
};

export class ChainApi {
  api: ApiPromise;

  constructor() {
    this.api = new ApiPromise({
      provider: new WsProvider(ENVIRONMENT.CHAIN_ENDPOINT),
    });
  }

  async subscribeBalance(address: string, callback: (balance: number) => void) {
    await this.api.isReady;
    const unsub = await this.api.query.system.account(address, ({data}) => {
      const free = convertStringToPrice(data.toHuman().free);
      const miscFrozen = convertStringToPrice(data.toHuman().miscFrozen);

      const bal = free - miscFrozen;
      callback(bal);
    });

    return unsub;
  }

  async mintNFT(collectionId: string, sendAccount: WalletAccount) {
    await this.api.isReady;
    const launchpad_psp34_nft_standard_contract = new ContractPromise(this.api,
      launchpad_psp34_nft_standard.CONTRACT_ABI,
      collectionId
    );

    launchpad_psp34_nft_standard_calls.setContract(
      launchpad_psp34_nft_standard_contract
    );
    const {currentPhase} = await fetchCurrentPhaseIdData(launchpad_psp34_nft_standard_contract);
    const {data} = await this.api.query.system.account(sendAccount.address);

    const balance =
      new BN(data.free).div(new BN(10 ** 6)).toNumber() / 10 ** 6 -
      // @ts-ignore
      new BN(data.miscFrozen).div(new BN(10 ** 6)).toNumber() / 10 ** 6;

    const mintingFee = currentPhase?.publicMintingFee / 10 ** 12;
    if (balance < 0.5) {
      return "Low balance to mint";
    }

    if (balance < mintingFee + 0.01) {
      return "Not enough balance to mint";
    }

    const currentPhaseId = currentPhase ? currentPhase.id : 1;
    await launchpad_psp34_nft_standard_calls.publicMint(
      sendAccount,
      currentPhaseId,
      mintingFee,
      1,
      null,
      'publicMint',
      this.api,
      collectionId,
      sendAccount
    );
  }
}

export const ChainApiImpl = new ChainApi();