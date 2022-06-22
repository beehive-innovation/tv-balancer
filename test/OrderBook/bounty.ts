import { assert } from "chai";
import { ContractFactory } from "ethers";
import { concat } from "ethers/lib/utils";
import { ethers } from "hardhat";
import type {
  AfterClearEvent,
  BountyConfigStruct,
  DepositConfigStruct,
  DepositEvent,
  OrderBook,
  OrderConfigStruct,
  OrderLiveEvent,
} from "../../typechain/OrderBook";
import { OrderBookStateBuilder } from "../../typechain/OrderBookStateBuilder";
import { ReserveToken18 } from "../../typechain/ReserveToken18";
import {
  eighteenZeros,
  max_uint256,
  ONE,
} from "../../utils/constants/bigNumber";
import { TRACK_CLEARED_ORDER } from "../../utils/constants/orderbook";
import { basicDeploy } from "../../utils/deploy/basic";
import { getEventArgs } from "../../utils/events";
import { fixedPointDiv } from "../../utils/math";
import { OrderBookOpcode } from "../../utils/rainvm/ops/orderBookOps";
import { op } from "../../utils/rainvm/vm";
import { compareStructs } from "../../utils/test/compareStructs";

const Opcode = OrderBookOpcode;

describe("OrderBook bounty", async function () {
  const cOrderHash = op(Opcode.CONTEXT, 0);

  let orderBookFactory: ContractFactory,
    tokenA: ReserveToken18,
    tokenB: ReserveToken18,
    stateBuilder: OrderBookStateBuilder;

  beforeEach(async () => {
    tokenA = (await basicDeploy("ReserveToken18", {})) as ReserveToken18;
    tokenB = (await basicDeploy("ReserveToken18", {})) as ReserveToken18;
  });

  before(async () => {
    const stateBuilderFactory = await ethers.getContractFactory(
      "OrderBookStateBuilder"
    );
    stateBuilder =
      (await stateBuilderFactory.deploy()) as OrderBookStateBuilder;
    await stateBuilder.deployed();

    orderBookFactory = await ethers.getContractFactory("OrderBook", {});
  });

  it("order clearer should receive correct bounty amounts in their vaults, and can withdraw their vault balance for each token", async function () {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alice = signers[1];
    const bob = signers[2];
    const bountyBot = signers[4]; // order clearer

    const orderBook = (await orderBookFactory.deploy(
      stateBuilder.address
    )) as OrderBook;

    const aliceInputVault = ethers.BigNumber.from(1);
    const aliceOutputVault = ethers.BigNumber.from(2);
    const bobInputVault = ethers.BigNumber.from(1);
    const bobOutputVault = ethers.BigNumber.from(2);
    const bountyBotVaultA = ethers.BigNumber.from(1);
    const bountyBotVaultB = ethers.BigNumber.from(2);

    // ASK ORDER

    const askPrice = ethers.BigNumber.from("90" + eighteenZeros);
    const askBlock = await ethers.provider.getBlockNumber();
    const askConstants = [askPrice, askBlock, 5];
    const vAskPrice = op(Opcode.CONSTANT, 0);
    const vAskBlock = op(Opcode.CONSTANT, 1);
    const v5 = op(Opcode.CONSTANT, 2);
    // prettier-ignore
    const askSource = concat([
      // outputMax = (currentBlock - askBlock) * 5 - aliceCleared
      // 5 tokens available per block
            op(Opcode.BLOCK_NUMBER),
            vAskBlock,
          op(Opcode.SUB, 2),
          v5,
        op(Opcode.MUL, 2),
          cOrderHash,
        op(Opcode.ORDER_FUNDS_CLEARED),
      op(Opcode.SUB, 2),
      vAskPrice,
    ]);

    const askOrderConfig: OrderConfigStruct = {
      inputToken: tokenA.address,
      inputVaultId: aliceInputVault,
      outputToken: tokenB.address,
      outputVaultId: aliceOutputVault,
      tracking: TRACK_CLEARED_ORDER,
      vmStateConfig: {
        sources: [askSource],
        constants: askConstants,
      },
    };

    const txAskOrderLive = await orderBook
      .connect(alice)
      .addOrder(askOrderConfig);

    const { sender: askSender, config: askConfig } = (await getEventArgs(
      txAskOrderLive,
      "OrderLive",
      orderBook
    )) as OrderLiveEvent["args"];

    assert(askSender === alice.address, "wrong sender");
    compareStructs(askConfig, askOrderConfig);

    // BID ORDER

    const bidOutputMax = max_uint256;
    const bidPrice = fixedPointDiv(ONE, askPrice);
    const bidConstants = [bidOutputMax, bidPrice];
    const vBidOutputMax = op(Opcode.CONSTANT, 0);
    const vBidPrice = op(Opcode.CONSTANT, 1);
    // prettier-ignore
    const bidSource = concat([
      vBidOutputMax,
      vBidPrice,
    ]);
    const bidOrderConfig: OrderConfigStruct = {
      inputToken: tokenB.address,
      inputVaultId: bobInputVault,
      outputToken: tokenA.address,
      outputVaultId: bobOutputVault,
      tracking: 0x0,
      vmStateConfig: {
        sources: [bidSource],
        constants: bidConstants,
      },
    };

    const txBidOrderLive = await orderBook
      .connect(bob)
      .addOrder(bidOrderConfig);

    const { sender: bidSender, config: bidConfig } = (await getEventArgs(
      txBidOrderLive,
      "OrderLive",
      orderBook
    )) as OrderLiveEvent["args"];

    assert(bidSender === bob.address, "wrong sender");
    compareStructs(bidConfig, bidOrderConfig);

    // DEPOSITS

    const amountB = ethers.BigNumber.from("1000" + eighteenZeros);
    const amountA = ethers.BigNumber.from("1000" + eighteenZeros);

    await tokenB.transfer(alice.address, amountB);
    await tokenA.transfer(bob.address, amountA);

    const depositConfigStructAlice: DepositConfigStruct = {
      token: tokenB.address,
      vaultId: aliceOutputVault,
      amount: amountB,
    };
    const depositConfigStructBob: DepositConfigStruct = {
      token: tokenA.address,
      vaultId: bobOutputVault,
      amount: amountA,
    };

    await tokenB
      .connect(alice)
      .approve(orderBook.address, depositConfigStructAlice.amount);
    await tokenA
      .connect(bob)
      .approve(orderBook.address, depositConfigStructBob.amount);

    // Alice deposits tokenB into her output vault
    const txDepositOrderAlice = await orderBook
      .connect(alice)
      .deposit(depositConfigStructAlice);
    // Bob deposits tokenA into his output vault
    const txDepositOrderBob = await orderBook
      .connect(bob)
      .deposit(depositConfigStructBob);

    const { sender: depositAliceSender, config: depositAliceConfig } =
      (await getEventArgs(
        txDepositOrderAlice,
        "Deposit",
        orderBook
      )) as DepositEvent["args"];
    const { sender: depositBobSender, config: depositBobConfig } =
      (await getEventArgs(
        txDepositOrderBob,
        "Deposit",
        orderBook
      )) as DepositEvent["args"];

    assert(depositAliceSender === alice.address);
    compareStructs(depositAliceConfig, depositConfigStructAlice);
    assert(depositBobSender === bob.address);
    compareStructs(depositBobConfig, depositConfigStructBob);

    // BOUNTY BOT CLEARS THE ORDER

    const bountyConfig: BountyConfigStruct = {
      aVaultId: bountyBotVaultA,
      bVaultId: bountyBotVaultB,
    };

    const blockClear0 = (await ethers.provider.getBlockNumber()) + 1;
    const expectedBounty0 = { a: 1, b: 0 };
    const expectedOutputAmount0 =
      (blockClear0 - askBlock) * 5 - expectedBounty0.a;

    const txClearOrder0 = await orderBook
      .connect(bountyBot)
      .clear(askConfig, bidConfig, bountyConfig);
    const { stateChange: stateChange0 } = (await getEventArgs(
      txClearOrder0,
      "AfterClear",
      orderBook
    )) as AfterClearEvent["args"];
    const { bInput: bInput0 } = stateChange0;

    const actualBounty0 = {
      a: stateChange0.aOutput.sub(stateChange0.bInput),
      b: stateChange0.bOutput.sub(stateChange0.aInput),
    };

    assert(
      bInput0.eq(expectedOutputAmount0),
      `did not throttle asker output amount correctly
      expected  ${expectedOutputAmount0}
      got       ${bInput0}`
    );
  });
});