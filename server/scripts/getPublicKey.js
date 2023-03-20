const secp = require("ethereum-cryptography/secp256k1");
const hashMessage = require("./hashMessage");

function getPublicKey(sender, recipient, amount, _signature, _recoveryBit = true) {
  const _msg = sender + recipient + amount;
  const _msgHash = hashMessage(_msg);
  
  return secp.recoverPublicKey(_msgHash, _signature, _recoveryBit);
  return 'damn';
}

module.exports = getPublicKey;