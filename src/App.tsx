import React, {useContext, useEffect} from 'react';
import './App.css';
import {Header} from './components/Header';
import {Outlet, useNavigate} from 'react-router';
import {AppContext, WalletContext} from './contexts';
import styled from 'styled-components';
import {ThemeProps} from './types';
import {Footer} from './components/Footer';

type Props = ThemeProps;

function Component({className}: Props) {
  const navigate = useNavigate();
  const {mintedNft, currentAccountData, currentAddress} = useContext(AppContext);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (!currentAddress || !walletContext.wallet) {
      navigate('/connect-wallet');
    } else if (mintedNft) {
      navigate('/congratulation');
    } else {
      navigate('/mint-nft')
    }
  }, [currentAddress, mintedNft, navigate, walletContext.wallet]);

  return (
    <div className={className}>
      <div className="app-layout">
        <Header className={'app-header'}/>
        <div className={'app-body'}>
          <Outlet/>
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
    '.app-body': {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  };
});

export default App;
