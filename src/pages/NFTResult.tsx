import {Button, Image, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useCallback, useContext, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {getWalletBySource, isWalletInstalled} from "@subwallet/wallet-connect/dotsama/wallets";

type NFTResultProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<NFTResultProps> {
  const [isInstallSubWallet] = useState(isWalletInstalled('subwallet'));
  const {collection} = useContext(AppContext);
  const walletContext = useContext(WalletContext);

  const onConnectWallet = useCallback(() => {
    const wallet = getWalletBySource('subwallet-js');
    walletContext.setWallet(wallet, 'substrate');
  }, [walletContext]);

  return (<div className={CN('common-page', className)}>
    {collection && <div>
      <Typography.Title className={'project-title'} level={4}>
        {collection?.name}
      </Typography.Title>
      <Image className={'project-image'} width={262} height={262} src={`https://artzeronft.infura-ipfs.io/ipfs/${collection?.avatarImage}`} shape={'default'}/>
      <Typography.Paragraph className={'project-description'}>
        {collection?.description},
        <a target={'_blank'} href={`https://alephzero.artzero.io/#/launchpad/${collection?.nftContractAddress}`}>see more</a>
      </Typography.Paragraph>
    </div>}
    <Button className={'mb-sm'} schema={"secondary"} ghost={true} block={true}>Video Instructions</Button>
  </div>)
}

const NFTResult = styled(Component)<NFTResultProps>(({theme}) => {
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
export default NFTResult;