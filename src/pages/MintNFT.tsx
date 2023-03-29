import {Button, Icon, Image} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useCallback, useContext, useState} from "react";
import {AppContext} from "../contexts";
import {ENVIRONMENT} from "../utils/environment";
import {VideoInstruction} from "../components/VideoInstruction";
import {CollectionDescription} from "../components/CollectionDescription";
import {Drop, Ticket} from "phosphor-react";
import CollectionTitle from "../components/CollectionTitle";

type MintNFTProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<MintNFTProps> {
  const {collection, freeBalance, setMintedNFTs} = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const onMint = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000)
  }, []);

  return (<div className={CN('common-page', className)}>
    {collection && <div>
      <CollectionTitle collection={collection} />
      <div className={'mint-area'}>
        <Image className={'collection-image'} width={'100%'} src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>
        <div className={'mint-upper-layer'}>
          <Button className={'mint-button'}
                  schema={'primary'}
                  loading={loading}
                  onClick={onMint}
                  icon={<Icon phosphorIcon={Ticket} weight={'fill'}/>}>
            Get your ticket
          </Button>
        </div>
      </div>
      <CollectionDescription collection={collection} />
    </div>}
    {freeBalance === 0 && (<Button className={'faucet-button mb-sm'}
            schema={'secondary'}
            onClick={() => {window.open('https://faucet.test.azero.dev')}}
            icon={<Icon phosphorIcon={Drop} weight={'fill'} />}
            block={true}>
      Faucet Token
    </Button>)}
    <VideoInstruction />
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

      '.mint-button': {
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