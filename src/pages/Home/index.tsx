import React, {useCallback} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {Button} from '@subwallet/react-ui';
import {BoxItem1} from './boxes/BoxItem1';
import {BoxItem2} from './boxes/BoxItem2';
import {BoxItem3} from './boxes/BoxItem3';
import {EventTitles} from '../EventTitles';
import {useNavigate} from 'react-router';

type Props = ThemeProps;

function Component({className}: Props): React.ReactElement<Props> {
  const navigate = useNavigate();

  const goConnect = useCallback(
    () => {
      navigate('/connect-wallet')
    },
    [navigate],
  );

  return (
    <div className={className}>
      <div className={'home-launch-area'}>
        <EventTitles className={'__event-titles'}/>
        <div className={'__minting-time'}>
          Minting period: 17 Jul - 23 Jul
        </div>

        <Button
          block
          shape={'circle'}
          schema="primary"
          onClick={goConnect}
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

      <div className={'home-boxes-area'}>
        <BoxItem1 className={'__box-item'}/>
        <BoxItem2 className={'__box-item'}/>
        <BoxItem3 className={'__box-item'}/>
      </div>
    </div>
  );
}

export const Home = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    position: 'relative',

    '.home-launch-area': {
      textAlign: 'center',

      '.__event-titles': {

      },

      '.__subtitle': {
        fontSize: 36,
        color: token.colorTextLight2,
        lineHeight: 1.3
      },

      '.__minting-time': {
        fontSize: 40,
        fontWeight: 700,
        color: token.colorTextLight1,
        lineHeight: 1.3,
        marginBottom: 86,
      },

      '.__button': {
        maxWidth: 240,
        marginBottom: 182,
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {
        paddingTop: 28,

        '.__event-titles': {
          marginBottom: 46,
        },

        '.__minting-time': {
          fontSize: 20,
          marginBottom: 64,
        },

        '.__slogan': {
          fontSize: 20,
        },

        '.__button': {
          marginBottom: 104,
        },
      },
    },

    '.home-boxes-area': {
      display: 'flex',
      maxWidth: 1440,
      marginLeft: 'auto',
      marginRight: 'auto',
      gap: 32,

      '.__box-item': {
        flex: 1,
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {
        '.__box-item': {
          flex: '0 1 auto',
        },
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 96,
        paddingLeft: 32,
        paddingRight: 32,
        gap: 16,
      },
    },
  };
});
