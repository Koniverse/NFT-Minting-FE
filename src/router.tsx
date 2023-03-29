// Copyright 2019-2023 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createHashRouter} from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome";
import MintNFT from "./pages/MintNFT";
import NFTResult from "./pages/NFTResult";

const timeLoader = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // @ts-ignore
      if (window.injectedWeb3) {
        console.log('window.injectedWeb3');
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 10);
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(true);
    }, 666);
  })
}
export const router = createHashRouter([
  {
    path: '/',
    loader: timeLoader,
    element: <App />,
    children: [
      {
        path: 'welcome',
        element: <Welcome />
      },
      {
        path: 'mint-nft',
        element: <MintNFT />
      },
      {
        path: 'result',
        element: <NFTResult />
      }
    ]
  },
])