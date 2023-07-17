import {ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useContext} from 'react';
import {AppContext} from '../contexts';
import {Icon} from '@subwallet/react-ui';
import {DISCORD_URL, DOWNLOAD_URL} from '../constants';
import {FacebookLogo, TwitterLogo} from 'phosphor-react';
import NftImage from "../components/NftImage";

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
            <NftImage src={mintedNft?.nftImage || ''}/>
          </div>

          <div className={'title __title'}>
            Superb!
          </div>

          <div className="__text-container">
            <div className={'__text'}>
              Open your <span className={'__highlight'}>SubWallet extension</span> or <a className={'__highlight'}  href={DOWNLOAD_URL} target={'_blank'}>mobile app</a> to view your Polkadot
              Power Passport. There may be occasional delays due to network stability.
            </div>
            <div className={'__text'}>
              View NFT on <a className={'__highlight'} href={singularLink} target={'_blank'}>Singular</a>
            </div>
            <div className={'__text -with-complex-content'}>
            <span>
              Share the good news on
            </span>

              <div className={'__share-container'}>
                <a target={'_blank'} className={'__button-link'}>
                  <Icon phosphorIcon={TwitterLogo} weight={'fill'} iconColor={'#2595E6'}/>
                  Twitter
                </a>

                <a target={'_blank'} className={'__button-link'}>
                  <Icon phosphorIcon={FacebookLogo} weight={'fill'} iconColor={'#2565E6'}/>
                  Facebook
                </a>
              </div>
            </div>
            <div className={'__text'}>
              Join <a className={'__highlight'} href={DISCORD_URL} target={'_blank'}>SubWallet Discord</a> to track
              Polkadot ecosystem campaigns & activities.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Congratulation = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    '.__box': {
      maxWidth: '950px',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      borderRadius: 16,
      paddingLeft: 16,
      paddingRight: 16,
    },

    '.__box-inner': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      maxWidth: 704,
      paddingTop: 64,
      paddingBottom: 72,
      margin: 'auto',
    },

    '.__image-wrapper': {
      width: 180,
      height: 180,
      marginBottom: 56,
      position: 'relative',

      'img, .__video': {
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
      justifyContent: 'center'
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

      '.anticon': {
        fontSize: 28
      },
    },

    '.__button-link + .__button-link': {
      paddingLeft: 0,
    },

    '.__text-container': {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    },

    '@media(max-width: 991px)': {
      '.__image-wrapper': {
        width: 124,
        height: 124,
        marginBottom: 36,
      },

      '.__box-inner': {
        paddingTop: 56,
        paddingBottom: 44,
      },

      '.__text-container': {
        gap: 20,
      },

      '.__title': {
        fontSize: 40,
        lineHeight: '30px',
        marginBottom: 32,
      },

      '.__text': {
        fontSize: 14,
      },

      '.__share-container': {
        marginTop: 8,
        flexBasis: '100%',
      },

      '.__button-link': {
        '.anticon': {
          fontSize: 20
        },
      },
    }
  };
});
