// Copyright 2019-2023 @subwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {createHashRouter} from 'react-router-dom';
import App from './App';
import {ConnectWallet} from './pages/ConnectWallet';
import {MintNft} from './pages/MintNft';
import {Congratulation} from './pages/Congratulation';
import {Welcome} from "./pages/Welcome";
import {LandingPage} from './pages/LandingPage';

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
        path: 'mint-nft',
        element: <MintNft />
      },
      {
        path: 'congratulation',
        element: <Congratulation />
      }
    ]
  },
  {
    path: '/landing-page',
    loader: timeLoader,
    element: <LandingPage/>,
  },
])
