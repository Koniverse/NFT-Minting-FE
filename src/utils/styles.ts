import {CSSObject} from 'styled-components';
import {ThemeProps} from '../types';

export function generateModalStyle(theme: ThemeProps): CSSObject {
  const {theme: { extendToken}} = theme;

  return ({
    top: 0,
    maxWidth: 704,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    '.__closer .anticon': {
      [`@media(max-width:${extendToken.mobileSize})`]: {
        height: 64,
        fontSize: 64,
        width: 64,
      },
    },

    '.ant-sw-modal-content': {
      maxHeight: 700,
      borderRadius: 16,
      boxShadow: '0px 4px 100px 0px rgba(0, 0, 0, 0.40)',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        maxHeight: 'unset',
        borderRadius: 0,
      },
    },

    '.ant-sw-header-container-center .ant-sw-header-center-part': {
      width: 'auto',
      marginLeft: 48,
      marginRight: 48,
    },
  });
}
