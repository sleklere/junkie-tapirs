const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

let whitelistAddresses = [
  "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
];

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const rootHash = merkleTree.getRoot();

console.log("Whitelist Merkle Tree\n", merkleTree.toString());

return;

///////////////////////////////////

const tapir1 = document.querySelector(".tapir-1");
const tapir2 = document.querySelector(".tapir-2");
const tapir3 = document.querySelector(".tapir-3");
const tapirs = document.querySelector(".tapirs");

const tapirsEls = [tapir1, tapir2, tapir3];

tapirsEls.forEach(function (tapir) {
  let index = tapirsEls.indexOf(tapir) + 1;
  tapirsEls.indexOf(tapir) == tapirsEls.length - 1 ? (index = 0) : null;
  let tapirNext = tapirsEls[index];
  tapir.addEventListener("click", function () {
    tapir.classList.toggle("hidden");
    tapirNext.classList.toggle("hidden");
  });
});

const mintButton = document.querySelector(".btn-mint");
const mintWindow = document.querySelector(".mint-window");
const overlay = document.querySelector(".overlay");
const closeMintButton = document.querySelector(".close-mint");
const mintPrice = document.querySelector(".mint-price");
const mintQuantity = Number(document.querySelector(".mint-quantity").value);
const mintQuantity2 = document.querySelector(".mint-quantity");
const mintQuantity3 = document.getElementById("mint-quantity");
const noWl = document.querySelector(".no-wl");

mintButton.addEventListener("click", function () {
  mintWindow.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

overlay.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
});

closeMintButton.addEventListener("click", function () {
  mintWindow.classList.add("hidden");
  overlay.classList.add("hidden");
});

// const num = 0;

// if (num) {
//   mintQuantity2.max = 1;
// } else if (num == 0) {
//   mintQuantity2.max = 0;
//   noWl.classList.remove("hidden");
// } else {
//   mintQuantity2.max = 1;
// }

mintQuantity2.addEventListener("change", function () {
  // mintPrice.textContent++;
  if (this.value > 1) {
    mintPrice.textContent = 0.1;
  } else if (this.value == 1) {
    mintPrice.textContent = 0.05;
  } else {
    mintPrice.textContent = 0.0;
  }
});
