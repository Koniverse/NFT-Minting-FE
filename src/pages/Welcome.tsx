import {Button, Icon, Image, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useCallback, useContext, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {getWalletBySource, isWalletInstalled} from "@subwallet/wallet-connect/dotsama/wallets";
import {ENVIRONMENT} from "../utils/environment";
import {Wallet} from "phosphor-react";
import {VideoInstruction} from "../components/VideoInstruction";
import {CollectionDescription} from "../components/CollectionDescription";
import {getEvmWalletBySource} from "@subwallet/wallet-connect/evm/evmWallets";

type WelcomeProps = ThemeProps;

function Component({className}: ThemeProps): React.ReactElement<WelcomeProps> {
  const [isInstallSubWallet] = useState(isWalletInstalled('subwallet-js'));
  const {collection} = useContext(AppContext);
  const walletContext = useContext(WalletContext);

  const onConnectSubstrateWallet = useCallback(() => {
    const wallet = getWalletBySource('subwallet-js');
    walletContext.setWallet(wallet, 'substrate');
  }, [walletContext]);

  const onConnectEvmWallet = useCallback(() => {
    const wallet = getEvmWalletBySource('SubWallet');
    walletContext.setWallet(wallet, 'evm');
  }, [walletContext]);

  const onInstallWallet = useCallback(() => {
    window.open(`https://mobile.subwallet.app/?url=${encodeURI(window.location.href)}`)
  }, []);

  return (<div className={CN('common-page', className)}>
    {collection && <div>
      <Typography.Title className={'collection-title'} level={4}>
        {collection?.name}
      </Typography.Title>
      <Image className={'collection-image'} width={262} height={262}
             src={ENVIRONMENT.ARTZERO_IMAGE_PATTERN.replace('{{id}}', collection?.avatarImage)} shape={'default'}/>
      <CollectionDescription collection={collection} />
    </div>}
    {isInstallSubWallet && (
        <>
          <Button className={'mb-md'}
                  schema={'primary'}
                  onClick={onConnectSubstrateWallet}
                  icon={<Icon phosphorIcon={Wallet} weight={"fill"}/>}
                  block={true}>
            Connect Substrate Wallet
          </Button>
          <Button className={'mb-md'}
                  schema={'primary'}
                  onClick={onConnectEvmWallet}
                  icon={<Icon phosphorIcon={Wallet} weight={"fill"}/>}
                  block={true}>
            Connect EVM Wallet
          </Button>
        </>
    )}
    {!isInstallSubWallet && <Button className={'mb-md'}
            schema={'primary'}
            onClick={onInstallWallet}
            icon={<Icon phosphorIcon={Wallet} weight={"fill"}/>}
            block={true}>
      Install Wallet
    </Button>}
    <VideoInstruction />
  </div>)
}

const Welcome = styled(Component)<WelcomeProps>(({theme}) => {
  return {
    textAlign: "center",
    '.collection-title': {
      marginBottom: 24,
    },
    '.collection-image': {
      marginBottom: 24
    }
  }
});
export default Welcome;
