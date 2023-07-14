import React, {useContext, useEffect} from 'react';
import './App.css';
import {Header} from './components/Header';
import {Outlet, useNavigate} from 'react-router';
import {AppContext2, WalletContext} from './contexts';
import styled from 'styled-components';
import {ThemeProps} from './types';
import {Footer} from './components/Footer';

type Props = ThemeProps;

function Component({className}: Props) {
  const navigate = useNavigate();
  const {isMinted, mintCheckResult, currentAddress} = useContext(AppContext2);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (currentAddress) {
      if (isMinted) {
        navigate('/congratulation');
      } else {
        if (!mintCheckResult?.requestId) {
          navigate('/eligibility-check');
        }
      }
    }
  }, [currentAddress, navigate, isMinted, mintCheckResult?.requestId]);

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
    backgroundColor: token.colorBgDefault,
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
    },
  };
});

export default App;
