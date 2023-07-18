import React, {useCallback, useContext} from 'react';
import styled from 'styled-components';
import CN from 'classnames';
import {Button, Icon, Image, ModalContext, SwModal} from '@subwallet/react-ui';
import logo from '../assets/logo.svg';
import {ThemeProps} from '../types';
import {WalletContext} from '../contexts';
import {Footer} from "./Footer";
import {X} from "phosphor-react";
import {HEADER_MENU_MODAL} from "../constants";
import {AccountSelectorInput} from "./AccountSelectorInput";
import {useNavigate} from "react-router";
import ConnectButton from "./ConnectButton";


type HeaderProps = ThemeProps;

const modalId = HEADER_MENU_MODAL;

export function Component({className}: HeaderProps): React.ReactElement {
  const walletContext = useContext(WalletContext);
  const { activeModal, inactiveModal } = useContext(ModalContext);
  const navigate = useNavigate();

  const goRoot = useCallback(() => {
    navigate('/');
    inactiveModal(modalId);
  }, [navigate, inactiveModal]);

  const openModal = useCallback(() => {
    activeModal(modalId);
  }, [activeModal]);

  const closeModal = useCallback(() => {
    inactiveModal(modalId);
  }, [inactiveModal]);

  const showAccount = !!(walletContext.wallet || walletContext.evmWallet) && !!walletContext.accounts.length;

  return (
    <div className={CN(className, '__container' ,  { __center: !showAccount })}>
      <div className="__left-part">
        <Image className={'logo'} width={88} height={88} src={logo} onClick={goRoot}/>
      </div>
      <div className="__left-part __mobile">
        <Image className={'__mobile'} width={72} height={72} src={logo} onClick={openModal}/>
      </div>
      <div className={'__right-part'}>
        <div className="__menu">
          <div className="__menu-item">
            <a className="__link-button -highlight" onClick={goRoot}>
              Home
            </a>
          </div>
          <div className="__menu-item">
            <a className="__link-button" href='https://dotinvietnam.com/'>
              DOTinVietNam
            </a>
          </div>

          <div className="__menu-item __wallet-button">
            {
              !!(walletContext.wallet || walletContext.evmWallet) && !!walletContext.accounts.length
                ? <AccountSelectorInput/>
                : <ConnectButton />
            }
          </div>
        </div>
      </div>
      <div className={'__right-part __mobile'}>
        {!!(walletContext.wallet || walletContext.evmWallet) && !!walletContext.accounts.length && <AccountSelectorInput/>}
      </div>

      <SwModal
        className={CN(className, 'modal-full')}
        id={modalId}
        onCancel={closeModal}
        closable={false}
        width='100%'
        transitionName='fade'
      >
        <div className="__modal-container">
          <div className="__closer">
            <Button
              icon={(
                <Icon
                  phosphorIcon={X}
                  iconColor='#E7087B'
                  weight='bold'
                />
              )}
              type="ghost"
              onClick={closeModal}
              size='lg'
            />
          </div>
          <div className="__menu">
            <div className="__menu-item">
              <a className="__link-button -highlight" onClick={goRoot}>
                Home
              </a>
            </div>
            <div className="__menu-item">
              <a className="__link-button" href='https://dotinvietnam.com/'>
                DOTinVietNam
              </a>
            </div>
            {(!(walletContext.wallet || walletContext.evmWallet) || !walletContext.accounts.length) && <ConnectButton />}
          </div>
          <Footer className='__footer' />
        </div>
      </SwModal>
    </div>
  );
}

export const Header = styled(Component)<HeaderProps>(({theme: {token, extendToken}}: HeaderProps) => {
  return {
    '&.__container': {
      display: 'flex',
      alignItems: 'center',
      paddingRight: 16,
      paddingLeft: 16,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        justifyContent: 'space-between',
        marginBottom: 44,

        '&.__center': {
          justifyContent: 'center',
        },
      },

      '.logo': {
        cursor: 'pointer'
      },

      '.__left-part': {
        [`@media(max-width:${extendToken.mobileSize})`]: {
          display: "none",

          '&.__mobile': {
            display: "unset",
          }
        },
        [`@media(min-width:${extendToken.mobileSize})`]: {
          display: "unset",

          '&.__mobile': {
            display: "none",
          }
        },
      },

      '.__right-part': {
        display: 'flex',
        justifyContent: 'flex-end',
        flex: 1,
        paddingBottom: 8,

        '&.__mobile': {
          flex: "unset",
        },

        [`@media(max-width:${extendToken.mobileSize})`]: {
          display: "none",

          '&.__mobile': {
            display: "unset",
          }
        },
        [`@media(min-width:${extendToken.mobileSize})`]: {
          '&.__mobile': {
            display: "none",
          }
        }
      },
    },

    '.__menu': {
      display: 'flex',
      gap: 64
    },

    '.__wallet-button': {
      width: 232,
      display: 'inline-block',
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

    '.__modal-container': {
      display: "flex",
      flexDirection: "column",
      height: '100%',
      gap: 80,
      paddingBottom: 40,
      paddingTop: 44,

      '.__menu': {
        gap: 80,
        flexDirection: 'column',
        alignItems: "center",
        flex: 1
      },

      '.__closer': {
        alignSelf: 'center',

        '.anticon': {
          [`@media(max-width:${extendToken.mobileSize})`]: {
            height: 64,
            fontSize: 64,
            width: 64,
          },
        }
      },

      '.__footer': {
        fontWeight: 400,
        lineHeight: 1.15
      }
    }
  };
});
