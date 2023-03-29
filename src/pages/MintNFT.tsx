import {Button, Image, Typography} from "@subwallet/react-ui";
import styled from "styled-components";
import CN from "classnames";
import {ThemeProps} from "../types";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AppContext, WalletContext} from "../contexts";
import {ENVIRONMENT} from "../utils/environment";
import launchpad_psp34_nft_standard from "../libs/launchpad-psp34-nft-standard";
import launchpad_psp34_nft_standard_calls, {getAccountBalanceOfPsp34NFT} from "../libs/launchpad-psp34-nft-standard-calls";
import {ContractPromise} from "@polkadot/api-contract";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {keyring, keyring as Keyring} from "@polkadot/ui-keyring";
import {WalletAccount} from "@subwallet/wallet-connect/types";
import {accounts} from "@polkadot/ui-keyring/observable/accounts";
import BN from "bn.js";
import {getPublicCurrentAccount, strToNumber} from "../utils";

type MintNFTProps = ThemeProps;
function Component({className}: ThemeProps): React.ReactElement<MintNFTProps> {
  const {collection, apiPromise, isApiReady} = useContext(AppContext);
  const [currentAccount, setCurrentAccount] = useLocalStorage('currentAccount');
  const [pairAccount, setPairAccount] = useState(null);
  const [collectionId, ] = useState(ENVIRONMENT.COLLECTION_ID);
  const walletContext = useContext(WalletContext);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [activePhaseId, setActivePhaseId] = useState(null);
  const [phasesInfo, setPhasesInfo] = useState([]);
  const isLastPhaseEnded = useMemo(() => {
    const lastPhase = [...phasesInfo]?.pop();

    // @ts-ignore
    const isEnded = lastPhase?.endTime < Date.now();

    return isEnded;
  }, [phasesInfo]);

  useEffect(() => {
    let isUnmounted = false;

    const fetchCurrentPhaseIdData = async () => {
      try {
        // setLoading(true);
        // @ts-ignore
        const launchpad_psp34_nft_standard_contract = new ContractPromise(apiPromise,
          launchpad_psp34_nft_standard.CONTRACT_ABI,
          collectionId
        );

        launchpad_psp34_nft_standard_calls.setContract(
          launchpad_psp34_nft_standard_contract
        );
        const id = await launchpad_psp34_nft_standard_calls.getCurrentPhase(
          getPublicCurrentAccount()
        );

        if (isUnmounted) return;
        console.log('setActivePhaseId')
        console.log(id);

        setActivePhaseId(id);
        // setLoading(false);
      } catch (error) {
        if (isUnmounted) return;

        // console.log(error.message);
        // setLoading(false);
      }
    };

    fetchCurrentPhaseIdData();
    // return () => (isUnmounted = true);
  }, [apiPromise, collectionId]);

  const fetchPublicPhasesInfoData = useCallback(
    async (isUnmounted: boolean) => {
      // setLoadingPhaseInfo(true);

      try {
        const totalPhase =
          await launchpad_psp34_nft_standard_calls.getLastPhaseId(
            getPublicCurrentAccount()
          );

        const allPhases = await Promise.all(
          [...new Array(totalPhase)].map(async (_, index) => {
            const totalCountWLAddress =
              await launchpad_psp34_nft_standard_calls.getPhaseAccountLastIndex(
                getPublicCurrentAccount(),
                index + 1
              );

            const data =
              await launchpad_psp34_nft_standard_calls.getPhaseScheduleById(
                getPublicCurrentAccount(),
                index + 1
              );

            const formattedData = {
              ...data,
              id: index + 1,

              publicClaimedAmount: strToNumber(data.publicClaimedAmount),
              publicRemainAmount:
                strToNumber(data.publicMintingAmount) -
                strToNumber(data.publicClaimedAmount),
              publicMintingFee: strToNumber(data.publicMintingFee),
              publicMintingAmount: strToNumber(data.publicMintingAmount),
              publicMaxMintingAmount: strToNumber(data.publicMaxMintingAmount),

              totalCountWLAddress: strToNumber(totalCountWLAddress),
              whitelistAmount: strToNumber(data.whitelistAmount),

              claimedAmount: strToNumber(data.claimedAmount),
              totalAmount: strToNumber(data.totalAmount),

              startTime: strToNumber(data.startTime),
              endTime: strToNumber(data.endTime),
            };

            return formattedData;
          })
        );

        // if (isUnmounted) return;
        console.log('vao dat ')
        console.log(allPhases)
        // @ts-ignore
        setPhasesInfo(allPhases.filter((p) => p.isActive === true));
        // setLoadingPhaseInfo(false);
      } catch (error) {
        if (isUnmounted) return;

        // setLoadingPhaseInfo(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [collectionId]
  );

  useEffect(() => {
    if (isLastPhaseEnded) {
      const lastPhase = [...phasesInfo]?.pop();
      return setCurrentPhase(lastPhase ?? null);
    }

    if (!activePhaseId) {
      const timeStampOnly = phasesInfo.reduce((prev, curr) => {
        // @ts-ignore
        prev.push(curr.startTime);
        // @ts-ignore
        prev.push(curr.endTime);
        return prev;
      }, []);

      let phase;

      for (let i = 0; i < timeStampOnly?.length; i++) {
        const p = timeStampOnly[i];
        const now = Date.now();

        if (now > p) {
          continue;
        }
        phase = phasesInfo[Math.floor(i / 2)];

        // setNextPhase(phase);
      }

      return setCurrentPhase(null);
    } else {
      // @ts-ignore
      const found = phasesInfo?.find((p) => p.id === parseInt(activePhaseId));
      setCurrentPhase(found ?? null);
    }
  }, [activePhaseId, isLastPhaseEnded, phasesInfo]);


  useEffect(() => {
    const getMyNFT = async () => {
      try {
        // @ts-ignore
        const launchpad_psp34_nft_standard_contract = new ContractPromise(apiPromise,
          launchpad_psp34_nft_standard.CONTRACT_ABI,
          collectionId
        );

        launchpad_psp34_nft_standard_calls.setContract(
          launchpad_psp34_nft_standard_contract
        );
        console.log(currentAccount)
        const allAccounts: WalletAccount[] = walletContext.accounts;
        // @ts-ignore
        const allNewAccounts = allAccounts.map(({ address, name }) => ({
          address,
          meta: { name },
        }));

        try {
          Keyring.loadAll({ isDevelopment: true }, allNewAccounts);
        } catch (error) {
          // @ts-ignore
          allAccounts.forEach(({ address, meta }) => {
            // Keyring.saveAddress(address, meta);
          });
        }
        // const keyringNew = new Keyring();
        const c = keyring.getPair(currentAccount)
        console.log(c)
        console.log('currentAccount')
        console.log(currentAccount)
        const totalNFTCount = await getAccountBalanceOfPsp34NFT({
          currentAccount: c, targetAddress: ''
        });
        console.log(totalNFTCount)
      } catch (e) {
        console.log(e)
      }
    }
    if (isApiReady) {
      getMyNFT();
    }
    fetchPublicPhasesInfoData(false)
  }, [isApiReady]);


  const handleMintNFT = async () => {
    console.log('handleMintNFT')
    try {
      // @ts-ignore
      const launchpad_psp34_nft_standard_contract = new ContractPromise(apiPromise,
        launchpad_psp34_nft_standard.CONTRACT_ABI,
        collectionId
      );

      launchpad_psp34_nft_standard_calls.setContract(
        launchpad_psp34_nft_standard_contract
      );
      const c = keyring.getPair(currentAccount)
      console.log(c)
      console.log('currentAccount')
      console.log(currentAccount)
      // @ts-ignore
      const { data } = await apiPromise.query.system.account(currentAccount);
      console.log(data)
      const balance =
        new BN(data.free).div(new BN(10 ** 6)).toNumber() / 10 ** 6 -
        new BN(data.miscFrozen).div(new BN(10 ** 6)).toNumber() / 10 ** 6;

      // @ts-ignore
      const mintingFee = currentPhase?.publicMintingFee / 10 ** 12;
      console.log(balance)
      console.log(mintingFee)
      console.log(currentPhase)
      // @ts-ignore
      const currentPhaseId = currentPhase ? currentPhase.id : 1;
      await launchpad_psp34_nft_standard_calls.publicMint(
        c,
        currentPhaseId,
        mintingFee,
        1,
        null,
        'publicMint',
        apiPromise,
        collectionId,
        walletContext.wallet
      );
    }catch (e) {

    }
  }

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
    <Button className={'mb-sm'} schema={'primary'} onClick={handleMintNFT} block={true}>MintNFT</Button>
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
