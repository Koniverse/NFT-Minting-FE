import React from "react";
import styled from "styled-components";
import {ThemeProps} from "../contexts/ThemeContext";
import CN from 'classnames';
import {Image} from "@subwallet/react-ui";
import logo from '../assets/logo.png';
import {AccountSelector} from "./AccountSelector";


type HeaderProps = ThemeProps;

export function Component({className}: HeaderProps): React.ReactElement {
  return (
    <div className={CN('main-header', className)}>
      <Image className={'left-header logo'} width={120} src={logo}/>
      <div className={'right-header'}>
        <AccountSelector/>
      </div>
    </div>
  );
}

export const Header = styled(Component)<HeaderProps>(({theme}) => {
  const token = theme.token;
  return {
    display: "flex",
    padding: token.paddingSM,
    alignItems: "center",

    '.right-header': {
      flex: '1 1 120px',
      paddingLeft: 60
    }
  }
});