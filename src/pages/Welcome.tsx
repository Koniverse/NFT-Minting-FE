import {Button, Image, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useCallback, useContext, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {getWalletBySource, isWalletInstalled} from "@subwallet/wallet-connect/dotsama/wallets";
import {ENVIRONMENT} from "../utils/environment";

type WelcomeProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<WelcomeProps> {
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
      <Image className={'project-image'} width={262} height={262} src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>
      <Typography.Paragraph className={'project-description'}>
        {collection?.description},
        <a target={'_blank'} href={`${ENVIRONMENT.ARTZERO_PORTAL}/#/launchpad/${collection?.nftContractAddress}`} rel="noreferrer">see more</a>
      </Typography.Paragraph>
    </div>}
    <Button className={'mb-sm'} schema={'primary'} onClick={onConnectWallet} disabled={isInstallSubWallet} block={true}>Connect Wallet</Button>
  </div>)
}

const Welcome = styled(Component)<WelcomeProps>(({theme}) => {
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
export default Welcome;