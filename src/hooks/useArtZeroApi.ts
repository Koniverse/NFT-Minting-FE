// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import {NFTCollection} from "../types";

const artZeroApiEndpoint = 'https://api.artzero.io';


async function postData(url = "", data = {}) {
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
export function useArtZeroApi () {
  return {
    fetchCollection: async (projectId: string): Promise<NFTCollection | undefined> => {
      try {
        const rs = await postData(`${artZeroApiEndpoint}/getCollectionByAddress`, { collection_address: projectId } );

        return rs.ret[0] as NFTCollection;
      } catch (e) {
        return undefined;
      }
    }
  };
}
