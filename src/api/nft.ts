import axios from "axios";
import {ENVIRONMENT} from "../utils/environment";
import {MintCheckInput, MintSubmitInput} from "./types";

const client = async (
    method: string,
    url: string,
    options: any = {},
    baseURL = ENVIRONMENT.API_ENDPOINT
) => {
    const headers = {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const urlencodedOptions = new URLSearchParams(
        Object.entries(options)
    ).toString();

    const { data } = await axios({
        baseURL,
        url,
        method,
        headers,
        data: urlencodedOptions,
    });

    if (data?.status === "FAILED") {
        console.log("error FAILED @ xx>>", url, data?.message);
    }

    return data;
};

const clientWithGetParams = async (
  url: string,
  options = {},
  baseURL = ENVIRONMENT.API_ENDPOINT
) => {
    const headers = {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const { data } = await axios({
        baseURL,
        url,
        method: 'GET',
        headers,
        params: options,
    });

    if (data?.status === "FAILED") {
        console.log("error FAILED @ xx>>", url, data?.message);
    }

    return data;
};


export const APICall = {
    getUserRandomCode: async (address: string) => {
        return await client("POST", "/api/user/get-code", {
            address,
        });
    },
    fetchALlCollection: async () => {
        return await clientWithGetParams( "/api/collection/fetch", {
            rmrkCollectionId: ENVIRONMENT.RMRK_COLLECTION_ID
        });
    },
    fetchMintedNft: async (address: string) => {
        return await clientWithGetParams( "/api/mint/fetch", {
            address,
            rmrkCollectionId: ENVIRONMENT.RMRK_COLLECTION_ID
        });
    },
    mintCheck: async (checkInput: MintCheckInput) => {
        return await client("POST", "/api/mint/check", checkInput);
    },
    mintSubmit: async (submitInput: MintSubmitInput) => {
        return await client("POST", "/api/mint/submit", submitInput);
    },
};
