import {ThemeProps} from '../types';
import styled from 'styled-components';
import React from 'react';
import {DISCORD_URL, TELEGRAM_URL, TWITTER_URL} from '../constants';
import {DiscordLogo, TelegramLogo, TwitterLogo} from 'phosphor-react';
import {Button, Icon, Image, SwIconProps} from '@subwallet/react-ui';
import logo from '../assets/logo-with-text-light.svg';

type Props = ThemeProps;

enum SocialType {
  TWITTER = 'twitter',
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
}

class PhosphorIcon {
}

interface SocialItem {
  icon: SwIconProps['phosphorIcon']
  type: SocialType
  url: string
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
            size={'sm'}
            icon={(
              <Icon
                phosphorIcon={si.icon}
                type='phosphor'
                weight={'fill'}
                customSize={'28px'}
              />
            )}
            type={'ghost'}
            className={'__social-button'}
          />
        ))}
      </div>
      <div className={'__right-part'}>
        <Image className={'__logo'} width={'auto'} height={24} src={logo}/>
        <div className={'__divider'}></div>
        <div className={'__copy-right'}>
          @2023 subwallet.app All rights reserved
        </div>
      </div>
    </div>
  )
}

export const Footer = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    display: 'flex',
    '.__social-button': {
      color: token.colorTextLight1,

      '&:hover': {
        color: token.colorSuccess
      },
    },
    '.__left-part': {
      flex: 1,
    },
    '.__right-part': {
      display: 'flex',
      gap: token.sizeSM,
      alignItems: 'center'
    },
    '.__logo': {

    },
    '.__divider': {
      height: 24,
      width: 1,
      backgroundColor: token.colorWhite,
    },
    '.__copy-right': {
      fontSize: token.fontSizeLG,
      lineHeight: token.lineHeightLG,
    },
  }
});
