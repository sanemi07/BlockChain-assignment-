const crypto = require('crypto'); // module for hashing

// Block Class
class Block {
    constructor(index, transactions, previousHash = '', difficulty = 2) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.difficulty = difficulty;
        this.hash = this.mineBlock();
    }

    computeHash() {
        const blockData = JSON.stringify({
            index: this.index,
            timestamp: this.timestamp,
            transactions: this.transactions,
            previousHash: this.previousHash,
            nonce: this.nonce
        });
        return crypto.createHash('sha256').update(blockData).digest('hex');
    }

    mineBlock() {
        let hash;
        do {
            this.nonce++;
            hash = this.computeHash();
        } while (!hash.startsWith('0'.repeat(this.difficulty))); // Proof-of-Work condition
        return hash;
    }
}

// Blockchain Class
class Blockchain {
    constructor(difficulty = 2) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, "Genesis Block", "0", this.difficulty);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const newBlock = new Block(this.chain.length, transactions, this.getLatestBlock().hash, this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false; // Block data was tampered
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; // Chain is broken
            }
        }
        return true;
    }
}

// Testing the Blockchain
const myBlockchain = new Blockchain();

console.log("Mining block 1...");
myBlockchain.addBlock([{ sender: "Alice", receiver: "Bob", amount: 10 }]);

console.log("Mining block 2...");
myBlockchain.addBlock([{ sender: "Charlie", receiver: "Dave", amount: 20 }]);

console.log("Blockchain: ", JSON.stringify(myBlockchain, null, 2));
console.log("Is blockchain valid?", myBlockchain.isChainValid());

// Simulating Tampering
console.log("\nTampering with blockchain...");
myBlockchain.chain[1].transactions = [{ sender: "Hacker", receiver: "Eve", amount: 100 }];
console.log("Is blockchain valid after tampering?", myBlockchain.isChainValid());
