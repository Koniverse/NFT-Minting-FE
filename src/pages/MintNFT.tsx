import {Button, Icon, Image} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {NFTItem, ThemeProps} from "../types";
import {useCallback, useContext, useState} from "react";
import {AppContext} from "../contexts";
import {ENVIRONMENT} from "../utils/environment";
import {VideoInstruction} from "../components/VideoInstruction";
import {CollectionDescription} from "../components/CollectionDescription";
import {Drop, Ticket} from "phosphor-react";
import CollectionTitle from "../components/CollectionTitle";
import {ChainApiImpl} from "../api/chainApi";
import {APICall} from "../api/client";
import {useNotify} from "../hooks/useNotify";

type MintNFTProps = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<MintNFTProps> {
  const {collection, freeBalance, currentAccount, currentAddress, setMintedNFTs} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const onMint = useCallback(() => {
    if (collection && currentAccount) {
      setLoading(true);
      ChainApiImpl.mintNFT(collection.nftContractAddress, currentAccount)
        .then((rs) => {
          const fetchInput = {collection_address: collection.nftContractAddress, owner: currentAccount.address}
          let retry = 0;

          // Start checking minted NFT with delay 3 sec and 6 retry
          setTimeout(() => {
            const checkInterval = setInterval(() => {
              APICall.getNFTsByOwnerAndCollection(fetchInput)
                .then((rs: { ret: NFTItem[] }) => {
                  if (rs.ret && rs.ret.length > 0) {
                    clearInterval(checkInterval);
                    setMintedNFTs(rs.ret)
                    setLoading(false)
                  } else {
                    retry += 1
                    if (retry > 9) {
                      clearInterval(checkInterval);
                    }
                  }
                })
            }, 1000)
          }, 3000)
        }).catch((e) => {
        setLoading(false);
        notify.error({message: e?.message || 'Get error in minting process', placement: 'top'})
        console.error(e)
      });
    }
  }, [collection, currentAccount, notify, setMintedNFTs]);

  return (<div className={CN('common-page', className)}>
    {collection && <div>
      <CollectionTitle collection={collection}/>
      <div className={'mint-area'}>
        <Image className={'collection-image'} width={'100%'}
               src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>
        <div className={'mint-upper-layer'}>
          {freeBalance === 0 &&
            <Button className={'faucet-button'}
                    schema={'primary'}
                    onClick={() => {
                      navigator.clipboard.writeText(currentAddress || '');
                      setTimeout(() => {
                        window.open('https://faucet.test.azero.dev')
                      }, 100)
                    }}
                    icon={<Icon phosphorIcon={Drop} weight={'fill'}/>}>
              Copy address & faucet
            </Button>}
          {freeBalance > 0 &&
            <Button className={'mint-button'}
                    schema={'primary'}
                    loading={loading}
                    onClick={onMint}
                    icon={<Icon phosphorIcon={Ticket} weight={'fill'}/>}>
              Get your ticket
            </Button>}
        </div>
      </div>
      <CollectionDescription collection={collection}/>
    </div>}
    <VideoInstruction/>
  </div>)
}

const MintNFT = styled(Component)<MintNFTProps>(({theme}) => {
  return {
    '.mint-area': {
      position: 'relative',
      marginBottom: 8,

      '.mint-upper-layer': {
        position: 'absolute',
        borderRadius: 8,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'grayscale(100%)',
        backgroundColor: 'rgba(16, 16, 16, 0.6)',
      },

      '.mint-button, .faucet-button': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        paddingLeft: 45,
        paddingRight: 45,
      }
    },

    '.collection-description': {
      marginBottom: 16
    }
  }
});
export default MintNFT;