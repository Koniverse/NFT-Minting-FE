import React, {useContext, useEffect} from 'react';
import './App.css';
import {Header} from './components/Header';
import {Outlet, useNavigate} from 'react-router';
import {AppContext, WalletContext} from './contexts';
import styled from 'styled-components';
import {ThemeProps} from './types';
import {Footer} from './components/Footer';
import {Image} from '@subwallet/react-ui';
import loadingImage from './assets/dual-ball.svg';

type Props = ThemeProps;

function Component({className}: Props) {
  const navigate = useNavigate();
  const {mintedNft, currentAccountData, currentAddress, isAppReady} = useContext(AppContext);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (isAppReady) {
      if (!currentAddress || !(walletContext.wallet || walletContext.evmWallet)) {
        navigate('/connect-wallet');
      } else if (mintedNft) {
        navigate('/congratulation');
      } else {
        navigate('/mint-nft');
      }
    }
  }, [currentAddress, mintedNft, navigate, walletContext.wallet, walletContext.evmWallet, isAppReady]);

  return (
    <div className={className}>
      <div className="app-layout">
        <Header className={'app-header'}/>
        <div className={'app-body'}>
          {!isAppReady ? (<div className={'__loading'}>
            <Image
              src={loadingImage}
              // shape="none"
              width={200}
              height={200}
            />
          </div>)
            : <Outlet/>
          }
        </div>
        <Footer className={'app-footer'}/>
      </div>
    </div>
  );
}

const App = styled(Component)<Props>(({theme: {token}}: ThemeProps) => {
  return {
    height: '100%',
    overflow: 'auto',

    '.app-layout': {
      maxWidth: '1440px',
      height: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },

    '.app-header': {
      paddingTop: 48,
    },

    '.app-body': {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },

    '.app-footer': {
      paddingTop: 30,
      paddingBottom: 30,
    },

    '.__loading': {
      textAlign: 'center'
    }
  };
});

export default App;
