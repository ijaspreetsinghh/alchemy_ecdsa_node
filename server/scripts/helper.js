const { keccak256 } = require("ethereum-cryptography/keccak")
const { toHex } = require("ethereum-cryptography/utils")

function extractPublicKey(fullKey) {
	let keccakKey = keccak256(fullKey.slice(1, fullKey.length))
	return toHex(keccakKey.slice(keccakKey.length - 20, keccakKey.length))
}

module.exports = { extractPublicKey }
