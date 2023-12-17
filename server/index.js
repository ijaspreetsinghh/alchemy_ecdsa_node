const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const secp = require("ethereum-cryptography/secp256k1")
const { utf8ToBytes } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { extractPublicKey } = require("./scripts/helper")

app.use(cors())
app.use(express.json())

const balances = {
	//private: e6338c8fb69267e6a42c55a31f960247be5bc3713f8ca67f35653b7905a2636e
	bfe1a9760f8dd44e6d10f0ab34a0df243107152d: 50,
	//private: bf3a7ce98cbec518dd089facc6033443ee5927edfb2dd0e4a8e80ee7800ba052
	c772491ecd8e0fb19e077233d76d52af41d099cb: 75,
	//private: 969ad90cc6ad39bd500bdf22cf1e404a2e814075a51ddbbfcc4b76afc51895e8
	d37554b39ba217fd04853f8dec9c01e92e29e05d: 100,
}
app.get("/balance/:address", (req, res) => {
	const { address } = req.params
	const balance = balances[address] || 0
	res.send({ balance })
})

function verifySignature(fullSignature, msg, pubKey) {
	const msgHash = keccak256(utf8ToBytes(msg))
	let signature = fullSignature.slice(0, fullSignature.length - 1)
	let recovery = parseInt(fullSignature[fullSignature.length - 1])
	const sigPubKey = secp.recoverPublicKey(msgHash, signature, recovery)
	const keyFromSig = extractPublicKey(sigPubKey)
	return keyFromSig == pubKey
}

app.post("/send", (req, res) => {
	//get a signature from client side
	//recover public address from the signature
	const { sender, recipient, amount, signature } = req.body

	setInitialBalance(sender)
	setInitialBalance(recipient)

	const message = `Transfer ${amount} from ${sender} to ${recipient}`

	let isValid = verifySignature(signature, message, sender)
	if (isValid === false) {
		return res.status(400).send({ message: "Invalid Signature!" })
	}

	if (balances[sender] < amount) {
		res.status(400).send({ message: "Not enough funds!" })
	} else {
		balances[sender] -= amount
		balances[recipient] += amount
		res.send({ balance: balances[sender] })
	}
})

app.listen(port, () => {
	console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0
	}
}
