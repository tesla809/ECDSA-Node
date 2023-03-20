// dependent import
const secp = require("ethereum-cryptography/secp256k1");
const hashMessage = require("./hashMessage");

// recovery key true by default, can be set to false
async function signMessage(_msg, _privateKey, _recoverykey = true) {
  // hash message
  const messageHash = hashMessage(_msg);

  // sign message w/ private key, set recovered to true
  // see: https://github.com/ethereum/js-ethereum-cryptography#secp256k1-curve
  // how to use option is NOT listed here
  // instead seen here: https://medium.com/@jennifer_tieu/public-key-cryptography-exercises-hash-message-sign-message-recover-public-key-and-public-key-a1bf6099cd9d
  // doesn't mention need to return without await.
  return await secp.sign(messageHash, _privateKey, {recovered: _recoverykey});
}

module.exports = signMessage;