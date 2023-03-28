import React, {useContext, useEffect} from 'react';
import './App.css';
import {Header} from "./components/Header";
import {Outlet, useNavigate} from "react-router";
import {WalletContext} from "./contexts";

function App() {
  const navigate = useNavigate();
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (walletContext.wallet === undefined) {
      navigate('/welcome');
    } else {
      // Todo: If NFT is not minted
      navigate('/mint-nft');

      // Todo: If NFT is minted
      // navigate('/result');
    }
  }, [navigate, walletContext.wallet]);


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
