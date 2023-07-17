import {CSSObject} from 'styled-components';
import {ThemeProps} from '../../../types';


export type BoxStyle = {
  container: CSSObject,
  textBox: CSSObject,
  text: CSSObject,
  textHighlight: CSSObject,
}

export function generateBoxStyle(theme: ThemeProps): BoxStyle {
  const {theme: {extendToken, token}} = theme;

  return ({
    container: {
      height: 492,
      position: 'relative',
      flex: 1,
    },

    textBox: {
      height: 244,
      borderRadius: 8,
      position: 'absolute',
      zIndex: 5,
      right: 0,
      left: 0,
      bottom: 0,
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 16,
      backdropFilter: 'blur(10px)',
    },

    text: {
      fontSize: 22,
      lineHeight: 1.5,
      color: token.colorTextLight1,
    },

    textHighlight: {
      color: token.colorSuccess,
    },
  });
}
