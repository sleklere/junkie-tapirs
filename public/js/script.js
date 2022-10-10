const keccak256 = require("keccak256");
const Web3 = require("web3");
const { MerkleTree } = require("merkletreejs");

///////////////////////////////////

let freeSupply;
let freeMinted;
let mintedFreeSupply;
let mintedAcc;
let priceMint;
let publicSaleActive;
let WLSaleActive;
let account;
let maxSupply;
let totalSupply;
let freeMaxMints;

// browserify script.js | uglifyjs > bundle.js
// browserify script.js > bundle.js

window.web3 = new Web3(window.ethereum);
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
let myContract;

let maxMint = 1;

////////////////////////////////////////////
// FAKE WL's (for testing) and MERKLE TREE //
////////////////////////////////////////////

let whitelistAddresses = [
  "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
  "0x36e99c9de23d07f67F06fA475D2b605279b52050",
  "0xb485a46a59B206d5C30Ad6c814E2e3373F132dd9",
  "0xaAaaD83aCFfc24f0682CfcaDAf1Fc41508aFc3e4",
  "0xe1D6bb8F54E345C1106C22958EFB815Dea616019",
  "0x5a91330C1147fb936bf134Ef744988985e610a7d",
  // "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
  // "0x36e99c9de23d07f67F06fA475D2b605279b53050",
  // "0x36e99c9de23d07f67F06fA475D2b605279b52051",
  // "0x36e99c9de23d07f67F06fA475D2b605279b52053",
  // "0x36e99c9de23d07f67F06fA475E2b605279b52050",
];

let testPayedWl = [
  "0x36e99c9de23d07f67F06fA475D2b605279b52050",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
  "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
];

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();
// console.log(rootHash);

const leafNodes2 = testPayedWl.map((addr) => keccak256(addr));
const merkleTree2 = new MerkleTree(leafNodes2, keccak256, { sortPairs: true });
const rootHash2 = merkleTree2.getRoot();

let proof;
let proofPayed;

////////////////////////////////////////////

////////////////////////////////////////////
// QUERY SELECTORS //
////////////////////////////////////////////

const openMintWindow = document.querySelector(".btn-mint");
const buttonConnect = document.querySelector(".btn-connect-wallet");
const mintButton = document.querySelector(".btn-mint-action");
const mintAddRm = document.querySelector(".add-rm-mint");
const mintPrice = document.querySelector(".mint-price");

const maxSupplyEl = document.querySelector(".max-supply");
const mintedEl = document.querySelector(".minted");
const freeMaxSupplyEl = document.querySelector(".max-supply-free");
const freeMintedEl = document.querySelector(".minted-free");

const divPriceQuant = document.querySelector(".div--price-quantity");
const quantMint = document.querySelector(".q-mint");
const quantMintNum = Number(quantMint.textContent);
const addMintQ = document.querySelector(".add-circle");
const rmMintQ = document.querySelector(".rm-circle");

////////////////////////////////////////////
// FUNCTIONS //
////////////////////////////////////////////

const updateData = async function () {
  freeSupply = await myContract.methods.freeSupply().call();
  freeMinted = await myContract.methods.freeMinted(account).call();
  mintedFreeSupply = await myContract.methods.mintedFreeSupply().call();
  mintedAcc = await myContract.methods.numberMinted(account).call();
  priceMint = await myContract.methods.price().call();
  publicSaleActive = await myContract.methods.publicSaleActive().call();
  WLSaleActive = await myContract.methods.WLSaleActive().call();
  maxSupply = await myContract.methods.maxSupply().call();
  totalSupply = await myContract.methods.totalSupply().call();
  freeMaxMints = await myContract.methods.FREE_MAX_MINTS().call();
};

function getMerkleProof(address, tree) {
  const hashedAddress = keccak256(address);
  return tree.getHexProof(hashedAddress);
}

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    account = (await web3.eth.getAccounts())[0];
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
    console.log(`Wallet connected: ${account}`);
    web3.eth.getChainId().then(console.log);
    await checkAndSwitch();
    updateData().then((a) => {
      openMintWindow.disabled = false;
    });
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
    if (currentChainId == "0x5") {
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
      params: [{ chainId: "0x5" }],
    });
    // refresh page
    window.location.reload();
  }
  myContract = new web3.eth.Contract(
    jsonInterface,
    "0xA460c864edf6c4BdA1eF9666F9B6E25B26793Ad0"
  );
};

const checkAcc = async () => {
  window.web3 = new Web3(window.ethereum);
  account = (await web3.eth.getAccounts())[0];
  console.log(`Account connected: ${account}`);
  // if there is an account connected
  if (account != undefined) {
    // checks for network and switches if needed
    await checkAndSwitch();
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
    updateData().then((a) => {
      openMintWindow.disabled = false;
      console.log(
        WLSaleActive,
        publicSaleActive,
        freeSupply,
        freeMinted,
        mintedAcc
      );
    });
  }
};

const showMintedSupply = function () {
  // maxSupplyEl.textContent = await myContract.methods.maxSupply().call();
  // mintedEl.textContent = await myContract.methods.totalSupply().call();
  // freeMaxSupplyEl.textContent = await myContract.methods.freeSupply().call();
  // freeMintedEl.textContent = await myContract.methods.mintedFreeSupply().call();
  maxSupplyEl.textContent = maxSupply;
  mintedEl.textContent = totalSupply;
  freeMaxSupplyEl.textContent = freeSupply;
  freeMintedEl.textContent = mintedFreeSupply;
};

const displayPrice = async function () {
  // const account = (await web3.eth.getAccounts())[0];

  const quantMintNum = Number(quantMint.textContent);

  // const freeSupply = await myContract.methods.freeSupply().call();
  // const freeMinted = await myContract.methods.freeMinted(account).call();
  // const mintedFreeSupply = await myContract.methods.mintedFreeSupply().call();
  // const priceMint = await myContract.methods.price().call();
  // const publicSaleActive = await myContract.methods.publicSaleActive().call();
  let mintPriceTx;
  // supply 333/333 or free minted
  if (mintedFreeSupply >= freeSupply || freeMinted || (proofPayed && !proof)) {
    mintPriceTx = quantMintNum * priceMint;
    mintPrice.textContent = mintPriceTx / 10 ** 18;
  } else if (publicSaleActive) {
    mintPriceTx = quantMintNum * priceMint;
    mintPrice.textContent = mintPriceTx / 10 ** 18;
  } else {
    mintPriceTx = (quantMintNum - 1) * priceMint;
    mintPrice.textContent =
      quantMintNum == 1 ? "Free!" : mintPriceTx / 10 ** 18;
  }
  return mintPriceTx;
};

const setMaxMint = async function () {
  // const account = (await web3.eth.getAccounts())[0];

  // const freeSupply = await myContract.methods.freeSupply().call();
  // const freeMinted = await myContract.methods.freeMinted(account).call();
  // const mintedFreeSupply = await myContract.methods.mintedFreeSupply().call();
  // const freeMaxMints = await myContract.methods.FREE_MAX_MINTS().call();
  // const mintedAcc = await myContract.methods.numberMinted(account).call();
  // const publicSaleActive = await myContract.methods.publicSaleActive().call();

  // supply 333/333 or free minted
  if (mintedFreeSupply >= freeSupply || freeMinted || (proofPayed && !proof)) {
    maxMint = freeMaxMints - mintedAcc;
  } else if (publicSaleActive) {
    maxMint = publicMaxMints;
  } else {
    maxMint = freeMaxMints - mintedAcc;
  }
  console.log(`maxMint : ${maxMint}`);
};

////////////////////////////////////////////
// EVENT LISTENERS //
////////////////////////////////////////////

openMintWindow.addEventListener("click", async function () {
  // WLSaleActive = await myContract.methods.WLSaleActive().call();
  // publicSaleActive = await myContract.methods.publicSaleActive().call();
  // const account = (await web3.eth.getAccounts())[0];

  proof = getMerkleProof(account, merkleTree);
  // proof.length > 1 ? (proof = proof.join(", ")) : (proof = proof[0]);
  console.log(`proof mintwindow: ${proof}`);

  proofPayed = getMerkleProof(account, merkleTree2);
  // proofPayed.length > 1
  //   ? (proofPayed = proofPayed.join(", "))
  //   : (proofPayed = proofPayed[0]);
  console.log(`proofPayed mintwindow: ${proofPayed}`);

  console.log(WLSaleActive, publicSaleActive);
  showMintedSupply();
  if (
    ((proof && proof.length >= 1) || (proofPayed && proofPayed.length >= 1)) &&
    (WLSaleActive || publicSaleActive)
  ) {
    mintWindow.classList.remove("hidden");
    overlay.classList.remove("hidden");
    setMaxMint();
    displayPrice();
  } else {
    // alert("Sorry! Your are not whitelisted!");
    mintWindow.classList.remove("hidden");
    overlay.classList.remove("hidden");
    mintButton.classList.add("hidden");
    mintAddRm.classList.add("hidden");
    divPriceQuant.style.justifyContent = "center";
    if (!WLSaleActive && !publicSaleActive) {
      mintPrice.textContent = "Sale closed!";
    } else {
      mintPrice.textContent = "Not whitelisted!";
    }
  }
});

rmMintQ.addEventListener("click", function () {
  const value = Number(quantMint.textContent);
  if (value > 1) quantMint.textContent = value - 1;
  displayPrice();
});

addMintQ.addEventListener("click", function () {
  const value = Number(quantMint.textContent);
  if (value < maxMint) quantMint.textContent = value + 1;
  displayPrice();
});

buttonConnect.addEventListener("click", function () {
  connectWallet();
});

window.ethereum.on("accountsChanged", async () => {
  openMintWindow.disabled = true;
  console.log("acount state changed");
  account = await web3.eth.getAccounts();
  quantMint.textContent = "1";
  if (account[0]) {
    checkAcc();
  } else {
    console.log("no account");
    buttonConnect.classList.remove("connected");
    buttonConnect.textContent = "Connect Wallet";
  }
});

// listener for mint button to send TX
mintButton.addEventListener("click", async function () {
  const price = await displayPrice();
  const account = (await web3.eth.getAccounts())[0];
  console.log(quantMintNum);
  myContract.methods
    .freeMint(quantMintNum, proof)
    .send({ from: account, value: price })
    .then((r) => console.log(r));
});

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// as soon as page loads check if theres an account and in the correct network
checkAcc();
