import BN from "bn.js";
// import toast from "react-hot-toast";
import { ContractPromise } from "@polkadot/api-contract";
// import {
//   txErrorHandler,
//   txResponseErrorHandler,
// } from "@store/actions/txStatus";
import {formatOutput, getEstimatedGas, readOnlyGasLimit} from "../utils";
import {web3FromSource} from "./extension-dapp";

let contract;

export const setLaunchPadContract = (api, data) => {
  contract = new ContractPromise(
    api,
    data?.CONTRACT_ABI,
    data?.CONTRACT_ADDRESS
  );
};
// no use???
async function getAttributes(caller_account, collection_address, attributes) {
  if (!contract || !caller_account) {
    return null;
  }
  let attributeVals;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const address = caller_account?.address;
  const { result, output } = await contract.query.getAttributes(
    address,
    { value: azero_value, gasLimit },
    collection_address,
    attributes
  );
  if (result.isOk) {
    attributeVals = output.toHuman().Ok;
  }
  return attributeVals;
}

async function getProjectsByOwner(caller_account, ownerAddress) {
  if (!contract || !caller_account) {
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "artZeroLaunchPadTrait::getProjectsByOwner"
  ](
    address,
    {
      value: azero_value,
      gasLimit,
    },
    ownerAddress
  );
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function owner(caller_account) {
  if (!contract || !caller_account) {
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query["ownable::owner"](address, {
    value: azero_value,
    gasLimit,
  });
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

async function getProjectCount(caller_account) {
  if (!contract || !caller_account) {
    return null;
  }
  const address = caller_account?.address;
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;

  const { result, output } = await contract.query[
    "artZeroLaunchPadTrait::getProjectCount"
  ](address, {
    value: azero_value,
    gasLimit,
  });

  if (result.isOk) {
    return formatOutput(output);
  }

  return null;
}

async function getProjectById(caller_account, project_id) {
  const gasLimit = readOnlyGasLimit(contract);
  const azero_value = 0;
  const address = caller_account?.address;

  const { result, output } = await contract.query[
    "artZeroLaunchPadTrait::getProjectById"
  ](address, { value: azero_value, gasLimit }, project_id);
  if (result.isOk) {
    return output.toHuman().Ok;
  }
  return null;
}

const launchpad_contract_calls = {
  setLaunchPadContract,
  getAttributes,
  owner,
};

export default launchpad_contract_calls;

