import {ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useContext} from 'react';
import {AppContext} from '../contexts';
import {Icon, Image} from '@subwallet/react-ui';
import {DISCORD_URL} from '../constants';
import {FacebookLogo, TwitterLogo} from 'phosphor-react';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const {mintedNft, collectionInfo} = useContext(AppContext);

  const singularLink = collectionInfo && mintedNft
    ? `https://singular.app/collectibles/${collectionInfo?.network}/${collectionInfo?.rmrkCollectionId}/${mintedNft?.rmrkNftId}`
    : 'https://singular.app';

  return (
    <div className={className}>
      <div className="__box">
        <div className="__box-inner">
          <div className={'__image-wrapper'}>
            <Image
              className={'nft-image'}
              width={'100%'}
              height={'100%'}
              src={mintedNft?.nftImage}
              shape={'default'}/>
          </div>

          <div className={'title __title'}>
            Superb!
          </div>

          <div className="__text-container">
            <div className={'__text'}>
              Open your <span className={'__highlight'}>SubWallet extension</span> or mobile app to view your Polkadot
              Power
              Passport. There may be occasional delays due to network stability.
            </div>
            <div className={'__text'}>
              View NFT on <a className={'__highlight'} href={singularLink} target={'_blank'}>Singular</a>
            </div>
            <div className={'__text -with-complex-content'}>
            <span>
              Share the good news on
            </span>

              <a target={'_blank'} className={'__button-link'}>
                <Icon phosphorIcon={TwitterLogo} weight={'fill'} iconColor={'#2595E6'} customSize={'28px'}/>
                Twitter
              </a>

              <a target={'_blank'} className={'__button-link'}>
                <Icon phosphorIcon={FacebookLogo} weight={'fill'} iconColor={'#2565E6'} customSize={'28px'}/>
                Facebook
              </a>
            </div>
            <div className={'__text'}>
              Join <a className={'__highlight'} href={DISCORD_URL} target={'_blank'}>SubWallet Discord</a> to track
              Polkadot
              ecosystem retroactive & aridrop campaigns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Congratulation = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    paddingLeft: 16,
    paddingRight: 16,

    '.__box': {
      maxWidth: '950px',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      borderRadius: 16,
      padding: 16,
    },

    '.__box-inner': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      maxWidth: 704,
      paddingBottom: 56,
      paddingTop: 48,
      margin: 'auto',
    },

    '.__image-wrapper': {
      width: 180,
      height: 180,
      marginBottom: 56,

      img: {
        borderWidth: 4,
      }
    },

    '.__title': {
      fontSize: 64,
      lineHeight: '48px',
      marginBottom: 48,
    },

    '.__text': {
      fontSize: 20,
      color: token.colorTextLight3,
      lineHeight: 1.5
    },

    '.__text.-with-complex-content': {
      display: 'flex',
      flexWrap: 'wrap',
    },

    '.__highlight': {
      color: token.colorSuccess
    },

    'a.__highlight': {
      textDecoration: 'underline'
    },

    '.__button-link': {
      display: 'inline-flex',
      gap: 8,
      paddingLeft: 8,
      paddingRight: 8,
    },

    '.__button-link + .__button-link': {
      paddingLeft: 0,
    },

    '.__text-container': {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },
  };
});
