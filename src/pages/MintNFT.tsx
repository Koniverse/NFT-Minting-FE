import {Button, Image, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useContext} from "react";
import {AppContext} from "../contexts";
import {ENVIRONMENT} from "../utils/environment";

type MintNFTProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<MintNFTProps> {
  const {collection} = useContext(AppContext);

  return (<div className={CN('common-page', className)}>
    {collection && <div>
      <Typography.Title className={'project-title'} level={4}>
        {collection?.name}
      </Typography.Title>
      <Image className={'project-image'} width={262} height={262} src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>
      <Typography.Paragraph className={'project-description'}>
        {collection?.description},
        <a target={'_blank'} href={`${ENVIRONMENT.ARTZERO_PORTAL}/#/launchpad/${collection?.nftContractAddress}`} rel="noreferrer">see more</a>
      </Typography.Paragraph>
    </div>}
    <Button className={'mb-sm'} schema={'primary'} block={true}>MintNFT</Button>
    <Button className={'mb-sm'} schema={"secondary"} ghost={true} block={true}>Video Instructions</Button>
  </div>)
}

const MintNFT = styled(Component)<MintNFTProps>(({theme}) => {
  return {
    textAlign: 'center',

    '.project-title': {
      marginBottom: 24
    },
    '.project-image': {
      marginBottom: 24,
      height: 262,
    },
    '.project-description': {
      marginBottom: 16
    }
  }
});
export default MintNFT;