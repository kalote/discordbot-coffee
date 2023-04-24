const { ethers } = require("ethers");
const luksoABI = require("./abi/LuksoGenesis.json");
require("dotenv").config();

async function blockchainFn(channel) {
  console.log("Listening on contract events ...");
  let count = parseInt(process.env.COUNT);
  const luksoAddress = "0x42000421dd80D1e90E56E87e6eE18D7770b9F8cC";
  const provider = new ethers.providers.WebSocketProvider(
    `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_ID}`
  );
  const contract = new ethers.Contract(luksoAddress, luksoABI, provider);

  contract.on("DepositEvent(bytes,bytes,uint256,bytes,uint256)", (pubkey, withdrawal_credentials, amount, signature, index, event) => {
    console.log("New Deposit! (signature)");
    count += 1;
    channel.send(`A new validator joined the LUKSO adventure at block \`${event.blockNumber}\` 🎉🎉🎉!\nWe now have ${count} validators (${count*32} LYXe)!`);
    console.log(JSON.stringify(event, null, 4));
  });
  
  filter = {
    address: luksoAddress,
    topics: [
      ethers.utils.id("DepositEvent(bytes,bytes,uint256,bytes,uint256)")
    ]
  }
  
  provider.on(filter, (log, event) => {
    console.log("New Deposit! (provider)", event);
  });
}

module.exports = { blockchainFn };