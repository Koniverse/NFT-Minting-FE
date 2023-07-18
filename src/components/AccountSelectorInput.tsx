import React, {useCallback, useContext} from 'react';
import styled from 'styled-components';
import {Icon, ModalContext, Typography} from '@subwallet/react-ui';
import {ThemeProps} from '../types';
import {AppContext} from '../contexts';
import AccountItem from '@subwallet/react-ui/es/web3-block/account-item';
import {toShort} from '@subwallet/react-ui/es/_util/address';
import {CaretDown} from 'phosphor-react';
import CN from 'classnames';
import {SELECT_ACCOUNT_MODAL} from "../constants";


type AccountSelectorInputProps = ThemeProps;

const modalId = SELECT_ACCOUNT_MODAL;

export const Component = ({className}: AccountSelectorInputProps): React.ReactElement => {
  const appState = useContext(AppContext);
  const { activeModal } = useContext(ModalContext);

  const account  = appState.walletAccount;

  const onOpen = useCallback(() => {
    activeModal(modalId)
  }, [activeModal])

  return (
    <div className={CN(className, '__input-container')} onClick={onOpen}>
      <div className="__input-wrapper">
        <div className="__input-content">
          {
            account ? (
              <AccountItem
                className={'selected-account-item'}
                address={account.address}
                renderMiddleItem={() => {
                  return <>
                    <span className={'__name'}>{account.name}</span>
                    <span className={'__address'}>({toShort(account.address, 0, 3)})</span>
                  </>;
                }}
                avatarSize={20}
                avatarIdentPrefix={0}
              />
            ) : (
              <Typography.Text>Select account</Typography.Text>
            )
          }
        </div>
        <div className={'__input-suffix'}><Icon type='phosphor' phosphorIcon={CaretDown} size='sm' /></div>
      </div>
    </div>
  );
};

export const AccountSelectorInput = styled(Component)<AccountSelectorInputProps>(({theme}) => {
  const token = theme.token;
  return {
    '&.__input-container': {
      borderRadius: '50px',
      cursor: 'pointer',
      display: 'flex',
      color: token.colorTextTertiary,
      lineHeight: token.lineHeightLG,
      position: 'relative',
      background: token.colorBgSecondary,

      '&:hover': {
        background: token.colorBgInput,

        '.selected-account-item': {
          background: token.colorBgInput,
        }
      }
    },

    '.__input-wrapper': {
      padding: '9px 16px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      overflow: 'hidden',
    },

    '.ant-account-item': {
      padding: 0,
      paddingRight: 6,
      '.ant-web3-block-middle-item': {
        width: 150,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      },
    },

    '.selected-account-item': {
      '.__name': {
        color: token.colorText,
        marginRight: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 99,
      },
      '.__address': {
        display: 'inline-block',
        whiteSpace: 'nowrap'
      },
    },
    '.__input-suffix': {
      position: 'relative',
      top: 1,
    }
  };
});
