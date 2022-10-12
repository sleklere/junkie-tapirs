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
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "publicMinted",
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

let freeWlAddresses = [
  "0x01d2f9d2c73dc71b249fd85272e41f7e0c959d6d",
  "0x01d33382da013f6dced207aec0ae39a8d76e3f8a",
  "0x044a34e7b20a65a31ed774137e144da44a73ffbe",
  "0x047a2505e19bc0df7ec55daf5aa57538f4bebb2e",
  "0x04c0e2d370984c67f8149e034d81341ef46f8205",
  "0x0806a784b3a9979124d00eeef03029a09e5ec7b9",
  "0x0c8b18864c5f28771797203e28d368434b67e725",
  "0x0c9b85c9997a8466f996168f6374c1af1d76f1a3",
  "0x0cd9432ec3ac76e6e38cf4192f0c9124339f06d0",
  "0x10de872bafa1850999d035b3e71900b78b0c97e4",
  "0x14fcb38a93ba46d4ffe6230e8c596f9091076b75",
  "0x14ffb0fad64f32d112f90e4230570bd5fd9e145c",
  "0x15b170d5bac1803f00ac037c90c3e8c199d30238",
  "0x1bb2821d4c58ed5aa2e1694cfb704d6c7a9a5711",
  "0x207a1868c0063039461b953b811ebe84d14da5bf",
  "0x2164f9f0b8d8a01448e19d6c95869136ed181ed0",
  "0x21f744a21a75ad84bd7fa969faedc31911af3082",
  "0x24f2f3752f517276612e7d53bb77d0a35ef0e927",
  "0x2863474b0c467a43369ac3a11d4b5cdd672328f6",
  "0x2a339c3de66ee1f05310af7b5eb7a1d5e165288a",
  "0x2b39ac8e85f1aefc47d0ed7bf0b095940a02286d",
  "0x2bfb3d6271eedee7d13714afdbf0fd8e679fbe56",
  "0x2c4a6e3f40137822060afb7660b879165f3e3b9f",
  "0x2f7320dc403f35692afb44172caf581ed352a865",
  "0x3038d263af086a54631b9bbfbccb70f9dcadadf8",
  "0x3082380adb4e610565a3707bc449097284d180c6",
  "0x35cce5954a0f63391456cc8ccdd35de499d6e0cf",
  "0x3810e63ABDF61cc83f676000118A877eC1BA58d0",
  "0x3b4158e346d331082562840e7627e08cb26a09c4",
  "0x3ddffa8ede031fe166bf99a79372cf1d87b2eef0",
  "0x43c28a88d496d8e16b7d45c2bb472e97aef3071e",
  "0x44a43f5ac142fcb40f8b1fd386f26b21d6c316ca",
  "0x487746a9ab4ad22c34a4fdad521db8f13b9a1762",
  "0x4be41356e363135702909192943d990651452b68",
  "0x4c7db634951a1e8a1744ffbc693b12360dd9a98f",
  "0x4f1c16078c796ece3db970f1c690767d088a9291",
  "0x517006aa91462863f559da1a3515475b9cc8c353",
  "0x555e152f01fdb41bdfd913d09c1ed5a63969c31e",
  "0x55ac86048addb08d7342d23c61bab11559e138c1",
  "0x566cdc799ef1637a8b31ad3066f901bdc2095205",
  "0x57a6825a072969e9082a56cfa6b0db840f79653c",
  "0x5a18e03052442e9b16a1ca0a6982ded9eca82ec7",
  "0x5a6fcdcc0f29cb31c07ac60ffa502523f0946473",
  "0x5b34be7f73feed08b25dee428dc92e281f7ed23d",
  "0x5c21f81ebb321ede0203733495e59083f3bc9d70",
  "0x638adc0eb925e33f8e9402a5fe4ca3e758f88351",
  "0x671955d3a634a51b9d787d00362501db33d50021",
  "0x6789cdc133ad7bdec118e5bc89a166ffb97e8e33",
  "0x691ccecdc50f1d30128034d57a64c904dbd62f2a",
  "0x6b0c5977d77f9cdcf142e23b65bad289e18100c7",
  "0x6ce198e88e86da6d0ca360bbea1067882cf4897e",
  "0x6cf468dfbc51ff2f920216fbdea3876a9450029d",
  "0x77baff20d8e11fe7529eb3db078af0668048cded",
  "0x79666c402d28ed0256662a063a81b4219fbad90e",
  "0x806094c823722dd9d1d72db6d156b41e0fed2510",
  "0x817f590ef0719c29a078f81ffb60534d19860f98",
  "0x82d4cb8f910c0959f4e92383d8c1866ecd49e82e",
  "0x8b5b518ab4a67532422106cc86f1567f5543ee6e",
  "0x8ba7e34be3e5601c14ac5b75bec2b24cb1bd37a5",
  "0x90ff60dc045c861ddd77e1451329100f2c6041d7",
  "0x94cb1b104d4140d6d1bc3826f9b0c5c3533de999",
  "0x99b257bca92be47546f8ca4044ba39600bc685d0",
  "0x9b8c700044147b6b1f53186c08732daa7d966cd3",
  "0x9d0aa9c52fa7f861fee132c8dead956ad14c3540",
  "0x9d81edf075a7fa717b4d1db7a40aeb56868269c1",
  "0x9dff2856fdf04fe8247fbe7e9a6a7244a73a458d",
  "0x9f7384eb8705dab8bd769df6499644854dcb32ba",
  "0xa217621de6ecdfe5b943365620df58fedefa7c7f",
  "0xa48f8cd494e1dbc196b8a38aae5248660441ac2f",
  "0xa7c43c81d458b428df425cfcbac3cebca3b1b2e0",
  "0xa863eb34ec473cae2ab017c804e03318a2a82e9b",
  "0xaabb885bf9f8221aa3e243d52ae2189c87d5607f",
  "0xaf4cdbbd068cb781b26a587e98616c90017b1054",
  "0xafb6312427749510f90bf78f76d76a9586135632",
  "0xb19570bcce09f5cf214c4f838285737148fa0f09",
  "0xb2f14c22e140a2c8014e13e6a527403136231b56",
  "0xb6417219691a2fc6b17eb7fd109dc208c8bcd8ab",
  "0xb98296c9b2d75c6c358cc9367acb4ff433f0a742",
  "0xbaabe13864bed38d66e1a10316dc5b1878dec48f",
  "0xbcD2587a33b530D5A9e42A81c9fE4C88df730921",
  "0xc007f01b8d36f864d937bfdfe11c7cbdb9b720fc",
  "0xc3689b375a6371939c4a70747aea75676d5ef074",
  "0xc3699567f5854b547811dbdfa18c8889acc065c0",
  "0xc5bccf19760d08974a23003fabd1f09c2d161f18",
  "0xc78ef9ee8ebf41e8be90bf28baa3906357e36592",
  "0xcb7f48360d7f175143d7b3a301e04d9cda1f956d",
  "0xce233e0e080bf879eb970927b9bf33b2c6d76c99",
  "0xcf35db879a80c2292487d82fcf83cbc17425848d",
  "0xd187061ac20375de52888928e0cd0c07af4057f4",
  "0xd23ef18d62146d98dedb14f479e1ea839d539344",
  "0xd42692df64b396256d4b85b9ba7504c35f577abd",
  "0xd5ea6da94a71b52247287dbd985ee3affee40ae5",
  "0xd74a91ad3613f1fa188396a38a898df31e6be89a",
  "0xd868d93b7bcdf5f7816f5cb53282402909bdaf87",
  "0xd9a571c699aa76086a3d709ee3376e14ca4bc427",
  "0xdd643971ae8dd6fc17da8587c670dc88c00acb0a",
  "0xddf94ae011a98c3b3555700235a6c0ba5d5039b8",
  "0xde7a619b032a3eeba16f6e20b4440320dd02b437",
  "0xe5de6cc4b63a0b9009e7096ec5c5bedd4f596fb2",
  "0xe7474357094778dd93657211d7cd1c8c6e0c9954",
  "0xe7cbbe7f9c45a6bfa5d54458a68e735a6a232081",
  "0xe995481494695359e4726f9083edabfbd678fb64",
  "0xed85437e1471c5580171b60158aef05b6536cbc6",
  "0xed896444adf74c96034b94e4caeb41f5ed3fa0ad",
  "0xeec71187b4a77f62a69f9589db3a3a1375f9ee69",
  "0xefeed27f87f6bde006dffac71dffbc7a163ab592",
  "0xf1cab5e2fa0a539a06db5f62a0b03e4120193c9e",
  "0xf4a4bf04bc38ef17c883527aea0dae4ce66b5938",
  "0xfcf5c719931ffb887c45838408cd8c0e92abc2c8",
  "0xfd4541cc1c551a5343a7f930b8bc6267afeaf775",
  "0xfe077390e785fb9d31bf1f7c0daaf44e22959e6e",
  "0x39c69C55f976FF8e3D1E13fe0053818bFe6aFA48",
  "0x578114b43078df8d474595c1D92F77592D3859D0",
  "0xa7e6067cBCEC0F77796d81E45a4810482677cF58",
  "0x7Db8dCDF56D06DeCB065A87926240D683542c3b1",
  "0xE2451C2a6034E7140EF4A4CFFc7F6Ca9E13d409e",
  "0xdd643971aE8dd6FC17dA8587c670Dc88C00ACB0a",
  "0xd18E3F8AbC364409865FE4036b29003BD3470954",
  "0xC3A18D2449E2910a4AD17a871BA91c0EA4CA2926",
  "0x81C20DAE3Aa6dd92c8557746ad9Ff4312F954777",
  "0x757892eD9b9A3bd6fB75F9Af6D22A00b4c591D9C",
  "0xD7c639395c573B052FD20f5792E9BA7A8a035799",
  "0xd329f6589553f9a896DD35EAFCe7dB852791F0A0",
  "0x4c4d6a24aea6ebf095d846acb817a93537c4433c",
  "0xc471c21183315c928b8fa3939e201f6cf27f2f76",
  "0x0926B5522184C6c8f20237F003bbD5b9a48078a9",
  "0xbD5ba64a31Da14338D4021ECE985e6eF234ab851",
  "0x8d2a1Dce2A4D717b3170bca49200C94FfF1B3446",
  "0x463C4BFb7a0f193C530F5aA4E64016310555D3D2",
  "0xfa26E26A551F05256b63061bAC6ea6d2F804967b",
  "0xaaCab878EC7891965097e61cF77AE14481B002E6",
  "0xbcF02472A295F99e3753fD74Fc666ef0EA0A8770",
  "0xE9c2D22736aeBd78b0DAC9676145560295603326",
  "0xd2A85B6A841BE5993938Eb2721CA6548e9E4Daa5",
  "0x448C1d47826b9608ef2B43f8E5aEced3592CC04f",
  "0x3B14284f3b7785a489ff40071722c9422e4B4D45",
  "0xb76812d15C579a3192C819C661c2a25a1c53D767",
  "0x08Cad477fcEB1f94adC4DD330758Acd6A2F3eB94",
  "0xf15ab62d2c2CaC87A11cf73B2dee426dB1663807",
  "0x5Bf0c8aBd4c19A5d8f35B8b79d71D58E0930Bc7c",
  "0xBfEcB5bD1726Afa7095f924374f3cE5d6375F24A",
  "0x2EEd012677956F2C1f9Eac12AA1306ebffeF7B47",
  "0x08A589D8C35603A2F0ae38568351B8E70Cd9603e",
  "0xa939ef5eA6E914FA1E5768c4C93763Ca0eE8ff1d",
  "0x96D8A7A48d83b0ec7a7E563ebFEfdC12afC456Eb",
  "0x295a3Bea006d885e384aD629729B82B16941C7f6",
  "0x939EE9d9eC03fA4ABDd8cC44d138b4Fc6Dc96D76",
  "0x2ce411F3F5A7b44eE03b3307Cf857101761461d0",
  "0x9b4F3Ae59043E37B1953C2630c7D0b660191481D",
  "0x1bDC459bc7dd7cb8507959b34a2980684D685273",
  "0xF1cD9C6Cb6c42b49a013321a82e1A1C10A36a735",
  "0x63Ca7A3F3c2984a286EB3be6afe011Ed6a5131df",
  "0x3826335E2bc15Ffa99Bf697c28352C7E871a228b",
  // "0x36e99c9de23d07f67F06fA475D2b605279b52050",
  // "0xb485a46a59B206d5C30Ad6c814E2e3373F132dd9",
  "0xaAaaD83aCFfc24f0682CfcaDAf1Fc41508aFc3e4",
  "0xe1D6bb8F54E345C1106C22958EFB815Dea616019",
  "0x5a91330C1147fb936bf134Ef744988985e610a7d",
  "0x0519D0D546EfCAAC8CFDB06edDcb605AC55c015E",
];

let paidWlAddresses = [
  "0x00285086d8dac2361eb3d3a9a98f689879e454c8",
  "0x00ea8aa041d75ef0b13fb8be0afdcb0d16fb0b75",
  "0x0130c4c5873df818f2bc21b7fd6e03d4c72dde8d",
  "0x01794c5ac48beb01596e4126e52bbda39d759728",
  "0x017ffb7c9e5aff47d9569265d7c78b2494099782",
  "0x022d6b75e29525ee9760a0182d6c147a152ca672",
  "0x02f32575761122f0646946909efa7cc2aa967e58",
  "0x03b6b8d1ff8ede2d77af184c3667b8311f409d9b",
  "0x03cf3d0d32ce33f15cfe9f73c5be7beeb50f6ac3",
  "0x03facd48325eae846c478e2f5e8e74955da4b231",
  "0x04453c4a56c9eaddf4141fb64365cc69c2438fc4",
  "0x04dc9ee916a4f1bc55450e734cd079a0c4d1d66e",
  "0x051e0d4cf6673d8e57e887137edca229adf11feb",
  "0x054ad98c5dde5cad9a913f764f9d97897f090d00",
  "0x05a8db73fa0eef886976c52e03e043d5a21fd2b0",
  "0x06be16341e25d2fc92badde9fef82f8f1f8d42e3",
  "0x071f267faf92a83fbe7dd1ef0558dba15f375043",
  "0x0804718357d372a96aacae8ebc8d0f615c370a1f",
  "0x085200a5d283a4c711543bd4ae97dab4fc39339c",
  "0x08bd61a0ec527d81b4746740f324c8de6a0b4826",
  "0x0953678ac2ee8571486ca9f94d3306d403cc76c0",
  "0x09615990c45ec5cc743b4eab5b436e232612606d",
  "0x0a441d83c79e4e1553ec9af092dd595b70a9e70d",
  "0x0ad5f42c44cb1e8afaa116e963096de97bc7482e",
  "0x0af39084cfa9c7b5825c54a10d0a47e1470f5c17",
  "0x0b03a7f0182720639cc4f6fd25bf8e51e543f0b7",
  "0x0b47429752c531a78cc8b0cf355cb19492df9623",
  "0x0be848e6db55564b186c6373e781c6a141eef067",
  "0x0c53c7da7e822e64bce38c6b2210801df698b22f",
  "0x0cf0824b7be7bd47b0d98abb2ff4831cbaaa7802",
  "0x0d448a793916d1268320608b4264123a5fdf1a19",
  "0x0d9080ccde0e0fb20ea5a02abb27405a4c863727",
  "0x0dc8df7fa7b52c4d850e2328339629ad9d0564f2",
  "0x0ddc62623b3837e684c9111c680460a8d1e5ab3e",
  "0x0e152a23cda380780d3192d3bc23ef7247eac02c",
  "0x0e706eb35016519a1989907c31a6925b7af74aca",
  "0x0eac4689ec832305fc60d3eda84f90ce065bf612",
  "0x0f4f6230d57ec8d45331aec2996f0d9f72c4fc6b",
  "0x0f72d9bed078bea37ac60ba49aa7339a707a6810",
  "0x0ff24e2659a600fe348c11b26409ca3dc5797cc4",
  "0x112630ba98300a8fb0af4eddb42449c03fc65a58",
  "0x117d03336c3931832840a478f10161be32db8c1a",
  "0x11f299be854c1a7c16b4217a69ae88291d33332a",
  "0x1248e8091170aa82a2e826c7d183afb04e4778e2",
  "0x124ae5eec8f28ef62df40907ab650e72037e096d",
  "0x12fb886a3776f6b04fc0b27346f55a89f4918a06",
  "0x134dcff9207d9f949eb87364299a5b8e1c1d737a",
  "0x147ab01e3364c5a8d7ebd1211369a259c2a3ce12",
  "0x148ef7b21d7b7dd1ab919d3d5e63a61c133b9f64",
  "0x14ba3e6b5a3abe6a778297434dbe45f0c47e12c7",
  "0x15bbccd76a770a726bff5f58ca3bbcf21005f15e",
  "0x1674d6af75afd9f18d0fc3a82d668514e044ee13",
  "0x17ebe208078c7a05fc99673e0f44cc9cf1646187",
  "0x184aa86ea6abc983df22693cbd63e422fa95af79",
  "0x196073a6be96996122b81854634475928d247195",
  "0x1a7a9aa44ecde017d348b6d3487aae9f3e37ee33",
  "0x1b2f5f7756c8ea39e2e136da2250b39abb0f0e4b",
  "0x1cbf0b8a6f916e922168cbb55aeb3346d9d0227d",
  "0x1d03067cc4863a990a9dbc0f7a6543347f6f41a2",
  "0x1da3862f7a87cb8d01467158f01f243738e21030",
  "0x1e06fdb842256f9cce789d7c12e3c2b51b8d9f8a",
  "0x1e47d2d5be4719701e4bd8319591c3f809806319",
  "0x1e8488567d670242844d1bb0937e9283cb564204",
  "0x1e948ccdbb1879d976b48f48aec3810835b11086",
  "0x20a6e7096507e4b898262ecff10b44966be51c8a",
  "0x20bea92732cb2b7a3f552ee22418f1dae59a1d3c",
  "0x20cc18f6586432fdfe3d6e72444277ff1f902fa5",
  "0x21f15d4349149b92a9e5dcf1da8d17d2e0753591",
  "0x224296f9f2b5973a6956709a6c3ce7714bd3fd78",
  "0x22b2ccb53963da600c83191db1ce3f61f92dcf45",
  "0x22dd57b4c8f4d0fe0bae7a9d554e3ab701df8842",
  "0x22faa564b9955eeaef3ace6da21740a40920a950",
  "0x23a980dd89ccdcb2a0e293734c58a0b81e11f142",
  "0x23b32f4f6fb2867fe4aa68b524d4c7a9954712a4",
  "0x23be58c3dedfa1e4b6ac93f9d1cb28d3e6bb2ff6",
  "0x24588627043765178946391d7e440802586a22ef",
  "0x248b6be896eee97b90da149c6d632e1881543e65",
  "0x25f1f1338b8e0065785a0a21635086e5046fda9f",
  "0x25f8d81ff037f97a9a1d89c467581324b51a75e6",
  "0x2665d24a78ff1593920c1a529f340d3fcd426af3",
  "0x2898e59e60db30f4a9d79d2c79b27428ddcf77f7",
  "0x28af5824f030632b2a051eb6ccff7ce5fd98378d",
  "0x28d50bf538fb98eb8aeb853640eb48c1515996b1",
  "0x29b6b6f9393e261d52ef1e92e16521df3bfa6638",
  "0x29e4abdb71be541579f047baada106619f8a47b8",
  "0x2b36aa62bd90cc333c07c69b8e123714926368d3",
  "0x2b709df2fc0d77c5abeac5ec8444a7abd11a601d",
  "0x2c06efff59e394e61c9468e2bb34af66defafb4c",
  "0x2c654d5083671326673819c8a5a5816c4845d90b",
  "0x2dbb5ea4010f65a5fff18b7d43a6c1237788a0e5",
  "0x2e5d9552eb7e449465528e02774fbc1785677f88",
  "0x2f8c96a1f9c05dbc412323b17fb5909e29f58dab",
  "0x2fed8b81ad83fb3119d11af2926e6ffe28cad476",
  "0x304112b6c6e0552286119cb9148b8451919ea9e2",
  "0x3063f7a469e5bdb9c5cbb9ff98412dbf96eefa4d",
  "0x309484366d3f789fd445276fb78e5e83a7b1cfc9",
  "0x30c5ab523e8324f36f4881bbcc69688ec8ef6ca4",
  "0x31cb2f55a1e34d61c8558f5d8b7c600e62073b03",
  "0x32cee755dc0e8dc6757f41f06bf91a0a6c5875f9",
  "0x340b500988b439e294cf5553ea7e98de64345603",
  "0x3492606e68208b40c96f2f5771eccf6e49239241",
  "0x34f0bbb69c2e0f7d05e604d76b80e614089be386",
  "0x35ebe483f91647aac9ea5b34e2e830a13c10d4e0",
  "0x35f546854758fd420e47d906f8bb7e51e0a60177",
  "0x35f8fa458fe42dfddf712f22c6ae91e3ebfccc25",
  "0x36438e936b56f797abbd77809d8d80ed5e2ac0bd",
  "0x36d7e86212eff3837671ddb76f5111a4e5fe6f9f",
  "0x3807cb1f9185296646fdc4c362417c3e13f95bab",
  "0x382c6f4dd388a71458aaefa837b385ac6c33ddf0",
  "0x38c5dabba599c027dcd0ba168400c8e3ed200962",
  "0x38f15a3402143a56d80b85a7fd98d8535fff440e",
  "0x39773f9ed6d8c5555e825251c5648bd60d213444",
  "0x39b1d9cbd708790397deb8209ce1f3810da44f98",
  "0x39c69c55f976ff8e3d1e13fe0053818bfe6afa48",
  "0x3a6c189bf2591f7f5c73913383d15442a7fe498c",
  "0x3b287ddb497690a05aefc9277531d42c38d53b9b",
  "0x3b94c8a5b47916687b2fef8112940986b0b8ed63",
  "0x3c154956e13a035c30b58a07f2fae91822730dc9",
  "0x3ce735f6cfad70d8a689774e69695a98fb12920b",
  "0x3ec6426bfec96dbd53942228bc5df729b49ad186",
  "0x3f0768f370431c365a00f03ae907ea56086940a1",
  "0x3f85204ea1d95d461545255d53f0d3cda953aec2",
  "0x3fd2502c816e557e64688ccebc42a42f6e519c9f",
  "0x4012aee6e0a7d14de32b73a3925faf285fb9f93a",
  "0x401711c8f93b5378a5fb6912f7693af7171b3fdd",
  "0x405eb746cddb481f862b3f172004a9ab1c3273bd",
  "0x41133b53ed17dd8973e95656f6cef598e00506f8",
  "0x41d912abd76632ba0b0133e95cb1c7d2f0e87858",
  "0x42409aeb4f436aaefbc6b542bde5081c46653499",
  "0x433c2b55c3eeed6f63fb847836f86b09f222e860",
  "0x43af0dbf39acca150f2c0541dd13e13ef69165b1",
  "0x445764315ba1370cef9de96530224ef7824ef0e1",
  "0x44dc2f04eef0f12b2b763f91b6d43df3b3de6b65",
  "0x451e007d12484ae429f6197cb37244ac4a99d44b",
  "0x453bae9d628e05078cb194be4c16270b279306b2",
  "0x453f18a1c0a2d8d2bcb851bfc4f8ef78ed54aa07",
  "0x45a1d22f827ab1217d23ee6a116a65c357db0350",
  "0x45c2188ec89cce1f0d08b41ffe6c7efb7e72479f",
  "0x46391d1175efdebb38bd0ca61928274292ec3896",
  "0x468b98b17c278909975a1a211ee039d4a6614520",
  "0x47c88b005e3a51ae121acd6d2dc702e0de1484a9",
  "0x47e3d2174c40dba8ae0f7059c8159245f0ab2139",
  "0x483d98b4f0ad0abbe910ea1605eda41b01a6c5b6",
  "0x485abe0148087b7cf758e13506f7fb3a6a86ad0a",
  "0x495624a0f21833b4b577d0d442b7207419a0f413",
  "0x498b186743fd5243b0f9dc55846bd6bef5e69880",
  "0x49d72b6a37010f4d62e81087685d0759eee2d780",
  "0x49e3371cbc4d51afcbff9e295ab91ee34bcf26ed",
  "0x4acbdcb02809cbdd657cba476bdd803a3522d86c",
  "0x4b074912788db4e9dab26d5f2325021a89c6ebce",
  "0x4b0dfe7d9f2a839f53e4cfcb7a82c4ad74fb7bd5",
  "0x4b192fd6aea476531d9465c8d05a30addf1cdc9c",
  "0x4b3a4cc30802053f73d170c8fe25875c99be7c21",
  "0x4b42d7e24edd21650f0282444b993ef41dc7eaf9",
  "0x4b6a54a308d7a454614a525401c0f486f40a7954",
  "0x4bd06ab2a2134044adaaca577178530ef53e51f1",
  "0x4c1487d62cadc016443002cd873c24c52c876442",
  "0x4fbb76106ca725ab6f9053efc23823e9a5e5bdd0",
  "0x4ff8bef8399a9a1b9aac6ec3d6d084bb15b024f3",
  "0x50e926a3179a443dd72e28e4eb00ab70b9a627e5",
  "0x512e3ad2f34b8dced3b5959b6ec5c431115d341d",
  "0x5191410d10e5d9c493d6247a752dc38d0bdc6024",
  "0x524a1c4d6e412e1a838fc6be312a75733b3964d1",
  "0x5409bb002a8cf338b0c99b0cc4d4d1404fba575f",
  "0x540bbf6a9e195398802f42552b3089dee5d7af60",
  "0x5608a7201f5e09c159fa0128f002a7a87bff81be",
  "0x56265e54ed6bbbf0c1756f5754fdc9433cc14e73",
  "0x566e18c471a20cce2884dbb3dca1f95ac73cb0fa",
  "0x569666be14c66218468b1cddf347902feba17a6b",
  "0x5729d1bf99ce6ebf6f059d431df56cf900971af5",
  "0x578114b43078df8d474595c1d92f77592d3859d0",
  "0x58670d157f14dcd442a212f50cd5acb82ea7fc64",
  "0x58c8255a67f46f7e1f48f2b488e4f3c5a477638a",
  "0x58d3d6ec4967958ccd33498370a4c393679354ba",
  "0x58f531c2ab1ee5e74469c567593b3a492a620cf8",
  "0x5914446e411a6e7fba0cae7b3b1367a43d2e09c9",
  "0x5925751906b901722c326519b8cce9dc6063f11f",
  "0x59bf9e7f5042394d757a8731c6a8f025c8172cf0",
  "0x59ccadd5b42603383df1605f1c2435e8cfd9e625",
  "0x5a37c56f1544298a229beb7aa7047ba378fc6efd",
  "0x5a3ae212338d7a3070cb06d83b4a323da975c606",
  "0x5b2aad096ce946aae3c4887947ddf49831c46e1b",
  "0x5b3d03866ef98f7d86f830392b0a236b358e8648",
  "0x5c468656afa3220508bf5d1be9eda2a2bdd01946",
  "0x5d965ec54cf9cd019c8b2b22103145f5a2fcdf9f",
  "0x5e0bf5cccb7e642639e2583a00c0f4dfeb8377d4",
  "0x5ea53576ec7916c1d4f633ae35e9aba3fc37305f",
  "0x5ec62034dd3b198763c72e5ae775fad3990973b3",
  "0x5f2f9a18b02f4cb26d21e7ff2bcedd51626ae80f",
  "0x5f42ae473d7f29449de1dbc3d4e2bebc5c07b600",
  "0x5fb0231244f8e8d851329ac7bea1b74f6e4b4c1f",
  "0x6012de81fd667f9eb5dc58c897112227c02924bc",
  "0x62de6a6409ae0127a8eee69f19aac360b3375589",
  "0x6345613dc5f067bcfda6c2a86998f2b0cba898fe",
  "0x63c44ac1b2774bbe65452fef78c001629c00c883",
  "0x63eece95b03dba502b2e6bdccac78ed555550d69",
  "0x64096773439e1ace82b5c95674ed342e0658b2b7",
  "0x643199de2b97a9cadbba9473eb4201ae1f968452",
  "0x64c3d956830a6bdb91b030f7a184623a1b324f95",
  "0x64fc8c50d3ae974bf9a32afb7232ae96bcfbb35b",
  "0x65a5c177cbc0a3b119c980bb643e0f28b73f49b3",
  "0x65dfd614c0ab5fcbb63e459fa7bb0e90b7d9b17a",
  "0x6633006af4804ff6b9a5f9f4e83e1fa9d9d7200d",
  "0x67f68d3756edebde67d26073954a6bd0e82150fb",
  "0x6820b51e600cb7631572b686515b08e0068bc50d",
  "0x687bbd5f17e872206acabda7a52672e24b1170d0",
  "0x68c0e23205acdb01385a28d4099f70e17de91e9c",
  "0x68f720bfe21979eeb850792bbd178d4accd66856",
  "0x6a037b9b16a88bcae5614d5221991b423e90a315",
  "0x6b584c49102f5bb8f5fdf9308e256f0e7953b1c3",
  "0x6c42c30c87081a53abbfcd1d6adfc4816a371f30",
  "0x6c721ed35f3d11a22d51f0dcc8758045c32ebb81",
  "0x6d1b1055b024600a547491dec85b1c426dc34f23",
  "0x6d1c0b488b6fd23c8b6da3e6ea36d950ef73aea0",
  "0x6dc2de36c572f74ed1a17a1f5c1b4fe066d0ce15",
  "0x6e6f6d15b9f9a2f94185f2bbcbe8550a6e185a2f",
  "0x6ec08b7e8b42075302ac052e48af72904a6edc5a",
  "0x718aff288be2e73ef0f89742af468ccf66769c06",
  "0x723AE904335E91238Ca84BA32352AFaa95d345Ad",
  "0x72ade704e062f3cdaeee6c4fc8fe1d2236aacfe4",
  "0x747a0609771bca1bf7ab30358a3b9b9fbb7a2e74",
  "0x757275cd0f17783bf58d8aae591dad9c04bc273f",
  "0x758736efb338ad018e2708cc575bf863b13578ce",
  "0x75f144e11ed35f3c4bd976c1e43aeacc4ea38ae7",
  "0x75f9d7f981e41be1ee9a281c981d70facbf7ac0c",
  "0x76d0c82d6ebc00f994e16ed8edda8ae6e206e68e",
  "0x796c6a9514987ac1be358e8c96bb8b6f0c572dc9",
  "0x798601a7ca5a041592556333a25ba7db598696a9",
  "0x7b71f81ba80060ee34db8024d40bfe2f04b76adc",
  "0x7c13afb16acd25ac70659ed2c4fb227e84df92df",
  "0x7d492e72b251670022ca418e248ee84d243507b5",
  "0x7d86ee0a32fdfc8f9282223b7f111e842f4f81e2",
  "0x7da8de0fcef881344e88756bd0e8e182515ccef2",
  "0x7e5edf76e2254d35f0327953aae62d284d204949",
  "0x7f30c17b81a75abcb473c165162dda8b0c5b04fb",
  "0x7f366a12df49bffcbc235e7f12f50be8ba9abcda",
  "0x80564607da68153e9a48fac8ed21f43de2da7cdf",
  "0x81c20dae3aa6dd92c8557746ad9ff4312f954777",
  "0x81c58302ef10f692b05197cd4622d3037c345a03",
  "0x82073224cbe41c196a79222a1451043ab74958b5",
  "0x8211149f4aa9ad7f86feb490b7b0c2a7443361cc",
  "0x821bf7b684de53ae2ce142d1557de34c9997200a",
  "0x826e72fcffb0ef7ab3dcc9dcad43fc9b62ab645b",
  "0x8308f5a4cb6b33b09b30e880e82ed637d834b097",
  "0x83137ee70c21fd125715d3eae3037928144030eb",
  "0x837cf0D13387f0DfBaD6160db9f47Fc951C2cfF0",
  "0x83a0c9ac63634fe4069c4b57e6a5f641769df7b0",
  "0x83a7062f79a0e9092f649aab590b72b101e4057e",
  "0x8401849c97058a2b6ea15d3ca36ed13ad8f450f3",
  "0x840df4437c6245a1fe26dad29405b506b2eb0ba7",
  "0x846bca2ef1f92021b4092e1cd0cc5c00ae2b5257",
  "0x84ab11a5237973e4131b16b4d9882e57446bb0e7",
  "0x8558dd15408ba8330d430ada40c73d9336d821f4",
  "0x8582269eac0dba0d027686307db085efa533534e",
  "0x85a4427f025200b70dd929e55b1dd889e17715fd",
  "0x86576c5bb59fdbb113c5ddea055319f1d693c651",
  "0x8766c2f77b25cf6c4f6f63f0391bc4143d736255",
  "0x87a5ee283e602718957fdc1a4a60f1cd290500ea",
  "0x87e205e53d796ddd902b54e9ad4eb3e492dc36c8",
  "0x88001162ccd6022089ad847cda6be5487ee985f6",
  "0x884be1ccb25d8c52b111d0e245d302610b0ac21b",
  "0x88cbc07480af9e2417e6717e053cc3bbff92dc8e",
  "0x88d186138ed173a06cd1381f3705033c748d5f30",
  "0x8988e4f12247bac780158ce5bbc055603101d79c",
  "0x89b6bb543986c3e0eea397a1d94ad18fa9831b31",
  "0x8b6278f24875641beb51c0028b51e466c53e67f6",
  "0x8ced50f5a2a04dada5d0156cc9b3790ad37d1016",
  "0x8d270e79e68d2c1080bbbf53c572cf82e665ebe4",
  "0x8d8456db1bcec4b92c0ca964060eddb0c061346f",
  "0x8dfcd287a876dc4bde2de8d5f35603e708e4e253",
  "0x8e22e77f50428d96f5f6d8296840dda7bbdceda5",
  "0x8e24864f6e26dc8a0e8719d084c12ce2c4b5e2ed",
  "0x8e5084db897a6cb81e21748841ce055765a1580e",
  "0x8e6c4b5cacb3255530a32cf15203a440a1918ea7",
  "0x8f89ddca1a50281743a0b860ac5d29b99a59b93a",
  "0x8fb32a648d6b14ee0953b785322c3293f8b0d761",
  "0x90b4b22b1d2bca83937ede54ec03936cc5300e4c",
  "0x91752f5d0ec6d3032861941071dbe0bdc3de7361",
  "0x924ced55c95a6ac9892b763ab8ec308f8dc92ca3",
  "0x9266d4795f1871e2b410ab4af62454b5e00e6805",
  "0x92e4568de1ccd2143d10532e9e5eded554993234",
  "0x945e577fc3dfc6ddbfde08fff82acfc22b3e2097",
  "0x9487aa21d9ecdce9522ea48d450773d684a3ee1d",
  "0x952a7f66c3d3f59853106ee69f4ed32913a6abf2",
  "0x95885877f9bbc78716665d3a1f5c920a73e398b2",
  "0x95a0dbf4099a058cdaa78f15186a0d5c507b0d11",
  "0x97dc3898a13fffaa13acfa198021ac7be3f26644",
  "0x98765483c3a0679839f91ca614382582ed90b786",
  "0x98c0a14de379aeba258fb11e83be73ad5aaf4d14",
  "0x98cbe9f936a2e5776506eea67b958f66aa4ba55c",
  "0x99245b0928c9739a763d6a60b34c72a960713ed2",
  "0x99263c6be50230d90c782fbda28c1ec74a105a11",
  "0x9ad843323763bc0283d067d965b77f97a44f4f53",
  "0x9bbbbd0bf7cdf5cbcffa3b22993aa84a41d79637",
  "0x9c1982dade6b2136cb95557fb0879ec0c2261794",
  "0x9c4f52cf0f6537031d64b0c8ba7ea1729f0d1087",
  "0x9cd61186115468da3e9495b2df4c7b2a56f2ed68",
  "0x9d38ed2866b09b2f5f7f54b7efd91175fdd0a934",
  "0x9dcf04f18ffc514efbe0d5dcba93afeb0a974da2",
  "0x9de913b2e5b0f3986bffa510201107d8a07cd542",
  "0x9e053ea35cec4d1f274127a799676f85b15be92c",
  "0x9e3d381facb08625952750561d2c350cff48dc62",
  "0x9e7d1dd7a93647225c04a112d3d5335814fff906",
  "0x9fa3c87eb4668984b87e185b24ae08759b0f50bd",
  "0x9ff296816f4a1ddf8988cab4d97c7c42701b6612",
  "0xa041e8fcfeb517d9682807b5c7822655e6d3da20",
  "0xa05eac1bde7ad8f0a6065940fd41c7efa46b3438",
  "0xa1106c7ca47ffd812ebfb966cea5893019d6d01f",
  "0xa13ee9242d8c4d0c5a312ef07cb35ec6a4f26753",
  "0xa17e6b0e04aa22802b2a32b20b88295861a84de8",
  "0xa1a1bfbd666df921bbaa77c815944ffaa9b02bc5",
  "0xa20456e735ab50eac5cb7343e7f91bd066e52c2b",
  "0xa20fff9a72eb47793cf923a16927b5c9869fe567",
  "0xa29da80cb15ef8ab36cec0e5cd04b43414eec4c1",
  "0xa2a1106c16d4834669d7be8f220ac59b9e6b5c44",
  "0xA375Edc977201a8451642d66ab54890398D5CFE8",
  "0xa45e4fe9f9c46f2fe00702c8a84138e08350fb7e",
  "0xa462149283fd9c700fc9fce47f3dc29609e59124",
  "0xa4e3dc1c4c57e2f5d4e18312dd72c210d69777d2",
  "0xa579f766406d0e18d8c7ff81d6e2db1dc3063943",
  "0xa6156e195f32f866c9a014ad62ab6da3aff05c9e",
  "0xa7763cc0694d056f04359d13f64bec5f6745d092",
  "0xa7ff5b6db120984f13860c004f7713f25087b25d",
  "0xa86f5324129c34312187cde5b42fe283fc493fd8",
  "0xa95ec5cd56347ae8f71724d23561a1bf7104ecfc",
  "0xa988529145c59d39b8cc980437fa131fb09646aa",
  "0xa9a0c59a43839a3f7feb74abb93e928c7044254b",
  "0xaaf109f3f5c53cb3b6112d2ea0e83004f1677807",
  "0xab7677798443e40a12371e2a2d704f6b8bb51f8d",
  "0xac557e28ef3b7377a141dceb8ae7559e38988316",
  "0xaff55c7a5149477ea02c7dce7f40d9cb4d622777",
  "0xb00134bf7a8ea0d2a209654e139bfb532d469a14",
  "0xb1089b8b0f90145f766039507150e092ea9b0ac8",
  "0xb2d46144371a3fc15b5c1f199300efdc43b2beb9",
  "0xb33fb83c645ac2a12b138636fe59604312092484",
  "0xb46eae7dee1a7ea1569594b37f522e03c38f1149",
  "0xb4794c0092c1120f4ead8f6bad8c3cf5c587e64e",
  "0xb51667ddaffdbe32e676704a0ca280ea19eb342b",
  "0xb5a364f162de925921d7bf9b604b41fa4cfe1a20",
  "0xb75b9a412f2ad2dd7cb2962ade829839c7b89ca5",
  "0xb7725a31fb93dfb139d6c0d40e17b226ca0a8800",
  "0xb7ff8e2bca891b7a0a051aadb187fbe88d4ed5c8",
  "0xb82044882c713c3b5a135eaed1e745fa14ba61a8",
  "0xb82334eb882bc9a235c48c7d3c8bc4a634de5821",
  "0xb8d6c533cf0759039c4a47e21dc577e6f46ce48c",
  "0xb966799a3b37eae74b797b8b69cea4313c4db6e3",
  "0xb99e4765f6c9fca9ebfc60c4d3a6d6f23cad4fd4",
  "0xb99fd24297fa2775e5a523812d03d6402cbff813",
  "0xb9d423113055a6056148e440eaabec0866f32332",
  "0xBA5B91b6963CD425BF5C9f67d68aa25e3489db80",
  "0xba8bc44131f34baf0dabd8e4a5de15ac9493e0e4",
  "0xbb0287fe22870eee2191ebe61ba742f5a6b93a46",
  "0xbbf5ec7f1040b2d23b058d61a9a6d6d328511a2a",
  "0xbc856dad4b3715057699dbf6ff8a372a663456b6",
  "0xbcac57990f8edf1a821e5758a3a6aaa9f81a3e69",
  "0xbccc1a1a0f8830790991b61dc412b1be63da5231",
  "0xbcff67496d1ab1557d9b7b3d227076d52279d9a1",
  "0xbd36086a33483307c4e1f71e954cba700e24e02a",
  "0xbd80bd7cb137a79d9d47a5994b09141f1db76b5c",
  "0xbd81a5db7feb74f729994e23a18d1c85c278403b",
  "0xbd98a053e3a5c45d0c0baf63aa6307dcd3050b04",
  "0xbdc280b126397ce11a0775a77ddf9a18a43e7b58",
  "0xbe6dd9fb48621c1f081453c3f4e3993d9cbea0bf",
  "0xbe8968EE25FBD5EbbAc867f07436770E2efF51D7",
  "0xbe9d1d8919dd00becb41a781e7215a7ad68e2804",
  "0xbf2263b5222177384b303bf2b20cd7ca2c139b80",
  "0xc00825acdb6fdd60dd94685ba8d40a3bf692c902",
  "0xc0359ad38a9470605bca06675d67d5851f65c0bc",
  "0xc1876bb98df09206a7929350e40eb0b970b2c05a",
  "0xc23a18b7cf192671e0b288203b4edfd6ef38a710",
  "0xc2eacfbb2fe0064523758687fe3dde3baa76de4c",
  "0xc33d0a01021fa34860fa3f3fe58f74f26cf274b4",
  "0xc355531378ae42143d3177d5a8d42cb9eb4b02fa",
  "0xc45954cf69a3f2ffa4fa742d641476d4fca6f2ba",
  "0xc553a293cdc68436f78951ceb6010b29711452b3",
  "0xc59edd4f2a8f565c91529eb15f9c461f978cd53b",
  "0xc5a6a22c194bc089e6f0b265b1f7e221f4f1c9a9",
  "0xc646cb51295519a2a16b736e0ef4efb3b2363a8a",
  "0xc6579463bab5bcb90a9635bef91ccaa78fffd7b1",
  "0xc7f90ce38279e48d79689c6a244ddd62f865f4ca",
  "0xc97b32d413bdf3039b7293c3246cc8fdcb864bcb",
  "0xca805b9ac9089d762603b98384713596ea108fba",
  "0xcb03d02695f40e8863bbb567b53e4f43090948b8",
  "0xcb1257e4f2efd5ddab72a57e76a0bdd68211c1e7",
  "0xcbb1662ffc44568d032500411c04253ad689d214",
  "0xcd11abbc370dbce80b81a250df87b3226f2b1a49",
  "0xcd25dc4a68578569afbded6a6d742caa11b37f40",
  "0xcd528ca3689f0f80bd3d45a4a438253b824ab8d7",
  "0xcd573a10caf44a7701401db675da273e0ddb68cd",
  "0xcd58d913110928afd6ff85f1cf7ccffb92c9d029",
  "0xcd87a1fef8efb74ebf04ba02cffa2bdb82013b2e",
  "0xcd9cf83dd90b9b8ebcfe3de49f6dacc97eaf0f7f",
  "0xcdec431a7170d10347629c858c6d7cf144e743dd",
  "0xce0b3870ab2caa995e353c1a00f61a363e667a58",
  "0xcf2fdb4557f97f307839596197bc6e38128834e1",
  "0xcf6069c99108b45c094d65e5016537fdc1bf6c14",
  "0xcfb095eb16c88ce9492cbfa04ea45bf950930e35",
  "0xcfff685979320598034d27c673937a3ec33beec3",
  "0xd0c801867ee7a85fff336ecbaa399338c323b24b",
  "0xd12257acbca112871070f3e49f5c0f22faa57ac6",
  "0xd1c89cfc54d529bb1f4e1e179a1b87d92182b378",
  "0xd1e2fec054b84a7f501818c7849817dd3065610d",
  "0xd23f6de1c2e475f0bb36ad917004bba5861941f8",
  "0xd2ece7d6f0f2629f1b2c4328a62ca25da8232801",
  "0xd301bd192d1cc89fb0e532654a183e8a597feb17",
  "0xd4407076f8a9de0ac94e22abba27aadb069a123c",
  "0xd4562d7d62cefebada19449a0ebd4a8d2afd0976",
  "0xd4579ef90e9f5bbf8776d3daf1a8e6140f0ef502",
  "0xd697d65c65e31d4120089fd6edb207449a9d3a61",
  "0xd6f1bf99127fb85119dec1cd6b459a35cf405402",
  "0xd7f5E70451965877A3c8841f202c3aCd7DF1B335",
  "0xd7f8a80a97963a0f55b56511ac1f92a1ec899a87",
  "0xd89471aa051e34fc776cdab9bf4f4db317f28c41",
  "0xd8d9c4337ea0126bfdb84ece157d5c934c6d291a",
  "0xd9075275fece55259ad068894bc93bb29dd4f333",
  "0xdae7084ff150a3e2fe42ae663bc48c2131da95a3",
  "0xdaf86b5927f97e3bdbf2ae9152fd9cd4ea59490c",
  "0xdb19ed87d040cf1a2d2538056d40e01fbe289528",
  "0xdb49c692b2a6da353af5622c0756a1f085b8b646",
  "0xdc1a61419d77b801ed878c2ade322f0e85b910ff",
  "0xdc245e0ecbcbc4210eb6a20530f57b9a944281b2",
  "0xdd17b04d77020e47693420035ffd6a647b206d6e",
  "0xdd9d8407f632287566f6a1b41a7bd2d94cfd4afc",
  "0xddeb4b81401d7bdc620757c65363795f9f1d4129",
  "0xdf3e69237d45a0460d210d1a13b0f0408107c50a",
  "0xe0ff164f6558810a6bc780a3ea3ee98ed15abea6",
  "0xe12f4ab0dc928247688e4bbd812c16ecdc944947",
  "0xe15f6f1e4cc7299be2ec786817dc700d602c7ec7",
  "0xe24a157fc29799a7e3417d27fee4da1f028d132b",
  "0xe29bc747ec4bf762acb3221b8c3521e811a7355a",
  "0xe2caf175046c63f63d1f9a72e1ec2c956890f039",
  "0xe3f7c9e66356ef1818c6d318b26409bcc64db4f0",
  "0xe43d8ddd91f93487648d4436f35829be05db31a7",
  "0xe4d65f833b7c043d85e3e329b83fe2942b536f2e",
  "0xe4d70f9d2d6691c186544416df2e8334b795c6c9",
  "0xe515c5f9bde58bcc720173081bdf58c19ce94267",
  "0xe60ee66bd4db2e6da0f0c76275cb318add31fbf1",
  "0xe6ffc8269d7412cf81f3d89afe2dd2b0893063a5",
  "0xe87d144612c0c13fd327417e1e5b4f3f7fe7eeb9",
  "0xe8c6368bf2be291d64ed75ca8ff9938d5cc5cb5d",
  "0xe8d6b7a2a26a5ec75496433b363746fccd21d4b6",
  "0xe962730cd7ec7eb6740bd4e03c0a1279f202c913",
  "0xe973130ff6491b3d653425060ec1e30e0bc8805e",
  "0xe9dd21536e8ab9af4353286c248ab0dadb64d9b9",
  "0xea1f1f3ceaf9e945d4824fba668ee149f07ac1a1",
  "0xeb9cd476339c7221f2a507d746dc02622eaa65e5",
  "0xebdff89f1e1ee0489a1b1b5d224863128b4b16b8",
  "0xedd27a2e9ac8358411ffd91cb0f0947ca59fbdee",
  "0xee4216fcb3b67a0a43c0ce8f0a2d51c83fb80685",
  "0xee667a3c89c7ee6e5a9595f998d32642dfd0931f",
  "0xef3041e1f836350299a614d1de80d7057390c1bc",
  "0xef75956f9Cf3e8FA8aB972C8387d84f0244831F1",
  "0xf16fddf528797c2981e7e412d44400cf9882b1f4",
  "0xf175384baa9cf1e98940fa272eb6923edcb29330",
  "0xf2283f0cdac64241f7846181460819e085aefaf7",
  "0xf299cb678c09f9341adb117003e2dc5b99d8d8a5",
  "0xf2bd3daea43ed0e66bbdf5ac8b0bc853903b3187",
  "0xf2fd05E5E5AF0b6b977F8C0F6D16c9f17d21a0f4",
  "0xf31dd477136fcc69da9d17276f00c378eace18cd",
  "0xf32e1cfc6f012f9104c50ca3f6fa552f5641f798",
  "0xf367236d56338ac780267ac09217b02746607cae",
  "0xf3b1b2b13bd6e3c07ce82c292bb01874f87bfbf8",
  "0xf3da1972ea694ab56d80ad88b7f8a4456caa8196",
  "0xf4e23d45846c20f35760aa33570e0cd14390b5f4",
  "0xf4eec84174b4a591e57bfc81af8ffb3e539e118e",
  "0xf536c905103661523e1ae2647aae8440a74cac41",
  "0xf5c8cecf00d06931cd0966745b0351f83a698b05",
  "0xf65dfa6a53f24bdc2fdb213792e75693fe126fc7",
  "0xf6a80093b5122216d2c5ef41d41495377ed4c229",
  "0xf6b952bc5b4ed221020915c38e0e15f0ef983880",
  "0xf7a6df6d5b8e45e9264bb6a024d201927773ac71",
  "0xf7eca7f2f39ae41fa27b7635b075d6f6caec14d6",
  "0xf82afbeea9c41fc2435db20adfeb26be534d6eab",
  "0xf86e9d424ce606abb160442642ede2c9983a5ea0",
  "0xf8a448f0e4b9b3ddcecc695266d37dc4cf6e701c",
  "0xf902a1c5815b57e7888dc93842dbff8f3d5523f6",
  "0xf9ba5169f86b95e749eed1b8c9e2d5df216d500a",
  "0xf9e566984b8310f3bb800b728794122b0356def7",
  "0xfa0bdd7fb89924d2661d06c356be7062432ae7ee",
  "0xfa1e52c3747cbf8802477a2ed6492694486d1ad0",
  "0xfa92f34b5d9b59303eac73f42f274566d3033593",
  "0xfaa2b0009ab2f17e95e664f8f9f0cc8946507332",
  "0xfb157f7ae07ffe0e75cbdcd247590e5961a16c64",
  "0xfb856523a2072d39405562211f50082e233438c8",
  "0xfc0a86c41d31968c1211cb8993d7e2ba1ce264ed",
  "0xfc463af93f97a950a23b94e0126a6a2fdb72f19f",
  "0xfd0ed15db61545cdd1886d0da20edd71d0d41b03",
  "0xfd4640d4fb229bd607df0b53d59075160deddb4e",
  "0xfddcb2ee7d4302b5d92d45a05b54dfe16adf8169",
  "0xfe2505b88bc7023b392670bfea4e0da7b8194cd2",
  "0xfe2b2709087202f2f729c1f09fc2616d156fb61d",
  "0xff38411246678843dad070c904ea664714ed210d",
  "0xfff25521dbddeb2bc6de8a9f45c6f29b70c2e703",
  "0x2Fa47b90C037251C198EafCf87438EC64039BBE0",
  "0xF3F04181b89a8EBbdA2d950419AaF26aDd709D5f",
  "0x3133197ae8F09AFCb9F4e7211f17DE7ccb5C489D",
  "0xA776488bE8DD7F250BD28c18f71b6D153428ea5E",
  "0x9e8eA10e991C1b535fb6ca08Fb21Fe2270370795",
  "0x8d824877f0c58C8Ad0b46A3972295a6Ef549aF27",
  "0x65ec83C8205d9AD695c3576722A66A2772ed99b3",
  "0x051e0d4cf6673d8e57e887137edca229adf11feb",
  "0x0757e46eaeb784ae0de62e210535e0c057895144",
  "0x0c71e228ee5c50a5d82d25cc2e93d9e7a64205aa",
  "0x0dc8df7fa7b52c4d850e2328339629ad9d0564f2",
  "0x1b9b31b6f2ab65e70a3d4fa7150add08ca55b91c",
  "0x1dc7c225eb8aa659010d7139dd4aa0a4f6d38caa",
  "0x2ebdf43e9b5e8150c7db1dd73f07b494bad52abc",
  "0x3ec6426bfec96dbd53942228bc5df729b49ad186",
  "0x3f47126d9eb302383159cd0c4042ff6d48405783",
  "0x405eb746cddb481f862b3f172004a9ab1c3273bd",
  "0x41133b53ed17dd8973e95656f6cef598e00506f8",
  "0x49d72b6a37010f4d62e81087685d0759eee2d780",
  "0x5deb684d90d8751a39c43db733611057da7089b5",
  "0x73a028c5a2c7f865a3194e9ae89c32638c69ea32",
  "0x73b41fafc67fbee0afd35eaeaba76e7468083f07",
  "0x7f30c17b81a75abcb473c165162dda8b0c5b04fb",
  "0x868fa84ee420f7a3f7beb984c62c4b77a05fb8ac",
  "0x8b5b518ab4a67532422106cc86f1567f5543ee6e",
  "0x9174776085365154cf6893f7088008ced8c0a826",
  "0x9efecba02f686c2a778521e6cc1dd9d0e830822f",
  "0xa58e46f99903847c7bab24530c105581823d15d1",
  "0xa7ff61f55ee34fdb2dcff34420af0150c1a6f535",
  "0xac35ddfbdaeb568d165c2f78fed58f4bed734eab",
  "0xb7ff8e2bca891b7a0a051aadb187fbe88d4ed5c8",
  "0xbdb5cedd0bc6e0a91c3ef8455b94a8ea39fa1584",
  "0xbf251cf798f3b3fdf1b53ae8e8d2ee2e666111d3",
  "0xcd11abbc370dbce80b81a250df87b3226f2b1a49",
  "0xd112071a5837ac1f69e40fac7a25caaa9baafbcd",
  "0xd95ead0e76d2d71d20bab8c6777d6a11f203589f",
  "0xdb19ed87d040cf1a2d2538056d40e01fbe289528",
  "0xdb49c692b2a6da353af5622c0756a1f085b8b646",
  "0xdc49105bc68cb63a79df50881be9300acb97ded5",
  "0xdd9d8407f632287566f6a1b41a7bd2d94cfd4afc",
  "0xe07d25d09d0504d50f36dd49eae4b839f68c6025",
  "0xe24a157fc29799a7e3417d27fee4da1f028d132b",
  "0xe5d2dc12c17BbdF0932E6F56b1F316673363cde1",
  "0xe9c2d22736aebd78b0dac9676145560295603326",
  "0xed6f4dacf10d6af5eb1eaf2de24b695eb1599bd2",
  "0xfaa2b0009ab2f17e95e664f8f9f0cc8946507332",
  "0xfb7d56b6681a6c27484e8d67a5fdd3f4cddcfd4a",
  "0x0412bb606dbd2710a2912af07ae977da37848e51",
  "0x0abe86ba462ae91f4f473234d5578b76dba59af5",
  "0x139bd32a991b9d367952677b33fe749d4b660745",
  "0x1424c2a237f32030fd914465410f89bbc4723b90",
  "0x19d55c3717360872774a9de93f302f1c2f4e4d19",
  "0x253efc307436052121d2c2c2556fa1051ede9f62",
  "0x44997e3422f9f33213d3c8e2d8dafe42b9134c59",
  "0x4fdf3264926c08f0e4d905eb258b60725593af44",
  "0x537b2671238dc3db1352668d0f4f4651da8ecc6d",
  "0x591be8d5268f2f9d6b62a6604d58f325eb7c84bc",
  "0x5d399e058a134c8bbf8ee67efd3271a8fddf36e8",
  "0x5e07fb29aa7fb940188ef1654d13818dbc5afcd9",
  "0x635d7202b058ca37c57b6748f57b78a47f6e857c",
  "0x6e1fbd4d033e3fb5e554837e1df208aa004864ea",
  "0x7d7947125fcc43d2fefa7fcde21f59f1a0040c37",
  "0xba819ed81f8035bb9c8dab06d2c6d1b083ffbf8a",
  "0xc0872cae709bbf502678e886af94bda1ab8a1a89",
  "0xd77d344e210992f67f729cd2867311bcc4fd9ba4",
  "0xd900b35a7b34766422e248f079089f4e64df49fc",
  "0xe8af2757c5db9b318702e98f2fe3fc1584899669",
  "0x08267cb203b4cf1066a81b0f218dddd8f0e33e1e",
  "0x0e67ce7da06875ec116654bdbea4727e5fa49d47",
  "0x1755ce48f758b56cd570def81ef0834a5c18f7f3",
  "0x192171be8eb35c11d1515e96aefd1625938a55bd",
  "0x3511ac7f2321ef471f9f243f0757face26c8b9a2",
  "0x483afda5eece4ffdd95e83531733bc93d82e003a",
  "0x4d18c1d5eb4be1d7356c0ffa221bb99ee086bdb8",
  "0x5e59428f72aa38e6ab7751fdda4fa535066390ee",
  "0x728fa8bf79545fb2e4a6fdfb21eef076e4ada951",
  "0x799c250d3c0e26a6964a51a709ccc032d323d324",
  "0x7e9b3dd8ced26838cde46c2682f53cedeca94873",
  "0x814c73624cd19e3bc352449dd5f787b148533ba3",
  "0x87410bf2bc0e8712d7af629ca20fb1329291d93b",
  "0xa73f2964aa8029a56077ababa388b42700d73157",
  "0xae13d5c548138762645c1a3a9251d56e2e358ae0",
  "0xb7c818c8bbb0c788863994f783ae36d147c28597",
  "0xbdc2a036d65dd7df71996149413d4e063a448d0f",
  "0xdd7e2f3fefe2db2dc7594b36c7478f25568e180f",
  "0xe28d0fceb3d18bdc27f61e8ff7b59e9faea50a2e",
  "0xf3f83a0afa7ccc58360cabb96a981148d815628b",
  "0x0ca98210431c43fc1a9617cf3b83a805cc9de0ae",
  "0x1dc7c225eb8aa659010d7139dd4aa0a4f6d38caa",
  "0x2f4ffaa59984d1b72318019b882c181e8232e04b",
  "0x33bca50b5432afd362cd976ac9900b48b925c94f",
  "0x3e2fe787feea89702ad548730d78997838376b53",
  "0x3f47126d9eb302383159cd0c4042ff6d48405783",
  "0x478483973288b689fe0d38fed5e5326d26554489",
  "0x4955fd9959d4b26e0ab22953652af21d97ce8310",
  "0x5395e455642c0f9d8631e45dd0809f93b93ecf2b",
  "0x5399baf90850fcb5818a6898695605551f221149",
  "0x61e3b17dd9788e8fd4ad0cc95401fb94b3a30423",
  "0x73a028c5a2c7f865a3194e9ae89c32638c69ea32",
  "0x78d607f219a49915bf5b45d8e6a2eba597457bf4",
  "0x86339a63b82a4fb5e1ea888eea7c760b9662f1c2",
  "0x87754fb795d2666368a8ecc7ec3d4a85f8bff93e",
  "0x8a5e249ba28c6f6492778c8850ce25edd4a2862d",
  "0x981a9d6416b0296ed19e87e4645a088499fa98cd",
  "0xc078027bc7ebab657783febf7dfb2a29db27134a",
  "0xc23a18b7cf192671e0b288203b4edfd6ef38a710",
  "0xdc49105bc68cb63a79df50881be9300acb97ded5",
  "0xbE65E4f905d6ED62D7e09d7f5D115a16f2AFF504",
  "0xb5e56848e46cf9648Bd2415f48209b6085d5D80C",
  "0x53E58fC50Bd93c7aC4A9eF8aC82044BA7b47b451",
  "0x2d7d5dD8a3218dFA314a53695F2e2c3e25630203",
  "0x8a2ca64E7a3a9D008346FD7dD67dB61f6EB42A51",
  "0x60E70632Bd42490b44e8d558816f782d37a030eC",
  "0xd1041B520b72Ccf54cdAF68e3E34290357fD5afE",
  "0xE50559dA2f4180305BC202ABfF3c0BD502b6B4e8",
  "0x56856365b4635C90DF1D41e05833b682E3ff270E",
  "0xC56b682493D335b2c6cC0e974cfeD4eDA471cB1A",
  "0xb0738A63A7E7De622661065a4B0695d046d29268",
  "0x3667BC81245769BE9c90e815D29b595871CD388e",
  "0x24581d02Ae216d5997cCBbA67CD937bd999f1135",
  "0xdcF2e719edD8E90DcBa981161f62a1667c68a5a8",
  "0x34eCa3F8F17B174212BEA639eDC6302a402b50b6",
  "0x9763771312dfed5bd8f14c224626be2af6c4102a",
  "0x0F2bA58cd5afE0d3B203DeB4faa1A250414A8F0f",
  "0x408a2Ccb50405Df2B5bf834bfD7EfcCD635138bB",
  "0xdd8e0A3b10c5638cf65aEBd39f71AE1DEE664469",
  "0xbb9038398780544407e7ef6583968bce4b5CC078",
  "0x08c133B50D1ecD5bF6b96F47717D555f0D2f458C",
  "0xB5Dd16F777d836089De26E03C0F0E03DA7B9698A",
  "0x504454E8DAdEF40422cbb58Cb7a06Af7d06B2EcE",
  "0x5505f68e400A63Ec2a8f24C2eE2b98DAbad13e29",
  "0x112d62B9B1DeaA943e8BEfB7270A9167c7b95838",
  "0xf9E4A219F9982a76804f0111219A04bb96901ece",
  "0x5871E6B1e58d0014a7F29c496fbb8ee25852dfCe",
  "0x9574152fA4d6C5dd04bbd3f672c6861A0E975FB3",
  "0xfc98B088552C060856cd93d1344822dAAf835EB8",
  "0xe2502EB83f07244A5b5a5Fa878BdBE9c8DF07d93",
  "0x3C36f8DBec7B5e74C1de617133c718C071C22a1e",
  "0xAe213b915A797C5De29ED2f42D463d388A369098",
  "0x2226EfAD8F461C57F03FfBc0C97fd1D2F503DDcE",
  "0x07Dfd812Ad2c43A3dDA4E3462865Ef14a52378a3",
  "0x462233f988488D2C459DAF53C6a9C98a3D2a484c",
  "0xCa1DC6d5a627fE1fbD3cf9648E671c969D74EB80",
  "0x03B6b8d1FF8eDe2d77AF184C3667B8311F409d9b",
  "0xf6899b1B495Fa263bb8d214F8aFf56caf13EA358",
  "0x00285086d8dac2361eb3d3a9a98f689879e454c8",
  "0x00950cf692f535963a3cf0d58e3da1941f903f55",
  "0x011ed61a306eb183c6143c1d00d1fde8564a2a81",
  "0x017a5024eb2316575b672a22c9a3f4eb5278ad14",
  "0x01d2f9d2c73dc71b249fd85272e41f7e0c959d6d",
  "0x01dc02ae6041adc7b7afdf14421c2249b268c570",
  "0x01fc666b08080edd41b91d21b40010fce9dc8aa4",
  "0x02573612fe78f82d04f270653bba3279d3995938",
  "0x02b6270d6f2cb804916f488701a5d9ce76d1c740",
  "0x032bcdfca20723cb9ffcf694b514fb54b0dbf25e",
  "0x032ef26d3e31a97ab55fb81a99790eb8b681b422",
  "0x039aa831e2b1ef619b547710ddf36d13eeba0049",
  "0x039c310d60f8c1ccdb2042d17cd689a63e8b3723",
  "0x03a2903da7c77758ff1d518171ec09bfd5e63baa",
  "0x044a34e7b20a65a31ed774137e144da44a73ffbe",
  "0x04d2b729fa85a52ed3f2dfaf49a74caf524b6f13",
  "0x051d92c2e9270b65d3f961085b73a90f7578b037",
  "0x0595f5c894149239eae74830b0d6d7fe64101f27",
  "0x05a8db73fa0eef886976c52e03e043d5a21fd2b0",
  "0x06b5fd9f8cdb62a1303253484c05619f76a012b3",
  "0x06c94d39044238562073ca45d523557deb03af0a",
  "0x06e736c392e46ac2cb69009b42ee8df2af5c9bbc",
  "0x06fc0a02f1c8d447fc5ceb3326a893f6b93fd469",
  "0x07067b1958aa70cd362a518120fb60ab7e5a1ac7",
  "0x071c479c613771535234eef2315a087b6f53132d",
  "0x071f267faf92a83fbe7dd1ef0558dba15f375043",
  "0x072ff40e47fb29e9ca96fa100c389fbe0400f47f",
  "0x075b0c30e022a4cdbd750b63c40134abfe29a8ec",
  "0x07b78095a0feeab67dad9b3288c17aba78df1178",
  "0x07dc7cfd43756e78189272369be479292fe0be3f",
  "0x085200a5d283a4c711543bd4ae97dab4fc39339c",
  "0x0853b096cc4a77c1216b297722c76f1ec2268778",
  "0x0953678ac2ee8571486ca9f94d3306d403cc76c0",
  "0x096031faa7bf80125d4982f2267641d3adfd49cd",
  "0x09846c9ed5d569b3c2429b03997ca9f7bc76393a",
  "0x09b76d0ea1a2585e57c73dbcde35bb6a0c57eb34",
  "0x0ad5f42c44cb1e8afaa116e963096de97bc7482e",
  "0x0adf3fc8ca9f2a342cc0ade9c678876700895e32",
  "0x0b03a7f0182720639cc4f6fd25bf8e51e543f0b7",
  "0x0b04d13a864843ce211c6199de81f18ec81357c9",
  "0x0b2e70ddf2adcd68cff5741ba95e520ede714118",
  "0x0b47429752c531a78cc8b0cf355cb19492df9623",
  "0x0bb790d6c19c51270e17b4c7be5ea47c8ada9255",
  "0x0be848e6db55564b186c6373e781c6a141eef067",
  "0x0c53c7da7e822e64bce38c6b2210801df698b22f",
  "0x0c74393df39b6810098db33b773003e590ff6b45",
  "0x0c7527db19b93bbd014774d654963938dd8f0f14",
  "0x0c985d4e69ebe1521ae8964d335bcaf33ef1e27f",
  "0x0ca98210431c43fc1a9617cf3b83a805cc9de0ae",
  "0x0cbbaea3158fbbb7e74ff346d208356e2ce76a62",
  "0x0cf0824b7be7bd47b0d98abb2ff4831cbaaa7802",
  "0x0d068cbb1a2464da587221a1caba55693401413b",
  "0x0d326eacb480e04ff2022b8d89b42b19cf4faaba",
  "0x0d3562d8022996c016916e4bc51bea5b261777da",
  "0x0d4c58fa09e242b55e5fc0f38f0b99ffdd6116a4",
  "0x0d9080ccde0e0fb20ea5a02abb27405a4c863727",
  "0x0d9720d462decc28c46c0db20d100cc824f6aa96",
  "0x0d9add3b974e4099708088867de38ae332289552",
  "0x0db60c6e6941bbc841a86b90e587d8eaeae2a4af",
  "0x0dc8df7fa7b52c4d850e2328339629ad9d0564f2",
  "0x0de5b3e3554649293b3c796da869243d63d2848c",
  "0x0e084ea861c952856707a67ea4d3fa466c1a5f22",
  "0x0e6f9babf6ea329f632b42d5b7868f2cdccde12e",
  "0x0e706eb35016519a1989907c31a6925b7af74aca",
  "0x0eaa2b262944ea9b76d08685389ff587271fa1a6",
  "0x0eac4689ec832305fc60d3eda84f90ce065bf612",
  "0x0ec8ec098bd27d09035745653894be6bfd00a5a0",
  "0x0f2ba58cd5afe0d3b203deb4faa1a250414a8f0f",
  "0x0f6da4f1b1e205c92925b2ec3511bdeabe84c4ea",
  "0x0fcdf4d8f1e48397c877d9f6ea1b79cb7bf536b3",
  "0x0ff24e2659a600fe348c11b26409ca3dc5797cc4",
  "0x1009dc39381da387aa4617ad5b9de410914beea1",
  "0x102158b711c75f336a728266affee5d018909a9b",
  "0x102c2bc294e68786828f1a9bf94e1390cac0838c",
  "0x10f1e7e5f81067fc788ffb41b926c8148999f87e",
  "0x112630ba98300a8fb0af4eddb42449c03fc65a58",
  "0x116a19773c2a6dd3c037bd6c13aa789973193fea",
  "0x11aa48c376b7b90678baf3086af97315a75f419a",
  "0x11d1b508b6e7026100f458f8f0eea67554a49088",
  "0x11f1f206a69692955237c7ff492f851c40655c03",
  "0x12198e9d1408c2e795cd3cfb90cffbc1ba7f7d0a",
  "0x1237b67ba15147b664d15c403aa61a0039d40b4b",
  "0x1248e8091170aa82a2e826c7d183afb04e4778e2",
  "0x127749a51eed3756178e494611d33419e2dd6e41",
  "0x12fb886a3776f6b04fc0b27346f55a89f4918a06",
  "0x13ae893c02b8368403b187231ea299c917e0549f",
  "0x13e1e23ff95b4cba7cf7f204a20dabade10c00e6",
  "0x1410a5ca07a05edf10dd7b2ed386b508f290318b",
  "0x1435f958a5230c7e49723f7fb8dacbbd322e929a",
  "0x148ef7b21d7b7dd1ab919d3d5e63a61c133b9f64",
  "0x14ba3e6b5a3abe6a778297434dbe45f0c47e12c7",
  "0x14f05ef901de8583fd4ff346c925cf4a54970607",
  "0x14fe53c4648c5e0fd9e44a4903c8fb02c791e76d",
  "0x14ff4b18849f5ecfbbd743515f5acfabf57ae399",
  "0x151f824834b13f63e9d4a85901900bb56497a448",
  "0x15bbccd76a770a726bff5f58ca3bbcf21005f15e",
  "0x15f28198d5fdc0bba0715772031f588c1ee164fe",
  "0x16431dec2e85a2cf971691aad005a452187fc284",
  "0x1660acea35b11c09383cb716776c85deb0cecfc6",
  "0x1674d6af75afd9f18d0fc3a82d668514e044ee13",
  "0x17639360386b6ff279ed727fa575e9245e98e64a",
  "0x180e7f7a9d966b739bc8bdfa3799a20dc484e333",
  "0x185aa5752dbe18cbfcc99c4292c32d7e99918ef1",
  "0x187b183121f969e736dd247eeedd058c6d2aef19",
  "0x189769fbc9cf678345c4d1721a891095b7a3f52a",
  "0x18fa2563fe28b76436145bfb848d7e4fc85c2a87",
  "0x195acd2bc2042f1bdf1b1fc09a1c1a1088e6a6e6",
  "0x196073a6be96996122b81854634475928d247195",
  "0x19b57f49f83697d513a68067dd1a36891bfdd219",
  "0x19b71f63dbe67c8938318c6fd6e6a55d90617fdc",
  "0x19dcb98761aff4f0faf3814ed152b539ba3c4552",
  "0x19e48b5b5c68a73a58da4bbd8d9c900ebafca544",
  "0x19fc4c2af821a11bf5db51a73d80889f59919c2e",
  "0x1a4a5c6fecb9b51a81d7b330f5ad5921f09b26a9",
  "0x1a65bc52f047f936f5f1cce84f177b29f4acc2a0",
  "0x1ac38ea70347fc85cde0d49cb52dd7f2418907e0",
  "0x1b2f5f7756c8ea39e2e136da2250b39abb0f0e4b",
  "0x1b856033282de6724454e32936c7b170f96dd704",
  "0x1b910af463d8ec8d916c76c07f9ab6aea5401167",
  "0x1bb51931c4a63b0774f5f62a668284f6f88d639d",
  "0x1bb94a8c89e45b28e45e65c81e87da73739d9c44",
  "0x1c64e1d4e9e367662e0c24d70c15e203ddedd2fe",
  "0x1c9581a1c630e3323134415ea134a9d44b089efa",
  "0x1c96114720838675a1b7189df367c6e57a9f5290",
  "0x1ca3075b5249e954614a9eb283a6f7eced1deef7",
  "0x1d059600cff53a2d22ca48b254fc8c22071b5d67",
  "0x1d197a512b33f26dabaff498769bbd5a37df13b6",
  "0x1da3862f7a87cb8d01467158f01f243738e21030",
  "0x1db87236182907d1b81ca96aeb868174d217735e",
  "0x1dc1e0a300bd641462d8c6e9f1ea435842061646",
  "0x1df2758b2bcb56073527d84ed4943994d0b687a2",
  "0x1e3a8812ae818714d842165745e34cc760b0cb96",
  "0x1e6c1375abc832540da73994bac82a2225a9bfbd",
  "0x1e6d3fac6bea6954f248ff5c686fa1efcec2c48b",
  "0x1e802ea7a4bacebecda281039f1327d02ae13be9",
  "0x1e948ccdbb1879d976b48f48aec3810835b11086",
  "0x1f9bcf38ae72b1650173917852d62d3b642edda6",
  "0x2008863d3bbedd2b793e44c0f0c39cf4902e33b3",
  "0x201c1186278a119fa7e01cb1509cf43338c0f749",
  "0x205b37e83c4538fc9af5b9b63de522e3035e95c5",
  "0x207a1868c0063039461b953b811ebe84d14da5bf",
  "0x20bea92732cb2b7a3f552ee22418f1dae59a1d3c",
  "0x214a382b0cce1c59b45c4c705420932fb9f6b9d9",
  "0x216b588eaa1b5cb90cb19d51044e634a7cafc723",
  "0x219ef848a2ad307d8d4a899262d860c51ac8076b",
  "0x21dd78de4dca7d2bd846628568d6bbf4ff691a45",
  "0x21e769f13ca6b5479e42bc969b13d76aeec38f14",
  "0x21f15d4349149b92a9e5dcf1da8d17d2e0753591",
  "0x22164bd27c244172275c753ebd36f3f18c82812a",
  "0x2232d71b0ec0e1b18a961c3aa1739d549a422c20",
  "0x2295b580776e57e419743c8e16071b726cdbc79e",
  "0x22b2ccb53963da600c83191db1ce3f61f92dcf45",
  "0x22c9b5b117993c061153e0323a6b22deef4433aa",
  "0x22faa564b9955eeaef3ace6da21740a40920a950",
  "0x239907b13f8918f7ddded8b30b34e69514634398",
  "0x23be58c3dedfa1e4b6ac93f9d1cb28d3e6bb2ff6",
  "0x24157db9928b42086017ba232d67957f9b59269e",
  "0x243883074f0f6d5915b3d8c33e5cb4f42268c1e8",
  "0x24d5acd17a2def16b451cc31bb1785f99bf11992",
  "0x24e95f63a4fc42022a9bb647206b8156d5025c7f",
  "0x2545badc5b41740308e0ccc1310b4810380ecdef",
  "0x25a5d189156b64d55fa991c46d98b12028f9ad26",
  "0x25ba2b0b3036772c5c5d24371da70e04c3373d63",
  "0x25c35630f9b82bec528c41f94b4e1ffa8970fd67",
  "0x25d626c5996ce7111ce21e7d2b1449b6af598563",
  "0x25d673812023af0e88a484cf408d020894571b17",
  "0x25e5bba1240ba58041d539026dedc1b3b1f2ce5a",
  "0x261ba31a295c1df6d8eaa1463089b741d20de4f7",
  "0x2663d0b5ce30d11198ff338ad3cd2d03ef12e51f",
  "0x26abd6bec54f17717474a3d9051e2dd407b4ffa7",
  "0x26e40cb4200df01326d73b1d7200ac944a6435f5",
  "0x2718e4e21a33d0a0afe740ac731350f5fe914039",
  "0x274a3d825ee5567102d5ae76d7a213a09918cf5d",
  "0x27f56e309b0f9bc349ec5283d2ba03f8e382ac84",
  "0x280aed7f23e97e5c27ca534e94914064518bf232",
  "0x281b7d10d2e07343d7701ccd3fdfbe4b9baf700f",
  "0x281c6a79fdda3752d81cf134896ff820273d5b87",
  "0x2863474b0c467a43369ac3a11d4b5cdd672328f6",
  "0x2897ba70a2c52e5923fbecc946d25933a5895d5c",
  "0x28d50bf538fb98eb8aeb853640eb48c1515996b1",
  "0x28f73459f81adcc26f80db77d5bdf880a50029b4",
  "0x290c6909616e5b5ffb2c92e3282a5cf82510e257",
  "0x293995b82a1abb7fcb56bd446d64a8e287007634",
  "0x296da8735ac42e16fefba93d5d10ea46d90fd364",
  "0x29c1272cdd8f93175849c61be08ddd4bcf770a07",
  "0x29c43564195c2f2c2fc6ef6981d9a796cde0cf8d",
  "0x29e4abdb71be541579f047baada106619f8a47b8",
  "0x2a339c3de66ee1f05310af7b5eb7a1d5e165288a",
  "0x2ae8b98af5794902046c80ef8a8566a74b40b406",
  "0x2af470ac1a696e7ed366968a26bf0f07514c27c8",
  "0x2b1e3b4d3393b98dde4c23429fca347939c74897",
  "0x2b28fe83fd0fe630f99f135e82bcaac99f9b70dc",
  "0x2b36aa62bd90cc333c07c69b8e123714926368d3",
  "0x2b45d9bf36c57577fb681aff999dafda7f209ad3",
  "0x2bbb3ee994a57c81b776a505edcbc44dfdc94ad7",
  "0x2beed52923815c3fb4805b21fde8ef31b3c880be",
  "0x2bfb3d6271eedee7d13714afdbf0fd8e679fbe56",
  "0x2c32db80f1d911702e00cd5051539782a02a7ff6",
  "0x2c4a6e3f40137822060afb7660b879165f3e3b9f",
  "0x2c654d5083671326673819c8a5a5816c4845d90b",
  "0x2cadff0b7452bc46bd6c2d94d145fc24c4c72883",
  "0x2d043f3e9e74fab91d792e7c953361feecc41b27",
  "0x2e00942a5fe98211a1a15a9ff6c292a563964bb7",
  "0x2e5d9552eb7e449465528e02774fbc1785677f88",
  "0x2ebdf43e9b5e8150c7db1dd73f07b494bad52abc",
  "0x2ee3e89bf63309305f8b736803702f035925e02f",
  "0x2f0fbc558eba681ccfe6ab54d2a4918dc770d765",
  "0x2fb8d70d158285cba24a8bd20f20a74dbba486fe",
  "0x301c358675354b0c0658c643c697c44200881322",
  "0x3065ad648a011921b6c5a83444775eb392ad26f4",
  "0x3067421ccd1a67d875ad29055185742201363949",
  "0x306e5f54c4bd36a51bd482c266331eafcb3a13a2",
  "0x307cbb9b47dcfb7ab119079ce97a3c3063fc272f",
  "0x3082380adb4e610565a3707bc449097284d180c6",
  "0x30910a6dae83eaf9e389f97ef3f4a0f34779b065",
  "0x30f84786f8eafdbe06d9924fd1b264c07b25ffc4",
  "0x3105943c81ddce652811dbeffdc279787c886f0f",
  "0x311548ee8498386f03fb20ffceaad0b7fffae4f0",
  "0x31264e77652bc1c54812900d2cc34ec4025a9a24",
  "0x317667627cf96acadacf7369772c7f60320133df",
  "0x32c1c4a7592c6eff73d60f317a2b514ad10410b8",
  "0x33ae990bf211acebc65c8654f3d3031bb5477c7a",
  "0x33c6adffe9bc0680d9d0a7e7bfc8d64dd19c8967",
  "0x340b500988b439e294cf5553ea7e98de64345603",
  "0x3492606e68208b40c96f2f5771eccf6e49239241",
  "0x34b2fb076dfedfc37b0812c4bee7e5af2cd5d427",
  "0x34ef4511f903c48efae463357a1366e08af3a301",
  "0x352b6f8acb571df3cd968f19aa84105accc73790",
  "0x35d81cc5fa0458ad8024a15c29c2c115e8c90e89",
  "0x35ebe483f91647aac9ea5b34e2e830a13c10d4e0",
  "0x35ef983c0d040e2deaefce5245f7193e01a8aaa8",
  "0x35f546854758fd420e47d906f8bb7e51e0a60177",
  "0x361d6628c914eee6739ec40d11845b7685d31f7b",
  "0x366e76db2cd7874f6f43cafcfffc519579f9c29e",
  "0x369cdf25fe9820bac1ed5252b4a4f1cf8a031583",
  "0x36c4b4f714140ad53f082d33a4fe773d15b8b171",
  "0x36d7e86212eff3837671ddb76f5111a4e5fe6f9f",
  "0x3705e8a44b9a36990b6f4b42f59dcc66d462ebdc",
  "0x3764ff18540030ce69ff217d34f1d1e90d3f830c",
  "0x381661874fbaf2d0e8083ed17d20219e2dca309b",
  "0x382c6f4dd388a71458aaefa837b385ac6c33ddf0",
  "0x3884399408c8c76c4e957499f61ba139689f649f",
  "0x3919db35dea8a1e4e4a2c7cbb1121dc536713969",
  "0x39fc4291f38ffb27d17b9c2b46bb8e5019e23ace",
  "0x3a2b7ffd4e90647cc2429725c53ef6ad2b3e1940",
  "0x3a77f0d59b27bb313d85a31a07c3be26ada4e197",
  "0x3b287ddb497690a05aefc9277531d42c38d53b9b",
  "0x3b317600f1407744b2f14149534a81bfbf7b9c33",
  "0x3b4aef47cbaca166ca4113449162d120b62aceb2",
  "0x3b5590a6ee4862bcdef866c404bccbf94b4314c1",
  "0x3b8eabb86846fbf925df9afa3991234b6b8f80c2",
  "0x3b94c8a5b47916687b2fef8112940986b0b8ed63",
  "0x3ba4b72ad49976d0369d9cd6d9bacf91bfd72336",
  "0x3c4736580633679ed5fc6a6d28d08b4f2f676370",
  "0x3cb2ae8d0fbd7248699aba57a028d8fc1ea30646",
  "0x3ccc6583703eb3e2beb3e4b5b56ef47311e04174",
  "0x3cff9b7dab2631749aca2c88a95f5f15ec0d3684",
  "0x3d80ee092cf7568f825b6d3f31abc3918030c715",
  "0x3d999b5609e969625bd70b46afcff2cc61bb108b",
  "0x3dd91c04f0719b8f88a6a2b7683edf85d6b6beda",
  "0x3dda279bce36cd02107a71c6f45a664b0dfbbf83",
  "0x3deaeaf6bb477458759a176d558bb7563b704f4c",
  "0x3e07f239ee3e62e1d0109f84cc15071367945c09",
  "0x3ec6426bfec96dbd53942228bc5df729b49ad186",
  "0x3ed94c67a4bd3116e58189585bcf15ccc2e9d12a",
  "0x3f0768f370431c365a00f03ae907ea56086940a1",
  "0x3f47126d9eb302383159cd0c4042ff6d48405783",
  "0x3f85204ea1d95d461545255d53f0d3cda953aec2",
  "0x3fC21025Ad8a305b023aa71bb2A5408a498f194f",
  "0x405eb746cddb481f862b3f172004a9ab1c3273bd",
  "0x408a2ccb50405df2b5bf834bfd7efccd635138bb",
  "0x40b824664480b71bd17f17988ce90d2cb6c76c8a",
  "0x40d6de70b7df671bde266a0c51c38c429fea8057",
  "0x40e0c6fba31b23d129bdec549ef6bc5ccb1b9819",
  "0x40e4cfbfcc0a518ff0dd77f4d326611be341e123",
  "0x40ef00d053b282a2a081102521b4f2cdc0556852",
  "0x41133b53ed17dd8973e95656f6cef598e00506f8",
  "0x411ffbf2f4197824279c8e7e2b47d7774b39ab18",
  "0x41227bc0503b46b0f90b785c2e8b0a01f18a1caa",
  "0x4180d7b895191379a331a1bbbd6660540e0e36f0",
  "0x41d12e32522e0bc20c1c8a8a72c96253c6f2f4fa",
  "0x41d912abd76632ba0b0133e95cb1c7d2f0e87858",
  "0x41dc573311f2b9f4eddf0e172b771a6ea92470a3",
  "0x42017bb18248b889a2fb726ef336446c757ddf3a",
  "0x4212f053196a690796755ee274b878aee7558852",
  "0x4237d3882305a133f516f1fa5f64041bef4a4089",
  "0x42409fca8bf3a84aa3123e10953be83c7eceb5a6",
  "0x4287fce85b1710f6186d2941259b3f1a1150b322",
  "0x429d1de70be4535b7a2e84789e3fa8a2b8ee7bbe",
  "0x433c2b55c3eeed6f63fb847836f86b09f222e860",
  "0x43c28a88d496d8e16b7d45c2bb472e97aef3071e",
  "0x44a43f5ac142fcb40f8b1fd386f26b21d6c316ca",
  "0x44b11fcaf5cab90d312c6e4ecdbb99b922e14327",
  "0x44df884bf4e63f7061b4d251737147cbc705aa3f",
  "0x453bae9d628e05078cb194be4c16270b279306b2",
  "0x45823dd5e2f66418fbffa2f3171908e8f18ef9d1",
  "0x4632fc4c5ac846e70b09f3e8c0168c250278c679",
  "0x46960551fc7dc60ab28a2a94d332e3257fa409ea",
  "0x46a9b64b68a4cab74340a5385d27a6d24cbb6056",
  "0x46c4b4bc396fc1912cfd8b293fde7b4ab296b01c",
  "0x46f8ff21273969d08ec843ed7179874c6e8ee868",
  "0x473fdc0313ec2f844b436f9951323dbf3d09d74e",
  "0x4756a6a863ec516eee6eab9f58a59d1857e40342",
  "0x47e3d2174c40dba8ae0f7059c8159245f0ab2139",
  "0x4809df6b13c4bdee9a163e510e9b7bbea4080d46",
  "0x4816e08f0daf971072051c0da7a42370451d0baa",
  "0x4830ffcb9543b2e4257ff21e18cda9d0df4c9ad5",
  "0x483d98b4f0ad0abbe910ea1605eda41b01a6c5b6",
  "0x485abe0148087b7cf758e13506f7fb3a6a86ad0a",
  "0x489ae1fc509265881fa91de467512e82b58421ec",
  "0x48bec23a5c455f04be5807021f742fd82d1a9983",
  "0x48c7bf7650111f11447a32e1087ad0fb250434a2",
  "0x490d5c46c363c264cb6ddc0fd7bb6f47acbe46c6",
  "0x495624a0f21833b4b577d0d442b7207419a0f413",
  "0x495952f6237354134094cd93a9764fe545dbca40",
  "0x49d72b6a37010f4d62e81087685d0759eee2d780",
  "0x4a1a2432115eaddb0b4551b973eab057c371c9ca",
  "0x4a8afb38c5e24d30b497c049b2f206a8425dc617",
  "0x4b074912788db4e9dab26d5f2325021a89c6ebce",
  "0x4b151df769a6f4b882082bb74ad0d6342f66b790",
  "0x4b3746e084bcffdfdba69ee0973e2eef6803f588",
  "0x4b847e9a89f38a1d439f0fb2b72ff8b82ca46d49",
  "0x4B8dDE1d16c7BE7FE3a95AD8a3518CD86A8364A0",
  "0x4ba5437c1d0bd07e5a9d65acc80a62b8f03a92cc",
  "0x4ba56fb663857963f5f1417e915e7b1e97f28eaf",
  "0x4bc33e73410f4bbf9a05cdfaffbfd5aade01f07b",
  "0x4bd06ab2a2134044adaaca577178530ef53e51f1",
  "0x4be41356e363135702909192943d990651452b68",
  "0x4c56e380685aef264699df065b68cc2a467638f5",
  "0x4c58b1328907b8375904d4a83e70e405134e4ac3",
  "0x4c79962bf4e29b3eb55dcb16886b27de5df229c9",
  "0x4c7db634951a1e8a1744ffbc693b12360dd9a98f",
  "0x4cbb5e729b8e7afccc2b17958bdc2aa7329701b0",
  "0x4d45cf4061d30635f3af496b6ec244f7e71d5866",
  "0x4d7849ed54d23107a007d6d07df0b05b78722a0e",
  "0x4da2d1578d837f896cffccdb56d8a6ec1892ef98",
  "0x4e326f20839f217f539b1b44c9a136401d917d5f",
  "0x4e3f57b627809f96e9dfb52cf8c436a773910deb",
  "0x4e5dae8c0daf6d3a452673897408c03813e63849",
  "0x4ed1b0bbe9545fe6eb0fbd80e49b2998239072d6",
  "0x4f29dec2b5ce2b82c0a68e124b7e33a11a317afd",
  "0x5007965e51ea5da7301c962228b29595212ec9e5",
  "0x50241feb3b9d0ea53629c4055636ab5a86a51a07",
  "0x5047d041e22c0372d2aaf3596bdfbde91cb917b0",
  "0x5080b95e752120fce142fd47d9c8f7f8aefcc769",
  "0x5102dcde9af0e614af6b60acea8d16973ecb8b26",
  "0x5115ee34406be22bae90d24f066b4682b44d07ba",
  "0x512e3ad2f34b8dced3b5959b6ec5c431115d341d",
  "0x524a1c4d6e412e1a838fc6be312a75733b3964d1",
  "0x52b687aab594fc76bec30a95481e445debe25b0b",
  "0x53a5a1e93d1a2639b90dc1422766e73dd1fe57e3",
  "0x545bd7afce929d816dffcd1a2757443a1a33176a",
  "0x550aeaf9ca525755af08f3829f200739b5e41a37",
  "0x553191ca30b888d10c06fea785b2fb9ceabaa513",
  "0x5533ce374a77ed2289ff82657de2ea8df7378304",
  "0x555be5343185cf44bf314c5acc9777810ab3ee4f",
  "0x555e152f01fdb41bdfd913d09c1ed5a63969c31e",
  "0x55e4f6e62d28df80ff8294d53473f8e7da9242c7",
  "0x55eff5ca4979a5c3a265c8c2f0806c7b98e148b1",
  "0x566cdc799ef1637a8b31ad3066f901bdc2095205",
  "0x566e18c471a20cce2884dbb3dca1f95ac73cb0fa",
  "0x569666be14c66218468b1cddf347902feba17a6b",
  "0x569db8c260bb065f0ce30a28d65f618ec47be676",
  "0x56a6e068d5a61d26cca38cec705969a058f80b26",
  "0x56fded725607f10ae98dc3572ef0f01196586afa",
  "0x570c2720a44fd9e15b97c79d5f3b99eb4528ec2f",
  "0x5729d1bf99ce6ebf6f059d431df56cf900971af5",
  "0x574f3df096a8de0936189302180a9fdbf6d611b7",
  "0x577b9e415e62e26dc45d145eb7fa54189156a1d3",
  "0x57a6825a072969e9082a56cfa6b0db840f79653c",
  "0x57d19a8c8d08cc71f7214a3b9cfbd2a07a92ae62",
  "0x57e766997ed89ec496fdf3fa315d12bc2ae87e63",
  "0x586a3327f0be87f8505446d7351b808d65eb1dc0",
  "0x58748fdecd2efb8fec849affeaf1a04a4de96a9c",
  "0x5895c444dd9608ef3e9805ff9d8fad34e9458dc8",
  "0x58d7d0016b21ffebbf41f4e4f5cb393927cc14cc",
  "0x58e56aabed602c02153bb53dec29ceb22f183dfa",
  "0x58f531c2ab1ee5e74469c567593b3a492a620cf8",
  "0x59144c30da9696d5b52a7f1be18c59923f7fa8b1",
  "0x596dd60efae7e4bdc13e7c0bf4d42b41d9d38ca7",
  "0x59786b36ecc81969700167573e7c79610cdf32b8",
  "0x5a18e03052442e9b16a1ca0a6982ded9eca82ec7",
  "0x5a28464c483537ba95aabc289bd7db2be6466855",
  "0x5a3ae212338d7a3070cb06d83b4a323da975c606",
  "0x5a505629bccbd4c58a430ca715dba8624ae107bf",
  "0x5a767f0966b35dc8df2558066beedf6af8d4f793",
  "0x5af0d36c0f0658de6167a7fa9c8c0d94ab4418d0",
  "0x5af9b3d775e75439043f825d69c849eda8c1bd38",
  "0x5b3d03866ef98f7d86f830392b0a236b358e8648",
  "0x5b5e632aa9d8a7320d33ebffc2641f664bd80dee",
  "0x5b683725c3356fe7e81fd596f04ec2157b5789c3",
  "0x5b869f8ac78f58456b02738bf0fa4374435f5358",
  "0x5c21f81ebb321ede0203733495e59083f3bc9d70",
  "0x5c24c1ec9471a5c493d886704423050e77f46476",
  "0x5c4f9feefe5ff75204d5d864687a04a37aa153a9",
  "0x5d50a1ab1488479f0556c94daf52e43aaa0eb892",
  "0x5d590d206a71711472e52fa2ef7514f51920bb64",
  "0x5deb684d90d8751a39c43db733611057da7089b5",
  "0x5e0bf5cccb7e642639e2583a00c0f4dfeb8377d4",
  "0x5ea53576ec7916c1d4f633ae35e9aba3fc37305f",
  "0x5ec62034dd3b198763c72e5ae775fad3990973b3",
  "0x5f2ebd6db31908ec48bac2f5da5a0487e3ca9b97",
  "0x5f90a4a1e496dff32c6486cfc74584587b86f116",
  "0x5f9173154690aa76def925b52a1dff25e4fcc218",
  "0x5fb0231244f8e8d851329ac7bea1b74f6e4b4c1f",
  "0x6008be79d74b1974d177a01e67bf9f7e3dd6a6c5",
  "0x6035851fa124bbb64c2112d62885b4229c73bc2c",
  "0x60855ad2d9e3c3294865d0c82586054c3cb147b0",
  "0x61bbf41e55ce67fccce1cb4b0d77790c47224b25",
  "0x624cc774b7c67aac4a47e73465dcfd246b744695",
  "0x629a4bd8b2f0694a81ae6c308ffbd0035a015dd4",
  "0x62dc61caed6ff106d1b07184ec9ee09e0ffb7ba2",
  "0x62de6a6409ae0127a8eee69f19aac360b3375589",
  "0x63078f71ff1349f023f6a2daacf412aab2d943f6",
  "0x631059f465ed923ec972af618699e0ead952e693",
  "0x6311a6b60756efed95cb1aa839afad6ef3fb0743",
  "0x638364bb4e8728a39be67a534cfcca5b62b4b094",
  "0x638adc0eb925e33f8e9402a5fe4ca3e758f88351",
  "0x63c44ac1b2774bbe65452fef78c001629c00c883",
  "0x65a5c177cbc0a3b119c980bb643e0f28b73f49b3",
  "0x65f7e7cee219b7b0ee07445d19a8715e1d266a9e",
  "0x6662950f360c17181f7a71405a1714b38ed86493",
  "0x667d595528abac80255124ce9252929530a08222",
  "0x66eed074c5ac049e01e93937a1a076ff946b39af",
  "0x66f5bd4eb1dbb5a48f0eaa8b2092ad211a5118c6",
  "0x672bca1b3b0690afdb7893263852c0e1bf3a9cce",
  "0x691ccecdc50f1d30128034d57a64c904dbd62f2a",
  "0x693b86d2663b959d7eb3cf852f00e65dd42ea7e8",
  "0x69e9d274e960b1647d3216d6d57f353cad011842",
  "0x6ac8f5ac2f49a074b3d99fd5c94825a4b2f27902",
  "0x6ad640e07276c63155fec7cff43b12b5e45e4aae",
  "0x6b096ba099d99e281b04cbe65b611c7b44d91454",
  "0x6b0c5977d77f9cdcf142e23b65bad289e18100c7",
  "0x6b33c7a3c2218cb2b5d82e6e3a41e6ffdf3decac",
  "0x6b3749cbb4c43a745fca252e917406c3510db874",
  "0x6b584c49102f5bb8f5fdf9308e256f0e7953b1c3",
  "0x6bcaaea0f3be2bbff1a7dcca7386b3646b87d8e4",
  "0x6c267a233a071944a7a41d5ab33d5c6098347e4e",
  "0x6c37f6a4cab6cb1136bad014efce55f1679c61cd",
  "0x6c42c30c87081a53abbfcd1d6adfc4816a371f30",
  "0x6c47f65584a5115a18bcdc28d8f1f9b1a36fbc1e",
  "0x6c721ed35f3d11a22d51f0dcc8758045c32ebb81",
  "0x6c8ab70c6b822048c5f71b4ae59d3fc94c868204",
  "0x6cd7d609b155cd5d36ea5b9a4ceabd0cdde50844",
  "0x6ce198e88e86da6d0ca360bbea1067882cf4897e",
  "0x6db60f32d7a77cf1876537c9975b83b2651ad0fa",
  "0x6dc142dc98820dc6eeb6d39369bb4f99af04fd9d",
  "0x6dde293a8317cfb4af91bcc9c17c9a38f2e5dd14",
  "0x6e16d42f951c3500b7f21209eb04be3f205762f3",
  "0x6e69e48353696f85fb35db50aadde3744fcb17c1",
  "0x6ea298d50a1328f646bad6e2f36dc063925c8930",
  "0x6ed75e43e7eec0b3f95e2dac87920de66f1e494f",
  "0x6fa2bd1f5ab73c3c3bc7f1bd017aaf990b0bc795",
  "0x6fc249bccbf874c718aa19589bd039962b8c5f0f",
  "0x6febf08ee1430c6bbd8f8742f456b6f77547d5f6",
  "0x703c5d0dcdbd3385c30611a53a70a058d2b3030a",
  "0x70f8cef8a20973c3c7251429962b63249f52b417",
  "0x70fa7d9a67aaf1f7aa8e65977afc2710b2c48196",
  "0x71bc83ecdc717d20bb563e4edfb4dfd93de09bdb",
  "0x71c82d958a57da5ff32e2cf33fc56081a33e74f7",
  "0x72727400aa04f79cfb1ad5904915448a627102d2",
  "0x733ab9a320c5f27ff1c8fd95d338bd76ee3e11d1",
  "0x7372838169895900695e908736a52a443039c5be",
  "0x73a3c0dc46ba75ff71b6e1fed661d6988ae84889",
  "0x73ca2a21cb4c2821c4f4439d9b3a3e303d5e2f05",
  "0x73f8787c4f86132318d2a19a6fc2a5cc740e2db0",
  "0x74413a63c3f8cfb5cb14e9de238365bae458d7cf",
  "0x746ae4f8de45972ee644c34290a3023847631289",
  "0x746b59d292db369a41fb8797ea03bf090c4dbf10",
  "0x746c7d6a4976e95558b16bec16776eab658c777a",
  "0x74873e926ffe90daa036669b76988ecb08911b86",
  "0x7499de64b726f00530ef096b2aed9b8e05891ea0",
  "0x7542b51642aa54e0aaa6ba5140f3b95db1b039f6",
  "0x759e747767b260f4b570261ee06c98e6286dac42",
  "0x75f144e11ed35f3c4bd976c1e43aeacc4ea38ae7",
  "0x761f94f9f0e5e72bff3c083752f84c3c07e755ad",
  "0x7672f7ec15cd4e4d921ab814c9fd03ead0acc612",
  "0x77142cb01dc9a84bc80a5f0c339c9fa654b24977",
  "0x771b5715f2b202ddf50b2671d4267959bbddfb61",
  "0x773cdb30e335ac224a0c78b2baa64db33fa9714f",
  "0x7747559f01ab0df9c18cc2418f546e3bab655aa6",
  "0x7749d6c77a421b989d1f4e9f3139b1220f7316fa",
  "0x774ce3d524d40ed46da92d4fea178821ec474862",
  "0x776eca9dcc432bbcf10f24b975f4353dd48a9b2c",
  "0x7835cd862f9c3ed1c90511bf9f02265546ebf4c0",
  "0x78a4d0df22a73f377f9074d83d06147ab0a861e1",
  "0x78d607f219a49915bf5b45d8e6a2eba597457bf4",
  "0x791a0f5eb4ffca66ac1c4c8b0c495a33e1db4d92",
  "0x792d0007263d6e3d763b4a028f2df72d90f00118",
  "0x79981d6f80caa1fb327d0af34093f8aba7477379",
  "0x79b5a13cf034fbe4ac583ba2db06ddf232d2c8fd",
  "0x7a0ab4a019f5b9626db6590f02d07f8ee504ae8a",
  "0x7a9ffe0993887f3e5da982c3eb3e110adc918b29",
  "0x7ce53555ca008e8c25af55a703d45a7ecd45e358",
  "0x7d175bd123865f9ca8ae40d3a009d0186da4b09f",
  "0x7d260dbad3ce2412f083e811285471ad2ef2c7da",
  "0x7dba1460346981c8756d2637c8fc60c297e90274",
  "0x7dd3801a1120bef223bcbdd151236c3665722e1c",
  "0x7de3e5eac31b5a44abc85b6495f1ed07a054816b",
  "0x7e2d3a2d01c8165562724815da8de729ba2ca42d",
  "0x7e5accf68ca4fd09b6479e66b7c419d80f79825b",
  "0x7eebc52df419083a749b36ca57d07f02662cb9f7",
  "0x7f30c17b81a75abcb473c165162dda8b0c5b04fb",
  "0x7fd4502ea9e017911bc4328ab10db88bbc8af955",
  "0x8005003c3cac4c4b440d3abf7e91841ead16e837",
  "0x804060797056cc80f469c1df42dfeba471148661",
  "0x80564607da68153e9a48fac8ed21f43de2da7cdf",
  "0x8078b3976e4c2884df64b95f16a0367a2c735490",
  "0x8087a8c55573301e1a963209739d960cd91638ba",
  "0x80afab702176d51423a793b58ecdc71684e9d533",
  "0x80d8056fc62136c71de2de66853c22617ba211c6",
  "0x810223dd36d5cbf2885c847e50ecf82bbcd4c998",
  "0x8121ac42f24fe104b46fb4175ec0a75e60803c7f",
  "0x81ad9e6c82437cb73ecb5c4f27094c7e5231d5eb",
  "0x81c58302ef10f692b05197cd4622d3037c345a03",
  "0x81c5e2e00648edfb07f4819cb13c8eed4ec3fc89",
  "0x82073224cbe41c196a79222a1451043ab74958b5",
  "0x821bf7b684de53ae2ce142d1557de34c9997200a",
  "0x8308f5a4cb6b33b09b30e880e82ed637d834b097",
  "0x83f89c2ae788fe4c76f39c4a3c7a84c3b4384e4d",
  "0x8438200ab5feaef7e076016f97dfb738c7507f9d",
  "0x857faf106b213fddaca0df67463f52177b257b48",
  "0x85b0dc990c73ff1f74d427e6a2ace098f5f42eba",
  "0x85bbea142274056780f3647cab891959cb2760cc",
  "0x85f40b6f39143efe85c2a9b3b8f2d88a4b83bd6b",
  "0x86576c5bb59fdbb113c5ddea055319f1d693c651",
  "0x86943ef68150a5129e0bac115959ad47fb601117",
  "0x8766c2f77b25cf6c4f6f63f0391bc4143d736255",
  "0x8781bc0a2f385eec36912fa178d904959344d1e8",
  "0x87a5ee283e602718957fdc1a4a60f1cd290500ea",
  "0x87c89f5f027b0dc4626e92d92e5964ff8661df84",
  "0x87d1db1d9a335991da77ee4b23b8357eff0d24c5",
  "0x87db0df3eb53272858bf0708a85127096b636138",
  "0x87e5a0a6ed3f574b11986549d0b26467bebe7e99",
  "0x88001162ccd6022089ad847cda6be5487ee985f6",
  "0x8821de22fc9797809cd5885ef0b0f2270504032f",
  "0x884be1ccb25d8c52b111d0e245d302610b0ac21b",
  "0x8878acae557be020686a26c96497444f76873c2c",
  "0x88c8ea1470763e9651faba1e944c7715fc9bbd42",
  "0x88f96204a47c3bd173b672a49f010149c4bd802c",
  "0x896ae45164b0eb741074a1cdb3df170f5ed8f664",
  "0x8988e4f12247bac780158ce5bbc055603101d79c",
  "0x898af489a405caa9609e1412275168fc21d1c385",
  "0x8996d6625bd04672c58808f6e17dd77012de1328",
  "0x8a5b204e1f744645efeea4614bc64bbf91d85629",
  "0x8a93e80c19f717b913dd028f12042b1ca08e8ad0",
  "0x8acb0bba4d7e0ac06b27c0f7ca01acd975d94c13",
  "0x8afb9d472c7f7facee5f6b9b186f1c6bc544b7b5",
  "0x8b5b518ab4a67532422106cc86f1567f5543ee6e",
  "0x8b6278f24875641beb51c0028b51e466c53e67f6",
  "0x8bc3f6eb59ebe063f645c7478d5d52cb41e909f7",
  "0x8c8237da302dc13d094736b96f0508fd55c2697d",
  "0x8ced50f5a2a04dada5d0156cc9b3790ad37d1016",
  "0x8de1bbdbaab3d68376b2441a3ddabb27eb24f8e3",
  "0x8dfcd287a876dc4bde2de8d5f35603e708e4e253",
  "0x8e102c7f3ec4fd0888b1be19cc6aae8e1792d5e8",
  "0x8e5084db897a6cb81e21748841ce055765a1580e",
  "0x8e7149726dd566cc790fc5bf2fc5ddb4fdb14e26",
  "0x8e993c84e35f4f4fad262b6190d96e1d6242bb47",
  "0x8ea6b6b80d2fa83abed9f2bb8b1ea273c0f2e219",
  "0x8eb0a2694d3224d7e7d599a5a11aaab0c8189d8b",
  "0x8f1b03b58c22b8798a35f2a10e5e18769c672c1d",
  "0x8f89ddca1a50281743a0b860ac5d29b99a59b93a",
  "0x8feb97070cec0830832b129e3ed09964697cc03f",
  "0x900dfb8c1d7ba14d04e38d912838b267fa00a978",
  "0x90123c1e3335bd51f831f17e3c826fb9718745f4",
  "0x90184d6775e5260add5af32723cb568a21684698",
  "0x910de31cf99beed178adbf70841afb1dd5d388bb",
  "0x9176cf802a5a27a73b1a793ca0c64fd52eb97252",
  "0x91d7116a09aa0cae87366f0f71670cf2bdff20de",
  "0x924ced55c95a6ac9892b763ab8ec308f8dc92ca3",
  "0x92b5590ee202ff27f8cd03fe173f9e042104c93c",
  "0x92e4568de1ccd2143d10532e9e5eded554993234",
  "0x92fa0d782f7f2a93b8f21e2549fa9d0961d1bbff",
  "0x930b383593a1758d73eee512527a3fa47886a506",
  "0x934e30eb80c42618752f9696596a9730adec8ade",
  "0x93fd0f3024126e34a1dd682a3b6cf73cf52d3b2e",
  "0x9429d16026ed46d3d3ca6656eda53d7760ffce11",
  "0x945551768c6d57ff385075b257bb54b64c1f98c3",
  "0x94757206332ef51aa7182cc9e1199966e63637fc",
  "0x94b35b6808a43b1db3980be22494a3bbedf4592c",
  "0x94cb1b104d4140d6d1bc3826f9b0c5c3533de999",
  "0x94da11a4a55c67afe39b5c2250a503c059b27ce2",
  "0x94e79aabcf6f89d3fe0b6f47e00899cf56801ed0",
  "0x952a7f66c3d3f59853106ee69f4ed32913a6abf2",
  "0x953a6f2527a9152598d820e2b857a33d1505e0e6",
  "0x9581150c82328f31b3ad90e2fbccf52354daff73",
  "0x95885877f9bbc78716665d3a1f5c920a73e398b2",
  "0x95a0dbf4099a058cdaa78f15186a0d5c507b0d11",
  "0x9637a000d23166947cc8522681f6f0c41b614b2f",
  "0x9664cea7e2dc2a6c06beabe60a530924fa209d8f",
  "0x966d2428ff82fa86963dcb985566faec55c95cd1",
  "0x96d49f677ef52e214fdf24f7dc51b73649ef885c",
  "0x96ea90a2511115c0d81b24eddbfec49ea3b59c49",
  "0x9738f949ac39a2883e0176f561b8c32139ee33d5",
  "0x97701055f57d01fcddcd181d3b47b8da2bf9b4c0",
  "0x979246ae8aec7321a4490d243e80c356e5f7d87b",
  "0x97c5f210584b1538d4e3aea5f68270bb1138bd7f",
  "0x97c8becdb6bdb1bfc0a789cc240f0e126c9a3feb",
  "0x98765483c3a0679839f91ca614382582ed90b786",
  "0x98c0a14de379aeba258fb11e83be73ad5aaf4d14",
  "0x994bafd3006a4b171008c77e93f92437f16915f5",
  "0x9aaafde29d5988c3cd8a8517c82c4bd47d144597",
  "0x9c1982dade6b2136cb95557fb0879ec0c2261794",
  "0x9c2f4f485506b0bf4a861253bdd2d4cf62d2c032",
  "0x9c895c28f1bc8f23bd67cdfd8eac7a29fa874ef0",
  "0x9c9d2f9f91ffe29f75a0fb62e1de08b8d48f48d1",
  "0x9cbe1cc0684200c1dac6d35e84101d7b2e3675f0",
  "0x9cd61186115468da3e9495b2df4c7b2a56f2ed68",
  "0x9cfac5020946ddb4f073c3b391b729cefbe5ad4c",
  "0x9d21c79d71bb257febc1d45b352daf801908a271",
  "0x9d77dec4083fa8567b6c1f17d986de9665954d5c",
  "0x9d81edf075a7fa717b4d1db7a40aeb56868269c1",
  "0x9dff2856fdf04fe8247fbe7e9a6a7244a73a458d",
  "0x9e3d381facb08625952750561d2c350cff48dc62",
  "0x9e3df23c284cef828438a4143d6bdd950de54c82",
  "0x9e4c791f75791f53c914be3ead7b96ed4b437de8",
  "0x9f625edac04319c7ff01cb14cdb474722239f956",
  "0x9fa3c87eb4668984b87e185b24ae08759b0f50bd",
  "0x9ff296816f4a1ddf8988cab4d97c7c42701b6612",
  "0x9ff6bcb37d09dc570b2d3b2a4b226ed06f19c8cc",
  "0xa01eaec9ea5fb718acb20ba4a493713095a02301",
  "0xa05fb1510359ea72951ad5cccfed9cc9c417861b",
  "0xa161f0e1ee72ef12941d9dd6e75fe94c143076b8",
  "0xa16231d4da9d49968d2191328102f6731ef78fca",
  "0xa17e6b0e04aa22802b2a32b20b88295861a84de8",
  "0xa1972ff87bba5d95b832965d18313a98e7e08cbe",
  "0xa1a1bfbd666df921bbaa77c815944ffaa9b02bc5",
  "0xa1d84ee9876f11d415e3b08772748f99d4e93934",
  "0xa217621de6ecdfe5b943365620df58fedefa7c7f",
  "0xa26034e6b0bd5e8bd3649ae98960309dbd9eda7f",
  "0xa35b67ba3b645f4265164bc398bf36be73f8d9cb",
  "0xa3f2ea3683e8116a5faf5e52a695a5171bae088e",
  "0xa44de069a3063a61c0489f2064cbbb37746ce563",
  "0xa462149283fd9c700fc9fce47f3dc29609e59124",
  "0xa47b31dbe6004f3a5f8ee35d50efc1d96354c943",
  "0xa48f6fb679034191f5280247d0c1cdd7f098ec1c",
  "0xa4fa05e9efcaed6f55d808575a9b22b2757388a7",
  "0xa503ea2b04df8ac586a3ee626fd961c113145066",
  "0xa5174611d3f3dcfab29d80990e3ece2bdf4d25b3",
  "0xa570142f8f8f44139f8a1bf3811339406d87c876",
  "0xa5d24e7e85ed19a3f73d9ee24a0793bc2951eabd",
  "0xa60d6dc7cb5e2a16593c0ceb9caec3c10ef8bba6",
  "0xa61fe601d74f57c9ae2cbc550a6faf98fca59a0c",
  "0xa661bccd73ce8264565c9630e7a070d9b5a17703",
  "0xa697fe30d1125a0438075b476ecdfd77fb12ef53",
  "0xa6c11f4deffc6b06d0bb7a64244cb9e59a7d6718",
  "0xa6f5e0b54ddef382f1ead33fc58919ebe7c19c10",
  "0xa71b09b9e73031a612c6a289421120c8898b3dee",
  "0xa71c468aaedb027c68e0e2eff2450a888473be5f",
  "0xa7652ca2084b5518c92ea027e64b16b38d9da0ca",
  "0xa7763cc0694d056f04359d13f64bec5f6745d092",
  "0xa7c43c81d458b428df425cfcbac3cebca3b1b2e0",
  "0xA7C570F33093449921385611BB71CE70Dc83DDa3",
  "0xa82120d3ef1bf0fd1599e449d1dfa2f58a9ff456",
  "0xa847808c45978062a09dfba1cd0d61cef021800e",
  "0xa84e530dbdada54d1daa6fff8877d831366cf88f",
  "0xa84f5ac7ecc24d36448275081ae742e91cf749ce",
  "0xa8b1d034bb853032b1a089ee1383d5bf9c0a6b81",
  "0xa8d08b7aee657a3c51367453036030824d79c961",
  "0xa8fd4d11cdc4b6f23f7a23bcd6a1bb8195d9b912",
  "0xa95ec5cd56347ae8f71724d23561a1bf7104ecfc",
  "0xa995f5a6e692ad48a061810894e235bb1cac7fa8",
  "0xaa06c9e53301a4580b6cba74880345167e68ba8c",
  "0xaa7efcd542a021d391566a4526ebc22c6992b4bc",
  "0xaaa9d0a912a3de949f61cc2a0b65d152d3e32446",
  "0xaaaa045d4c4676ff1443be5e495152ecf2967502",
  "0xab7677798443e40a12371e2a2d704f6b8bb51f8d",
  "0xabba4ab6c2222f886df759d31ef0c17f93279f83",
  "0xac35ddfbdaeb568d165c2f78fed58f4bed734eab",
  "0xac820fbc716b51703a7548963ec4fed6e9a8454e",
  "0xacafceee8c51da29203e83bed0a0a4a66769b76b",
  "0xacd3f90191b20594a6e38ab7f72ee7b4ca04fd36",
  "0xad2927498fea77bfedb9955c1e0b3d2d67e3f569",
  "0xad5e2495732e05b36bb51c8a44f72c2fc7ea6733",
  "0xae325f7fcd86297c27727442ad88af2a4718d9cd",
  "0xaed9ba189123b33155a02a6bc955b382d828284d",
  "0xaee8646bd065f95d6fc848228db07980701c8e8b",
  "0xaf2c14e377538c79a9eb57b333c6aa32547f9944",
  "0xaf4cdbbd068cb781b26a587e98616c90017b1054",
  "0xaf4d4e99a2432aced9759188bcb09710feac3f51",
  "0xafd5be32c95e4132892fef0d71e073e48a9cdc2b",
  "0xafd7de3ebe4acb429458e34768babc407909d86d",
  "0xafdb99def38a49d24a5189d341fc96f4729f27d6",
  "0xafdbab99b9cecdba5f08a11e62cf94056276adc4",
  "0xb084f1f139c3a477e22a884be8b349aa6b2b73e6",
  "0xb0d2f89e63c84263b6bca1e0fe60efff125f4048",
  "0xb0f7b6b8ea8f0760cd06c31e09f7a490e807de90",
  "0xb0f9eadb1cf936836b742f34913bcc26fa26fb49",
  "0xb103811cd6c800ec5567c320b56d77803149e7b2",
  "0xb1089b8b0f90145f766039507150e092ea9b0ac8",
  "0xb127744f076bc495bf51a4710f0a1f8e15283957",
  "0xb179cd45ed036891b01ac4c796404ff8c1c7a187",
  "0xb1bcf504f569c04f27b3a77be802e64a05bebbfb",
  "0xb2462664a7761828d634cb7d8ee1c7997b58bdee",
  "0xb299dd7eeb55b1ca6703a3af011826d053651562",
  "0xb3de37376cdd99ee13f3a6fcb08ee9bcd7400cad",
  "0xb3e4ebc288c097b1166a5645c0accf898da5ac69",
  "0xb46eae7dee1a7ea1569594b37f522e03c38f1149",
  "0xb4c397c9c012b55c3aec534be1b1c08440467301",
  "0xb51667ddaffdbe32e676704a0ca280ea19eb342b",
  "0xb524ac0d100f6d35a82ab5a1c78ce2edf5bedc39",
  "0xb5af766524e6b7f253db57c51a0dc022e85c0538",
  "0xb6417219691a2fc6b17eb7fd109dc208c8bcd8ab",
  "0xb6dfc0ca609823d4a8f74ab3bcf1c2bbf47c0783",
  "0xb6f86bd79d9d6d3502666692c1624c18913798bf",
  "0xb7379b91912e335f21f6699c0522ab12a457f5d9",
  "0xb755eb807585b86e7aff341bfcc0843effad9aee",
  "0xb75e827aaf5c204f1e375b0d52e4a6d1ba0b94e5",
  "0xb7d39519cfe5645aff774f5eab7a89c718b7b04b",
  "0xb7ecbf7070e3fbb20ae7ad431933895439f7f32e",
  "0xb7ef63aa3434c90cde8ded26d89bbd8b240d1649",
  "0xb7ff8e2bca891b7a0a051aadb187fbe88d4ed5c8",
  "0xb82044882c713c3b5a135eaed1e745fa14ba61a8",
  "0xb82334eb882bc9a235c48c7d3c8bc4a634de5821",
  "0xb83d89f5d828a50197aa7f65ea1c91d3c181db65",
  "0xb87960d3f0c232190e8a44a93f8d04c0d78ccd4a",
  "0xb8b9f270c0941b80c0b57f68f969d2302cfe9f43",
  "0xb8d6c533cf0759039c4a47e21dc577e6f46ce48c",
  "0xb8d93b02bde385918e5b86569b5e1a235902fa7e",
  "0xb90c28ae57fb833e37be2c117461c198028083fb",
  "0xb916493278a9fa3d5ef0bd354a8fed275231c32b",
  "0xb93d2146ee1d023bd7843904aaf4b027ac34d690",
  "0xb9517f9c534a82084470cdc03e412825a7cec54d",
  "0xb98085c6bde950e449b239c03bfcac772e9f056d",
  "0xb98296c9b2d75c6c358cc9367acb4ff433f0a742",
  "0xb9f1d1f37fdd3a4dbc9f3d7f676d68533572e524",
  "0xb9fe1e88622e712546ef7d0d9dc00dba25282a93",
  "0xba136d3b38a7ad5245fd5aada8b3f27aeed861db",
  "0xba25b7ef59a183f00714b7e75a84207d7b3d8ce6",
  "0xba4ef8f0a6de00277b7b6f7d437ee9b7738e33b0",
  "0xba7fdd9611e6a9f39dcd0764e137be9ab48add9e",
  "0xba87082e22db697ed80189cdc447e10babd154fd",
  "0xbaabe13864bed38d66e1a10316dc5b1878dec48f",
  "0xbabe91412dcd9697f991d0c038f1fd460b260e1a",
  "0xbad80961fac9cab4dd76b21d1de6cedc1015df55",
  "0xbadcab3a9cc7831978a5fa9053b7b756b269a7eb",
  "0xbb0287fe22870eee2191ebe61ba742f5a6b93a46",
  "0xbb08212af6a1b0a6d5e8acb6c108af72ae25fe5a",
  "0xbb190045da11543f7d3589e40b68b41bb0e4562d",
  "0xbb3f9a54af88f7a16374724c69ee5c823fb34ad2",
  "0xbb6503033579457bbc433ae345dce70098c2f551",
  "0xbb8b5c4413e733d01cad715f7fcbfa535ca00f1c",
  "0xbbadd6f1f2034edb0da04db480736a67947fbcaa",
  "0xbbc32b3258dfe4d4cf9a814e70dece844cf0902a",
  "0xbbf5ec7f1040b2d23b058d61a9a6d6d328511a2a",
  "0xbc839cf6b5178383cd4553b9e964c3f07675c62e",
  "0xbc8f7c4d25e7adf6a62d8c40163f185d7c563842",
  "0xbce1636ea7a28d299890db0276a12c130a6570c5",
  "0xbceedfe92ad1e92146dcc8be734788a7e3620b92",
  "0xbcf02472a295f99e3753fd74fc666ef0ea0a8770",
  "0xbcff67496d1ab1557d9b7b3d227076d52279d9a1",
  "0xbd05895d023da171f185d1da64f2469da83e8922",
  "0xbd0e610a650571a25236ea39cd01d7cb8f150a4f",
  "0xbd3f4f88dd6799f6b26269690c7643e4c50cd37e",
  "0xbd53060021a7f274afcb875d4ccdbeb50109cf4f",
  "0xbd609936ac671715d01d12cb3075221038f61efa",
  "0xbd613a9d887ed8fe1d7399dce96584594e5abc31",
  "0xbd97a288e7bfa77f47b27b7848bd37a145b4ad38",
  "0xbdb5cedd0bc6e0a91c3ef8455b94a8ea39fa1584",
  "0xbdd6b42f0446875800931c1cd916c7b2247c6189",
  "0xbe1dc5b6773cb802ed2a6d77fd662dda2743646e",
  "0xbe4ca71d2511d4dbfd8291c4d850dd1287ffe35f",
  "0xbe518f98448a25b667297a6f2900e19f1681bb40",
  "0xbe87e787e3d414684b9b14b8892ae504b0fea064",
  "0xbea01fcf710f73c6b26cd69fbc2f4356f1ee9a12",
  "0xbedae6d5f69ca7cf315e249ba911af5ee9209e0e",
  "0xbf251cf798f3b3fdf1b53ae8e8d2ee2e666111d3",
  "0xbf45552e6ee9eaf7d652fbe905e1c9edfe4d3b3c",
  "0xbf6ebf441be2d2de94e362178dba82039497698c",
  "0xbf8735ad7a3c0e8ca25df7f3c158d66d113c046d",
  "0xc00825acdb6fdd60dd94685ba8d40a3bf692c902",
  "0xc04addaecfbed5dc7e95ebc891f830a89836016c",
  "0xc06efc9be16a34a713c8b7144a82898190f5d13a",
  "0xc13f7eabf2272208d4342ab356ff7706407419f0",
  "0xc1876bb98df09206a7929350e40eb0b970b2c05a",
  "0xc1a48b5c3d58f82c198517e3f2bd1548af50956b",
  "0xc1c40ad78b96bea82fd4b491c005146e2a0dd325",
  "0xc25f4e4efbb2554f36198911d095f84207f4de2b",
  "0xc292ebd6b5f3b8d22693223f36ed6791adc05a70",
  "0xc2946f834197fbed96a7114e4a46e4500f6cd94e",
  "0xc296bbfd0f5386e8d232ef6a9dc03330beaaf306",
  "0xc2eacfbb2fe0064523758687fe3dde3baa76de4c",
  "0xc3689b375a6371939c4a70747aea75676d5ef074",
  "0xc3a0178234bb7eb55f18efb2de2d49e19567b30e",
  "0xc3b52d51b493b5da4d51627929f4fc38fd51eaba",
  "0xc3d8ed8401de7d88b1cf4ff87de3c48642dee9da",
  "0xc41a36776ee40e924e95d767ca04420fc3bf7746",
  "0xc43484efff8a828cfc58d9195face6215aff08e4",
  "0xc44c73b9f36132d7479243656b34a756654ae448",
  "0xc49e3b56961b897c14927331cbdf000b41d96fee",
  "0xc5488672c5b8c8ce50d651ac3f608f1a61539788",
  "0xc57c5f6fd64ec11e6788da6ccfe2193fa548fc05",
  "0xc5841b895d55dd6890bc12f0bace0fe5e12e2754",
  "0xc59edd4f2a8f565c91529eb15f9c461f978cd53b",
  "0xc5a6a22c194bc089e6f0b265b1f7e221f4f1c9a9",
  "0xc646cb51295519a2a16b736e0ef4efb3b2363a8a",
  "0xc7062f13cc17a6ee5bef82194f088a77e2ec54f7",
  "0xc74ec1f6ee76d8661538292efb62c95fe97fbf6b",
  "0xc7517a9ea280c14769a6ae52bc52387540c2044c",
  "0xc75da5fe492cabff70c45a6b46f81ab37d81c50f",
  "0xc7bbb1541c8db5f62b7b5d6d881cbbd0184644b9",
  "0xc7f90ce38279e48d79689c6a244ddd62f865f4ca",
  "0xc8006485faebf41cddc3ef5a3a9e20bfcf34fe07",
  "0xc800b40b74fb2f33163084a39de3ce3174de2cd4",
  "0xc81e1de266e86d48d98636666b632d07a822ad61",
  "0xc83e5955db0934fcd48e103c39a0020b90ada0b8",
  "0xc87ad081743f09764fa210b9e1a913381446469f",
  "0xc88baad5d2ec805084acaccc41976d8ab28c1929",
  "0xc95bc221b023e0a675a2ee2f855513316492d9f4",
  "0xc972cde20c9fdf726e48f457643f93a0d1ce02a0",
  "0xca5dea8dc35fb840852451b4b94d29e71b2885b0",
  "0xca805b9ac9089d762603b98384713596ea108fba",
  "0xcb1257e4f2efd5ddab72a57e76a0bdd68211c1e7",
  "0xcb5e51d796717e867ed29edb13f861e323df0b43",
  "0xcb65cd69c02b778ba2a0ac08316b975d592c13ea",
  "0xcb6bf878777ca03e84163083b133a20ffeddf5d2",
  "0xcb7136e37846153ac07066acf346032a5d40db47",
  "0xcb9d4b9ae3a04545846cfd6bcecb8222140e79d6",
  "0xcc3ad1ba93bbcec800f6bd495be697b3337b0bc1",
  "0xcc9da72a418e981074d6a00c328000413386fddc",
  "0xccfe12882a2d2b030dd11eacf7388242d13157cb",
  "0xcd104ec8f823bfa17fe11c78cbb46b6af6f0e6ed",
  "0xcd11abbc370dbce80b81a250df87b3226f2b1a49",
  "0xcd25dc4a68578569afbded6a6d742caa11b37f40",
  "0xcd5a7416e0b7b57fd718de70c10c8304dfe9ea4a",
  "0xcd87a1fef8efb74ebf04ba02cffa2bdb82013b2e",
  "0xcdc8a902588354d8e8804ecb7561023b7b3f075c",
  "0xce447d814fea1c83d30c1b1a61d5b248adf58ece",
  "0xce6a6cefdc75bf85e903739ecd3ad4ff89d141fa",
  "0xcebc6fcd8a43a582b0c6c0fe1e9a1ffb76d11caf",
  "0xcf36a32ece96d837a3f2e4631ab763bcef612575",
  "0xcf3c3ffeb1907782e88882e136049a2bd5a2a59a",
  "0xcf48aa3fffff170ef335fa569cea2b8a1b058914",
  "0xcf6069c99108b45c094d65e5016537fdc1bf6c14",
  "0xcfb095eb16c88ce9492cbfa04ea45bf950930e35",
  "0xd06252ca5d423a892faec936e9a280340bb95256",
  "0xd06a1dba2afd6dfe08815241bbc4c86807580d06",
  "0xd0c5d932aa88e841cf9b8bbbfd1f4a942b40b5aa",
  "0xd0f4287b817ae02f2de1d20da3b3742fde124eb2",
  "0xd1041b520b72ccf54cdaf68e3e34290357fd5afe",
  "0xd112071a5837ac1f69e40fac7a25caaa9baafbcd",
  "0xd13f2a5c70dde704dd8389bb1559964cf32f686d",
  "0xd1842d4a0fddb7ff4c66999fe72bdfd629a16de5",
  "0xd1ac1da2e6d56dbb8bac91f1614550a3b2cd092d",
  "0xd1e2fec054b84a7f501818c7849817dd3065610d",
  "0xd23f6de1c2e475f0bb36ad917004bba5861941f8",
  "0xd2a27d3629986942f9323e5d8333643a9fb85edd",
  "0xd2a2c1279e873310427ad44a97ee00e889532574",
  "0xd34604acc4e6ca8f99287251b7b6f78bf9bfeec5",
  "0xd35209ecb095d6ade26dcb30870e037c299477fe",
  "0xd3974902e1ab1e013087df92567990f14e0950ea",
  "0xd3d50541edbb8944603756c822c9d77ed2ceb83f",
  "0xd41acf64692a39effa0db4cfabe3245c5021cd59",
  "0xd451efc3e2208cd15b3d95600e7123e524685dc5",
  "0xd4593c88862b7bb6f0388c2473e40ffd046f3737",
  "0xd46819ac3bf59ed284af7c192728fdab8b0b8489",
  "0xd4bbcd01ce6c1a92b669b1103a98e02588c47024",
  "0xd4c8ff87f13a5e2a9e44a6635466986a44542e47",
  "0xd4cd901acc1df52cafba9455de7ab687f0000000",
  "0xd53cca49ea34419f369e84bd0b3372635779711f",
  "0xd68472a0ec3710b1221103e3279afa8d56feb11f",
  "0xd8455ee2befda71bef72203654bbd4ff27a005f6",
  "0xd868d93b7bcdf5f7816f5cb53282402909bdaf87",
  "0xd8a4e1280ed221c765351bfd7c3166e163e9a455",
  "0xd900b35a7b34766422e248f079089f4e64df49fc",
  "0xd9075275fece55259ad068894bc93bb29dd4f333",
  "0xd9603ea61c235ee4338e06902065d7710b37e107",
  "0xd962ed45ece571e91ba083ebb907e828fa11ce3d",
  "0xd98d839275cf356ec9e34a146c7edaaa69f29022",
  "0xd9a15d10535337e90405c79008095ff668e9f988",
  "0xda8adf0a4097fdbc2fe5cde874aec32f813eb1a8",
  "0xdadc7abff713213f21129688d5f9d672bd0dbd93",
  "0xdae7084ff150a3e2fe42ae663bc48c2131da95a3",
  "0xdae8776a87860eefaf9afd6957aef17fa55654c2",
  "0xdb19ed87d040cf1a2d2538056d40e01fbe289528",
  "0xdb3dcf9a3b11071bec9353c41b66c70ec19a065e",
  "0xdb49c692b2a6da353af5622c0756a1f085b8b646",
  "0xdb94da1a5e00e190e53f1da530f769d8e5843e07",
  "0xdbd8c5f71915a44f4959e3fb86b6db929b4f93e7",
  "0xdbec9f8acf7029be79034db7857d1d09c9a6dcd3",
  "0xdbf1b144e787958ef9f429954347af46b5e8e403",
  "0xdc49105bc68cb63a79df50881be9300acb97ded5",
  "0xdc692e8f58165c3f1313add637df2b57f42d5797",
  "0xdc6e4b60bb7ab5f287075a5c9521c5182dad81b9",
  "0xdccbc04af5d79e2fbdc5084f9fba064a87134620",
  "0xdd8e0a3b10c5638cf65aebd39f71ae1dee664469",
  "0xdd9d8407f632287566f6a1b41a7bd2d94cfd4afc",
  "0xddeb4b81401d7bdc620757c65363795f9f1d4129",
  "0xddf3c8d51d07ee993c0ab670194a68f4b81b3654",
  "0xde08dcd41d84e48fab7b216b0478867dad95e554",
  "0xde6d555528eea5ec2ab7e63c902466122ecdb663",
  "0xde7a619b032a3eeba16f6e20b4440320dd02b437",
  "0xde8d3579f7b7cb595e85f599a0d2be9a36ddb9a2",
  "0xde9593f820633945f6bbcf23feeb7b1ca28b9e79",
  "0xdea208c78672f3ab31deb040b7f08503081af46a",
  "0xdec378fff377aa54b6db39c4a594f7f13af2dbfe",
  "0xdec7030cae9548cd89ea8d16470d416372de662f",
  "0xdf4ac4ea0d5d305e5758cd6430ccfd5fb3609555",
  "0xdf60ce18ec2e257b6ea07814a4cd002b4991fbeb",
  "0xdfdcff60641a499a2a5b85e3f9fab67c01b4bbab",
  "0xe02879200cddb0d71f6f931ebe2e5208bf489872",
  "0xe0b3a311551d211721e1831caaabbd84f5e66af4",
  "0xe0ff164f6558810a6bc780a3ea3ee98ed15abea6",
  "0xe123cdee5ade9160a2d310bfdd207a72ee01506b",
  "0xe15f6f1e4cc7299be2ec786817dc700d602c7ec7",
  "0xe1704b02f68ea50806389c82411be58f07da2457",
  "0xe175458e2916b2b828c1fca32891594e43dd715c",
  "0xe1a6a821d29664824f9bdf980c9b859d188d9ec6",
  "0xe1c22727f4fdf12f335ff2f53c1a94ce76f1588c",
  "0xe1fd3509143c1f90ba840f88a876b23781cceac1",
  "0xe24a157fc29799a7e3417d27fee4da1f028d132b",
  "0xe29bc747ec4bf762acb3221b8c3521e811a7355a",
  "0xe389fa9e3e0354c7dc05bfde3c6b424d2a63e0d4",
  "0xe3abe82b7e5fcd6943806cf66fe1b9170e5aad15",
  "0xe3f4808bbbd78d9dfb27a7f8b5587df3afcd63a0",
  "0xe3f7c9e66356ef1818c6d318b26409bcc64db4f0",
  "0xe4a3b8f7a222c2c8093470746a6cec2cfb71307b",
  "0xe4B76869e6A75AF15721dA6Debe652666f905b35",
  "0xe4d65f833b7c043d85e3e329b83fe2942b536f2e",
  "0xe4d70f9d2d6691c186544416df2e8334b795c6c9",
  "0xe4ebad58c7b418acdbb4910cb29cb366dc6b31f8",
  "0xe5d2dc12c17BbdF0932E6F56b1F316673363cde1",
  "0xe5de6cc4b63a0b9009e7096ec5c5bedd4f596fb2",
  "0xe6b8a876f406b44be587c9c90130ce832b861165",
  "0xe6bb26d4038f320fd3fb7874d61c170251d91d0b",
  "0xe716198556d331f20de0b5559aef43371b86c0f1",
  "0xe738dcd53151327bcd1b57eba6f118740b3a9f99",
  "0xe78cbdd279cd38d0ab2a7a7f9dc12d68a669bbde",
  "0xe7a6538f1dacccbd87c97239de49230479f11ce6",
  "0xe80c9c66af23514c48131590b541cbaa7d5ed32e",
  "0xe84c9090df944fe1ccb9c778fad055e0158e34e1",
  "0xe8c6368bf2be291d64ed75ca8ff9938d5cc5cb5d",
  "0xe8cb7fdc5141f07950c673fa82d30db79297eebb",
  "0xe8d6b7a2a26a5ec75496433b363746fccd21d4b6",
  "0xe964f06c04ff62494ebaa2b363e99cca58569fe8",
  "0xe9b343fbb4091790c314bc7e389906e46c08b937",
  "0xe9b54ba35d4649d88e982629a4fb56a328638f07",
  "0xea05a16d3d922feccea9e48061e1f578553be38b",
  "0xea14c78813e5da2a88872550b98e8723623318fa",
  "0xea3b2923e13f97b7820a7a2aaacf492939166a85",
  "0xea529400d3d0009c2b67a563a07f0d7f22cd1522",
  "0xeae6d104a4ba2dc0d7b44443921aa70258b4d69e",
  "0xeaeaf81a78e36c8b7c8575dcfe9ae6b8ffcb6570",
  "0xeb7ca932f0fc5f0ec0ddf29d06294faea6a3fa3e",
  "0xebbbdd6710cf947e60476b808bb30ecf9626db46",
  "0xebdff89f1e1ee0489a1b1b5d224863128b4b16b8",
  "0xebe412e521edae11942923840b87fcaecd09c56c",
  "0xecde044c2285ed6e4285921935d2749384e8dcf1",
  "0xedb494705ef3b02e7631af0cbeeccb2a2b6aac91",
  "0xedc6424a27bbf96b9401fc20d47b4cdf79a1b8fb",
  "0xee0e8d3c5855a2aaf875ed7d7818678482c8818f",
  "0xef00ed8c3ecbcafe172385dfa955555c6ac06f32",
  "0xef75956f9Cf3e8FA8aB972C8387d84f0244831F1",
  "0xefb33dd8aa62089d403e5ee55ac719ce11464c5f",
  "0xefeed27f87f6bde006dffac71dffbc7a163ab592",
  "0xf00897ed581ffcc2f5d98f4808a022a35f095aed",
  "0xf04fb800c6ba28d0345822e2a090b0fde03a8930",
  "0xf077ad31a7b47b7248fc8cc102f2cbcdb42560d2",
  "0xf19558935ed4fc56a44dca639dd6ab1ca5b60740",
  "0xf1cab5e2fa0a539a06db5f62a0b03e4120193c9e",
  "0xf1ea6173157c4d48a748e9435efc7bc871fc0900",
  "0xf2370a5a9e5c3dc3be09375afb0d3c06dd2adc36",
  "0xf2bd3daea43ed0e66bbdf5ac8b0bc853903b3187",
  "0xf2ca60b7104df580a77b809dab9d57ef0ae2874d",
  "0xf31dd477136fcc69da9d17276f00c378eace18cd",
  "0xf43948ed8f2fe57e18ed14b25b980219f25af23c",
  "0xf44db40ab932e80ff480a05c86a072e865f3292f",
  "0xf457a6c6371e7259d9a622c7a96f233e3ca849dc",
  "0xf45b9369290df182ea73c014efceef4a5ea5f9f6",
  "0xf48553912dff31cab2bbe16032462c99428873ec",
  "0xf4ad628abc7deb4ba5a6e9e658993c6b0e535405",
  "0xf4db3660a22cb4f62b2922d6993502acabb8a0e3",
  "0xf554868fdafb826f6adc93cfada7d03d98038949",
  "0xf5c8cecf00d06931cd0966745b0351f83a698b05",
  "0xf65dfa6a53f24bdc2fdb213792e75693fe126fc7",
  "0xf70202e3bbb8e42208a4fb5efc0780acb4fc8260",
  "0xf720b71168aba670806bf6d457a80b2484c21a86",
  "0xf78faa3eaa9229dbf0a2ddf1eb2a167819d5b99b",
  "0xf7c5db97cabc4b4d37f5e5846a4d32f7259531b2",
  "0xf7d6af8f1939a540add96f68382d677f164ee28b",
  "0xf7eca7f2f39ae41fa27b7635b075d6f6caec14d6",
  "0xf82afbeea9c41fc2435db20adfeb26be534d6eab",
  "0xf8395a61f94401f13359d3f750bd810effe132cc",
  "0xf88bef01950f410a62572f23cc0524a3be115465",
  "0xf8b3bc1663d73afd37a2e5d47faf313ba8762faa",
  "0xf8bd7ddd73e2ffe80cdaa5829ac3db86a7a227f8",
  "0xf8c84b51b29c4c4ddf56c685a25051864c5c9962",
  "0xf8fa18eb1d4e5d521d66f37e5bded758bd730a59",
  "0xf927b558db7b7ddc7fc042239c9ff475c585cfcd",
  "0xf97c4f0181992f169cfe6985649d29671b6a68ad",
  "0xf9e63fd7af34ccfeab085c369ca0e47bdd01f3d5",
  "0xfa230cb08a647598dfb0413946559e1600ea4208",
  "0xfa879074be3b499ed6e3ea4d1fd89815ddaae85e",
  "0xfa92f34b5d9b59303eac73f42f274566d3033593",
  "0xfaa2b0009ab2f17e95e664f8f9f0cc8946507332",
  "0xfaef0d1dd8474412e9e6516b90280b14a5727e17",
  "0xfb7e8739e5e35f120334b9f61f9ebbd6f5870a77",
  "0xfca6e42e5529bd19f2640fc552744a55392a1b68",
  "0xfcf5c719931ffb887c45838408cd8c0e92abc2c8",
  "0xfd0ed15db61545cdd1886d0da20edd71d0d41b03",
  "0xfd2c780283d48315d6006aa1dcf2ac041ef84aae",
  "0xfd4640d4fb229bd607df0b53d59075160deddb4e",
  "0xfe077390e785fb9d31bf1f7c0daaf44e22959e6e",
  "0xfe8d0058f84512673d998a0159efbc5a6383041c",
  "0xfec70d613f207591f53dbf3097d7b90c2f7d67bb",
  "0xff2e1b7da311c254b8e8e374d271700b4686fc5a",
  "0xff30506f3c03343b384a9434ff2f76d675c856d1",
  "0xff38411246678843dad070c904ea664714ed210d",
  "0xff510630dbcd08830a7b74cda7c85931ea0ccefb",
  "0xff8ac55cd47f1c8c8d9d3c6c2cb186745a18c6f3",
  "0xffa46b53b533721db89931ea8bed50a7fdf9ee2b",
  "0xffff41988852d624b0e640e895eb4d18f7da077e",
  "0x731f7fbf884d33A3352785dc199f317abe64DB4b",
  "0x36e99c9de23d07f67F06fA475D2b605279b52050",
  "0xb485a46a59B206d5C30Ad6c814E2e3373F132dd9",
];

let proof;
let proofPaid;

let proofCopy;

const leafNodes = freeWlAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot().toString("hex");
console.log("root", rootHash);

const leafNodes2 = paidWlAddresses.map((addr) => keccak256(addr));
const merkleTree2 = new MerkleTree(leafNodes2, keccak256, { sortPairs: true });
const rootHash2 = merkleTree2.getRoot().toString("hex");
console.log("root paid", rootHash2);

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

////////////////////////////////////////////
// FUNCTIONS //
////////////////////////////////////////////

const updateData = async function () {
  console.log("updating data");
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

const connectWallet = async function () {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    account = (await web3.eth.getAccounts())[0];
    buttonConnect.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    buttonConnect.classList.add("connected");
    // button that appears in a tablet/phone querie
    btnConnectSmall.textContent = `${account.slice(0, 6)}...${account.slice(
      -4
    )}`;
    btnConnectSmall.classList.add("connected");
    console.log(`Wallet connected: ${account}`);
    web3.eth.getChainId().then(console.log);
    await checkAndSwitch();
    proof = getMerkleProof(account, merkleTree);
    proofPaid = getMerkleProof(account, merkleTree2);
    updateData().then((a) => {
      openMintWindow.disabled = false;
      updDataInterval();
    });
  } else {
    console.log("No wallet");
  }
};

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
  // console.log(correctNetwork);
  const correctNetwork = await checkNetwork();
  if (!correctNetwork) {
    console.log("Incorrect network! Changing now");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    } catch (err) {
      alert(err.message);
    }
    // refresh page
    // window.location.reload();
  }
  myContract = new web3.eth.Contract(
    jsonInterface,
    "0x4758377E68841f5B7dAfc4354BEdFD833dc32884"
  );
};

const checkAcc = async () => {
  // window.web3 = new Web3(window.ethereum);
  account = (await web3.eth.getAccounts())[0];
  console.log(`Account connected: ${account}`);
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
    mintPrice.textContent == "Not whitelisted!" ||
    mintPrice.textContent == "Sale closed!"
  ) {
    return;
  }
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
  console.log(`maxMint : ${maxMint}`);
};

const updateDataAfterMint = function () {
  clearInterval(updDataInterval);
  maxMint -= 1;
  const quantMintNum = Number(quantMint.textContent);
  mintPriceTx = quantMintNum * priceMint;
  mintPrice.textContent = mintPriceTx / 10 ** 18 + "Ξ";
};

const getReceipt = async function (hash) {
  const receipt = await web3.eth.getTransactionReceipt(hash);
  return receipt.status;
};

const updateMintWindow = function () {
  showMintedSupply();
  if (
    (WLSaleActive &&
      ((proof && proof.length >= 1 && mintedAcc < freeMaxMints) ||
        (proofPaid && proofPaid.length >= 1 && mintedAcc < WlMaxMints))) ||
    (publicSaleActive && publicMinted < publicMaxMints)
  ) {
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

////////////////////////////////////////////
// EVENT LISTENERS //
////////////////////////////////////////////

let proofDisplayed;
let finalProof;
// let updDataInterval;

let updDataInterval = function () {
  setInterval(() => {
    console.log("30s interval: updating info");
    updateData();
    updateMintWindow();
  }, 30000);
};

openMintWindow.addEventListener("click", async function () {
  if (freeWlAddresses.includes(account)) {
    proof = getMerkleProof(account, merkleTree);
    console.log(`proof mintwindow: ${proof}`);
    console.log(`proof mintwindow[0]: ${proof[0]}`);
    proofDisplayed = proof[0].slice(0, 8);
  } else if (paidWlAddresses.includes(account)) {
    proofPaid = getMerkleProof(account, merkleTree2);
    console.log(`proofPaid mintwindow: ${proofPaid}`);
    proofDisplayed = proofPaid[0].slice(0, 8);
  }
  proofEl.textContent = proofDisplayed;

  console.log(WLSaleActive, publicSaleActive);
  showMintedSupply();
  if (
    (WLSaleActive &&
      ((proof && proof.length >= 1 && mintedAcc < freeMaxMints) ||
        (proofPaid && proofPaid.length >= 1 && mintedAcc < WlMaxMints))) ||
    (publicSaleActive && publicMinted < publicMaxMints)
  ) {
    finalProof = `${proof ? proof.join(",") : proofPaid.join(",")}`;
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

buttonConnect.addEventListener("click", function () {
  connectWallet();
});

btnConnectSmall.addEventListener("click", function () {
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
    // button that appears in a tablet/phone querie
    btnConnectSmall.textContent = `${account.slice(0, 6)}...${account.slice(
      -4
    )}`;
    btnConnectSmall.classList.add("connected");
  }
  window.location.reload();
});

const postMint = function (r) {
  console.log(r);
  let status = r.status;
  let hash = r.transactionHash;
  // postMint(status, hash);

  gifLoadingMint.classList.add("hidden");
  notifHash.setAttribute("href", `https://goerli.etherscan.io/tx/${hash}`);
  notifHash.classList.remove("hidden");
  if (status == true) {
    // success
    console.log(`true?: ${status}`);
    notifText.textContent = "Mint successful!";
    // pendingMintNotif.style.background =
    //   "linear-gradient(to bottom right, #00ff73, #009f03)";
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
    // pendingMintNotif.style.background =
    //   "linear-gradient(to bottom right, #fca519, #f05c00);";
  }, 10000);
};

const catchPostMint = function (err) {
  console.error(err);
  console.log(err.message);
  if (err.message.includes("Transaction has been reverted by the EVM")) {
    const errorObj = JSON.parse(err.message.slice(err.message.indexOf("{")));
    console.log(errorObj);
    if (errorObj.status == false) {
      // failed
      notifHash.setAttribute(
        "href",
        `https://goerli.etherscan.io/tx/${errorObj.transactionHash}`
      );
      notifHash.classList.remove("hidden");
      console.log(`false?: ${errorObj.status}`);
      notifText.textContent = "Mint failed!";
      // pendingMintNotif.style.background =
      //   "linear-gradient(to bottom right, #fc1919, #680808);";
      setTimeout(function () {
        pendingMintNotif.style.opacity = 0;
        notifHash.classList.add("hidden");
        gifLoadingMint.classList.remove("hidden");
        notifText.textContent = "Mint TX sent!";
        // pendingMintNotif.style.background =
        //   "linear-gradient(to bottom right, #fca519, #f05c00);";
      }, 10000);
    }
  } else {
    pendingMintNotif.style.opacity = 0;
  }
};

// listener for mint button to send TX
mintButton.addEventListener("click", async function () {
  const price = await displayPrice();
  const account = (await web3.eth.getAccounts())[0];
  console.log(quantMintNum);
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

copyProofBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(proofCopy);
  proofEl.textContent = "Copied!";
  setTimeout(function () {
    proofEl.textContent = proofDisplayedInput;
  }, 5000);
});

getProofBtn.addEventListener("click", function () {
  const inputAddress = proofAddressInput.value;
  let proofInput;
  let proofPaidInput;

  if (freeWlAddresses.includes(inputAddress)) {
    proofInput = getMerkleProof(account, merkleTree);
    console.log(`proof home: ${proofInput}`);
    proofDisplayedInput = proofInput[0].slice(0, 8);
    congratEl.textContent = "Congrats! You are on the free WL!";
    congratEl.style.color = "green";
  } else if (paidWlAddresses.includes(inputAddress)) {
    proofPaidInput = getMerkleProof(account, merkleTree2);
    console.log(`proofPaid home: ${proofPaidInput}`);
    proofDisplayedInput = proofPaidInput[0].slice(0, 8);
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

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// as soon as page loads check if theres an account and in the correct network
checkAcc();
