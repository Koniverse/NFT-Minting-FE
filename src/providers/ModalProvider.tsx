// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {ModalContextProvider} from '@subwallet/react-ui';
import React from 'react';
import {AccountSelectorModal} from "../components/AccountSelectorModal";


export interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider ({ children }: ModalProviderProps): React.ReactElement<ModalProviderProps> {
  return (
    <ModalContextProvider>
      {children}
      <AccountSelectorModal/>
    </ModalContextProvider>
  );
}
