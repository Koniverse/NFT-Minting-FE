// Copyright 2019-2023 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createHashRouter} from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome";
import MintNFT from "./pages/MintNFT";
import NFTResult from "./pages/NFTResult";

export const router = createHashRouter([
  {
    path: '/',
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