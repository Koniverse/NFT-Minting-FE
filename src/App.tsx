import React, {useContext, useEffect} from 'react';
import './App.css';
import {Header} from "./components/Header";
import {Outlet, useNavigate} from "react-router";
import {AppContext, WalletContext} from "./contexts";

function App() {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (walletContext.wallet === undefined) {
      navigate('/welcome');
    } else if (!appContext.mintedNFTs || appContext.mintedNFTs.length === 0) {
      navigate('/mint-nft');
    } else {
      navigate('/result')
    }
  }, [appContext.mintedNFTs, navigate, walletContext.wallet]);


  return (
    <div className="main-wrapper">
      <div className="main-content">
        <Header/>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
