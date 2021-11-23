/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { TierByConstructionClaimTest } from "../TierByConstructionClaimTest";

export class TierByConstructionClaimTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    tier_: string,
    overrides?: Overrides
  ): Promise<TierByConstructionClaimTest> {
    return super.deploy(
      tier_,
      overrides || {}
    ) as Promise<TierByConstructionClaimTest>;
  }
  getDeployTransaction(
    tier_: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(tier_, overrides || {});
  }
  attach(address: string): TierByConstructionClaimTest {
    return super.attach(address) as TierByConstructionClaimTest;
  }
  connect(signer: Signer): TierByConstructionClaimTest__factory {
    return super.connect(signer) as TierByConstructionClaimTest__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TierByConstructionClaimTest {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TierByConstructionClaimTest;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ITier",
        name: "tier_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
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
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
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
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claims",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "constructionBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "enum ITier.Tier",
        name: "minimumTier_",
        type: "uint8",
      },
    ],
    name: "isTier",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumTier",
    outputs: [
      {
        internalType: "enum ITier.Tier",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tierContract",
    outputs: [
      {
        internalType: "contract ITier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b506040516200151138038062001511833981810160405260208110156200003757600080fd5b5051604080518082018252600781526633b7b6322a35b760c91b6020828101918252835180850190945260048085526323aa25a760e11b9185019190915282518594919385939092916200008e9160039162000108565b508051620000a490600490602084019062000108565b5050600580546001600160a01b0390931661010002610100600160a81b031960ff1990941660121793909316929092179091555043600655806008811115620000e957fe5b6080816008811115620000f857fe5b60f81b81525050505050620001a4565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200014b57805160ff19168380011785556200017b565b828001600101855582156200017b579182015b828111156200017b5782518255916020019190600101906200015e565b50620001899291506200018d565b5090565b5b808211156200018957600081556001016200018e565b60805160f81c61134a620001c7600039806109355280610c23525061134a6000f3fe608060405234801561001057600080fd5b506004361061011b5760003560e01c806377544f33116100b2578063a9059cbb11610081578063c6788bdd11610066578063c6788bdd14610485578063dd62ed3e146104b8578063f1ebd5dd146104f35761011b565b8063a9059cbb14610387578063bb1757cf146103c05761011b565b806377544f33146102d957806395d89b4114610315578063a30872db1461031d578063a457c2d71461034e5761011b565b806323b872dd116100ee57806323b872dd1461020c578063313ce5671461024f578063395093511461026d57806370a08231146102a65761011b565b806306fdde0314610120578063095ea7b31461019d5780630f0af57f146101ea57806318160ddd14610204575b600080fd5b61012861051c565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561016257818101518382015260200161014a565b50505050905090810190601f16801561018f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101d6600480360360408110156101b357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356105d0565b604080519115158252519081900360200190f35b6101f26105ee565b60408051918252519081900360200190f35b6101f26105f4565b6101d66004803603606081101561022257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356105fa565b61025761069b565b6040805160ff9092168252519081900360200190f35b6101d66004803603604081101561028357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356106a4565b6101f2600480360360208110156102bc57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff166106ff565b6101d6600480360360408110156102ef57600080fd5b50803573ffffffffffffffffffffffffffffffffffffffff16906020013560ff16610727565b6101286107e2565b610325610861565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101d66004803603604081101561036457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610882565b6101d66004803603604081101561039d57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356108f7565b610483600480360360408110156103d657600080fd5b73ffffffffffffffffffffffffffffffffffffffff823516919081019060408101602082013564010000000081111561040e57600080fd5b82018360208201111561042057600080fd5b8035906020019184600183028401116401000000008311171561044257600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061090b945050505050565b005b6101d66004803603602081101561049b57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610bd4565b6101f2600480360360408110156104ce57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516610be9565b6104fb610c21565b6040518082600881111561050b57fe5b815260200191505060405180910390f35b60038054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105c65780601f1061059b576101008083540402835291602001916105c6565b820191906000526020600020905b8154815290600101906020018083116105a957829003601f168201915b5050505050905090565b60006105e46105dd610c45565b8484610c49565b5060015b92915050565b60065481565b60025490565b6000610607848484610d90565b61069184610613610c45565b61068c8560405180606001604052806028815260200161127f6028913973ffffffffffffffffffffffffffffffffffffffff8a1660009081526001602052604081209061065e610c45565b73ffffffffffffffffffffffffffffffffffffffff1681526020810191909152604001600020549190610f60565b610c49565b5060019392505050565b60055460ff1690565b60006105e46106b1610c45565b8461068c85600160006106c2610c45565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918c168152925290205490611011565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b600554604080517fe053ea3100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff858116600483015291516000936107d693610100909104169163e053ea31916024808301926020929190829003018186803b1580156107a457600080fd5b505afa1580156107b8573d6000803e3d6000fd5b505050506040513d60208110156107ce57600080fd5b50518361108c565b60065410159392505050565b60048054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105c65780601f1061059b576101008083540402835291602001916105c6565b600554610100900473ffffffffffffffffffffffffffffffffffffffff1681565b60006105e461088f610c45565b8461068c856040518060600160405280602581526020016112f060259139600160006108b9610c45565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918d16815292529020549190610f60565b60006105e4610904610c45565b8484610d90565b73ffffffffffffffffffffffffffffffffffffffff821660009081526007602052604090205482907f00000000000000000000000000000000000000000000000000000000000000009060ff16156109c457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f4455504c49434154455f434c41494d0000000000000000000000000000000000604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff8416600081815260076020908152604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055805182815287518184015287517fa16751aa65ef03fb7261c0a125a84854295c191657bda7151d4396246b1bbeb49489949293849390840192908601918190849084905b83811015610a71578181015183820152602001610a59565b50505050905090810190601f168015610a9e5780820380516001836020036101000a031916815260200191505b509250505060405180910390a2600554604080517fe053ea3100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff80881660048301529151610b59938893610100909104169163e053ea31916024808301926020929190829003018186803b158015610b2757600080fd5b505afa158015610b3b573d6000803e3d6000fd5b505050506040513d6020811015610b5157600080fd5b5051856110d2565b610b638282610727565b610bce57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f4d494e494d554d5f544945520000000000000000000000000000000000000000604482015290519081900360640190fd5b50505050565b60076020526000908152604090205460ff1681565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b7f000000000000000000000000000000000000000000000000000000000000000081565b3390565b73ffffffffffffffffffffffffffffffffffffffff8316610cb5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806112cc6024913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610d21576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806112376022913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff8316610dfc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806112a76025913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610e68576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806112146023913960400191505060405180910390fd5b610e738383836110dd565b610ebd816040518060600160405280602681526020016112596026913973ffffffffffffffffffffffffffffffffffffffff86166000908152602081905260409020549190610f60565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082209390935590841681522054610ef99082611011565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115611009576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610fce578181015183820152602001610fb6565b50505050905090810190601f168015610ffb5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b60008282018381101561108557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b60008082600881111561109b57fe5b14156110a9575060006105e8565b600060018360088111156110b957fe5b0360200290508084901c63ffffffff1691505092915050565b6110dd8360646110e2565b505050565b73ffffffffffffffffffffffffffffffffffffffff821661116457604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b611170600083836110dd565b60025461117d9082611011565b60025573ffffffffffffffffffffffffffffffffffffffff82166000908152602081905260409020546111b09082611011565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a3505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220b743c284b1cd885dbd82d8e1ee41de2c6189f3360cf4cd8bf515010f2faf3c5b64736f6c634300060c0033";
