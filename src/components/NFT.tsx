// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import {MintedNFTItem, ThemeProps} from "../types";
import CN from "classnames";
import NftImage from "./NftImage";

interface Props extends ThemeProps {
  nft: MintedNFTItem
}

const Component: React.FC<Props> = ({className, nft: {nftImage}}: Props) => {
  return (<div className={CN(className, 'nft-collection')}>
    <NftImage src={nftImage} />
  </div>);
};

const NFT = styled(Component)<Props>(({theme: {extendToken}}: Props) => {
  return {
    width: extendToken.nftImageSize,
  };
});

export default NFT;
