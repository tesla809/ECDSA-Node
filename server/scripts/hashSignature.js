const { toHex } = require("ethereum-cryptography/utils"); 
const { keccak256 } = require("ethereum-cryptography/keccak");

async function hashSignature(_signature){
  return toHex(keccak256(_signature));
}

module.exports = hashSignature;