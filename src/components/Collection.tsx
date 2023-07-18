// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import {CollectionItem, ThemeProps} from "../types";
import CN from "classnames";
import NftImage from "./NftImage";

interface Props extends ThemeProps {
  collection: CollectionItem
}

const Component: React.FC<Props> = ({className, collection: {image}}: Props) => {
  return (<div className={CN(className, 'nft-collection')}>
    <NftImage src={image} />
  </div>);
};

const NFTCollection = styled(Component)<Props>(({theme: {extendToken}}: Props) => {
  return {
    width: extendToken.collectionImageSize,
  };
});

export default NFTCollection;
