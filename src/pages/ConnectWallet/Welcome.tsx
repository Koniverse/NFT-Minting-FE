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
        Exclusive for holders of Polkadot ecosystem’s relaychain
        and parachain projects
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

export const Welcome = styled(Component)<Props>(({theme: {token}}: Props) => {
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
    },
    '.__mint-count': {
      fontSize: 48,
      lineHeight: 1.3,
      fontWeight: '700',
      color: token.colorSecondary,
      marginBottom: 60,
    },
  };
});
