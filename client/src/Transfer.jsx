import { keccak256 } from "ethereum-cryptography/keccak"
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils"
import React, { useState } from "react"
import server from "./server"

function Transfer({ address, setBalance }) {
	const [sendAmount, setSendAmount] = useState("")
	const [recipient, setRecipient] = useState("")
	const [privateKey, setPrivateKey] = useState("")
	const [errorMessage, setErrorMessage] = useState("")

	const setValue = (setter) => (evt) => setter(evt.target.value)

	async function hashMessage(message) {
		return toHex(keccak256(utf8ToBytes(message)))
	}

	async function signTransaction(messageHash, privateKey) {
		const data = await secp.sign(secp.utils.hexToBytes(messageHash), privateKey, { recovered: true })
		return data
	}

	async function transfer(evt) {
		evt.preventDefault()
		setErrorMessage("")
		try {
			const message = await hashMessage(`Transfer ${parseInt(sendAmount)} from ${address} to ${recipient}`)

			const signature = await signTransaction(message, privateKey)
			const signaturePart = toHex(signature[0])
			const recovery = signature[1].toString()
			let fullSignature = signaturePart + recovery
			const {
				data: { balance },
			} = await server.post(`send`, {
				sender: address,
				amount: parseInt(sendAmount),
				recipient,
				signature: fullSignature,
			})

			setBalance(balance)
		} catch (ex) {
			if (ex.response && ex.response.data.message) {
				setErrorMessage(ex.response.data.message)
			}
		}
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: bfe1a9760f8dd44e6d10f0ab34a0df243107152dv"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<label>
				Sign transaction
				<input type="password" placeholder="Enter your private key" value={privateKey} onChange={setValue(setPrivateKey)}></input>
			</label>
			{errorMessage && <label>{errorMessage}</label>}
			<input type="submit" className="button" value="Transfer" />
		</form>
	)
}

export default Transfer
