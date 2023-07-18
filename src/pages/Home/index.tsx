import React, {useCallback, useContext, useMemo} from 'react';
import styled from 'styled-components';
import {ThemeProps} from '../../types';
import {Button, Icon} from '@subwallet/react-ui';
import {BoxItem1} from './boxes/BoxItem1';
import {BoxItem2} from './boxes/BoxItem2';
import {BoxItem3} from './boxes/BoxItem3';
import {EventTitles} from '../EventTitles';
import {useNavigate} from 'react-router';
import { GlobeHemisphereWest } from 'phosphor-react';
import {AppContext} from "../../contexts";

type Props = ThemeProps;

function formatDateToCustomFormat(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();

  return `${day} ${month} ${hours}:${minutes}`;
}

function Component({className}: Props): React.ReactElement<Props> {
  const navigate = useNavigate();
  const {collectionInfo} = useContext(AppContext);
  const mintingPeriod = useMemo(() => {
    const currentCampaign = collectionInfo?.currentCampaign;
    if (currentCampaign) {
      return `${formatDateToCustomFormat(currentCampaign.startTimeObj)} - ${formatDateToCustomFormat(currentCampaign.endTimeObj)}`;
    }

    return '';
  }, [collectionInfo?.currentCampaign]);

  const goConnect = useCallback(
    () => {
      navigate('/connect-wallet');
    },
    [navigate],
  );

  return (
    <div className={className}>
      <div className={'home-launch-area'}>
        <EventTitles className={'__event-titles'}/>

        <div className={'__subtitle'}>
          Proof of asset for Polkadot ecosystem holder
        </div>

        <div className={'__minting-time'}>
          <span className={'__label'}>Minting period:</span> <span className={'__value'}>{mintingPeriod}</span>
        </div>

        <Button
          shape={'circle'}
          schema="primary"
          size={'sm'}
          onClick={goConnect}
          className={'__button general-button'}
          icon={<Icon
            phosphorIcon={GlobeHemisphereWest}
            weight="fill"
          />}
        >
          Launch app
        </Button>
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
      paddingBottom: 78,

      '.__event-titles': {
        marginBottom: 34,
      },

      '.__subtitle': {
        fontSize: token.fontSizeLG,
        color: token.colorTextLight2,
        lineHeight: token.lineHeightLG,
        fontWeight: '700',
        marginBottom: 16,
      },

      '.__minting-time': {
        fontSize: token.fontSizeLG,
        color: token.colorSuccess,
        lineHeight: token.lineHeightLG,
        fontWeight: '700',
        marginBottom: 48,
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {

      },
    },

    '.__minting-time': {
      '.__label,.__value': {
        display: 'inline-block',
      }
    },

    '.home-boxes-area': {
      display: 'flex',
      maxWidth: 1440,
      marginLeft: 'auto',
      marginRight: 'auto',
      gap: 32,
      marginBottom: 38,

      '.__box-item': {
        flex: 1,
      },

      [`@media(max-width:1199px)`]: {
        '.__box-item': {
          flex: '0 1 auto',
        },
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
      },
    },
  };
});
