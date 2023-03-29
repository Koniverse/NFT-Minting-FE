// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {NFTCollection} from "../types";
import {ENVIRONMENT} from "./environment";


export class ArtZeroApi {
  static async postJson(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  static async postForm(url = "", data = {}) {
    const formBody = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody, // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  static async fetchCollection(projectId: string): Promise<NFTCollection | undefined> {
    try {
      const rs = await ArtZeroApi.postForm(`${ENVIRONMENT.ARTZERO_API_ENDPOINT}/getCollectionByAddress`, {collection_address: projectId});

      return rs.ret[0] as NFTCollection;
    } catch (e) {
      return undefined;
    }
  }
}
