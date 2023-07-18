import {ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useContext, useRef} from 'react';
import {AppContext} from '../contexts';
import {Button, Icon} from '@subwallet/react-ui';
import {DISCORD_URL, SHARE_TAGS, SHARE_TEXT, SHARE_URL} from '../constants';
import {FacebookLogo, TwitterLogo} from 'phosphor-react';
import NFT from '../components/NFT';
import {
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const {mintedNft, collectionInfo} = useContext(AppContext);
  const twitterRef = useRef(null);
  const facebookRef = useRef(null);

  const singularLink = collectionInfo && mintedNft
    ? `https://singular.app/collectibles/${collectionInfo?.network}/${collectionInfo?.rmrkCollectionId}/${mintedNft?.rmrkNftId}`
    : 'https://singular.app';

  const onShareTwitter = () => {
    // @ts-ignore
    twitterRef.current?.click();
  };

  const onShareFacebook = () => {
    // @ts-ignore
    facebookRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="__left-part">
        {mintedNft && <NFT nft={mintedNft} className={'__image-wrapper'}/>}
      </div>
      <div className="__right-part">
        <div className={'title __title'}>
          Superb!
        </div>

        <div className={'__text'}>
          Open your <span className={'__highlight'}>SubWallet</span> to view your Polkadot
          Power Passport. There may be occasional delays due to network stability.
        </div>

        <div className={'__share-container'}>
          <div className={'__share-label'}>Share the good news on</div>

          <div className="__share-buttons">
            <FacebookShareButton
              ref={facebookRef}
              quote={SHARE_TEXT}
              url={SHARE_URL}
              hashtag={SHARE_TAGS.join(' ')}
              className={'hidden'}
              children={undefined}
            />

            <TwitterShareButton className={'hidden'} ref={twitterRef} children={undefined} url={SHARE_URL} title={SHARE_TEXT} hashtags={SHARE_TAGS}/>
            <Button
              shape={'circle'}
              schema="primary"
              size={'sm'}
              onClick={onShareTwitter}
              className={'__button __twitter-button general-button'}
              icon={<Icon
                phosphorIcon={TwitterLogo}
                weight="fill"
              />}
            >
              Twitter
            </Button>

            <Button
              shape={'circle'}
              schema="primary"
              size={'sm'}
              onClick={onShareFacebook}
              className={'__button __facebook-button general-button'}
              icon={<Icon
                phosphorIcon={FacebookLogo}
                weight="fill"
              />}
            >
              Facebook
            </Button>
          </div>
        </div>

        <div className={'__text'}>
          Join <a className={'__highlight'} href={DISCORD_URL} target={'_blank'}>SubWallet Discord</a> to track
          Polkadot ecosystem campaigns & activities.
        </div>
      </div>
    </div>
  );
}

export const Congratulation = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    width: '100%',
    maxWidth: 1120,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 74,

    '.__image-wrapper': {
      width: 480,
      height: 480,
      position: 'relative',
    },

    '.__right-part': {
      display: 'flex',
      flexDirection: 'column',
      gap: 40,
    },

    '.__title': {
      fontSize: 40,
      lineHeight: 1,
    },

    '.__text': {
      fontWeight: '300',
      fontSize: 16,
      lineHeight: 1.5
    },

    '.__highlight': {
      color: token.colorPrimary,
      fontWeight: 500,
    },

    'a.__highlight': {
      color: token.colorTextLight3,
      transition: `${token.motionDurationMid} color`,

      '&:hover': {
        color: token.colorPrimary,
      },
    },

    '.__share-label': {
      color: token.colorTextLight3,
      fontSize: 20,
      lineHeight: 1.5,
      marginBottom: 24,
    },

    '.__share-buttons': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
    },

    '.__twitter-button': {
      backgroundColor: token['blue-7'],

      '&:hover': {
        backgroundColor: token['blue-5'],
      },

      '&:active': {
        backgroundColor: token['blue-4'],
      },
    },

    '.__facebook-button': {
      backgroundColor: token['geekblue-6'],

      '&:hover': {
        backgroundColor: token['geekblue-5'],
      },

      '&:active': {
        backgroundColor: token['geekblue-4'],
      },
    },

    '@media(max-width: 1199px)': {
      gap: 40,
      '.__image-wrapper': {
        width: 400,
        height: 400,
      },
    },

    '@media(max-width: 991px)': {
      '.__image-wrapper': {
        maxWidth: 240,
        width: '100%',
        height: 'auto',
      },

      flexDirection: 'column',

      '.__title': {
        fontSize: 36,
      },

      '.__right-part': {
        maxWidth: 600,
        textAlign: 'center',
        alignItems: 'center',
      },

      '.__share-buttons': {
        justifyContent: 'center',
      },
    },
  };
});
