// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import CN from 'classnames';
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components';
import {Button, Icon, ModalContext} from "@subwallet/react-ui";
import {isWalletInstalled} from "@subwallet/wallet-connect/dotsama/wallets";
import {openInNewTab} from "../utils/common/browser";
import { ThemeProps } from '../types';
import {SELECT_ACCOUNT_TYPE_MODAL} from "../constants";
import {Wallet} from "phosphor-react";

interface Props extends ThemeProps {}

const Component: React.FC<Props> = (props: Props) => {
  const { className } = props;

  const [isSubWalletInstalled] = useState(isWalletInstalled('subwallet-js'));
  const {activeModal} = useContext(ModalContext);
  const onConnectWallet = useCallback(() => {
    activeModal(SELECT_ACCOUNT_TYPE_MODAL);
  }, [activeModal])

  const onInstallWallet = () => {
    openInNewTab('https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn')();
  };

  return (
    <div className={CN(className)}>
      <Button
        className={CN('general-button')}
        shape={'circle'}
        size={'sm'}
        onClick={isSubWalletInstalled ? onConnectWallet : onInstallWallet}
        icon={<Icon phosphorIcon={Wallet} weight='fill' />}
      >
        {isSubWalletInstalled ? 'Connect Wallet' : 'Install Wallet'}
      </Button>
    </div>
  );
};

const ConnectButton = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {

  };
});

export default ConnectButton;
