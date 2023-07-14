import {MintedNFTItem, ThemeProps} from '../types';
import styled from 'styled-components';
import React, {useContext} from 'react';
import {useNavigate} from 'react-router';
import {AppContext2} from '../contexts';
import {Button, Image} from '@subwallet/react-ui';
import {APICall} from '../api/nft';
import {isEthereumAddress} from '@polkadot/util-crypto';

type Props = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<Props> {
  const navigate = useNavigate();
  const {
    collectionInfo,
    mintCheckResult,
    recipient,
    currentAddress,
    setMintedNft,
    setIsMinted
  } = useContext(AppContext2);

  const mintSubmit = () => {
    if (mintCheckResult?.requestId && currentAddress && (!recipient || isEthereumAddress(currentAddress))) {
      APICall.mintSubmit(
        {
          requestId: mintCheckResult?.requestId,
          recipient: recipient || currentAddress
        }
      ).then((rs: MintedNFTItem) => {
        setMintedNft(rs);
        setIsMinted(true);
      });
    }
  };

  return (
    <div className={className}>
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

          <Button onClick={mintSubmit} className={'__button'}>
            Mint for free
          </Button>
        </div>
      </div>
    </div>
  );
}

export const MintDetail = styled(Component)<Props>(({theme: {token}}: Props) => {
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

    '.__table': {},

    '.__table-row': {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});
