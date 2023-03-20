const { utf8ToBytes } = require("ethereum-cryptography/utils"); 
const { keccak256 } = require("ethereum-cryptography/keccak");

function hashMessage(message) {
  // string -> utf8 bytes - get utf8 representation of string letters
  const messageBytes = utf8ToBytes(message);

  // utf8 -> hash - hash the letters
  const messageHashArray = keccak256(messageBytes);

  // return value - hash of message in hexadecimal
  return messageHashArray;
}

module.exports = hashMessage;