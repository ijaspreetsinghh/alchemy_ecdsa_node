import server from "./server"

function Wallet({ address, setAddress, balance, setBalance }) {
	async function onChange(evt) {
		const address = evt.target.value
		setAddress(address)
		if (address) {
			const {
				data: { balance },
			} = await server.get(`balance/${address}`)
			setBalance(balance)
		} else {
			setBalance(0)
		}
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Public key / Wallet Address
				<input
					placeholder="Enter an public key c772491ecd8e0fb19e077233d76d52af41d099cb"
					value={address}
					onChange={onChange}
				></input>
			</label>

			<div className="balance">Balance: {balance}</div>
			<div className="balance">Public Key 1: bfe1a9760f8dd44e6d10f0ab34a0df243107152d</div>
			<div className="balance">Public Key 2: c772491ecd8e0fb19e077233d76d52af41d099cb</div>
			<div className="balance">Public Key 3: d37554b39ba217fd04853f8dec9c01e92e29e05d</div>
		</div>
	)
}

export default Wallet
