import React from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {Header} from '../../components/Header';
import {Footer} from '../../components/Footer';
import {EventTitles} from './EventTitles';
import {Button} from '@subwallet/react-ui';
import {BoxItem1} from './boxes/BoxItem1';
import {BoxItem2} from './boxes/BoxItem2';
import {BoxItem3} from './boxes/BoxItem3';

type Props = ThemeProps;

function Component({className}: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className="bgi-background-landing-1"></div>
      <div className="bgi-background-landing-2"></div>
      <Header className={'landing-header'}/>
      <div className={'landing-launch-area'}>
        <EventTitles className={'__event-titles'}/>
        <div className={'__minting-time'}>
          Minting period: 17 Jul - 23 Jul
        </div>

        <Button
          block
          shape={'circle'}
          schema="primary"
          className={'__button general-button'}
        >
          Launch app
        </Button>

        <div className={'__slogan'}>
          Proof of asset for Polkadot ecosystem holder
          <br/>
          NFT Holder Utilities
        </div>
      </div>

      <div className={'landing-boxes-area'}>
        <BoxItem1/>
        <BoxItem2/>
        <BoxItem3/>
      </div>

      <div className={'landing-install-app-area'}>
        <div className={'__inner-container'}>
          <div className={'__content-block'}>
            <div className="__title">Install SubWallet to mint your NFT</div>
            <div className="__text">Your comprehensive wallet solution on extension & mobile app for everything
              Polkadot.
            </div>
            <Button
              shape={'circle'}
              schema="primary"
              className={'__button general-bordered-button'}
            >
              Download now
            </Button>
          </div>
        </div>

        <img className={'__image-background'} src="/images/mockups/mockup-1.png" alt="mock up"/>
      </div>

      <Footer className={'landing-footer'}/>
    </div>
  );
}

export const LandingPage = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    position: 'relative',
    backgroundColor: '#070620',

    '.bgi-background-landing-1, .bgi-background-landing-2': {
      position: 'absolute',
    },

    '.bgi-background-landing-1': {
      top: 0,
      left: 0,
      right: 0,
      backgroundPosition: 'center top',
      backgroundSize: 'cover',
      zIndex: 2,
      height: 1080,
    },

    '.bgi-background-landing-2': {
      left: 0,
      right: 0,
      bottom: 0,
      backgroundPosition: 'center bottom',
      backgroundSize: 'cover',
      zIndex: 1,
      height: 1422,
    },

    '.landing-header, .landing-footer, .landing-launch-area, .landing-boxes-area, .landing-install-app-area': {
      position: 'relative',
      zIndex: 5,
    },

    '.landing-header': {
      paddingTop: 48,
      paddingBottom: 48,
      maxWidth: 1472,
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    '.landing-launch-area': {
      textAlign: 'center',
      paddingTop: 176,
      paddingBottom: 140,

      '.__event-titles': {
        marginBottom: 56,
      },

      '.__minting-time': {
        fontSize: 40,
        fontWeight: 500,
        color: token.colorTextLight1,
        lineHeight: 1.3,
        marginBottom: 86,
      },

      '.__button': {
        maxWidth: 240,
        marginBottom: 182,
      },

      '.__slogan': {
        fontSize: 36,
        fontWeight: 500,
        color: token.colorSuccess,
        lineHeight: 1.3
      },
    },

    '.landing-boxes-area': {
      marginBottom: 200,
      display: 'flex',
      maxWidth: 1440,
      marginLeft: 'auto',
      marginRight: 'auto',
      gap: 32,
    },

    '.landing-install-app-area': {
      paddingLeft: 16,
      paddingRight: 16,
      marginBottom: 32,
      backgroundColor: token.colorBgDefault,
      position: 'relative',

      '.__image-background': {
        position: 'absolute',
        right: -10,
        bottom: 0,
        width: 1060,
        height: 'auto',
      },

      '.__inner-container': {
        width: '100%',
        position: 'relative',
        zIndex: 5,
        paddingTop: 110,
        paddingBottom: 84,
        maxWidth: 1440,
        marginLeft: 'auto',
        marginRight: 'auto',
      },

      '.__content-block': {
        maxWidth: 850,
      },

      '.__title': {
        fontSize: 40,
        fontWeight: 500,
        color: token.colorTextLight1,
        lineHeight: 1.3,
        marginBottom: 32,
      },

      '.__text': {
        fontSize: 22,
        color: token.colorTextLight1,
        lineHeight: 1.3,
        marginBottom: 48,
      },

      '.__button': {
        maxWidth: 284,
        width: '100%',
      },
    },

    '.landing-footer': {
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 16,
      paddingRight: 16,
      maxWidth: 1472,
      marginRight: 'auto',
      marginLeft: 'auto',
    },
  };
});
