import { useState } from "react";
import server from "./server";

import { utf8ToBytes, toHex } from "ethereum-cryptography/utils"; 
import { keccak256 }  from"ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function DigitalSignature({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function createSignature(evt) {
    evt.preventDefault();

    const msg = sender + parseInt(sendAmount) + recipient;
    const msgHash = keccak256(utf8ToBytes(msg));
    const msgSign = await secp.sign(msgHash, privateKey, {recovered: 1});
    console.log('msgSign:', msgSign);
    const msgSignHex = toHex(msgSign[0]); // compensate for recoverykey
    console.log('msgSignHex: ', msgSignHex)

    setSignature(msgSignHex);
  }

  return (
    <form className="container transfer" onSubmit={createSignature}>
      <h1>Create Digital Signature</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Sender
        <input
          placeholder="Type address of sender, for example: 0x2"
          value={sender}
          onChange={setValue(setSender)}
        ></input>
      </label>

      <label>
        PrivateKey
        <input
          placeholder="Add PrivateKey"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Digital Signature
        <input
          placeholder="Type an address, for example: 0x2"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Create Signature" />
    </form>
  );
}

export default DigitalSignature;
