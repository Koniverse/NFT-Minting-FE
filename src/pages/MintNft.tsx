import {MintCheckResult, MintedNFTItem, ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {AppContext, WalletContext} from '../contexts';
import {Button, Form, Icon, Image, Input, List, Typography} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {RuleObject} from "@subwallet/react-ui/es/form";
import {Check, CheckCircle, Wallet, XCircle} from "phosphor-react";

type Props = ThemeProps;

interface RecipientAddressInput {
  address?: string;
}

function Component({className}: ThemeProps): React.ReactElement<Props> {
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
  const [step, setStep] = useState<'check' | 'confirm'>('check')
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
      }
    },
    [collectionInfo?.currentCampaignId, currentAccountData, currentAddress, isAppReady, mintedNft, walletContext],
  );

  const nextStep = useCallback(() => {
    const {isOwner, hasBalance, notDuplicated} = mintCheckResult;
    if (isOwner && hasBalance && notDuplicated) {
      setStep('confirm');
    }
  }, [mintCheckResult])

  // Mint check if in step check
  useEffect(() => {
    mintCheck();
  }, [mintCheck])

  const mintSubmit = () => {
    const recipient = isEthereumAddress(currentAddress) ? form.getFieldValue('address') : undefined;
    if (mintCheckResult?.requestId && currentAddress && (!recipient || isEthereumAddress(currentAddress))) {
      setLoading(true);
      APICall.mintSubmit(
        {
          requestId: mintCheckResult?.requestId,
          recipient: recipient || currentAddress
        }
      ).then((rs: MintedNFTItem) => {
        setMintedNft(rs);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className={className}>
      {step === 'check' && (
        <div className={'__box'}>
          <div className={'__box-left-part'}>
            {
              collectionInfo && (
                <Image className={className}
                       width={'100%'}
                       src={collectionInfo.image}
                       shape={'default'}/>
              )
            }
          </div>
          <div className={'__box-right-part'}>
            <div className={'checklist'}>
              <Typography.Title>
                Check eligibility
              </Typography.Title>
              <div>
                <Icon size='sm' phosphorIcon={(mintCheckResult.isOwner && currentAccountData.signature) ? CheckCircle : XCircle}
                      weight={'fill'}/>
                <Typography.Text>Own this wallet</Typography.Text>
              </div>
              <div>
                <Icon size='sm' phosphorIcon={mintCheckResult.hasBalance ? CheckCircle : XCircle} weight={'fill'}/>
                <Typography.Text>Has balance</Typography.Text>
              </div>
              <div>
                <Icon size='sm' phosphorIcon={mintCheckResult.notDuplicated ? CheckCircle : XCircle} weight={'fill'}/>
                <Typography.Text>Minted before</Typography.Text>
              </div>
            </div>

            <Button block={true}
                    onClick={mintCheckResult.requestId ? nextStep : mintCheck}
                    schema="primary"
                    className={'__button'}
                    loading={loading}>
              {loading ? 'Checking...' : mintCheckResult.requestId ? 'Mint for free' : 'Check Again'}
            </Button>
          </div>
        </div>

      )}
      {step === 'confirm' && (<div className={'__box'}>
        <div className={'__box-left-part'}>
          {
            collectionInfo && (
              <Image className={className}
                     width={'100%'}
                     src={collectionInfo.image}
                     shape={'default'}/>
            )
          }
        </div>

        <div className={'__box-right-part'}>
          <div className={'__table'}>
            <div className={'__table-row'}>
              <div>NFT:</div>
              <div>{collectionInfo?.name}</div>
            </div>
            <div className={'__table-row'}>
              <div>Network</div>
              <div>{collectionInfo?.networkName}</div>
            </div>
            <div className={'__table-row'}>
              <div>Price</div>
              <div>Free</div>
            </div>
            <div className={'__table-row'}>
              <div>Gas Fee</div>
              <div>sponsored by SubWallet</div>
            </div>
            <div className={'__table-row'}>
              <div>Total</div>
              <div>0.00 KSM</div>
            </div>
          </div>

          <Form form={form} onFinish={mintSubmit} className={'mint-form'}>
            <Form.Item
              hidden={!isSubstrateAddress}
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

            <Button block
                  onClick={form.submit}
                  schema="primary"
                  className={'__button'} loading={loading}>
            Mint NFT
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
      paddingTop: 114,
      paddingBottom: 111,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: token.colorBgDefault,
      boxShadow: '4px 4px 32px 0px rgba(34, 84, 215, 0.30)',
      display: 'flex',
      justifyContent: 'center',
    },

    '.__box-left-part': {
      width: 500,
    },

    '.__box-right-part': {
      width: 500,
      marginLeft: 30
    },

    '.__table': {},

    '.__table-row': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});
