const keccak256 = require("keccak256");
// const Web3 = require("web3");
const { MerkleTree } = require("merkletreejs");

///////////////////////////////////
window.web3 = new Web3(window.ethereum);

// Update data variables
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
let WlMaxMints;
let publicMinted;
let publicMaxMints;

let myContract;
let maxMint = 1;

let proofDisplayedInput;
// browserify script.js | uglifyjs > bundle.js
// browserify script.js > bundle.js

const jsonInterface = require("./interface");

////////////////////////////////////////////
// WL's and MERKLE TREE //
////////////////////////////////////////////

// FOR TESTING
// let freeWlAddresses = [
//   "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
//   "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
//   "0x36e99c9de23d07f67F06fA475D2b605279b52050",
//   "0xb485a46a59B206d5C30Ad6c814E2e3373F132dd9",
//   "0xaAaaD83aCFfc24f0682CfcaDAf1Fc41508aFc3e4",
//   "0xe1D6bb8F54E345C1106C22958EFB815Dea616019",
//   "0x5a91330C1147fb936bf134Ef744988985e610a7d",
//   // "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
//   // "0x36e99c9de23d07f67F06fA475D2b605279b53050",
//   // "0x36e99c9de23d07f67F06fA475D2b605279b52051",
//   // "0x36e99c9de23d07f67F06fA475D2b605279b52053",
//   // "0x36e99c9de23d07f67F06fA475E2b605279b52050",
// ];

// let paidWlAddresses = [
//   "0x36e99c9de23d07f67F06fA475D2b605279b52050",
//   "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
//   "0x36e99c9de23d07f67F06fA475D2b605279b5205c",
// ];

let freeWlAddresses = require("./freeWl");

let paidWlAddresses = require("./paidWl");

let proof;
let proofPaid;

let proofCopy;

const leafNodes = freeWlAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot().toString("hex");
// console.log("root", rootHash);

const leafNodes2 = paidWlAddresses.map((addr) => keccak256(addr));
const merkleTree2 = new MerkleTree(leafNodes2, keccak256, { sortPairs: true });
const rootHash2 = merkleTree2.getRoot().toString("hex");
// console.log("root paid", rootHash2);

////////////////////////////////////////////

////////////////////////////////////////////
// QUERY SELECTORS //
////////////////////////////////////////////

const openMintWindow = document.querySelector(".btn-mint");
const overlay = document.querySelector(".overlay");
const closeMintButton = document.querySelector(".close-mint");

const mintWindow = document.querySelector(".mint-window");

const buttonConnect = document.querySelector(".btn-connect-wallet");
const btnConnectSmall = document.querySelector(".btn-connect");

const mintAddRm = document.querySelector(".add-rm-mint");
const mintPrice = document.querySelector(".mint-price");
const mintButton = document.querySelector(".btn-mint-action");

const maxSupplyEl = document.querySelector(".max-supply");
const mintedEl = document.querySelector(".minted");
const freeMaxSupplyEl = document.querySelector(".max-supply-free");
const freeMintedEl = document.querySelector(".minted-free");

const divPriceQuant = document.querySelector(".div--price-quantity");
const quantMint = document.querySelector(".q-mint");
const quantMintNum = Number(quantMint.textContent);
const addMintQ = document.querySelector(".add-circle");
const rmMintQ = document.querySelector(".rm-circle");

const proofAddressInput = document.querySelector(".proof-input-address");
const getProofBtn = document.querySelector(".get-proof");
const proofEl = document.querySelector(".proof");
const copyProofBtn = document.querySelector(".copy-proof");
const congratEl = document.querySelector(".proof-congrats");

const pendingMintNotif = document.querySelector(".mint-notif");
const notifText = document.querySelector(".notif-text");
const notifHash = document.querySelector(".notif-hash");
const gifLoadingMint = document.querySelector(".gif-loading-mint");
const warningEl = document.querySelector(".mint-warning");

////////////////////////////////////////////
// FUNCTIONS //
////////////////////////////////////////////

// Wallet/network related

const connectWallet = async function () {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    account = (await web3.eth.getAccounts())[0];
    account = account.toLowerCase();
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
    // button that appears in a tablet/phone querie
    btnConnectSmall.textContent = `${account.slice(0, 6)}...${account.slice(
      -4
    )}`;
    btnConnectSmall.classList.add("connected");
    // console.log(`Wallet connected: ${account}`);
    web3.eth.getChainId();
    await checkAndSwitch();
    proof = getMerkleProof(account, merkleTree);
    proofPaid = getMerkleProof(account, merkleTree2);
    updateData().then((a) => {
      openMintWindow.disabled = false;
      updDataInterval();
    });
  } else {
    // console.log("No wallet");
  }
};

// checks if the current network of the wallet is the intended one (in this case the rinkby testnet)
const checkNetwork = async () => {
  if (window.ethereum) {
    const currentChainId = await web3.eth.getChainId();
    // console.log(`current chain id: ${currentChainId}`);

    // return true if current network is the same as the one targeted
    if (currentChainId == "0x1") {
      return true;
    }
    // return false if the current network is not the one targeted
    return false;
  }
};

const checkAndSwitch = async () => {
  // console.log(correctNetwork);
  const correctNetwork = await checkNetwork();
  if (!correctNetwork) {
    // console.log("Incorrect network! Changing now");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (err) {
      alert(err.message);
    }
    // refresh page
    // window.location.reload();
  }
  myContract = new web3.eth.Contract(
    jsonInterface,
    "0xAEb6B4FB8EE5D1876392fEE1093D2269d48C4A4c"
  );
};

const checkAcc = async () => {
  // window.web3 = new Web3(window.ethereum);
  account = (await web3.eth.getAccounts())[0];
  account = account.toLowerCase();
  // console.log(`Account connected: ${account}`);
  // if there is an account connected
  if (account != undefined) {
    // checks for network and switches if needed
    await checkAndSwitch();
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
    // button that appears in a tablet/phone querie
    btnConnectSmall.textContent = `${account.slice(0, 6)}...${account.slice(
      -4
    )}`;
    btnConnectSmall.classList.add("connected");
    openMintWindow.style.padding = 0;
    updateData().then((a) => {
      openMintWindow.style.padding = "1.25rem 1.5rem";
      openMintWindow.textContent = "Mint!";
      openMintWindow.disabled = false;
      updDataInterval();
    });
  } else {
    openMintWindow.textContent = "Mint!";
  }
};

// ///////////////////////////
// UI stuff

const showMintedSupply = function () {
  maxSupplyEl.textContent = maxSupply;
  mintedEl.textContent = totalSupply;
  freeMaxSupplyEl.textContent = freeSupply;
  freeMintedEl.textContent = mintedFreeSupply;
};

const displayPrice = async function () {
  const quantMintNum = Number(quantMint.textContent);
  let mintPriceTx;
  if (
    publicSaleActive ||
    typeof proofPaid !== "undefined" ||
    mintedFreeSupply >= freeSupply ||
    freeMinted
  ) {
    mintPriceTx = quantMintNum * priceMint;
    mintPrice.textContent = mintPriceTx / 10 ** 18 + "Ξ";
  } else {
    mintPriceTx = (quantMintNum - 1) * priceMint;
    mintPrice.textContent =
      quantMintNum == 1 ? "Free!" : mintPriceTx / 10 ** 18 + "Ξ";
  }
  return mintPriceTx;
};

const setMaxMint = async function () {
  // supply 333/333 or free minted
  if (publicSaleActive) {
    maxMint = publicMaxMints - publicMinted;
  } else if (typeof proofPaid !== "undefined") {
    maxMint = WlMaxMints - mintedAcc;
  } else if (mintedFreeSupply >= freeSupply || freeMinted) {
    maxMint = freeMaxMints - mintedAcc;
  } else {
    maxMint = freeMaxMints - mintedAcc;
  }
};

const updateMintWindow = function () {
  showMintedSupply();
  if (
    WLSaleActive &&
    ((proof && proof.length >= 1 && mintedAcc < freeMaxMints) ||
      (proofPaid && proofPaid.length >= 1 && mintedAcc < WlMaxMints))
  ) {
    mintButton.classList.remove("hidden");
    mintAddRm.classList.remove("hidden");
    setMaxMint();
    displayPrice();
  } else if (
    publicSaleActive &&
    Number(publicMinted) < Number(publicMaxMints)
  ) {
    mintButton.classList.remove("hidden");
    mintAddRm.classList.remove("hidden");
    setMaxMint();
    displayPrice();
  } else {
    mintButton.classList.add("hidden");
    mintAddRm.classList.add("hidden");
    divPriceQuant.style.justifyContent = "center";
    if (!WLSaleActive && !publicSaleActive) {
      mintPrice.textContent = "Sale closed!";
    } else if (
      !(proof && proof.length >= 1) &&
      !(proofPaid && proofPaid.length >= 1)
    ) {
      mintPrice.textContent = "Not whitelisted!";
    } else {
      mintPrice.textContent = "Already minted max amount!";
    }
  }
};

// //////////////////////////////
// Data

const updateData = async function () {
  // console.log("updating data");
  publicSaleActive = await myContract.methods.publicSaleActive().call();
  WLSaleActive = await myContract.methods.WLSaleActive().call();
  if (publicSaleActive) {
    publicMinted = await myContract.methods.publicMinted(account).call();
    publicMaxMints = await myContract.methods.PUBLIC_MAX_MINTS().call();
  } else if (WLSaleActive) {
    if (freeWlAddresses.includes(account)) {
      freeMaxMints = await myContract.methods.FREE_MAX_MINTS().call();
      freeMinted = await myContract.methods.freeMinted(account).call();
    } else if (paidWlAddresses.includes(account)) {
      WlMaxMints = await myContract.methods.WL_MAX_MINTS().call();
    }
    mintedAcc = await myContract.methods.numberMinted(account).call();
  }
  priceMint = await myContract.methods.price().call();
  freeSupply = await myContract.methods.freeSupply().call();
  mintedFreeSupply = await myContract.methods.mintedFreeSupply().call();
  maxSupply = await myContract.methods.maxSupply().call();
  totalSupply = await myContract.methods.totalSupply().call();
};

function getMerkleProof(address, tree) {
  const hashedAddress = keccak256(address);
  return tree.getHexProof(hashedAddress);
}

let updDataInterval = function () {
  setInterval(() => {
    // console.log("30s interval: updating info");
    updateData();
    updateMintWindow();
  }, 30000);
};

////////////////////////////////////////////
// Mint related

const postMint = function (r) {
  // console.log(r);
  let status = r.status;
  let hash = r.transactionHash;
  // postMint(status, hash);

  gifLoadingMint.classList.add("hidden");
  notifHash.setAttribute("href", `https://etherscan.io/tx/${hash}`);
  notifHash.classList.remove("hidden");
  if (status == true) {
    // success
    warningEl.classList.remove("hidden");
    notifText.textContent = "Mint successful!";
    clearInterval(updDataInterval);
    setMaxMint();
    displayPrice();
    setTimeout(updDataInterval, 120 * 1000);
  }
  setTimeout(function () {
    pendingMintNotif.style.opacity = 0;
    notifHash.classList.add("hidden");
    gifLoadingMint.classList.remove("hidden");
    notifText.textContent = "Mint TX sent!";
  }, 10000);
};

const catchPostMint = function (err) {
  console.error(err);
  // console.log(err.message);
  if (err.message.includes("Transaction has been reverted by the EVM")) {
    const errorObj = JSON.parse(err.message.slice(err.message.indexOf("{")));
    if (errorObj.status == false) {
      // failed
      notifHash.setAttribute(
        "href",
        `https://etherscan.io/tx/${errorObj.transactionHash}`
      );
      notifHash.classList.remove("hidden");
      notifText.textContent = "Mint failed!";
      setTimeout(function () {
        pendingMintNotif.style.opacity = 0;
        notifHash.classList.add("hidden");
        gifLoadingMint.classList.remove("hidden");
        notifText.textContent = "Mint TX sent!";
      }, 10000);
    }
  } else {
    pendingMintNotif.style.opacity = 0;
  }
};

////////////////////////////////////////////
// EVENT LISTENERS //
////////////////////////////////////////////

buttonConnect.addEventListener("click", function () {
  connectWallet();
});

btnConnectSmall.addEventListener("click", function () {
  connectWallet();
});

window.ethereum.on("accountsChanged", async () => {
  openMintWindow.disabled = true;
  // console.log("acount state changed");
  account = (await web3.eth.getAccounts())[0];
  account = account.toLowerCase();
  quantMint.textContent = "1";
  if (account) {
    checkAcc();
  } else {
    // console.log("no account");
    buttonConnect.classList.remove("connected");
    buttonConnect.textContent = "Connect Wallet";
    // button that appears in a tablet/phone querie
    btnConnectSmall.textContent = `${account.slice(0, 6)}...${account.slice(
      -4
    )}`;
    btnConnectSmall.classList.add("connected");
  }
  window.location.reload();
});

// get merkle proof at home page if user can't connect wallet
getProofBtn.addEventListener("click", function () {
  const inputAddress = proofAddressInput.value.toLowerCase();
  let proofInput;
  let proofPaidInput;

  if (freeWlAddresses.includes(inputAddress)) {
    proofInput = getMerkleProof(inputAddress, merkleTree);
    // console.log(`proof home: ${proofInput}`);
    proofDisplayedInput = proofInput[0];
    congratEl.textContent = "Congrats! You are on the free WL!";
    congratEl.style.color = "green";
  } else if (paidWlAddresses.includes(inputAddress)) {
    proofPaidInput = getMerkleProof(inputAddress, merkleTree2);
    // console.log(`proofPaid home: ${proofPaidInput}`);
    proofDisplayedInput = proofPaidInput[0];
    congratEl.textContent = "Congrats! You are on the paid WL!";
    congratEl.style.color = "green";
  } else {
    proofDisplayedInput = "No proof!";
    congratEl.textContent = "Sorry! You are not whitelisted";
    congratEl.style.color = "red";
  }
  proofCopy = `${proofInput ? proofInput.join(",") : proofPaidInput.join(",")}`;
  proofEl.textContent = proofDisplayedInput;
});

copyProofBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(proofCopy);
  proofEl.textContent = "Copied!";
  setTimeout(function () {
    proofEl.textContent = proofDisplayedInput;
  }, 5000);
});

openMintWindow.addEventListener("click", async function () {
  if (freeWlAddresses.includes(account.toLowerCase())) {
    proof = getMerkleProof(account, merkleTree);
    // console.log(`proof mintwindow: ${proof}`);
    // console.log(`proof mintwindow[0]: ${proof[0]}`);
  } else if (paidWlAddresses.includes(account.toLowerCase())) {
    proofPaid = getMerkleProof(account, merkleTree2);
    // console.log(`proofPaid mintwindow: ${proofPaid}`);
  }

  // console.log(WLSaleActive, publicSaleActive);
  showMintedSupply();
  if (
    WLSaleActive &&
    ((proof && proof.length >= 1 && mintedAcc < freeMaxMints) ||
      (proofPaid && proofPaid.length >= 1 && mintedAcc < WlMaxMints))
  ) {
    mintWindow.classList.remove("hidden");
    overlay.classList.remove("hidden");
    setMaxMint();
    displayPrice();
  } else if (
    publicSaleActive &&
    Number(publicMinted) < Number(publicMaxMints)
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
    } else if (
      !(proof && proof.length >= 1) &&
      !(proofPaid && proofPaid.length >= 1)
    ) {
      mintPrice.textContent = "Not whitelisted!";
    } else {
      mintPrice.textContent = "Already minted max amount!";
    }
  }
});

overlay.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
});

closeMintButton.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
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

// listener for mint button to send TX
mintButton.addEventListener("click", async function () {
  const price = await displayPrice();
  let account = (await web3.eth.getAccounts())[0];
  account = account.toLowerCase();
  const quantMintNum = Number(quantMint.textContent);
  // console.log(quantMintNum);
  pendingMintNotif.style.opacity = 1;
  if (publicSaleActive) {
    myContract.methods
      .mint(quantMintNum)
      .send({ from: account, value: price })
      .then((r) => {
        postMint(r);
      })
      .catch((err) => {
        catchPostMint(err);
      });
  } else if (typeof proof !== "undefined") {
    myContract.methods
      .freeMint(quantMintNum, proof)
      .send({ from: account, value: price })
      .then((r) => {
        postMint(r);
      })
      .catch((err) => {
        catchPostMint(err);
      });
  } else if (typeof proofPaid !== "undefined") {
    myContract.methods
      .WLMint(quantMintNum, proofPaid)
      .send({ from: account, value: price })
      .then((r) => {
        postMint(r);
      })
      .catch((err) => {
        catchPostMint(err);
      });
  }
});

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// as soon as page loads check if theres an account and in the correct network
checkAcc();
