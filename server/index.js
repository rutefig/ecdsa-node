const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const { generateAccounts } = require("./scripts/generate-accounts");

app.use(cors());
app.use(express.json());

const balances = {};
const accounts = generateAccounts(3);
for (const account of accounts) {
  balances[account] = Math.floor(Math.random() * 1000);
}
console.log(balances);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;

  const privateKey = Buffer.from(address.slice(2), "hex");
  const publicKey = secp256k1.getPublicKey(privateKey);
  const senderPublicKey = `0x${toHex(publicKey)}`;

  const balance = balances[senderPublicKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  const privateKey = Buffer.from(sender.slice(2), "hex");
  const publicKey = secp256k1.getPublicKey(privateKey);
  const senderPublicKey = `0x${toHex(publicKey)}`;


  setInitialBalance(senderPublicKey);
  setInitialBalance(recipient);

  if (balances[senderPublicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderPublicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[senderPublicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
