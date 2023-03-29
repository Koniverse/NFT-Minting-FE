import {ApiPromise, WsProvider} from "@polkadot/api";
import {ENVIRONMENT} from "../utils/environment";
import "@polkadot/api-augment"
import {convertStringToPrice} from "../utils";

export class ChainApi {
  api: ApiPromise;
  constructor() {
    this.api = new ApiPromise({
      provider: new WsProvider(ENVIRONMENT.CHAIN_ENDPOINT),
    });
  }
  async subscribeBalance(address: string, callback: (balance: number) => void) {
    await this.api.isReady;
    const unsub = await this.api.query.system.account(address, (account) => {
      const balance = account.data;
      const free = convertStringToPrice(balance.toHuman().free);
      const miscFrozen = convertStringToPrice(balance.toHuman().miscFrozen);

      const bal = free - miscFrozen;
      callback(bal);
    });

    return unsub;
  }
}

export const ChainApiImpl = new ChainApi();