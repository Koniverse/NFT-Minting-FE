import axios from "axios";
import {ENVIRONMENT} from "../utils/environment";

// @ts-ignore
const client = async (
    method,
    url,
    options = {},
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
  url,
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
    getUserCode: async (address) => {
        return await client("POST", "/api/user/get-code", {
            address,
        });
    },
    fetchALlCollection: async () => {
        return await client("GET", "/api/collection/fetch", {});
    },
    fetchMintedNft: async (address) => {
        return await clientWithGetParams( "/api/mint/fetch", {
            address
        });
    },
    mintCheck: async ({ address, userId, signature, campaignId }) => {
        return await client("POST", "/api/mint/check", {
            address, userId, signature, campaignId
        });
    },
    mintSubmit: async ({ recipient, requestId }) => {
        return await client("POST", "/api/mint/submit", {
            recipient, requestId
        });
    },
};
