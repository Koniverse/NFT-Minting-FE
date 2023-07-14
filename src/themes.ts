// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {theme as SwReactUI} from '@subwallet/react-ui';
import {Web3LogoMap} from '@subwallet/react-ui/es/config-provider/context';
import logoMap from '@subwallet/react-ui/es/theme/themes/logoMap';
import {AliasToken, ExtraToken, GlobalToken, SwThemeConfig, Theme, ThemeNames} from './types';

// todo: will standardized logoMap later
const defaultLogoMap: Web3LogoMap = {
  ...logoMap
};

function genDefaultExtraTokens (token: AliasToken): ExtraToken {
  return {
    colorTitle: '#E7087B',
  };
}

// Todo: i18n for theme name
// Implement theme from @subwallet/react-ui
export const SW_THEME_CONFIGS: Record<ThemeNames, SwThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    algorithm: SwReactUI.darkAlgorithm,
    customTokens: (token) => ({
      ...token,
      bodyFontWeight: '400',
      fontFamily: '\'Unbounded\', sans-serif',
    }),
    generateExtraTokens: (token) => {
      return { ...genDefaultExtraTokens(token) };
    },
    logoMap: defaultLogoMap
  }
};

export function generateTheme ({ customTokens,
  id,
  logoMap,
  generateExtraTokens,
  name }: SwThemeConfig, token: GlobalToken): Theme {
  return {
    id,
    name,
    token: customTokens(token),
    extendToken: generateExtraTokens(token),
    logoMap
  } as Theme;
}
