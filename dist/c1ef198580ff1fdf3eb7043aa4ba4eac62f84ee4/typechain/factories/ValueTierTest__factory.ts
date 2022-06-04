/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { ValueTierTest } from "../ValueTierTest";

export class ValueTierTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    tierValues_: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ],
    overrides?: Overrides
  ): Promise<ValueTierTest> {
    return super.deploy(tierValues_, overrides || {}) as Promise<ValueTierTest>;
  }
  getDeployTransaction(
    tierValues_: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ],
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(tierValues_, overrides || {});
  }
  attach(address: string): ValueTierTest {
    return super.attach(address) as ValueTierTest;
  }
  connect(signer: Signer): ValueTierTest__factory {
    return super.connect(signer) as ValueTierTest__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ValueTierTest {
    return new Contract(address, _abi, signerOrProvider) as ValueTierTest;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256[8]",
        name: "tierValues_",
        type: "uint256[8]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "tierValues",
    outputs: [
      {
        internalType: "uint256[8]",
        name: "tierValues_",
        type: "uint256[8]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ITier.Tier",
        name: "tier_",
        type: "uint8",
      },
    ],
    name: "wrappedTierToValue",
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
        internalType: "uint256",
        name: "value_",
        type: "uint256",
      },
    ],
    name: "wrappedValueToTier",
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
];

const _bytecode =
  "0x61018060405234801561001157600080fd5b50604051610407380380610407833981810160405261010081101561003557600080fd5b5080516080818152602083015160a0818152604085015160c0818152606087015160e08181529588015161010081905293880151610120819052918801516101408190529590970151610160819052959693959194909161033a6100cd600039806102265250806102005250806101da5250806101b452508061018e52508061016852508061014252508061011f525061033a6000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80634bc1010e146100465780635d2c11171461008457806370230b39146100b6575b600080fd5b6100636004803603602081101561005c57600080fd5b50356100f7565b6040518082600881111561007357fe5b815260200191505060405180910390f35b6100a46004803603602081101561009a57600080fd5b503560ff1661010a565b60408051918252519081900360200190f35b6100be610115565b604051808261010080838360005b838110156100e45781810151838201526020016100cc565b5050505090500191505060405180910390f35b60006101028261024d565b90505b919050565b60006101028261029e565b61011d6102e5565b7f000000000000000000000000000000000000000000000000000000000000000081527f000000000000000000000000000000000000000000000000000000000000000060208201527f000000000000000000000000000000000000000000000000000000000000000060408201527f000000000000000000000000000000000000000000000000000000000000000060608201527f000000000000000000000000000000000000000000000000000000000000000060808201527f000000000000000000000000000000000000000000000000000000000000000060a08201527f000000000000000000000000000000000000000000000000000000000000000060c08201527f000000000000000000000000000000000000000000000000000000000000000060e082015290565b6000805b600881101561029557610262610115565b816008811061026d57fe5b602002015183101561028d5780600881111561028557fe5b915050610105565b600101610251565b50600892915050565b6000808260088111156102ad57fe5b116102b9576000610102565b6102c1610115565b60018360088111156102cf57fe5b03600881106102da57fe5b602002015192915050565b604051806101000160405280600890602082028036833750919291505056fea2646970667358221220fe3d0ae63863b63844bfca4228a2e1a2a2a9b1f8efcd2d630eacdb4be5c9ea1064736f6c634300060c0033";