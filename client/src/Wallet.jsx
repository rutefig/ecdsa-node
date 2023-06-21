import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privKey, setPrivKey }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type your wallet address" value={address} onChange={onChange}></input>
      </label>

      <label>
        Sign your transaction
        <input placeholder="Type your signature for this transaction" value={privKey} onChange={(evt) => setPrivKey(evt.target.value)}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
