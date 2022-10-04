const keccak256 = require("keccak256");
const Web3 = require("web3");
const { MerkleTree } = require("merkletreejs");

// browserify script.js | uglifyjs > bundle.js
// contrato --> 0x53E0CC4c51DcEC811C44e6Da0e72a6576e4C44c3

const jsonInterface = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "ApprovalCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "ApprovalQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
  { inputs: [], name: "MintERC2309QuantityExceedsLimit", type: "error" },
  { inputs: [], name: "MintToZeroAddress", type: "error" },
  { inputs: [], name: "MintZeroQuantity", type: "error" },
  { inputs: [], name: "OwnerQueryForNonexistentToken", type: "error" },
  { inputs: [], name: "OwnershipNotInitializedForExtraData", type: "error" },
  { inputs: [], name: "TransferCallerNotOwnerNorApproved", type: "error" },
  { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
  { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
  { inputs: [], name: "TransferToZeroAddress", type: "error" },
  { inputs: [], name: "URIQueryForNonexistentToken", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toTokenId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "ConsecutiveTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "FREE_MAX_MINTS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PUBLIC_MAX_MINTS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WLMerkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfMints", type: "uint256" },
      { internalType: "bytes32[]", name: "_merkleProof", type: "bytes32[]" },
    ],
    name: "WLMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "WLSaleActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WL_MAX_MINTS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "freeMerkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfMints", type: "uint256" },
      { internalType: "bytes32[]", name: "_merkleProof", type: "bytes32[]" },
    ],
    name: "freeMint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "freeMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "freeSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getOwnershipData",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
          { internalType: "uint64", name: "startTimestamp", type: "uint64" },
          { internalType: "bool", name: "burned", type: "bool" },
          { internalType: "uint24", name: "extraData", type: "uint24" },
        ],
        internalType: "struct IERC721A.TokenOwnership",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfMints", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintedFreeSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "numberMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "price",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicSaleActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "baseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newAddressMaxMints", type: "uint256" },
    ],
    name: "setFreeMaxMints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "newMerkleRoot", type: "bytes32" },
    ],
    name: "setFreeMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newFreeSupply", type: "uint256" },
    ],
    name: "setFreeSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPrice", type: "uint256" }],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newAddressMaxMints", type: "uint256" },
    ],
    name: "setPublicMaxMints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newSupply", type: "uint256" }],
    name: "setSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newAddressMaxMints", type: "uint256" },
    ],
    name: "setWLMaxMints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "newMerkleRoot", type: "bytes32" },
    ],
    name: "setWLMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePublicSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleWLSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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

const showMintedSupply = async function () {
  maxSupplyEl.textContent = await myContract.methods.maxSupply().call();
  mintedEl.textContent = await myContract.methods.totalSupply().call();
  freeMaxSupplyEl.textContent = await myContract.methods.freeSupply().call();
  freeMintedEl.textContent = await myContract.methods.mintedFreeSupply().call();
};

////////////////////////////////////////////
// QUERY SELECTORS //
////////////////////////////////////////////

const openMintWindow = document.querySelector(".btn-mint");
const buttonConnect = document.querySelector(".btn-connect-wallet");
const mintButton = document.querySelector(".btn-mint-action");
const mintAddRm = document.querySelector(".add-rm-mint");

const maxSupplyEl = document.querySelector(".max-supply");
const mintedEl = document.querySelector(".minted");
const freeMaxSupplyEl = document.querySelector(".max-supply-free");
const freeMintedEl = document.querySelector(".minted-free");

const divPriceQuant = document.querySelector(".div--price-quantity");
const quantMint = document.querySelector(".q-mint");
const addMintQ = document.querySelector(".add-circle");
const rmMintQ = document.querySelector(".rm-circle");

////////////////////////////////////////////
// EVENT LISTENERS //
////////////////////////////////////////////
let maxMint = 10;

openMintWindow.addEventListener("click", function () {
  (async () => {
    const WLSaleActive = await myContract.methods.WLSaleActive().call();
    const publicSaleActive = await myContract.methods.publicSaleActive().call();
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

    if (proof && proof.length >= 1 && (WLSaleActive || publicSaleActive)) {
      mintWindow.classList.remove("hidden");
      overlay.classList.remove("hidden");
    } else {
      // alert("Sorry! Your are not whitelisted!");
      mintWindow.classList.remove("hidden");
      overlay.classList.remove("hidden");
      mintButton.classList.add("hidden");
      mintAddRm.classList.add("hidden");
      divPriceQuant.style.justifyContent = "center";
      mintPrice.textContent = "Not whitelisted!";
    }
  })();
});

rmMintQ.addEventListener("click", function () {
  const value = Number(quantMint.textContent);
  if (value > 0) quantMint.textContent = value - 1;
});

addMintQ.addEventListener("click", function () {
  const value = Number(quantMint.textContent);
  if (value < maxMint) quantMint.textContent = value + 1;
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
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

checkAcc();

const myContract = new web3.eth.Contract(
  jsonInterface,
  "0x53e0cc4c51dcec811c44e6da0e72a6576e4c44c3"
);

showMintedSupply();

(async function () {
  // const WLSaleActive = await myContract.methods.WLSaleActive().call();
  // const freeMaxMints = await myContract.methods.FREE_MAX_MINTS().call();
  // const wlMaxMints = await myContract.methods.WL_MAX_MINTS().call();
  // const publicMaxMints = await myContract.methods.PUBLIC_MAX_MINTS().call();
  // const maxSupply = await myContract.methods.maxSupply().call();
  // const totalSupply = await myContract.methods.totalSupply().call();
  // const freeSupply = await myContract.methods.freeSupply().call();
  // const mintedFreeSupply = await myContract.methods.mintedFreeSupply().call();
  // const publicSaleActive = await myContract.methods.publicSaleActive().call();
});

const wlChecks = async function () {
  const account = (await web3.eth.getAccounts())[0];

  let proof = getMerkleProof(account[0], merkleTree);
  proof.length > 1 ? (proof = proof.join(", ")) : (proof = proof[0]);
  console.log(proof);

  let proofPayed = getMerkleProof(account[0], merkleTree2);
  proofPayed.length > 1
    ? (proofPayed = proofPayed.join(", "))
    : (proofPayed = proofPayed[0]);
  console.log(proofPayed);

  // check 333/333
  // else if freeMinted
  // else
};
