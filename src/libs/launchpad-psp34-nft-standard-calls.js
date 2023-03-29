import BN from "bn.js";
import { ContractPromise } from "@polkadot/api-contract";
import {web3FromSource} from "./extension-dapp";
import {formatNumberOutput, formatOutput, getEstimatedGas, readOnlyGasLimit} from "../utils";
import launchpad_psp34_nft_standard from "./launchpad-psp34-nft-standard";
// import {APICall} from "../api/client";

let contract;

export const setContract = (c) => {
  contract = c;
};

async function getTotalSupply(caller_account) {
  if (!contract || !caller_account) {
    return null;
  }

  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getTotalSupply"
  ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return formatOutput(output);
  }
  return null;
}

async function getLastPhaseId(caller_account) {
  if (!contract || !caller_account) {
    return null;
  }

  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getLastPhaseId"
  ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return formatNumberOutput(output);
  }
  return null;
}


async function getPhaseAccountLink(caller_account, phaseId, index) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getPhaseAccountLink"
  ](
    address,
    {
      value: azero_value,
      gasLimit,
    },
    phaseId,
    index
  );
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function getWhitelistByAccountId(
  caller_account,
  phaseId,
  accountAddress
) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getWhitelistByAccountId"
  ](
    address,
    {
      value: azero_value,
      gasLimit,
    },
    accountAddress,
    phaseId
  );

  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function getLastTokenId(caller_account) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const { result, output } = await contract.query[
    "psp34Traits::getLastTokenId"
  ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return formatOutput(output);
  }
  return null;
}


async function mint(caller_account, mintAmount, dispatch, txType, api) {
  if (!contract || !caller_account) {
    // toast.error(`Contract or caller not valid!`);
    return null;
  }

  let unsubscribe;
  let gasLimit;

  const address = caller_account?.address;
  const { signer } = await web3FromSource(caller_account?.meta?.source);
  const value = 0;

  gasLimit = await getEstimatedGas(
    address,
    contract,
    value,
    "mint",
    mintAmount
  );

  const txNotSign = contract.tx.mint({ gasLimit, value }, mintAmount);

  // await txNotSign
  //   .signAndSend(address, { signer }, async ({ status, dispatchError }) => {
  //     txResponseErrorHandler({
  //       status,
  //       dispatchError,
  //       dispatch,
  //       txType,
  //       api,
  //       caller_account,
  //     });
  //   })
  //   .then((unsub) => (unsubscribe = unsub))
  //   .catch((error) => txErrorHandler({ error, dispatch }));

  return unsubscribe;
}

async function publicMint(
  caller_account,
  phaseId,
  mintingFee,
  mintAmount,
  dispatch,
  txType,
  api,
  collection_address,
  wallet
) {
  console.log('co vao day k')
  if (!contract || !caller_account) {
    // toast.error(`Contract or caller not valid!`);
    return null;
  }

  console.log('co vao day k1')

  let unsubscribe;
  let gasLimit;

  const address = caller_account?.address;
  console.log(address)
  const { signer } = wallet;
  const value = new BN(mintingFee * 10 ** 6).mul(new BN(10 ** 6)).toString();
  console.log(value)

  gasLimit = await getEstimatedGas(
    address,
    contract,
    value,
    "publicMint",
    phaseId,
    mintAmount
  );
  console.log(gasLimit)
  const txNotSign = contract.tx.publicMint(
    { gasLimit, value },
    phaseId,
    mintAmount
  );

  await txNotSign
    .signAndSend(address, { signer }, async ({ status, dispatchError }) => {
      // txResponseErrorHandler({
      //   status,
      //   dispatchError,
      //   dispatch,
      //   txType,
      //   api,
      //   caller_account,
      // });
      console.log(status)
      console.log(status.isFinalized)

      if (status.isFinalized) {
        contract.query["psp34Traits::getLastTokenId"](address, {
          value: 0,
          gasLimit,
        }).then(async ({ result, output }) => {
          console.log(result)
          if (result.isOk) {
            const lastTokenId = formatOutput(output);

            for (
              let token_id = lastTokenId - mintAmount + 1;
              token_id <= lastTokenId;
              token_id++
            ) {
              // await APICall.askBeUpdateNftData({
              //   collection_address,
              //   token_id,
              // });
            }
          }
        });
      }
    })
    .then((unsub) => (unsubscribe = unsub))
    .catch((error) => {
      console.log('error')});

  return unsubscribe;
}

async function getPhaseScheduleById(caller_account, phaseId) {
  if (!contract || !caller_account) {
    return null;
  }

  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
      "psp34LaunchPadTraits::getPhaseScheduleById"
      ](address, { value: azero_value, gasLimit }, phaseId);
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function getProjectInfo(caller_account) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getProjectInfo"
  ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function tokenUri(caller_account, tokenId) {
  if (!contract || !caller_account) {
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query["psp34Traits::tokenUri"](
    address,
    {
      value: azero_value,
      gasLimit,
    },
    tokenId
  );
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}


async function getPublicMintedCount(caller_account) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getPublicMintedCount"
  ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return formatOutput(output);
  }
  return null;
}
async function getPhaseAccountLastIndex(caller_account, phaseId) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
      "psp34LaunchPadTraits::getPhaseAccountLastIndex"
      ](
      address,
      {
        value: azero_value,
        gasLimit,
      },
      phaseId
  );
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function getCurrentPhase(caller_account) {
  if (!contract || !caller_account) {
    console.log("invalid inputs");
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
      "psp34LaunchPadTraits::getCurrentPhase"
      ](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}


const launchpad_psp34_nft_standard_calls = {
  getCurrentPhase,
  getPhaseAccountLastIndex,
  getPhaseScheduleById,
  getLastPhaseId,
  setContract,
  publicMint,
  mint,
};

export default launchpad_psp34_nft_standard_calls;

// jjj
export const getAccountBalanceOfPsp34NFT = async ({
  currentAccount,
  targetAddress,
}) => {
  if (!contract || !currentAccount) {
    return null;
  }

  const value = 0;
  const gasLimit = readOnlyGasLimit(contract);

  const { result, output } = await contract.query["psp34::balanceOf"](
    currentAccount?.address,
    { value, gasLimit },
    targetAddress || currentAccount?.address
  );

  let ret = null;

  if (result.isOk) {
    ret = formatNumberOutput(output);
  }

  return ret;
};

export const getIdOfPsp34NFT = async ({
  currentAccount,
  ownerAddress,
  tokenID,
}) => {
  if (!contract || !currentAccount) {
    return null;
  }

  const value = 0;
  const gasLimit = readOnlyGasLimit(contract);

  const { result, output } = await contract.query[
    "psp34Enumerable::ownersTokenByIndex"
  ](
    currentAccount?.address,
    { value, gasLimit },
    ownerAddress || currentAccount?.address,
    tokenID
  );

  let ret = null;

  if (result.isOk) {
    ret = output.toHuman().Ok?.Ok?.U64;
  }

  return ret;
};

export const getCurrentPhaseByProjectAddress = async ({
  currentAccount,
  nftContractAddress,
  api,
}) => {
  if (!nftContractAddress || !currentAccount) {
    console.log("invalid inputs nftContractAddress || currentAccount");
    return null;
  }

  const contract = new ContractPromise(
    api,
    launchpad_psp34_nft_standard.CONTRACT_ABI,
    nftContractAddress
  );

  const address = currentAccount?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getCurrentPhase"
  ](address, {
    value: azero_value,
    gasLimit,
  });

  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
};

export const getCurrentPhaseStatusOfProject = async ({
  currentAccount,
  nftContractAddress,
  api,
}) => {
  if (!nftContractAddress || !currentAccount) {
    console.log("invalid inputs nftContractAddress || currentAccount");
    return null;
  }

  const contract = new ContractPromise(
    api,
    launchpad_psp34_nft_standard.CONTRACT_ABI,
    nftContractAddress
  );

  const phaseId = await getCurrentPhaseByProjectAddress({
    currentAccount,
    nftContractAddress,
    api,
  });

  const address = currentAccount?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "psp34LaunchPadTraits::getPhaseScheduleById"
  ](address, { value: azero_value, gasLimit }, phaseId);

  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
};
