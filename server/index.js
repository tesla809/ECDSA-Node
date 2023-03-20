const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils"); 
const secp = require("ethereum-cryptography/secp256k1");

const balances = {
  "0x84595e055805706d62e1": 100,  // priv key: 1e61570f4854859683b7969925d4f0c81ca8c4d13f2f362800bb9fb8821004f1
  "0x0c50f04c03b6b97962fb": 50,   // priv key: 06ffc7f040b58bb3c37b06e8cbad47d410e72e3ea87aca88ebd9646b9d25bfe3
  "0x5a8bc2f38b4c83c5ce75": 75,   // priv key: 255d3b579335ef45854b73d2436354033f76b78eccd5d8c0ca550366ad3d3514
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // create hash just like on front end
  const msg = sender + amount + recipient;
  const msgHash = keccak256(utf8ToBytes(msg));

  // recover the public key from the signature
  const publicKey = secp.recoverPublicKey(msgHash, signature, 0); // recoveryBit = 1 on front end. For some reason flipping to 0 works. To 1 changes address

  // create Ethereum-like address
  // keccak256 hash of public key, then take last 20 bytes
  const _publicKeyHash = toHex(keccak256(publicKey)); // toHex() for readability
  const _ethAddress = '0x' + _publicKeyHash.slice(-20);   // get last 20 bytes for address

  console.log(_ethAddress);

  if (_ethAddress === sender) {
    console.log('Digital Signature matches Public Key!');

    // proceed to move money
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    console.log('Digital Signature DOES NOT matches Public Key!');
    res.status(400).send("invalid digital signature.");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
