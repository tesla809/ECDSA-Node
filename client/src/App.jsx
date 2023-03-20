import Wallet from "./Wallet";
import Transfer from "./Transfer";
import DigitalSignature from "./DigitalSignature";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  
  // changed from private key to digital signature 
  const [signature, setSignature] = useState("");
  
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        signature={signature}
        setSignature={setSignature}
        address={address}
        setAddress={setAddress}
      />
      <DigitalSignature 
        setBalance={setBalance} 
        address={address} 
      />
      <Transfer 
        setBalance={setBalance} 
        address={address} 
      />
    </div>
  );
}

export default App;
