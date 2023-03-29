import {Button, Icon, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useContext} from "react";
import {AppContext} from "../contexts";
import CollectionTitle from "../components/CollectionTitle";
import CollectionImage from "../components/CollectionImage";
import {CheckCircle} from "phosphor-react";

type NFTResultProps = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<NFTResultProps> {
  const {collection, mintedNFTs} = useContext(AppContext);

  return (<div className={CN('common-page', className)}>
    {collection && mintedNFTs && mintedNFTs.length > 0 && <div>
      <CollectionTitle collection={collection}/>
      <CollectionImage className={'collection-image'} collection={collection}/>
      <Typography.Title level={4} className={'nft-title'}>
        {collection.name.toUpperCase()}
        <span className={'nft-number'}>#{mintedNFTs[0].name}</span>
      </Typography.Title>
    </div>}
    <Button schema={"secondary"}
            icon={<Icon phosphorIcon={CheckCircle} weight={"fill"}/>}
            ghost={true}
            block={true}>
      Successfully
    </Button>
  </div>)
}

const NFTResult = styled(Component)<NFTResultProps>(({theme}) => {
  return {
    '.collection-image': {
      marginBottom: 24
    },
    '.nft-title': {
      textAlign: 'center',
      marginBottom: 24,
    },
    '.nft-number': {
      color: theme.token.colorSecondary
    }
  }
});
export default NFTResult;