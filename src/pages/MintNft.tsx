import {MintCheckResult, MintedNftResponse, Theme, ThemeProps} from '../types';
import styled, {ThemeContext} from 'styled-components';
import React, {Context, useCallback, useContext, useEffect, useState} from 'react';
import {AppContext, WalletContext} from '../contexts';
import {Button, Form, Icon, Input, Number} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {RuleObject} from '@subwallet/react-ui/es/form';
import {ArrowCircleUpRight, CheckCircle, Question, Wallet, XCircle} from 'phosphor-react';
import LoadingIcon from '@subwallet/react-ui/es/button/LoadingIcon';
import CN from 'classnames';
import Collection from '../components/Collection';

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
    label = 'Check Eligibility';
  } else if (needRecheck) {
    label = 'Check Again';
  }

  let onClick: (() => void) | undefined = needSign ? signAction : nextAction;
  if (isLoading) {
    onClick = undefined;
  } else if (needRecheck) {
    onClick = recheckAction;
  }

  return <Button
    onClick={onClick}
    shape={'circle'}
    schema="primary"
    className={'__button general-button'}
    icon={<Icon
      phosphorIcon={ArrowCircleUpRight}
      weight="fill"
    />}
    loading={isLoading}>
    {label}
  </Button>;
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
    const needSign = isAppReady && !mintedNft && currentAddress && userId && randomCode && !signature;
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
    <div className={CN(className, {
      '-step-check': step === 'check',
      '-step-confirm': step === 'confirm',
    })}>
      <div className="__left-part">
        {
          collectionInfo && (
            <Collection collection={collectionInfo} className={'__image-wrapper'}/>
          )
        }
      </div>

      {step === 'check' && (
        <div className={'__right-part -step-check'}>
          <div className={'title __title'}>
            Eligibility check
          </div>
          <div className={'__checklist'}>
            <div className={'__checklist-item'}>
              <StatusIcon isLoading={loading} checked={!!currentAccountData.signature}
                          checkResult={!!(mintCheckResult.isOwner && currentAccountData.signature)}/>
              <div className={'__checklist-item-text'}>You own this wallet</div>
            </div>
            <div className={'__checklist-item'}>
              <StatusIcon isLoading={loading} checked={mintCheckResult.hasBalance !== undefined}
                          checkResult={mintCheckResult.hasBalance}/>
              <div className={'__checklist-item-text'}>You have assets on at least one of 60+ Polkadot chains</div>
            </div>
            <div className={'__checklist-item'}>
              <StatusIcon isLoading={loading} checked={mintCheckResult.notDuplicated !== undefined}
                          checkResult={mintCheckResult.notDuplicated}/>
              <div className={'__checklist-item-text'}>This is your first time minting this NFT</div>
            </div>
          </div>

          <NextButton isLoading={loading}
                      needSign={!currentAccountData.signature}
                      needRecheck={!!currentAccountData.signature && (!mintCheckResult.hasBalance || !mintCheckResult.notDuplicated)}
                      recheckAction={mintCheck}
                      signAction={signToCheck}
                      nextAction={nextStep}/>
        </div>

      )}

      {step === 'confirm' && (<div className={'__right-part -step-confirm'}>
        <div className={'title __title'}>
          Minting Detail
        </div>

        <div className={'__sub-title'}>
          Please confirm the following information
        </div>

        <div className={'__table'}>
          <div className={'__table-row'}>
            <div className={'__table-row-title'}>NFT</div>
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
              placeholder={'Fill your Substrate address to Mint'}
              prefix={<Wallet size={24}/>}
              type={'text'}
            />
          </Form.Item>
          {
            !isSubstrateAddress && (
              <div className="__note">Polkadot Power Passport is minted on Kusama, which is a Substrate chain. Please
                enter your Substrate address to mint your NFT.</div>
            )
          }
          <Button
            shape={'circle'}
            onClick={form.submit}
            schema="primary"
            icon={<Icon
              phosphorIcon={ArrowCircleUpRight}
              weight="fill"
            />}
            className={'__button general-button'} loading={loading}>
            Mint for free
          </Button>
        </Form>
      </div>)}
    </div>
  );
}

export const MintNft = styled(Component)<Props>(({theme: {token, extendToken}}: Props) => {
  return {
    // ---- general ----
    maxWidth: 1120,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 74,

    '&.-step-confirm': {
      maxWidth: 1180,
    },

    '.__image-wrapper': {
      width: 480,
      height: 480,
    },

    '.__title': {
      fontSize: 40,
      letterSpacing: 2,
      lineHeight: 1
    },

    '.__right-part': {
      flex: 1,
    },

    // ---- step check ----

    '.__checklist': {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginBottom: 50,
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
      fontSize: 16,
      lineHeight: 1.5,
    },

    '.__right-part.-step-check': {
      '.__title': {
        marginBottom: 48,
      },
    },

    // ---- step confirm ----

    '.__note': {
      fontFamily: 'inherit !important',
      fontSize: 16,
      lineHeight: '24px',
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
      flexWrap: 'wrap',
      lineHeight: '24px',

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
      flexWrap: 'wrap',

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

    '.__table-row-title': {
      color: token.colorTextLight2
    },

    '.__table-row-value': {
      color: token.colorTextLight1,
      paddingRight: 16,
    },

    '.__right-part.-step-confirm': {
      '.__title': {
        marginBottom: 12,
      },

      '.__sub-title': {
        color: token.colorTextLight3,
        fontSize: 20,
        lineHeight: 1.5,
        marginBottom: 40,
      },

      '.__table': {
        marginBottom: 20,
      },

      '.__button': {
        marginTop: 20,
      },
    },

    // ---- responsive ----

    '@media(max-width: 1199px)': {
      gap: 40,
      '.__image-wrapper': {
        width: 400,
        height: 400,
      },
    },

    '@media(max-width: 991px)': {
      '.__image-wrapper': {
        maxWidth: 400,
        width: '100%',
        height: 'auto',
      },

      '.__title': {
        textAlign: 'center',
      },

      flexDirection: 'column',

      '.__right-part.-step-check': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },

      '.__right-part.-step-confirm': {
        maxWidth: 600,
        '.__sub-title': {
          textAlign: 'center',
        },

        '.ant-form': {
          textAlign: 'center',
        },
      },
    },
  };
});
