import {MintCheckResult, MintedNFTItem, MintedNftResponse, Theme, ThemeProps} from '../types';
import styled, {ThemeContext} from 'styled-components';
import React, {Context, useCallback, useContext, useEffect, useState} from 'react';
import {AppContext, WalletContext} from '../contexts';
import {Button, Form, Icon, Image, Input, Number} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {RuleObject} from '@subwallet/react-ui/es/form';
import {CheckCircle, Wallet, XCircle} from 'phosphor-react';
import LoadingIcon from '@subwallet/react-ui/es/button/LoadingIcon';

type Props = ThemeProps;

interface RecipientAddressInput {
  address?: string;
}

function Component({className, theme}: ThemeProps): React.ReactElement<Props> {
  const {
    isAppReady,
    collectionInfo,
    currentAddress,
    currentAccountData,
    setCurrentAccountData,
    mintedNft,
    setMintedNft,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'check' | 'confirm'>('check');
  const walletContext = useContext(WalletContext);
  const token = useContext<Theme>(ThemeContext as Context<Theme>).token;

  // Mint Data
  const [mintCheckResult, setMintCheckResult] = useState<Partial<MintCheckResult>>({});
  const [form] = Form.useForm<RecipientAddressInput>();
  const isSubstrateAddress = currentAddress && !isEthereumAddress(currentAddress);

  const accountAddressValidator = useCallback(
    (rule: RuleObject, value: string) => {
      if (isSubstrateAddress) {
        return Promise.resolve();
      }

      if (!value) {
        return Promise.reject('Address is required');
      }

      if (!isAddress(value)) {
        return Promise.reject('Invalid address');
      } else if (isEthereumAddress(value)) {
        return Promise.reject('Address must be substrate type');
      }

      return Promise.resolve();
    },
    []
  );

  const mintCheck = useCallback(
    () => {
      let cancel = false;
      const {userId, signature, randomCode} = currentAccountData;
      const campaignId = collectionInfo?.currentCampaignId;
      const needSign = isAppReady && !mintedNft && currentAddress! && userId && randomCode && !signature;
      const canCheck = isAppReady && !mintedNft && currentAddress && userId && signature && campaignId;

      // Sign message
      if (needSign) {
        setLoading(true);
        walletContext.signMessage(currentAddress, randomCode)
        .then((signature) => {
          if (!cancel && signature) {
            setCurrentAccountData({
              ...currentAccountData,
              signature,
            });
          }
        }).catch(console.error).finally(() => {
          setLoading(false);
        });
      } else if (canCheck) {
        // Ready to check mint
        if (currentAddress && userId && signature && campaignId) {
          APICall.mintCheck({
            address: currentAddress,
            userId,
            signature,
            campaignId,
          }).then((rs: MintCheckResult) => {
            if (!cancel) {
              setMintCheckResult(rs);
            }
          }).finally(() => {
            setLoading(false);
          });
        }
      }

      return () => {
        setLoading(false);
        cancel = true;
      };
    },
    [collectionInfo?.currentCampaignId, currentAccountData, currentAddress, isAppReady, mintedNft, walletContext],
  );

  const nextStep = useCallback(() => {
    const {isOwner, hasBalance, notDuplicated} = mintCheckResult;
    if (isOwner && hasBalance && notDuplicated) {
      setStep('confirm');
    }
  }, [mintCheckResult]);

  // Mint check if in step check
  useEffect(() => {
    mintCheck();
  }, [mintCheck]);

  const mintSubmit = () => {
    const recipient = isEthereumAddress(currentAddress) ? form.getFieldValue('address') : undefined;
    if (mintCheckResult?.requestId && currentAddress && (!recipient || isEthereumAddress(currentAddress))) {
      setLoading(true);
      APICall.mintSubmit(
        {
          requestId: mintCheckResult?.requestId,
          recipient: recipient || currentAddress
        }
      ).then((rs: MintedNftResponse) => {
        setMintedNft(rs);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className={className}>
      {step === 'check' && (
        <div className={'__box -step-check'}>
          <div className={'__box-left-part'}>
            <div className={'mockup-background-image'}></div>
          </div>
          <div className={'__box-right-part'}>
            <div className={'title __title'}>
              Eligibility check
            </div>
            <div className={'__checklist'}>
              <div className={'__checklist-item'}>
                {loading && <LoadingIcon loading existIcon prefixCls={'ant'}/>}
                {!loading && <Icon
                  customSize={'28px'}
                  iconColor={(mintCheckResult.isOwner && currentAccountData.signature) ? token.colorSuccess : token.colorError}
                  phosphorIcon={(mintCheckResult.isOwner && currentAccountData.signature) ? CheckCircle : XCircle}
                  weight={'fill'}/>}
                <div className={'__checklist-item-text'}>Own this wallet</div>
              </div>
              <div className={'__checklist-item'}>
                {loading && <LoadingIcon loading existIcon prefixCls={'ant'}/>}
                {!loading && <Icon customSize={'28px'} phosphorIcon={mintCheckResult.hasBalance ? CheckCircle : XCircle}
                                   iconColor={mintCheckResult.hasBalance ? token.colorSuccess : token.colorError}
                                   weight={'fill'}/>}
                <div className={'__checklist-item-text'}>Has balance</div>
              </div>
              <div className={'__checklist-item'}>
                {loading && <LoadingIcon loading existIcon prefixCls={'ant'}/>}
                {!loading &&
                  <Icon customSize={'28px'} phosphorIcon={mintCheckResult.notDuplicated ? CheckCircle : XCircle}
                        iconColor={mintCheckResult.notDuplicated ? token.colorSuccess : token.colorError}
                        weight={'fill'}/>}
                <div className={'__checklist-item-text'}>Minted before</div>
              </div>
            </div>

            <Button
              shape={'circle'}
              onClick={mintCheckResult.requestId ? nextStep : mintCheck}
              schema="primary"
              className={'__button general-bordered-button general-button-width'}
              loading={loading}>
              {loading ? 'Checking...' : mintCheckResult.requestId ? 'Mint for free' : 'Check Again'}
            </Button>
          </div>
        </div>

      )}
      {step === 'confirm' && (<div className={'__box -step-confirm'}>
        <div className={'__box-left-part'}>
          {
            collectionInfo && (
              <div className="__nft-image-wrapper">
                <Image className={'nft-image'}
                       width={'100%'}
                       height={'100%'}
                       src={collectionInfo.image}
                       shape={'default'}/>
              </div>
            )
          }
        </div>

        <div className={'__box-right-part'}>
          <div className={'title __title'}>
            Minting Detail
          </div>

          <div className={'__sub-title'}>
            Please confirm the following information
          </div>

          <div className={'__table'}>
            <div className={'__table-row'}>
              <div className={'__table-row-title'}>NFT:</div>
              <div className={'__table-row-value'}>{collectionInfo?.name}</div>
            </div>
            <div className={'__table-row'}>
              <div className={'__table-row-title'}>Network</div>
              <div className={'__table-row-value'}>{collectionInfo?.networkName}</div>
            </div>
            <div className={'__table-row'}>
              <div className={'__table-row-title'}>Price</div>
              <div className={'__table-row-value'}>Free</div>
            </div>
            <div className={'__table-row'}>
              <div className={'__table-row-title'}>Gas Fee</div>
              <div className={'__table-row-value'}>sponsored by SubWallet</div>
            </div>
            <div className={'__table-footer'}>
              <div className={'__table-row-title'}>Total</div>
              <div className={'__table-row-value'}>
                <Number
                  className={'__balance-value'}
                  decimal={0}
                  decimalOpacity={0.45}
                  size={20}
                  suffix="KSM"
                  value={'0.00'}
                />
              </div>
            </div>
          </div>

          <Form form={form} onFinish={mintSubmit} className={'mint-form'}>
            <Form.Item
              hidden={!!isSubstrateAddress}
              name={'address'}
              rules={[
                {
                  validator: accountAddressValidator
                }
              ]}
              statusHelpAsTooltip={true}
            >
              <Input
                placeholder={'Enter address'}
                prefix={<Wallet size={24}/>}
                type={'text'}
              />
            </Form.Item>

            <Button
              block
              shape={'circle'}
              onClick={form.submit}
              schema="primary"
              className={'__button general-bordered-button general-button-width'} loading={loading}>
              Mint for free
            </Button>
          </Form>
        </div>
      </div>)}
    </div>
  );
}

export const MintNft = styled(Component)<Props>(({theme: {token}}: Props) => {
  return {
    '.__box': {
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      position: 'relative',
    },

    '.__checklist': {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 48,
    },

    '.__checklist-item': {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      '.anticon': {
        fontSize: 28,
        width: 28,
        height: 28,
      },
    },

    '.__checklist-item-text': {
      fontSize: 20,
      lineHeight: 1.5,
    },

    '.__box.-step-check': {
      justifyContent: 'flex-end',
      minHeight: 600,

      '.__title': {
        fontSize: 44,
        marginBottom: 56,
      },

      '.__box-left-part': {
        '.mockup-background-image': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
          backgroundSize: 'auto auto',
        },
      },

      '.__box-right-part': {
        maxWidth: 610,
        marginRight: 90,
        paddingTop: 148,
        position: 'relative',
      },
    },

    '.__table': {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    },

    '.__table-row': {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
      lineHeight: '24px',
    },

    '.__table-footer': {
      borderTop: '4px solid rgba(33, 33, 33, 0.80)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 20,
      paddingTop: 22,
      paddingBottom: 22,
    },

    '.__nft-image-wrapper': {
      width: 448,
      height: 446,

      img: {
        borderWidth: 10,
      }
    },

    '.__table-row-title': {
      color: token.colorTextLight2
    },

    '.__table-row-value': {
      color: token.colorTextLight1
    },

    '.__box.-step-confirm': {
      '.__box-left-part': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 120,
      },

      '.__title': {
        fontSize: 52,
        lineHeight: '40px',
        marginBottom: 24,
      },

      '.__sub-title': {
        fontSize: 20,
        lineHeight: 1.5,
        marginBottom: 64,
        color: token.colorTextLight3,
      },

      '.__box-right-part': {
        flex: 10,
        maxWidth: 580,
        marginRight: 124,
        paddingTop: 80,
        paddingBottom: 100,
        position: 'relative',
      },

      '.__table': {
        marginBottom: 36,
      },
    },
  };
});
