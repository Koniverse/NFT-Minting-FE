import {MintCheckResult, MintedNFTItem, ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {AppContext} from '../contexts';
import {Button, Form, Image, Input} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isAddress, isEthereumAddress} from '@polkadot/util-crypto';
import {RuleObject} from "@subwallet/react-ui/es/form";
import {Wallet} from "phosphor-react";

type Props = ThemeProps;

interface RecipientAddressInput {
  address?: string;
}

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const {
    collectionInfo,
    currentAddress,
    currentAccountData,
    setMintedNft,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'check' | 'confirm'>('check')

  // Mint Data
  const [mintCheckResult, setMintCheckResult] = useState<MintCheckResult | undefined>(undefined);
  const [isMinted, setIsMinted] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isCheckFetchMintedNftDone, setIsCheckFetchMintedNftDone] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);

  const [form] = Form.useForm<RecipientAddressInput>();

  const isReadyToMintCheck =
    !mintCheckResult
    && isCheckFetchMintedNftDone
    && !isMinting
    && !isMinted
    && collectionInfo?.currentCampaignId
    && currentAccountData.userId
    && currentAccountData.signature
    && currentAddress;

  useEffect(() => {
    if (currentAddress && currentAccountData.userId && currentAccountData.signature && isReadyToMintCheck) {
      APICall.mintCheck({
        address: currentAddress,
        campaignId: collectionInfo?.currentCampaignId,
        userId: currentAccountData.userId,
        signature: currentAccountData.signature,
      }).then((rs: MintCheckResult) => {
        setMintCheckResult(rs);
      });
    }
  }, [isReadyToMintCheck, collectionInfo?.currentCampaignId, currentAccountData, currentAddress]);

  const accountAddressValidator = useCallback(
    (rule: RuleObject, value: string) => {

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


  const minCheck = () => {
    const { userId, signature} = currentAccountData;
    const campaignId = collectionInfo?.currentCampaignId;

    if (currentAddress && userId && signature && campaignId) {

      APICall.mintCheck({
        address: currentAddress,
        userId,
        signature,
        campaignId,
      }).then((rs: MintCheckResult) => {

      });
    }

  }

  const mintSubmit = () => {
    if (mintCheckResult?.requestId && currentAddress && (!recipient || isEthereumAddress(currentAddress))) {
      setLoading(true);
      APICall.mintSubmit(
        {
          requestId: mintCheckResult?.requestId,
          recipient: recipient || currentAddress
        }
      ).then((rs: MintedNFTItem) => {
        setMintedNft(rs);
        setIsMinted(true);
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className={className}>
      {step === 'check' && (
        <Form form={form}>
          <Form.Item
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
            onClick={form.submit}
            schema="primary"
          >
            Start to mint
          </Button>
        </Form>
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

          <Button onClick={mintSubmit} className={'__button'} loading={loading}>
            Mint for free
          </Button>
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
      marginLeft: 30
    },

    '.__table': {},

    '.__table-row': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});
