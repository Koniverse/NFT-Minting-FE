import React, {useContext} from "react";
import styled from "styled-components";
import CN from 'classnames';
import {Button, Icon, Image} from "@subwallet/react-ui";
import logo from '../assets/logo.png';
import {AccountSelector} from "./AccountSelector";
import {ThemeProps} from "../types";
import {WalletContext} from "../contexts";
import {Question} from "phosphor-react";
import {ENVIRONMENT} from "../utils/environment";


type HeaderProps = ThemeProps;

export function Component({className}: HeaderProps): React.ReactElement {
  const walletContext = useContext(WalletContext);

  return (
    <div className={CN('main-header', className)}>
      <Image className={'left-header logo'} width={120} src={logo}/>
      <div className={'right-header'}>
        {walletContext.wallet && <AccountSelector/>}
        {!walletContext.wallet &&
          <Button
            type={'ghost'}
            onClick={() => {
              window.open(ENVIRONMENT.INSTRUCTION_URL)
            }}
            icon={<Icon phosphorIcon={Question} weight={'duotone'}/>}
            size={'xs'}>
            Help
          </Button>}
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
      textAlign: 'right',
      paddingLeft: 36,

      '.ant-btn': {
        position: "relative",
        right: -12,
      }
    }
  }
});