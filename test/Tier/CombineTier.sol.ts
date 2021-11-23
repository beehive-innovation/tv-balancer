import * as Util from "../Util";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { concat } from "ethers/lib/utils";
import { bytify, op, paddedBlock, paddedReport } from "../Util";
import type { Contract, ContractFactory } from "ethers";

import type { CombineTier } from "../../typechain/CombineTier";
import type { ReadWriteTier } from "../../typechain/ReadWriteTier";
import type { CombineTierFactory } from "../../typechain/CombineTierFactory";
import type { Source, Vals } from "../Util";

chai.use(solidity);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { expect, assert } = chai;

enum Tier {
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
}

const enum Opcode {
  END,
  VAL,
  CALL,
  BLOCK_NUMBER,
  REPORT,
  NEVER,
  ALWAYS,
  AND_OLD,
  AND_NEW,
  AND_LEFT,
  OR_OLD,
  OR_NEW,
  OR_LEFT,
  ACCOUNT,
}

const sourceAlways: Source = [
  concat([
    //
    op(Opcode.ALWAYS),
  ]),
  0,
  0,
  0,
];
const sourceNever: Source = [
  concat([
    //
    op(Opcode.NEVER),
  ]),
  0,
  0,
  0,
];

const valsDefault = new Array(16).fill(0) as Vals;

describe("CombineTier", async function () {
  it("should correctly combine Always and Never tier contracts with orLeft", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const combineTierFactory = (await ethers.getContractFactory(
      "CombineTier"
    )) as CombineTierFactory & ContractFactory;

    const alwaysTier = (await combineTierFactory.deploy({
      source: sourceAlways,
      vals: valsDefault,
    })) as CombineTier & Contract;
    const neverTier = (await combineTierFactory.deploy({
      source: sourceNever,
      vals: valsDefault,
    })) as CombineTier & Contract;

    console.log(await alwaysTier.report(signers[0].address));
    console.log(await neverTier.report(signers[0].address));

    // const vals = [
    //   ethers.BigNumber.from(alwaysTier.address), // right report
    //   ethers.BigNumber.from(neverTier.address), // left report
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    // ];

    // const source = [
    //   concat([
    //     op(Opcode.OR_LEFT, 2),
    //     op(Opcode.REPORT),
    //     op(Opcode.VAL, 0),
    //     op(Opcode.ACCOUNT),
    //     op(Opcode.REPORT),
    //     op(Opcode.VAL, 1),
    //     op(Opcode.ACCOUNT),
    //     op(Opcode.BLOCK_NUMBER),
    //   ]),
    //   0,
    //   0,
    //   0,
    // ];

    // const combineTier = (await combineTierFactory.deploy({
    //   source,
    //   vals,
    // })) as CombineTier & Contract;

    // const result = await combineTier.report(signers[0].address);

    // // for each tier, Always has blocks which are lte current block
    // // therefore, OR_LEFT succeeds

    // const expected = 0x00; // success, left report's block number for each tier
    // assert(
    //   result.eq(expected),
    //   `wrong block number preserved with tierwise orLeft
    //   expected  ${expected}
    //   got       ${result}`
    // );
  });

  /*
  it("should correctly combine Always and Never tier contracts with orNew", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address),
      ethers.BigNumber.from(neverTier.address),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.OR_NEW, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[0].address);

    // for each tier, Always has blocks which are lte current block
    // therefore, OR_NEW succeeds

    const expected = 0x00; // success, newest block number before current block for each tier
    assert(
      result.eq(expected),
      `wrong block number preserved with tierwise orNew
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should correctly combine Always and Never tier contracts with orOld", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address),
      ethers.BigNumber.from(neverTier.address),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.OR_OLD, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[0].address);

    // for each tier, Always has blocks which are lte current block
    // therefore, OR_OLD succeeds

    const expected = 0x00; // success, oldest block number for each tier
    assert(
      result.eq(expected),
      `wrong block number preserved with tierwise orOld
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should correctly combine Always and Never tier contracts with andLeft", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address), // right report
      ethers.BigNumber.from(neverTier.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_LEFT, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[0].address);

    // for each tier, only Always has blocks which are lte current block
    // therefore, AND_LEFT fails

    const expected = Util.max_uint256; // 'false'
    assert(
      result.eq(expected),
      `wrong block number preserved with tierwise andLeft
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should correctly combine Always and Never tier contracts with andOld", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address),
      ethers.BigNumber.from(neverTier.address),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_OLD, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[0].address);

    // for each tier, only Always has blocks which are lte current block
    // therefore, AND_OLD fails

    const expected = Util.max_uint256; // 'false'
    assert(
      result.eq(expected),
      `wrong block number preserved with tierwise andOld
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should correctly combine Always and Never tier contracts with andNew", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address),
      ethers.BigNumber.from(neverTier.address),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_NEW, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[0].address);

    // for each tier, only Always has blocks which are lte current block
    // therefore, AND_NEW fails

    const expected = Util.max_uint256; // 'false'
    assert(
      result.eq(expected),
      `wrong block number preserved with tierwise andNew
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should support a program which returns the default report", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const alwaysTierFactory = await ethers.getContractFactory("Always");
    const alwaysTier = (await alwaysTierFactory.deploy()) as Always & Contract;

    const neverTierFactory = await ethers.getContractFactory("Never");
    const neverTier = (await neverTierFactory.deploy()) as Never & Contract;

    const vals = [
      ethers.BigNumber.from(alwaysTier.address),
      ethers.BigNumber.from(neverTier.address),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const sourceAlways = [
      concat([op(Opcode.REPORT, 0), op(Opcode.VAL, 0), op(Opcode.ACCOUNT, 0)]),
      0,
      0,
      0,
    ];

    const sourceNever = [
      concat([op(Opcode.REPORT, 0), op(Opcode.VAL, 1), op(Opcode.ACCOUNT, 0)]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTierAlways = (await combineTierFactory.deploy({
      source: sourceAlways,
      vals,
    })) as CombineTier & Contract;

    const resultAlways = await combineTierAlways.report(signers[1].address);

    const expectedAlways = 0;
    assert(
      resultAlways.eq(expectedAlways),
      `wrong report
      expected  ${expectedAlways}
      got       ${resultAlways}`
    );

    const combineTierNever = (await combineTierFactory.deploy({
      source: sourceNever,
      vals,
    })) as CombineTier & Contract;

    const resultNever = await combineTierNever.report(signers[1].address);

    const expectedNever = ethers.constants.MaxUint256;
    assert(
      resultNever.eq(expectedNever),
      `wrong report
      expected ${expectedNever}
      got      ${resultNever}`
    );
  });

  it("should support a program which simply returns the account", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const vals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const source = [concat([bytify(0), bytify(Opcode.ACCOUNT)]), 0, 0, 0];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const result = await combineTier.report(signers[1].address);
    const expected = signers[1].address;
    assert(
      result.eq(expected),
      `wrong account address
      expected  ${expected}
      got       ${result}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with andOld", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_OLD, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultAndOld = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedAndOld = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      resultAndOld === expectedAndOld,
      `wrong block number preserved with tierwise andOld
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedAndOld}
      got       ${resultAndOld}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with andNew", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_NEW, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );

    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );

    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultAndNew = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedAndNew = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      resultAndNew === expectedAndNew,
      `wrong block number preserved with tierwise andNew
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedAndNew}
      got       ${resultAndNew}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with andLeft", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.AND_LEFT, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultAndLeft = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedAndLeft = leftReport;
    assert(
      resultAndLeft === expectedAndLeft,
      `wrong block number preserved with tierwise andLeft
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedAndLeft}
      got       ${resultAndLeft}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with orOld", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.OR_OLD, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultOrOld = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedOrOld = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      resultOrOld === expectedOrOld,
      `wrong block number preserved with tierwise orOld
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedOrOld}
      got       ${resultOrOld}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with orNew", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.OR_NEW, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultOrNew = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedOrNew = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      resultOrNew === expectedOrNew,
      `wrong block number preserved with tierwise orNew
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedOrNew}
      got       ${resultOrNew}`
    );
  });

  it("should correctly combine ReadWriteTier tier contracts with orLeft", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const readWriteTierFactory = await ethers.getContractFactory(
      "ReadWriteTier"
    );
    const readWriteTierRight =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;
    const readWriteTierLeft =
      (await readWriteTierFactory.deploy()) as ReadWriteTier & Contract;

    const vals = [
      ethers.BigNumber.from(readWriteTierRight.address), // right report
      ethers.BigNumber.from(readWriteTierLeft.address), // left report
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];

    const source = [
      concat([
        op(Opcode.OR_LEFT, 2),
        op(Opcode.REPORT),
        op(Opcode.VAL, 0),
        op(Opcode.ACCOUNT),
        op(Opcode.REPORT),
        op(Opcode.VAL, 1),
        op(Opcode.ACCOUNT),
        op(Opcode.BLOCK_NUMBER),
      ]),
      0,
      0,
      0,
    ];

    const combineTierFactory = await ethers.getContractFactory("CombineTier");
    const combineTier = (await combineTierFactory.deploy({
      source,
      vals,
    })) as CombineTier & Contract;

    const startBlock = await ethers.provider.getBlockNumber();

    // Set some tiers
    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.ONE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.TWO, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.THREE, []);

    // ReadWriteTierLeft
    await readWriteTierLeft.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierLeft.setTier(signers[0].address, Tier.SIX, []);

    // ReadWriteTierRight
    await readWriteTierRight.setTier(signers[0].address, Tier.FOUR, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.FIVE, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.SIX, []);
    await readWriteTierRight.setTier(signers[0].address, Tier.EIGHT, []);

    const rightReport = paddedReport(
      await readWriteTierRight.report(signers[0].address)
    );
    const expectedRightReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 12) +
          paddedBlock(startBlock + 11) +
          paddedBlock(startBlock + 10) +
          paddedBlock(startBlock + 3) +
          paddedBlock(startBlock + 2) +
          paddedBlock(startBlock + 1)
      )
    );
    assert(
      rightReport === expectedRightReport,
      `wrong right report
      expected  ${expectedRightReport}
      got       ${rightReport}`
    );

    const leftReport = paddedReport(
      await readWriteTierLeft.report(signers[0].address)
    );
    const expectedLeftReport = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          "ffffffff".repeat(2) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      leftReport === expectedLeftReport,
      `wrong left report
      expected  ${expectedLeftReport}
      got       ${leftReport}`
    );

    const resultOrLeft = paddedReport(
      await combineTier.report(signers[0].address)
    );
    const expectedOrLeft = paddedReport(
      ethers.BigNumber.from(
        "0x" +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 13) +
          paddedBlock(startBlock + 9) +
          paddedBlock(startBlock + 8) +
          paddedBlock(startBlock + 7) +
          paddedBlock(startBlock + 6) +
          paddedBlock(startBlock + 5) +
          paddedBlock(startBlock + 4)
      )
    );
    assert(
      resultOrLeft === expectedOrLeft,
      `wrong block number preserved with tierwise orLeft
      left      ${leftReport}
      right     ${rightReport}
      expected  ${expectedOrLeft}
      got       ${resultOrLeft}`
    );
  });
  */
});
