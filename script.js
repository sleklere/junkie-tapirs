let whitelistAddresses = [
  "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
];

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const rootHash = merkleTree.getRoot();

const root =
  "0x762cf6c3f961f9d5084b3fe2e3129ff762eb6bad898e3eef1348964a56e4722e";

console.log("Whitelist Merkle Tree\n", merkleTree.toString());

// console.log("the Merkle root is:", merkleTree.getRoot().toString("hex"));

/////////////////////////////

function getMerkleProof(address) {
  const hashedAddress = keccak256(address);
  return merkleTree.getHexProof(hashedAddress);
}

const proof = getMerkleProof();
// console.log(getMerkleProof("0x3826335E2bc15Ffa99Bf697c28352C7E871a228b"));
// console.log(getMerkleProof("0x3826335E2bc15Ffa99Bf697c28352C7E871a228c"));

const buttonConnect = document.querySelector(".btn-connect-wallet");

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
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
const targetNetworkId = "0x4";

const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    // return true if network id is the same
    if (currentChainId == targetNetworkId) {
      console.log("true");
      return true;
    }
    // return false is network id is different
    console.log("false");
    return false;
  }
};

// targets Rinkeby chain, id 4

// switches network to the one provided
const switchNetwork = async (correctNetwork) => {
  if (!correctNetwork) {
    console.log("incorrect network! changing now");
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
  console.log(correctNetwork);
  switchNetwork(correctNetwork);
};

buttonConnect.addEventListener("click", function () {
  connect();
  checkAndSwitch();
});

window.web3 = new Web3(window.ethereum);
const account = web3.eth.accounts;
//Get the current MetaMask selected/active wallet
const walletAddress = account.givenProvider.selectedAddress;

console.log(walletAddress);
if (walletAddress != null) {
  checkAndSwitch();
}

//////////////////////////
