import {ThemeProps} from "../types";
import styled from "styled-components";
import React from "react";

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className="__box">
        Sup !!!!
      </div>
    </div>
  )
}

export const Congratulation = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    '.__box': {
      paddingTop: 114,
      paddingBottom: 111,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
  };
});
