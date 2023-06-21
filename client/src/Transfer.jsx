import { useState } from "react";
import server from "./server";
import sha256 from "crypto-js/sha256";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js"
import { toHex } from "ethereum-cryptography/utils.js";

function Transfer({ address, setBalance, privKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };
      const messageHash = toHex(sha256(JSON.stringify(message)));
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        messageHash,
        signature: secp256k1.sign(messageHash, privKey),
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
