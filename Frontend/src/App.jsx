import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import gif from '../cat-coding.gif'
import abi from "./utils/WavePortal.json"


const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try{
    
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }
    
    console.log("We have the Ethereum object", ethereum);

    const accounts = await ethereum.request({method: 'eth_accounts'});

    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account : ", account);
      return account;
    }else {
      console.error("No authorized account found");
      return null;
    }
    
  }catch(error){
    console.error(error);
    return null;
  }
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xdA16dcCC23D2272f5fF791EBc3edfE62b674D399";
  const contractABI = abi.abi;
  

  const connectWallet = async () => {
    try{
      const ethereum = getEthereumObject();
      if(!ethereum){
        alert("Get Metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch(error){
      console.log(error);
    }
  };

  const wave = async () => {
    try{
      const {ethereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTx = await waveContract.wave(inputMsg.value, {gasLimit: 300000});
        const message = "Waved"
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.log(error);
    };
  };

  const getAllWaves = async () => {
    try {
      const ethereum = window;
      if(ethereum){
        const provider = ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesInfo = [];
        waves.forEach(wave => {
          waveInfo.push({
            address: wave.waver,
            message: wave.message,
            timestamp: new Date(wave.timestamp * 1000)
          });
        });

        setAllWaves(wavesInfo);
      }else{
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      
    }
  }

  useEffect(()=> {
    
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="gif"><img src={gif}></img></div>
      
        <div className="bio">
        Welcome! I am Anvikshik 🐈 and I am learning Web3.
          <p><em>Connect your MetaMask wallet, say hi and throw me a wave. You'll have a 50% chance to win 0.005 ETH just by sending me a wave</em></p>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me 🙋‍♂️
        </button>

        { !currentAccount && (
        <button className = "waveButton" onClick={connectWallet}>
          Connect Wallet 🪙</button>
        )}

        {allWaves.map((wave,index) => {
          return(
            <div key={index} style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
              <div>Address: {wave.address}</div>
              <div>TimeStamp: {wave.timestamp}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default App;