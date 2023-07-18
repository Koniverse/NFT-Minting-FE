// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {theme as SwReactUI} from '@subwallet/react-ui';
import {Web3LogoMap} from '@subwallet/react-ui/es/config-provider/context';
import logoMap from '@subwallet/react-ui/es/theme/themes/logoMap';
import seedToken from "@subwallet/react-ui/es/theme/themes/seed";
import derivative from "@subwallet/react-ui/es/theme/themes/dark";

// todo: will standardized logoMap later
const defaultLogoMap: Web3LogoMap = {
    ...logoMap
};

const currentToken = {
    ...seedToken,
    colorLink: '#E7087B',
    colorPrimary: '#E7087B',
    bodyFontWeight: '400',
    fontFamily: '\'Unbounded\', sans-serif',
}

export const appTheme = {
    id: 'dark',
    name: 'Dark',
    algorithm: SwReactUI.darkAlgorithm,
    token: derivative(currentToken),
    extendToken: {
        colorTitle: currentToken.colorPrimary,
        mobileSize: '992px',
        mediumSize: '1200px',
        largeSize: '1600px',
    },
    logoMap: defaultLogoMap,
}
