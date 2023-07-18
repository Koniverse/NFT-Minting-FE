// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {appTheme} from '../themes';
import {ConfigProvider, theme as reactUiTheme} from '@subwallet/react-ui';
import React from 'react';
import styled, {createGlobalStyle, ThemeProvider as StyledComponentThemeProvider} from 'styled-components';
import {Theme, ThemeProps} from "../types";
import {ThemeConfig} from "@subwallet/react-ui/es/config-provider/context";

interface Props {
  children: React.ReactNode;
  themeConfig: ThemeConfig
}

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

    '.ant-sw-modal': {
      '.ant-sw-modal-content': {
        borderRadius: token.sizeXL,

        [`@media(max-width:${extendToken.mobileSize})`]: {
          marginLeft: token.margin,
          marginRight: token.margin,
        }
      },

      '&.modal-full': {
        '.ant-sw-modal-content': {
          borderRadius: 0,
          '.ant-sw-modal-header': {
            borderRadius: 0
          },

          [`@media(max-width:${extendToken.mobileSize})`]: {
            marginLeft: 0,
            marginRight: 0,
          }
        }
      }
    },

    'a': {
      color: token.colorText,
      transition: 'color 0.2s ease-in-out',
        '&:hover': {
            color: token.colorPrimary
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
      width: '100%',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        maxWidth: 300,
      }
    },

    '.title': {
      color: token.colorPrimary,
      fontWeight: 900,
      textTransform: 'uppercase',
    },

    '.general-bordered-button.general-bordered-button': {
      height: 60,
      lineHeight: '56px',
      color: token['colorSuccess'],
      backgroundColor: 'transparent',
      border: '2px solid',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        height: 50,
        lineHeight: '46px',
        borderWidth: 2,
      },

      '.ant-btn-content-wrapper': {
        textTransform: 'uppercase',

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 14,
        }
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
      paddingLeft: 24,
      paddingRight: 24,
      fontWeight: '500',
    },
  });
});

function ThemeGenerator ({ children, themeConfig }: Props): React.ReactElement<Props> {
  return (
    <StyledComponentThemeProvider theme={themeConfig}>
      <GlobalStyle theme={themeConfig} />
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
  return (
    <ConfigProvider
      getModalContainer={getModalContainer}
      getPopupContainer={getPopupContainer}
      theme={appTheme}
    >
      <ThemeGenerator themeConfig={appTheme}>
        <TooltipContainer id='tooltip-container' />
          {children}
      </ThemeGenerator>
    </ConfigProvider>
  );
}
