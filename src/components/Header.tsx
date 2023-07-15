import React, {useContext} from 'react';
import styled from 'styled-components';
import CN from 'classnames';
import {Image} from '@subwallet/react-ui';
import logo from '../assets/logo.svg';
import {AccountSelector} from './AccountSelector';
import {ThemeProps} from '../types';
import {WalletContext} from '../contexts';


type HeaderProps = ThemeProps;

export function Component({className}: HeaderProps): React.ReactElement {
  const walletContext = useContext(WalletContext);

  return (
    <div className={CN(className)}>
      <Image className={'__left-part logo'} width={88} height={88} src={logo}/>
      <div className={'__right-part'}>

        <div className="__menu">
          <div className="__menu-item">
            <a className="__link-button -highlight">
              Home
            </a>
          </div>
          <div className="__menu-item">
            <a className="__link-button">
              DOTinVietNam
            </a>
          </div>

          {!!(walletContext.wallet || walletContext.evmWallet) && <AccountSelector/>}
        </div>
      </div>
    </div>
  );
}

export const Header = styled(Component)<HeaderProps>(({theme: {token}}: HeaderProps) => {
  return {
    display: 'flex',
    alignItems: 'center',

    '.__right-part': {
      display: 'flex',
      justifyContent: 'flex-end',
      flex: 1,
      paddingBottom: 8,
    },

    '.__menu': {
      display: 'flex',
      gap: 64
    },

    '.__link-button': {
      cursor: 'pointer',
      color: token.colorTextLight3,
      fontSize: 20,
      lineHeight: 1.4,
      display: 'flex',
      height: 48,
      position: 'relative',
      alignItems: 'center',
      transition: `${token.motionDurationMid} color`,

      '&:hover' : {
        color: token.colorTextLight2,
      },

      '&.-highlight': {
        color: token.colorTextLight1,

        '&:before': {
          content: "''",
          height: 2,
          display: 'block',
          backgroundColor: token.colorTextLight1,
          left: 0,
          right: 0,
          position: 'absolute',
          bottom: 4,
        },
      },
    },
  };
});
