const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { extractPublicKey } = require("./helper")

const privateKey = secp.utils.randomPrivateKey()

console.log("private key: ", toHex(privateKey))

const publicKey = extractPublicKey(secp.getPublicKey(privateKey))

console.log("public key: ", publicKey)

// const publicKeyBuffer = Buffer.from(publicKey, "hex") // replace with actual public key
// const hash = keccak256(publicKeyBuffer)
// const address = "0x" + Buffer.from(hash).slice(-20).toString("hex")
// console.log(address, "address") // should output a valid Ethereum address
