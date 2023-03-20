import server from "./server";
import { useState } from "react";
import { Buffer } from 'buffer';

// ethereum cryptography for generating public address
import * as secp from "ethereum-cryptography/secp256k1"; // import everthing as secp
import { toHex } from "ethereum-cryptography/utils"; 
import { keccak256 } from "ethereum-cryptography/keccak";

/* change private key to signature */
function Wallet({ address, setAddress, balance, setBalance, signature, setSignature }) {
  
  const [privateKey, setPrivateKey] = useState("");

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChangeSignature(evt) {
    const _signature = evt.target.value;
    setSignature(_signature);
  }

  async function onChangePrivateKey(evt) {
    const _privateKey = evt.target.value;
    setPrivateKey(_privateKey);

    // convert from hex to Uint8Array
    const _tempPrivKey = Uint8Array.from(Buffer.from(evt.target.value, 'hex'));
    const ethAddress = derivePublicKeyFromPrivateKey(_tempPrivKey);
    console.log('ethAddress: ',ethAddress);

    // get balance from server
    const {
      data: { balance },
    } = await server.get(`balance/${ethAddress}`);

    // set ethAddress and its balance
    setAddress(ethAddress);
    setBalance(balance);
  }

  function derivePublicKeyFromPrivateKey(_privKey) {
      const _publicKey = secp.getPublicKey(_privKey);

    // create Ethereum-like address
    // keccak256 hash of public key, then take last 20 bytes
    const _publicKeyHash = toHex(keccak256(_publicKey)); // toHex() for readability
    const _ethAddress = '0x' + _publicKeyHash.slice(-20);   // get last 20 bytes for address
    return _ethAddress;
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      
      <label>
        Private Key (Not shared)
        <input placeholder="Generate public address. Private key NOT sent to server" value={privateKey} onChange={onChangePrivateKey}></input>
      </label>

      <label>
        Wallet Address
        <input placeholder="Or type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
/*
import * as secp from "ethereum-cryptography/secp256k1"; 
Since secp isn't exported as global variable wrapper
aka module.exports = secp. 

So get everything aka, then set to secp
*/