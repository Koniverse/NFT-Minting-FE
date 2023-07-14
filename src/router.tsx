// Copyright 2019-2023 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createHashRouter} from "react-router-dom";
import App from "./App";
import React from "react";
import { Welcome } from "./pages2/Welcome";
import {ConnectWallet} from "./pages2/ConnectWallet";
import {SelectAccountType} from "./pages2/SelectAccountType";
import {EligibilityCheck} from "./pages2/EligibilityCheck";
import {MintDetail} from "./pages2/MintDetail";
import {Congratulation} from "./pages2/Congratulation";

const timeLoader = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // @ts-ignore
      if (window.injectedWeb3) {
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
    element: <App/>,
    children: [
      {
        path: 'welcome',
        element: <Welcome />
      },
      {
        path: 'connect-wallet',
        element: <ConnectWallet />
      },
      {
        path: 'select-account-type',
        element: <SelectAccountType />
      },
      {
        path: 'eligibility-check',
        element: <EligibilityCheck />
      },
      {
        path: 'mint-detail',
        element: <MintDetail />
      },
      {
        path: 'congratulation',
        element: <Congratulation />
      }
    ]
  },
])
