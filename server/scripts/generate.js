// generate.js
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils"); 
const { keccak256 } = require("ethereum-cryptography/keccak");
const signMessage = require("./signMessage");
const hashSignature = require("./hashSignature");

// generate private key
/* 
create private key
not secure though, 
as private keys need to be created client side
*/
const privateKey = secp.utils.randomPrivateKey();
// console.log('raw private key', privateKey);

// const privateKeyHex = toHex(privateKey)
// console.log('hex private key', privateKeyHex);

// const _tempPrivKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));
// console.log('again raw private key', _tempPrivKey);

// console.log('equal after change', toHex(privateKey) === toHex(_tempPrivKey));

// get public key from private key
const publicKey = secp.getPublicKey(privateKey);

// create Ethereum-like address
// keccak256 hash of public key, then take last 20 bytes
const publicKeyHash = toHex(keccak256(publicKey)); // toHex() for readability
const ethAddress = '0x' + publicKeyHash.slice(-20);   // get last 20 bytes for address

// sign message 
const msg = 'hello world!';

const signature = (async (_msg, _privateKey) => { 
  // console.log('digital signature to copy:', await signMessage(_msg, _privateKey));
  return await signMessage(_msg, _privateKey); 
})(msg, privateKey).then(async (msgSigned) => {
  let msgSignedHex = msgSigned.length === 2        // check if recovery bit is attached
    ? await hashSignature(msgSigned[0]) // get Uint8Array without recovery bit
    : await hashSignature(msgSigned)    // get Uint8Array, not the first element of Uint8Array
  // console.log("msg", msg);
  // console.log('hex sig:', msgSignedHex);
  return msgSignedHex;
});

console.log('private key', toHex(privateKey));
console.log('eth address', ethAddress);


/*
1. client sends digital signature to server
2. server gets public key from digital signature
means that only private key could have signed
3. link between priviate key and public key means 
if you get public key, its only from private key

private key -> signature -> public key -> verified

*/