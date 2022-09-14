////////////////////////////////////////////
// FUNCTIONS //
////////////////////////////////////////////
function getMerkleProof(address, tree) {
  const hashedAddress = keccak256(address);
  return tree.getHexProof(hashedAddress);
}

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = (await web3.eth.getAccounts())[0];
    buttonConnect.textContent = `${walletAddress.slice(
      0,
      6
    )}...${walletAddress.slice(-4)}`;
    buttonConnect.classList.add("connected");
    console.log(`Wallet connected: ${walletAddress}`);
    web3.eth.getChainId().then(console.log);
  } else {
    console.log("No wallet");
  }
}

// checks if the current network of the wallet is the intended one (in this case the rinkby testnet)
const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await web3.eth.getChainId();
    // console.log(`current chain id: ${currentChainId}`);

    // return true if current network is the same as the one targeted
    if (currentChainId == "0x4") {
      return true;
    }
    // return false if the current network is not the one targeted
    return false;
  }
};

const checkAndSwitch = async () => {
  const correctNetwork = await checkNetwork();
  // console.log(correctNetwork);
  if (!correctNetwork) {
    console.log("Incorrect network! Changing now");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
    // refresh page
    window.location.reload();
  }
};

const checkAcc = async () => {
  window.web3 = new Web3(window.ethereum);
  const account = (await web3.eth.getAccounts())[0];
  console.log(`Account connected: ${account}`);
  // if there is an account connected
  if (account != undefined) {
    // checks for network and switches if needed
    checkAndSwitch();
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
  }
};

////////////////////////////////////////////
// QUERY SELECTORS //
////////////////////////////////////////////

const openMintWindow = document.querySelector(".btn-mint");
const buttonConnect = document.querySelector(".btn-connect-wallet");
const mintButton = document.querySelector("btn-mint-action");

////////////////////////////////////////////
// EVENT LISTENERS //
////////////////////////////////////////////

openMintWindow.addEventListener("click", function () {
  (async () => {
    const account = await web3.eth.getAccounts();

    let proof = getMerkleProof(account[0], merkleTree);
    proof.length > 1 ? (proof = proof.join(", ")) : (proof = proof[0]);
    console.log(proof);

    let proofPayed = getMerkleProof(account[0], merkleTree2);
    proofPayed.length > 1
      ? (proofPayed = proofPayed.join(", "))
      : (proofPayed = proofPayed[0]);
    console.log(proofPayed);
    if (!proofPayed) {
      mintQuantity.max = 1;
    }

    if (proof && proof.length >= 1) {
      mintWindow.classList.remove("hidden");
      overlay.classList.remove("hidden");
    } else {
      alert("Sorry! Your are not whitelisted!");
    }
  })();
});

buttonConnect.addEventListener("click", function () {
  connectWallet();
  checkAndSwitch();
});

window.ethereum.on("accountsChanged", async () => {
  console.log("acount state changed");
  buttonConnect.classList.remove("connected");
  buttonConnect.textContent = "Connect Wallet";
});

////////////////////////////////////////////
// FAKE WL's (for testing) and MERKLE TREE //
////////////////////////////////////////////

let whitelistAddresses = [
  "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
  // "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
  // "0x36e99c9de23d07f67F06fA475D2b605279b53050",
  // "0x36e99c9de23d07f67F06fA475D2b605279b52051",
  // "0x36e99c9de23d07f67F06fA475D2b605279b52053",
  // "0x36e99c9de23d07f67F06fA475E2b605279b52050",
  "0x36e99c9de23d07f67F06fA475D2b605279b52050",
];

let testPayedWl = [
  "0x36e99c9de23d07f67F06fA475D2b605279b52050",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
  "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
];

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

const leafNodes2 = testPayedWl.map((addr) => keccak256(addr));
const merkleTree2 = new MerkleTree(leafNodes2, keccak256, { sortPairs: true });
const rootHash2 = merkleTree2.getRoot();

// not used for now
// const root =
//   "0x762cf6c3f961f9d5084b3fe2e3129ff762eb6bad898e3eef1348964a56e4722e";

////////////////////////////////////////////

checkAcc();
// console.log("Whitelist Merkle Tree\n", merkleTree.toString());
