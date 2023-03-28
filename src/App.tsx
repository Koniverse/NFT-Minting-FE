import React, {useEffect} from 'react';
import './App.css';
import {Header} from "./components/Header";
import {Outlet, useNavigate} from "react-router";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Todo: If wallet not connect
    navigate('/welcome');

    // Todo: If NFT is not minted
    // navigate('/mint-nft');

    // Todo: If NFT is minted
    // navigate('/result');
  }, [navigate]);


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
