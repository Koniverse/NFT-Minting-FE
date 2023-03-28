// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import defaultImagePlaceholder from './assets/default-image-placeholder.png';
import subWalletLogo from './assets/sub-wallet-logo.svg';
import { theme as SwReactUI } from '@subwallet/react-ui';
import { ThemeConfig as _ThemeConfig, Web3LogoMap } from '@subwallet/react-ui/es/config-provider/context';
import { AliasToken as _AliasToken, GlobalToken as _GlobalToken } from '@subwallet/react-ui/es/theme/interface';
import logoMap from '@subwallet/react-ui/es/theme/themes/logoMap';
import {GlobalToken, SwThemeConfig, Theme, ThemeNames} from './types';

// todo: will standardized logoMap later
const defaultLogoMap: Web3LogoMap = {
  ...logoMap
};

// Todo: i18n for theme name
// Implement theme from @subwallet/react-ui
export const SW_THEME_CONFIGS: Record<ThemeNames, SwThemeConfig> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    algorithm: SwReactUI.darkAlgorithm,
    customTokens: (token) => (token),
    logoMap: defaultLogoMap
  }
};

export function generateTheme ({ customTokens,
  id,
  logoMap,
  name }: SwThemeConfig, token: GlobalToken): Theme {
  return {
    id,
    name,
    token: customTokens(token),
    logoMap
  } as Theme;
}
