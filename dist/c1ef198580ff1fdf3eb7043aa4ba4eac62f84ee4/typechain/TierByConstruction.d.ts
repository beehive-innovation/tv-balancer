/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface TierByConstructionInterface extends ethers.utils.Interface {
  functions: {
    "constructionBlock()": FunctionFragment;
    "isTier(address,uint8)": FunctionFragment;
    "tierContract()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "constructionBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isTier",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tierContract",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "constructionBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isTier", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tierContract",
    data: BytesLike
  ): Result;

  events: {};
}

export class TierByConstruction extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: TierByConstructionInterface;

  functions: {
    constructionBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    "constructionBlock()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    isTier(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    "isTier(address,uint8)"(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    tierContract(overrides?: CallOverrides): Promise<[string]>;

    "tierContract()"(overrides?: CallOverrides): Promise<[string]>;
  };

  constructionBlock(overrides?: CallOverrides): Promise<BigNumber>;

  "constructionBlock()"(overrides?: CallOverrides): Promise<BigNumber>;

  isTier(
    account_: string,
    minimumTier_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isTier(address,uint8)"(
    account_: string,
    minimumTier_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  tierContract(overrides?: CallOverrides): Promise<string>;

  "tierContract()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    constructionBlock(overrides?: CallOverrides): Promise<BigNumber>;

    "constructionBlock()"(overrides?: CallOverrides): Promise<BigNumber>;

    isTier(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isTier(address,uint8)"(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tierContract(overrides?: CallOverrides): Promise<string>;

    "tierContract()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    constructionBlock(overrides?: CallOverrides): Promise<BigNumber>;

    "constructionBlock()"(overrides?: CallOverrides): Promise<BigNumber>;

    isTier(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isTier(address,uint8)"(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tierContract(overrides?: CallOverrides): Promise<BigNumber>;

    "tierContract()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    constructionBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "constructionBlock()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTier(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isTier(address,uint8)"(
      account_: string,
      minimumTier_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tierContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "tierContract()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
