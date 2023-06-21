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
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, messageHash, signature } = req.body;
  const { sender, recipient, amount } = JSON.parse(message);

  // const senderPublicKey = `0x${toHex(secp256k1.recoverPublicKey(messageHash, signature))}`;

  const isSigned = secp256k1.verify(signature, messageHash, sender);
  
  if (!isSigned) {
    res.status(400).send({ message: "Invalid signature!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
