import {ThemeProps} from '../types';
import styled from 'styled-components';
import React from 'react';
import {DISCORD_URL, TELEGRAM_URL, TWITTER_URL} from '../constants';
import {DiscordLogo, TelegramLogo, TwitterLogo} from 'phosphor-react';
import {Button, Icon, Image, SwIconProps} from '@subwallet/react-ui';
import logo from '../assets/logo-with-text.png';
import {openInNewTab} from '../utils/common/browser';

type Props = ThemeProps;

enum SocialType {
  TWITTER = 'twitter',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
}

interface SocialItem {
  icon: SwIconProps['phosphorIcon'];
  type: SocialType;
  url: string;
}

const socialItems: SocialItem[] = [
  {
    icon: TwitterLogo,
    type: SocialType.TWITTER,
    url: TWITTER_URL
  },
  {
    icon: TelegramLogo,
    type: SocialType.TELEGRAM,
    url: TELEGRAM_URL
  },
  {
    icon: DiscordLogo,
    type: SocialType.DISCORD,
    url: DISCORD_URL
  },
];

function Component({className}: ThemeProps): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className={'__left-part'}>
        {socialItems.map(si => (
          <Button
            key={si.type}
            size={'xs'}
            icon={(
              <Icon
                phosphorIcon={si.icon}
                type="phosphor"
                weight={'fill'}
              />
            )}
            type={'ghost'}
            className={'__social-button'}
            onClick={openInNewTab(si.url)}
          />
        ))}
      </div>
      <div className={'__right-part'}>
        <Image className={'__logo'} width={'auto'} shape={'square'} height="var(--logo-height)" src={logo}/>
        <div className={'__divider'}></div>
        <div className={'__copy-right'}>
          © 2023. All rights reserved
        </div>
      </div>
    </div>
  );
}

export const Footer = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    display: 'flex',

    [`@media(max-width:${extendToken.mobileSize})`]: {
      flexDirection: 'column',
      alignItems: 'center'
    },

    '.__social-button': {
      color: token.colorTextLight1,

      '.anticon.anticon.anticon': {
        fontSize: 28,
        width: 28,
        height: 28,

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 20,
          width: 20,
          height: 20,
        },
      },

      '&:hover': {
        color: token.colorPrimary
      },
    },
    '.__left-part': {
      display: 'flex',
      flex: 1,
      gap: 8,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        marginBottom: 2,
      },
    },
    '.__right-part': {
      display: 'flex',
      gap: token.sizeSM,
      alignItems: 'center',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flexDirection: 'column-reverse',
        alignItems: 'center'
      },
    },

    '.__logo': {
      '--logo-height': token.sizeLG,
    },

    '.__divider': {
      height: 24,
      width: 1,
      backgroundColor: token.colorWhite,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        display: 'none'
      }
    },
    '.__copy-right': {
      fontSize: 12,
      lineHeight: '24px',
    },
  };
});
