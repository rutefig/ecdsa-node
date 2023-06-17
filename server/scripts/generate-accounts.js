const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const generateAccounts = function(n) {
    const accounts = [];
    for (let i = 0; i < n; i++) {
        const privateKey = secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.getPublicKey(privateKey);

        console.log(`Private key: 0x${toHex(privateKey)}`);
        console.log(`Public key: 0x${toHex(publicKey)}`);
        console.log();
        accounts.push(`0x${toHex(publicKey)}`);
    }
    return accounts;
}

exports.generateAccounts = generateAccounts;