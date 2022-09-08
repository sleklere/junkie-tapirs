// FUNCTIONS
function getMerkleProof(address) {
  const hashedAddress = keccak256(address);
  return merkleTree.getHexProof(hashedAddress);
}

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    buttonConnect.classList.add("connected");
    buttonConnect.textContent = "Connected";
    window.web3 = new Web3(window.ethereum);
    const account = web3.eth.accounts;
    //Get the current MetaMask selected/active wallet
    const walletAddress = account.givenProvider.selectedAddress;
    console.log(`Wallet: ${walletAddress}`);
    web3.eth.getChainId().then(console.log);
  } else {
    console.log("No wallet");
  }
}
// targets Rinkeby chain, id 4
const targetNetworkId = "0x4";

const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // return true if network id is the same
    if (currentChainId == targetNetworkId) {
      return true;
    }
    // return false is network id is different
    return false;
  }
};

// switches network to the one provided
const switchNetwork = async (correctNetwork) => {
  if (!correctNetwork) {
    console.log("Incorrect network! Changing now");
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetNetworkId }],
    });
    // refresh
    window.location.reload();
  }
};

const checkAndSwitch = async () => {
  const correctNetwork = await checkNetwork();
  // console.log(correctNetwork);
  switchNetwork(correctNetwork);
};

const accountConnected = async () => {
  window.web3 = new Web3(window.ethereum);
  const account = await web3.eth.getAccounts();
  console.log(`Account connected: ${account[0]}`);
  return account[0];
};

const checkAcc = async () => {
  const account = await accountConnected();
  if (account != undefined) {
    checkAndSwitch();
    buttonConnect.textContent = "Connected";
    buttonConnect.classList.add("connected");
  }
};
////////////////////////////////////////////
const mintButton2 = document.querySelector(".btn-mint");
const buttonConnect = document.querySelector(".btn-connect-wallet");
////////////////////////////////////////////
mintButton2.addEventListener("click", function () {
  (async () => {
    const account = await accountConnected();
    let proof = getMerkleProof(account);
    proof.length > 1 ? (proof = proof.join(", ")) : (proof = proof[0]);
    console.log(proof);
  })();
});

buttonConnect.addEventListener("click", function () {
  connect();
  checkAndSwitch();
});

window.ethereum.on("accountsChanged", async () => {
  console.log("acount state changed");
  buttonConnect.classList.remove("connected");
  buttonConnect.textContent = "Connect Wallet";
});
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

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();
// root que paso t
const root =
  "0x762cf6c3f961f9d5084b3fe2e3129ff762eb6bad898e3eef1348964a56e4722e";
////////////////////////////////////////////

// check if there´s a wallet already connected to the site, if it is, check the network and switch if necessary
checkAcc();

// console.log("Whitelist Merkle Tree\n", merkleTree.toString());

//////////////////////////
