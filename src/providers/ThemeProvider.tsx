// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {generateTheme, SW_THEME_CONFIGS} from '../themes';
import {ConfigProvider, ModalContextProvider, theme as reactUiTheme} from '@subwallet/react-ui';
import React, { useMemo } from 'react';
import styled, { createGlobalStyle, ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import {SwThemeConfig, Theme, ThemeProps} from "../types";

interface Props {
  children: React.ReactNode;
  themeConfig: SwThemeConfig
}

const { useToken } = reactUiTheme;

const GlobalStyle = createGlobalStyle<ThemeProps>(({ theme }) => {
  const { token, extendToken } = theme as Theme;

  return ({
    body: {
      fontFamily: token.fontFamily,
      color: token.colorText,
      fontWeight: token.bodyFontWeight,
      backgroundColor: token["gray-1"]
    },
    pre: {
      fontFamily: 'inherit',
      whiteSpace: 'pre-wrap'
    },

    '.main-page-container': {
      border: `${token.lineWidth}px ${token.lineType} ${token.colorBgInput}`,
      borderBottomWidth: token.lineWidth * 2
    },

    '.modal-full': {
      '.ant-sw-modal-content': {
        boxShadow: `inset 0 0 0 ${token.lineWidth}px ${token.colorBgInput}, inset 0 ${token.lineWidth}px 0 ${token.lineWidth}px ${token.colorBgInput}`
      }
    },

    '.text-secondary': {
      color: token.colorTextSecondary
    },

    '.text-tertiary': {
      color: token.colorTextTertiary
    },

    '.text-light-2': {
      color: token.colorTextLight2
    },

    '.text-light-4': {
      color: token.colorTextLight4
    },

    '.common-text': {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight
    },

    '.sm-text': {
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeightSM
    },

    '.mono-text': {
      fontFamily: token.monoSpaceFontFamily
    },

    '.ml-xs': {
      marginLeft: token.marginXS
    },

    '.ml-xxs': {
      marginLeft: token.marginXXS
    },

    '.text-danger': {
      color: token.colorError
    },

    '.h3-text': {
      fontSize: token.fontSizeHeading3,
      lineHeight: token.lineHeightHeading3,
      fontWeight: token.headingFontWeight
    },

    '.h4-text': {
      fontSize: token.fontSizeHeading4,
      lineHeight: token.lineHeightHeading4,
      fontWeight: token.headingFontWeight
    },

    '.h5-text': {
      fontWeight: token.headingFontWeight,
      fontSize: token.fontSizeHeading5,
      lineHeight: token.lineHeightHeading5
    },

    '.form-space-xs': {
      '.ant-form-item': {
        marginBottom: token.marginXS
      }
    },

    '.form-space-sm': {
      '.ant-form-item': {
        marginBottom: token.marginSM
      }
    },

    '.form-space-xxs': {
      '.ant-form-item': {
        marginBottom: token.marginXXS
      }
    },

    '.form-row': {
      display: 'flex',
      gap: token.sizeSM,

      '.ant-form-item': {
        flex: 1,
        overflow: 'hidden'
      }
    },

    '.item-disabled': {
      opacity: 0.4,
      cursor: 'not-allowed !important',
      backgroundColor: `${token.colorBgSecondary} !important`
    },

    '.common-page': {
      padding: token.paddingSM,
      paddingBottom: token.paddingLG,
    },

    '.project-description': {
      borderRadius: token.borderRadius,
      padding: token.paddingXS,
      backgroundColor: token['gray-1'],
      textAlign: 'left',
    },

    '.mb-xs': {
      marginBottom: token.marginXS
    },
    '.mb-sm': {
      marginBottom: token.marginSM
    },
    '.mb-md': {
      marginBottom: token.marginMD
    },
    '.mb-lg': {
      marginBottom: token.marginLG
    },

    '.general-button-width': {
      maxWidth: 396,
      width: '100%'
    },

    '.title': {
      color: extendToken.colorTitle,
      fontWeight: 900,
      textTransform: 'uppercase',
    },

    '.general-bordered-button.general-bordered-button': {
      height: 72,
      lineHeight: '68px',
      color: token['colorSuccess'],
      backgroundColor: 'transparent',
      border: '2px solid',

      '.ant-btn-content-wrapper': {
        fontSize: 20,
        textTransform: 'uppercase',
      },

      ':hover': {
        color: token['colorSuccess-5'],
        backgroundColor: 'transparent',
      },

      '&:active, &:disabled': {
        color: token['colorSuccess-4'],
        backgroundColor: 'transparent',
      },
    },

    '.general-button.general-button': {
      height: 72,
      lineHeight: '72px',
      backgroundColor: token['colorSuccess'],
      color: token['geekblue-1'],


      '.ant-btn-content-wrapper': {
        fontSize: 20,
        textTransform: 'uppercase',
      },

      ':hover': {
        backgroundColor: token['colorSuccess-5'],
        color: token['geekblue-1'],
      },

      '&:active, &:disabled': {
        backgroundColor: token['colorSuccess-4'],
        color: token['geekblue-1'],
      },
    },

    '.nft-image': {
      border: '10px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '7.409873008728027px -5.5574049949646px 27.787025451660156px 0px rgba(33, 33, 33, 0.20)',
      borderRadius: 16
    },
  });
});

function ThemeGenerator ({ children, themeConfig }: Props): React.ReactElement<Props> {
  const { token } = useToken();

  // Generate theme from config
  const theme = useMemo<Theme>(() => {
    return generateTheme(themeConfig, token);
  }, [themeConfig, token]);

  return (
    <StyledComponentThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      {children}
    </StyledComponentThemeProvider>
  );
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const getModalContainer = () => document.getElementById('popup-container') || document.body;
const getPopupContainer = () => document.getElementById('tooltip-container') || document.body;

const TooltipContainer = styled.div`z-index: 10000`;

export function ThemeProvider ({ children }: ThemeProviderProps): React.ReactElement<ThemeProviderProps> {
  const themeName = 'dark';
  const themeConfig = SW_THEME_CONFIGS[themeName];

  return (
    <ConfigProvider
      getModalContainer={getModalContainer}
      getPopupContainer={getPopupContainer}
      theme={themeConfig}
    >
      <ThemeGenerator themeConfig={themeConfig}>
        <TooltipContainer id='tooltip-container' />
        <ModalContextProvider>
          {children}
        </ModalContextProvider>
      </ThemeGenerator>
    </ConfigProvider>
  );
}
