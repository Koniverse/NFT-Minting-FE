import {ThemeProps} from '../../types';
import styled from 'styled-components';
import React, {useContext} from 'react';
import {Button} from '@subwallet/react-ui';
import {EventTitles} from './EventTitles';
import {AppContext} from '../../contexts';

type Props = ThemeProps & {
  onClickButton: () => void
};

function Component({className, onClickButton}: Props): React.ReactElement<Props> {
  const {collectionInfo} = useContext(AppContext);

  return (
    <div className={className}>
      <EventTitles className={'__event-titles'}/>

      <div className={'__subtitle'}>
        <span>Exclusive for holders of</span>
        <span> Polkadot ecosystem’s relaychain </span>
        <span>and parachain projects</span>
      </div>

      <div className={'__mint-count'}>
        Already minted: {collectionInfo?.minted}
      </div>

      <Button shape={'circle'} className={'general-bordered-button general-button-width'} onClick={onClickButton}>
        Mint for Free
      </Button>
    </div>
  );
}

export const Welcome = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '.__event-titles': {
      marginBottom: 44
    },

    '.__subtitle': {
      fontSize: 32,
      lineHeight: 1.3,
      maxWidth: 1090,
      textAlign: 'center',
      marginBottom: 32,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: 16,
        padding: `0 ${token.paddingXL}px`
      }
    },
    '.__mint-count': {
      fontSize: 48,
      lineHeight: 1.3,
      fontWeight: '700',
      color: token.colorSecondary,
      marginBottom: 60,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 24,
        marginBottom: 48,
      }
    },
  };
});
