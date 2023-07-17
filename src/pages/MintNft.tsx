import {MintCheckResult, MintedNftResponse, Theme, ThemeProps} from '../types';
import styled, {ThemeContext} from 'styled-components';
import React, {Context, useCallback, useContext, useEffect, useState} from 'react';
import {AppContext, WalletContext} from '../contexts';
import {Button, Form, Icon, Input, Number} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {RuleObject} from '@subwallet/react-ui/es/form';
import {CheckCircle, Question, Wallet, XCircle} from 'phosphor-react';
import LoadingIcon from '@subwallet/react-ui/es/button/LoadingIcon';
import NftImage from "../components/NftImage";

type Props = ThemeProps;

interface RecipientAddressInput {
  address?: string;
}

interface SIProps {
  isLoading: boolean;
  checked: boolean;
  checkResult?: boolean;
}


interface NBProps {
  isLoading: boolean;
  needSign: boolean;
  needRecheck: boolean;
  signAction: () => void;
  nextAction: () => void;
  recheckAction: () => void;
}

function StatusIcon({isLoading, checked, checkResult}: SIProps) {
  const token = useContext<Theme>(ThemeContext as Context<Theme>).token;
  if (isLoading && !checkResult) {
    return <LoadingIcon loading existIcon prefixCls={'ant'}/>;
  }

  if (checked) {
    return <Icon
      iconColor={checkResult ? token.colorSuccess : token.colorError}
      phosphorIcon={checkResult ? CheckCircle : XCircle}
      weight={'fill'}/>;
  } else {
    return <Icon
      iconColor={token.colorBorder}
      phosphorIcon={Question}
      weight={'fill'}/>;
  }
}

function NextButton({isLoading, needSign, needRecheck, signAction, recheckAction, nextAction}: NBProps) {
  let label = 'Mint for free';
  if (isLoading) {
    label = 'Checking...';
  } else if (needSign) {
    label = 'Check Eligibility'
  } else if (needRecheck) {
    label = 'Check Again'
  }

  let onClick: (() => void) | undefined = needSign ? signAction : nextAction;
  if (isLoading) {
    onClick = undefined
  } if (needRecheck) {
    onClick = recheckAction;
  }

  return <Button
    onClick={onClick}
    shape={'circle'}
    schema="primary"
    className={'__button general-bordered-button general-button-width'}
    loading={isLoading}>
    {label}
  </Button>
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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'check' | 'confirm'>('check');
  const walletContext = useContext(WalletContext);

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
    [isSubstrateAddress]
  );

  const signToCheck = useCallback(() => {
    const {userId, signature, randomCode} = currentAccountData;
    const needSign = isAppReady && !mintedNft && currentAddress! && userId && randomCode && !signature;
    if (needSign) {
      setLoading(true);
      walletContext.signMessage(currentAddress, randomCode)
        .then((signature) => {
          if (signature) {
            setMintCheckResult({isOwner: true});
            setCurrentAccountData({
              ...currentAccountData,
              signature,
            });
          }
        })
        .catch(() => {
          setMintCheckResult({isOwner: false});
        })
        .finally(() => {
        setLoading(false);
      });
    }
  }, [currentAccountData, currentAddress, isAppReady, mintedNft, setCurrentAccountData, walletContext]);

  const mintCheck = useCallback(
    () => {
      let cancel = false;
      const {userId, signature, randomCode} = currentAccountData;
      const campaignId = collectionInfo?.currentCampaignId;
      const needSign = isAppReady && !mintedNft && currentAddress! && userId && randomCode && !signature;
      const canCheck = isAppReady && !mintedNft && currentAddress && userId && signature && campaignId;

      // Sign message
      if (needSign) {
        setMintCheckResult({});
      } else if (canCheck) {
        setLoading(true);
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
      } else {
        setStep('check');
        setMintCheckResult({});
      }

      return () => {
        setLoading(false);
        cancel = true;
      };
    },
    [collectionInfo?.currentCampaignId, currentAccountData, currentAddress, isAppReady, mintedNft, signToCheck],
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
            <div className={'bgi-mockup-2'}></div>
          </div>
          <div className={'__box-right-part'}>
            <div className={'title __title'}>
              Eligibility check
            </div>
            <div className={'__checklist'}>
              <div className={'__checklist-item'}>
                <StatusIcon isLoading={loading} checked={!!currentAccountData.signature}
                            checkResult={!!(mintCheckResult.isOwner && currentAccountData.signature)}/>
                <div className={'__checklist-item-text'}>Own this wallet</div>
              </div>
              <div className={'__checklist-item'}>
                <StatusIcon isLoading={loading} checked={mintCheckResult.hasBalance !== undefined}
                            checkResult={mintCheckResult.hasBalance}/>
                <div className={'__checklist-item-text'}>Has balance</div>
              </div>
              <div className={'__checklist-item'}>
                <StatusIcon isLoading={loading} checked={mintCheckResult.notDuplicated !== undefined}
                            checkResult={mintCheckResult.notDuplicated}/>
                <div className={'__checklist-item-text'}>Can mint this collection</div>
              </div>
            </div>

            <NextButton isLoading={loading}
                        needSign={!currentAccountData.signature}
                        needRecheck={!!currentAccountData.signature && (!mintCheckResult.hasBalance || !mintCheckResult.notDuplicated)}
                        recheckAction={mintCheck}
                        signAction={signToCheck}
                        nextAction={nextStep}/>
          </div>
        </div>

      )}
      {step === 'confirm' && (<div className={'__box -step-confirm'}>
        <div className={'__box-left-part'}>
          {
            collectionInfo && (
              <>
                <div className="__nft-image-wrapper">
                  <NftImage src={collectionInfo.image} />
                </div>
              </>
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

          {
            collectionInfo && (
              <div className="__nft-image-wrapper -show-on-mobile">
                <NftImage src={collectionInfo.image} />
              </div>
            )
          }

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

export const MintNft = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    '.__box': {
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      position: 'relative',
      borderRadius: token.size,
      flexDirection: 'row',

      [`@media(max-width:${extendToken.mobileSize})`]: {
        flexDirection: 'column',
      },
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

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 24,
          width: 24,
          height: 24,
        },
      },
    },

    '.__checklist-item-text': {
      fontSize: 20,
      lineHeight: 1.5,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 16,
      },
    },

    '.__box.-step-check': {
      justifyContent: 'flex-end',
      minHeight: 600,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        alignItems: 'center',
        justifyContent: 'start',
        maxWidth: 500,
      },

      '.__title': {
        fontSize: 44,
        marginBottom: 56,

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 22,
          marginBottom: 24,
        },
      },

      '.__box-left-part': {
        '.bgi-mockup-2': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
          backgroundSize: 'auto auto',

          [`@media(min-width:992px) and (max-width: 1300px)`]: {
            opacity: 0.4,
          },

          [`@media(max-width:${extendToken.mobileSize})`]: {
            backgroundSize: 'auto 242px',
            opacity: 1,
          },
        },
      },

      '.__box-right-part': {
        maxWidth: 610,
        marginRight: 90,
        paddingTop: 148,
        position: 'relative',

        [`@media(max-width:${extendToken.mobileSize})`]: {
          paddingTop: 56,
          marginRight: 0,
          alignSelf: 'stretch',
          paddingLeft: 16,
          paddingRight: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
    },

    '.__table': {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        gap: 12,
        alignSelf: 'stretch',
      },
    },

    '.__table-row': {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
      lineHeight: '24px',
      gap: 16,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        fontSize: 14,
        lineHeight: '22px',
      },
    },

    '.__table-footer': {
      borderTop: '4px solid rgba(33, 33, 33, 0.80)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 20,
      paddingTop: 22,
      paddingBottom: 22,

      [`@media(max-width:${extendToken.mobileSize})`]: {
        borderTopWidth: 2,
        fontSize: 16,
        paddingTop: 12,
        paddingBottom: 12,

        '.ant-typography': {
          fontSize: 'inherit !important',
        }
      },
    },

    '.__nft-image-wrapper': {
      maxWidth: 448,
      position: 'relative',
      width: '100%',

      '&.-show-on-mobile': {
        [`@media(min-width:992px)`]: {
          display: 'none'
        },
      },

      '&:before': {
        content: '\'\'',
        display: 'block',
        paddingTop: '100%',
      },

      '.ant-image': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },

      img: {
        borderWidth: 10,
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {
        maxWidth: 192,

        img: {
          borderWidth: 4,
        },
      },
    },

    '.__table-row-title': {
      color: token.colorTextLight2
    },

    '.__table-row-value': {
      color: token.colorTextLight1
    },

    '.__box.-step-confirm': {
      '.__table': {
        marginBottom: 18,
      },

      '.__button': {
        marginTop: 18,
      },

      [`@media(max-width:${extendToken.mobileSize})`]: {
        justifyContent: 'start',
        maxWidth: 500,

        '.ant-form': {
          alignSelf: 'stretch'
        },

        '.__button': {
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'flex'
        },
      },

      '.__box-left-part': {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 120,

        [`@media(min-width:1100px) and (max-width:1599px)`]: {
          paddingLeft: 60,
        },

        [`@media(min-width:992px) and (max-width:1099px)`]: {
          paddingLeft: 32,
        },

        [`@media(max-width:${extendToken.mobileSize})`]: {
          display: 'none',
        },
      },

      '.__title': {
        fontSize: 52,
        lineHeight: '40px',
        marginBottom: 24,

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 28,
          lineHeight: '1.3',
          marginBottom: 4,
        },
      },

      '.__sub-title': {
        fontSize: 20,
        lineHeight: 1.5,
        marginBottom: 64,
        color: token.colorTextLight3,

        [`@media(max-width:${extendToken.mobileSize})`]: {
          fontSize: 14,
          marginBottom: 24,
        },
      },

      '.__box-right-part': {
        flex: 10,
        maxWidth: 580,
        marginRight: 124,
        marginLeft: 124,
        paddingTop: 80,
        paddingBottom: 100,
        position: 'relative',

        [`@media(min-width:1100px) and (max-width:1599px)`]: {
          marginRight: 60,
          marginLeft: 60,
        },

        [`@media(min-width:992px) and (max-width:1099px)`]: {
          marginRight: 32,
          marginLeft: 32,
        },

        [`@media(max-width:${extendToken.mobileSize})`]: {
          marginRight: 16,
          marginLeft: 16,
          paddingTop: 56,
          paddingBottom: 44,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          '.__nft-image-wrapper': {
            marginBottom: 24,
          },
        },
      },
    },
  };
});
