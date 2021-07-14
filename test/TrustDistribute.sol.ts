import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import type { Trust } from "../typechain/Trust";
import type { ReserveToken } from "../typechain/ReserveToken";
import * as Util from "./Util";
import { utils } from "ethers";
import type { Prestige } from "../typechain/Prestige";
import type { RedeemableERC20 } from "../typechain/RedeemableERC20";
import type { RedeemableERC20Pool } from "../typechain/RedeemableERC20Pool";

chai.use(solidity);
const { expect, assert } = chai;

const trustJson = require("../artifacts/contracts/Trust.sol/Trust.json");
const poolJson = require("../artifacts/contracts/RedeemableERC20Pool.sol/RedeemableERC20Pool.json");
const bPoolJson = require("../artifacts/contracts/configurable-rights-pool/contracts/test/BPool.sol/BPool.json");
const reserveJson = require("../artifacts/contracts/test/ReserveToken.sol/ReserveToken.json");
const redeemableTokenJson = require("../artifacts/contracts/RedeemableERC20.sol/RedeemableERC20.json");
const crpJson = require("../artifacts/contracts/configurable-rights-pool/contracts/ConfigurableRightsPool.sol/ConfigurableRightsPool.json");

enum Status {
  NIL,
  COPPER,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
  CHAD,
  JAWAD,
}

enum RaiseStatus {
  PENDING,
  SEEDED,
  TRADING,
  TRADINGCANEND,
  SUCCESS,
  FAIL,
}

describe("TrustDistribute", async function () {
  it("blocks small token balance", async function () {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

    const reserve = (await Util.basicDeploy(
      "ReserveToken",
      {}
    )) as ReserveToken;

    const prestigeFactory = await ethers.getContractFactory("Prestige");
    const prestige = (await prestigeFactory.deploy()) as Prestige;
    const minimumStatus = Status.NIL;

    const trustFactory = await ethers.getContractFactory("Trust", {
      libraries: {
        RightsManager: rightsManager.address,
      },
    });

    const tokenName = "Token";
    const tokenSymbol = "TKN";

    const reserveInit = ethers.BigNumber.from("2001");
    const redeemInit = ethers.BigNumber.from("2001");
    const initialValuation = ethers.BigNumber.from("10001");
    const totalTokenSupply = ethers.BigNumber.from("2001");

    const minimumCreatorRaise = ethers.BigNumber.from("101");
    const seederFee = ethers.BigNumber.from("101");
    const seederUnits = 0;
    const seederCooldownDuration = 0;

    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator
    const deployer = signers[2]; // deployer is not creator
    const hodler1 = signers[3];

    const successLevel = redeemInit
      .add(minimumCreatorRaise)
      .add(seederFee)
      .add(reserveInit);
    const finalValuation = successLevel;

    const minimumTradingDuration = 50;

    const trustFactoryDeployer = new ethers.ContractFactory(
      trustFactory.interface,
      trustFactory.bytecode,
      deployer
    );

    Util.assertError(
      async () => await trustFactoryDeployer.deploy(
      {
        creator: creator.address,
        minimumCreatorRaise,
        seeder: seeder.address,
        seederFee,
        seederUnits,
        seederCooldownDuration,
        minimumTradingDuration,
        redeemInit,
      },
      {
        name: tokenName,
        symbol: tokenSymbol,
        prestige: prestige.address,
        minimumStatus,
        totalSupply: totalTokenSupply,
      },
      {
        crpFactory: crpFactory.address,
        balancerFactory: bFactory.address,
        reserve: reserve.address,
        reserveInit,
        initialValuation,
        finalValuation,
      }
    ),
    `revert RESERVE_INIT_MINIMUM`,
    `failed to project against large dust`
  )
  });

  it("supports precision of ten zeros", async function () {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

    const reserve = (await Util.basicDeploy(
      "ReserveToken",
      {}
    )) as ReserveToken;

    const prestigeFactory = await ethers.getContractFactory("Prestige");
    const prestige = (await prestigeFactory.deploy()) as Prestige;
    const minimumStatus = Status.NIL;

    const trustFactory = await ethers.getContractFactory("Trust", {
      libraries: {
        RightsManager: rightsManager.address,
      },
    });

    const tokenName = "Token";
    const tokenSymbol = "TKN";

    const reserveInit = ethers.BigNumber.from("2001" + Util.tenZeros);
    const redeemInit = ethers.BigNumber.from("2001" + Util.tenZeros);
    const initialValuation = ethers.BigNumber.from("10001" + Util.tenZeros);
    const totalTokenSupply = ethers.BigNumber.from("2001" + Util.tenZeros);

    const minimumCreatorRaise = ethers.BigNumber.from("101" + Util.tenZeros);
    const seederFee = ethers.BigNumber.from("101" + Util.tenZeros);
    const seederUnits = 0;
    const seederCooldownDuration = 0;

    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator
    const deployer = signers[2]; // deployer is not creator
    const hodler1 = signers[3];

    const successLevel = redeemInit
      .add(minimumCreatorRaise)
      .add(seederFee)
      .add(reserveInit);
    const finalValuation = successLevel;

    const minimumTradingDuration = 50;

    const trustFactoryDeployer = new ethers.ContractFactory(
      trustFactory.interface,
      trustFactory.bytecode,
      deployer
    );

    const trust = (await trustFactoryDeployer.deploy(
      {
        creator: creator.address,
        minimumCreatorRaise,
        seeder: seeder.address,
        seederFee,
        seederUnits,
        seederCooldownDuration,
        minimumTradingDuration,
        redeemInit,
      },
      {
        name: tokenName,
        symbol: tokenSymbol,
        prestige: prestige.address,
        minimumStatus,
        totalSupply: totalTokenSupply,
      },
      {
        crpFactory: crpFactory.address,
        balancerFactory: bFactory.address,
        reserve: reserve.address,
        reserveInit,
        initialValuation,
        finalValuation,
      }
    )) as Trust;

    await trust.deployed();

    // seeder needs some cash, give enough to seeder
    await reserve.transfer(seeder.address, reserveInit);

    const reserveSeeder = new ethers.Contract(
      reserve.address,
      reserve.interface,
      seeder
    ) as ReserveToken;

    // seeder must transfer seed funds before pool init
    await reserveSeeder.transfer(await trust.pool(), reserveInit);

    await trust.anonStartDistribution({ gasLimit: 100000000 });

    const startBlock = await ethers.provider.getBlockNumber();

    const token = new ethers.Contract(
      await trust.token(),
      redeemableTokenJson.abi,
      creator
    ) as RedeemableERC20;
    const pool = new ethers.Contract(
      await trust.pool(),
      poolJson.abi,
      creator
    ) as RedeemableERC20Pool;

    let [crp, bPool] = await Util.poolContracts(signers, pool);

    const reserveSpend = successLevel.div(10);

    const swapReserveForTokens = async (hodler, spend) => {
      // give hodler some reserve
      await reserve.transfer(hodler.address, spend);

      const reserveHodler = reserve.connect(hodler);
      const crpHodler = crp.connect(hodler);
      const bPoolHodler = bPool.connect(hodler);

      await crpHodler.pokeWeights();
      await reserveHodler.approve(bPool.address, spend);
      await bPoolHodler.swapExactAmountIn(
        reserve.address,
        spend,
        token.address,
        ethers.BigNumber.from("1"),
        ethers.BigNumber.from("1000000" + Util.eighteenZeros)
      );
    };

    // reach success level
    while ((await reserve.balanceOf(bPool.address)).lte(successLevel)) {
      await swapReserveForTokens(hodler1, reserveSpend);
    }

    // create empty transfer blocks until reaching unblock block, so distribution can end
    while (
      (await ethers.provider.getBlockNumber()) <=
      startBlock + minimumTradingDuration
    ) {
      await reserve.transfer(signers[9].address, 0);
    }

    await trust.anonEndDistribution();
  });

  describe("should update distribution status correctly", async function () {
    it("on successful distribution", async function () {
      this.timeout(0);

      const signers = await ethers.getSigners();

      const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

      const reserve = (await Util.basicDeploy(
        "ReserveToken",
        {}
      )) as ReserveToken;

      const prestigeFactory = await ethers.getContractFactory("Prestige");
      const prestige = (await prestigeFactory.deploy()) as Prestige;
      const minimumStatus = Status.NIL;

      const trustFactory = await ethers.getContractFactory("Trust", {
        libraries: {
          RightsManager: rightsManager.address,
        },
      });

      const tokenName = "Token";
      const tokenSymbol = "TKN";

      const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const initialValuation = ethers.BigNumber.from(
        "10000" + Util.eighteenZeros
      );
      const totalTokenSupply = ethers.BigNumber.from(
        "2000" + Util.eighteenZeros
      );

      const minimumCreatorRaise = ethers.BigNumber.from(
        "100" + Util.eighteenZeros
      );
      const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
      const seederUnits = 0;
      const seederCooldownDuration = 0;

      const creator = signers[0];
      const seeder = signers[1]; // seeder is not creator
      const deployer = signers[2]; // deployer is not creator
      const hodler1 = signers[3];

      const successLevel = redeemInit
        .add(minimumCreatorRaise)
        .add(seederFee)
        .add(reserveInit);
      const finalValuation = successLevel;

      const minimumTradingDuration = 50;

      const trustFactoryDeployer = new ethers.ContractFactory(
        trustFactory.interface,
        trustFactory.bytecode,
        deployer
      );

      const trust = (await trustFactoryDeployer.deploy(
        {
          creator: creator.address,
          minimumCreatorRaise,
          seeder: seeder.address,
          seederFee,
          seederUnits,
          seederCooldownDuration,
          minimumTradingDuration,
          redeemInit,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          prestige: prestige.address,
          minimumStatus,
          totalSupply: totalTokenSupply,
        },
        {
          crpFactory: crpFactory.address,
          balancerFactory: bFactory.address,
          reserve: reserve.address,
          reserveInit,
          initialValuation,
          finalValuation,
        }
      )) as Trust;

      await trust.deployed();

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.PENDING,
        `distribution status not pending`
      );

      // seeder needs some cash, give enough to seeder
      await reserve.transfer(seeder.address, reserveInit);

      const reserveSeeder = new ethers.Contract(
        reserve.address,
        reserve.interface,
        seeder
      );

      // seeder must transfer seed funds before pool init
      await reserveSeeder.transfer(await trust.pool(), reserveInit);

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.SEEDED,
        `distribution status not seeded`
      );

      await trust.anonStartDistribution({ gasLimit: 100000000 });

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.TRADING,
        `distribution status not trading`
      );

      const startBlock = await ethers.provider.getBlockNumber();

      const token = new ethers.Contract(
        await trust.token(),
        redeemableTokenJson.abi,
        creator
      ) as RedeemableERC20;
      const pool = new ethers.Contract(
        await trust.pool(),
        poolJson.abi,
        creator
      ) as RedeemableERC20Pool;

      let [crp, bPool] = await Util.poolContracts(signers, pool);

      const reserveSpend = successLevel.div(10);

      const swapReserveForTokens = async (hodler, spend) => {
        // give hodler some reserve
        await reserve.transfer(hodler.address, spend);

        const reserveHodler = reserve.connect(hodler);
        const crpHodler = crp.connect(hodler);
        const bPoolHodler = bPool.connect(hodler);

        await crpHodler.pokeWeights();
        await reserveHodler.approve(bPool.address, spend);
        await bPoolHodler.swapExactAmountIn(
          reserve.address,
          spend,
          token.address,
          ethers.BigNumber.from("1"),
          ethers.BigNumber.from("1000000" + Util.eighteenZeros)
        );
      };

      // reach success level
      while ((await reserve.balanceOf(bPool.address)).lte(successLevel)) {
        await swapReserveForTokens(hodler1, reserveSpend);
      }

      // create empty transfer blocks until reaching unblock block, so distribution can end
      while (
        (await ethers.provider.getBlockNumber()) <=
        startBlock + minimumTradingDuration
      ) {
        await reserve.transfer(signers[9].address, 0);
      }

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.TRADINGCANEND,
        `distribution status not trading can end`
      );

      const expectedTrustFinalBalance = await reserve.balanceOf(bPool.address);

      await trust.anonEndDistribution();

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.SUCCESS,
        "distribution status not successful distribution"
      );

      assert(
        (await trust.finalBalance()).eq(expectedTrustFinalBalance),
        "finalBalance was not exposed after trading ended (successful distribution)"
      );
    });

    it("on failed distribution", async function () {
      this.timeout(0);

      const signers = await ethers.getSigners();

      const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

      const reserve = (await Util.basicDeploy(
        "ReserveToken",
        {}
      )) as ReserveToken;

      const prestigeFactory = await ethers.getContractFactory("Prestige");
      const prestige = (await prestigeFactory.deploy()) as Prestige;
      const minimumStatus = Status.NIL;

      const trustFactory = await ethers.getContractFactory("Trust", {
        libraries: {
          RightsManager: rightsManager.address,
        },
      });

      const tokenName = "Token";
      const tokenSymbol = "TKN";

      const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const initialValuation = ethers.BigNumber.from(
        "10000" + Util.eighteenZeros
      );
      const totalTokenSupply = ethers.BigNumber.from(
        "2000" + Util.eighteenZeros
      );

      const minimumCreatorRaise = ethers.BigNumber.from(
        "100" + Util.eighteenZeros
      );
      const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
      const seederUnits = 0;
      const seederCooldownDuration = 0;

      const creator = signers[0];
      const seeder = signers[1]; // seeder is not creator
      const deployer = signers[2]; // deployer is not creator

      const successLevel = redeemInit
        .add(minimumCreatorRaise)
        .add(seederFee)
        .add(reserveInit);
      const finalValuation = successLevel;

      const minimumTradingDuration = 50;

      const trustFactoryDeployer = new ethers.ContractFactory(
        trustFactory.interface,
        trustFactory.bytecode,
        deployer
      );

      const trust = (await trustFactoryDeployer.deploy(
        {
          creator: creator.address,
          minimumCreatorRaise,
          seeder: seeder.address,
          seederFee,
          seederUnits,
          seederCooldownDuration,
          minimumTradingDuration,
          redeemInit,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          prestige: prestige.address,
          minimumStatus,
          totalSupply: totalTokenSupply,
        },
        {
          crpFactory: crpFactory.address,
          balancerFactory: bFactory.address,
          reserve: reserve.address,
          reserveInit,
          initialValuation,
          finalValuation,
        }
      )) as Trust;

      await trust.deployed();

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.PENDING,
        "distribution status was not set to pending"
      );

      // seeder needs some cash, give enough to seeder
      await reserve.transfer(seeder.address, reserveInit);

      const reserveSeeder = new ethers.Contract(
        reserve.address,
        reserve.interface,
        seeder
      );

      // seeder must transfer seed funds before pool init
      await reserveSeeder.transfer(await trust.pool(), reserveInit);

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.SEEDED,
        `distribution status not set to seeded`
      );

      await trust.anonStartDistribution({ gasLimit: 100000000 });

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.TRADING,
        "distribution status was not set to trading"
      );

      const startBlock = await ethers.provider.getBlockNumber();

      // create empty transfer blocks until reaching unblock block, so distribution can end
      while (
        (await ethers.provider.getBlockNumber()) <=
        startBlock + minimumTradingDuration
      ) {
        await reserve.transfer(signers[9].address, 0);
      }

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.TRADINGCANEND,
        `distribution status not trading can end`
      );

      const pool = new ethers.Contract(
        await trust.pool(),
        poolJson.abi,
        creator
      ) as RedeemableERC20Pool;
      let [crp, bPool] = await Util.poolContracts(signers, pool);

      const expectedTrustFinalBalance = await reserve.balanceOf(bPool.address);

      await trust.anonEndDistribution();

      assert(
        (await trust.getDistributionStatus()) === RaiseStatus.FAIL,
        "distribution status was failed"
      );

      assert(
        (await trust.finalBalance()).eq(expectedTrustFinalBalance),
        "finalBalance was not exposed after trading ended (failed distribution)"
      );
    });
  });

  it("should burn all unsold tokens", async function () {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

    const reserve = (await Util.basicDeploy(
      "ReserveToken",
      {}
    )) as ReserveToken;

    const prestigeFactory = await ethers.getContractFactory("Prestige");
    const prestige = (await prestigeFactory.deploy()) as Prestige;
    const minimumStatus = Status.NIL;

    const trustFactory = await ethers.getContractFactory("Trust", {
      libraries: {
        RightsManager: rightsManager.address,
      },
    });

    const tokenName = "Token";
    const tokenSymbol = "TKN";

    const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
    const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
    const initialValuation = ethers.BigNumber.from(
      "10000" + Util.eighteenZeros
    );
    const totalTokenSupply = ethers.BigNumber.from("2000" + Util.eighteenZeros);

    const minimumCreatorRaise = ethers.BigNumber.from(
      "100" + Util.eighteenZeros
    );
    const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
    const seederUnits = 0;
    const seederCooldownDuration = 0;

    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator
    const deployer = signers[2]; // deployer is not creator
    const hodler1 = signers[3];

    const successLevel = redeemInit
      .add(minimumCreatorRaise)
      .add(seederFee)
      .add(reserveInit);
    const finalValuation = successLevel;

    const minimumTradingDuration = 50;

    const trustFactoryDeployer = new ethers.ContractFactory(
      trustFactory.interface,
      trustFactory.bytecode,
      deployer
    );

    const trust = (await trustFactoryDeployer.deploy(
      {
        creator: creator.address,
        minimumCreatorRaise,
        seeder: seeder.address,
        seederFee,
        seederUnits,
        seederCooldownDuration,
        minimumTradingDuration,
        redeemInit,
      },
      {
        name: tokenName,
        symbol: tokenSymbol,
        prestige: prestige.address,
        minimumStatus,
        totalSupply: totalTokenSupply,
      },
      {
        crpFactory: crpFactory.address,
        balancerFactory: bFactory.address,
        reserve: reserve.address,
        reserveInit,
        initialValuation,
        finalValuation,
      }
    )) as Trust;

    await trust.deployed();

    // seeder needs some cash, give enough to seeder
    await reserve.transfer(seeder.address, reserveInit);

    const reserveSeeder = new ethers.Contract(
      reserve.address,
      reserve.interface,
      seeder
    );

    // seeder must transfer funds before pool can init
    await reserveSeeder.transfer(await trust.pool(), reserveInit);

    await trust.anonStartDistribution({ gasLimit: 100000000 });

    const startBlock = await ethers.provider.getBlockNumber();

    const token = new ethers.Contract(
      await trust.token(),
      redeemableTokenJson.abi,
      creator
    ) as RedeemableERC20;
    const pool = new ethers.Contract(
      await trust.pool(),
      poolJson.abi,
      creator
    ) as RedeemableERC20Pool;
    let [crp, bPool] = await Util.poolContracts(signers, pool);

    const reserveSpend = successLevel.div(10);

    const swapReserveForTokens = async (hodler, spend) => {
      // give hodler some reserve
      await reserve.transfer(hodler.address, spend);

      const reserveHodler = reserve.connect(hodler);
      const crpHodler = crp.connect(hodler);
      const bPoolHodler = bPool.connect(hodler);

      await crpHodler.pokeWeights();
      await reserveHodler.approve(bPool.address, spend);
      await bPoolHodler.swapExactAmountIn(
        reserve.address,
        spend,
        token.address,
        ethers.BigNumber.from("1"),
        ethers.BigNumber.from("1000000" + Util.eighteenZeros)
      );
    };

    // reach success level
    while ((await reserve.balanceOf(bPool.address)).lte(successLevel)) {
      await swapReserveForTokens(hodler1, reserveSpend);
    }

    const swappedTokens = await token.balanceOf(hodler1.address);

    // create empty transfer blocks until reaching unblock block, so distribution can end
    while (
      (await ethers.provider.getBlockNumber()) <=
      startBlock + minimumTradingDuration
    ) {
      await reserve.transfer(signers[9].address, 0);
    }

    const tokenBPoolBalanceBefore = await token.balanceOf(bPool.address);

    await trust.anonEndDistribution();

    const totalSupply = await token.totalSupply();
    const tokenDust = tokenBPoolBalanceBefore
      .mul(Util.ONE)
      .div(1e7)
      .div(Util.ONE)
      .add(2); // rounding error

    assert(
      totalSupply.eq(swappedTokens.add(tokenDust)),
      `remaining supply of tokens was not equal to number that were sold plus dust
      actual    ${totalSupply}
      expected  ${swappedTokens.add(tokenDust)}
      swapped   ${swappedTokens}
      tokenDust ${tokenDust}
    `
    );
  });

  it("should exit with minimal reserve dust remaining", async () => {
    this.timeout(0);

    const signers = await ethers.getSigners();

    const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

    const reserve = (await Util.basicDeploy(
      "ReserveToken",
      {}
    )) as ReserveToken;

    const prestigeFactory = await ethers.getContractFactory("Prestige");
    const prestige = (await prestigeFactory.deploy()) as Prestige;
    const minimumStatus = Status.NIL;

    const trustFactory = await ethers.getContractFactory("Trust", {
      libraries: {
        RightsManager: rightsManager.address,
      },
    });

    const tokenName = "Token";
    const tokenSymbol = "TKN";

    const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
    const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
    const initialValuation = ethers.BigNumber.from(
      "10000" + Util.eighteenZeros
    );
    const totalTokenSupply = ethers.BigNumber.from("2000" + Util.eighteenZeros);

    const minimumCreatorRaise = ethers.BigNumber.from(
      "100" + Util.eighteenZeros
    );
    const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
    const seederUnits = 0;
    const seederCooldownDuration = 0;

    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator
    const deployer = signers[2]; // deployer is not creator

    const successLevel = redeemInit
      .add(minimumCreatorRaise)
      .add(seederFee)
      .add(reserveInit);
    const finalValuation = successLevel;

    const minimumTradingDuration = 50;

    const trustFactoryDeployer = new ethers.ContractFactory(
      trustFactory.interface,
      trustFactory.bytecode,
      deployer
    );

    const trust = (await trustFactoryDeployer.deploy(
      {
        creator: creator.address,
        minimumCreatorRaise,
        seeder: seeder.address,
        seederFee,
        seederUnits,
        seederCooldownDuration,
        minimumTradingDuration,
        redeemInit,
      },
      {
        name: tokenName,
        symbol: tokenSymbol,
        prestige: prestige.address,
        minimumStatus,
        totalSupply: totalTokenSupply,
      },
      {
        crpFactory: crpFactory.address,
        balancerFactory: bFactory.address,
        reserve: reserve.address,
        reserveInit,
        initialValuation,
        finalValuation,
      }
    )) as Trust;

    await trust.deployed();

    // seeder needs some cash, give enough to seeder
    await reserve.transfer(seeder.address, reserveInit);

    const reserveSeeder = new ethers.Contract(
      reserve.address,
      reserve.interface,
      seeder
    );

    // seeder must transfer seed funds before pool can init
    await reserveSeeder.transfer(await trust.pool(), reserveInit);

    await trust.anonStartDistribution({ gasLimit: 100000000 });

    const startBlock = await ethers.provider.getBlockNumber();

    const pool = new ethers.Contract(
      await trust.pool(),
      poolJson.abi,
      creator
    ) as RedeemableERC20Pool;
    let [crp, bPool] = await Util.poolContracts(signers, pool);

    // create empty transfer blocks until reaching unblock block, so distribution can end
    while (
      (await ethers.provider.getBlockNumber()) <=
      startBlock + minimumTradingDuration
    ) {
      await reserve.transfer(signers[9].address, 0);
    }

    const bPoolReserveBeforeExit = await reserve.balanceOf(bPool.address);

    assert(
      bPoolReserveBeforeExit.eq(reserveInit),
      "wrong amount of reserve in balancer pool"
    );

    await trust.anonEndDistribution();

    const bPoolReserveAfterExit = await reserve.balanceOf(bPool.address);

    const expectedDust = bPoolReserveBeforeExit
      .mul(Util.ONE)
      .div(1e7)
      .div(Util.ONE)
      .add(1);

    assert(
      bPoolReserveAfterExit.eq(expectedDust),
      `
      wrong dust amount
      expected  ${expectedDust}
      got       ${bPoolReserveAfterExit}
    `
    );
  });

  describe("should only pay out creator if minimum distribution met", async function () {
    it("when minimum distribution met", async function () {
      this.timeout(0);

      const signers = await ethers.getSigners();

      const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

      const reserve = (await Util.basicDeploy(
        "ReserveToken",
        {}
      )) as ReserveToken;

      const prestigeFactory = await ethers.getContractFactory("Prestige");
      const prestige = (await prestigeFactory.deploy()) as Prestige;
      const minimumStatus = Status.NIL;

      const trustFactory = await ethers.getContractFactory("Trust", {
        libraries: {
          RightsManager: rightsManager.address,
        },
      });

      const tokenName = "Token";
      const tokenSymbol = "TKN";

      const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const initialValuation = ethers.BigNumber.from(
        "10000" + Util.eighteenZeros
      );
      const totalTokenSupply = ethers.BigNumber.from(
        "2000" + Util.eighteenZeros
      );

      const minimumCreatorRaise = ethers.BigNumber.from(
        "100" + Util.eighteenZeros
      );
      const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
      const seederUnits = 0;
      const seederCooldownDuration = 0;

      const creator = signers[0];
      const seeder = signers[1]; // seeder is not creator
      const deployer = signers[2]; // deployer is not creator
      const hodler1 = signers[3];

      const successLevel = redeemInit
        .add(minimumCreatorRaise)
        .add(seederFee)
        .add(reserveInit);
      const finalValuation = successLevel;

      const minimumTradingDuration = 50;

      const trustFactoryDeployer = new ethers.ContractFactory(
        trustFactory.interface,
        trustFactory.bytecode,
        deployer
      );

      const trust = (await trustFactoryDeployer.deploy(
        {
          creator: creator.address,
          minimumCreatorRaise,
          seeder: seeder.address,
          seederFee,
          seederUnits,
          seederCooldownDuration,
          minimumTradingDuration,
          redeemInit,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          prestige: prestige.address,
          minimumStatus,
          totalSupply: totalTokenSupply,
        },
        {
          crpFactory: crpFactory.address,
          balancerFactory: bFactory.address,
          reserve: reserve.address,
          reserveInit,
          initialValuation,
          finalValuation,
        }
      )) as Trust;

      await trust.deployed();

      // seeder needs some cash, give enough to seeder
      await reserve.transfer(seeder.address, reserveInit);

      const reserveSeeder = new ethers.Contract(
        reserve.address,
        reserve.interface,
        seeder
      );

      // seeder must transfer seed funds before pool init
      await reserveSeeder.transfer(await trust.pool(), reserveInit);

      await trust.anonStartDistribution({ gasLimit: 100000000 });

      const startBlock = await ethers.provider.getBlockNumber();

      const token = new ethers.Contract(
        await trust.token(),
        redeemableTokenJson.abi,
        creator
      ) as RedeemableERC20;
      const pool = new ethers.Contract(
        await trust.pool(),
        poolJson.abi,
        creator
      ) as RedeemableERC20Pool;
      let [crp, bPool] = await Util.poolContracts(signers, pool);

      const reserveSpend = successLevel.div(10);

      const swapReserveForTokens = async (hodler, spend) => {
        // give hodler some reserve
        await reserve.transfer(hodler.address, spend);

        const reserveHodler = reserve.connect(hodler);
        const crpHodler = crp.connect(hodler);
        const bPoolHodler = bPool.connect(hodler);

        await crpHodler.pokeWeights();
        await reserveHodler.approve(bPool.address, spend);
        await bPoolHodler.swapExactAmountIn(
          reserve.address,
          spend,
          token.address,
          ethers.BigNumber.from("1"),
          ethers.BigNumber.from("1000000" + Util.eighteenZeros)
        );
      };

      // reach success level
      while ((await reserve.balanceOf(bPool.address)).lte(successLevel)) {
        await swapReserveForTokens(hodler1, reserveSpend);
      }

      // create empty transfer blocks until reaching unblock block, so distribution can end
      while (
        (await ethers.provider.getBlockNumber()) <=
        startBlock + minimumTradingDuration
      ) {
        await reserve.transfer(signers[9].address, 0);
      }

      const creatorBalanceBefore = await reserve.balanceOf(creator.address);

      await trust.anonEndDistribution();

      const creatorBalanceAfter = await reserve.balanceOf(creator.address);

      assert(
        !creatorBalanceAfter.eq(creatorBalanceBefore),
        "creator wrongly did not receive payout after successful distribution"
      );
    });

    it("when minimum distribution not met", async function () {
      this.timeout(0);

      const signers = await ethers.getSigners();

      const [rightsManager, crpFactory, bFactory] = await Util.balancerDeploy();

      const reserve = (await Util.basicDeploy(
        "ReserveToken",
        {}
      )) as ReserveToken;

      const prestigeFactory = await ethers.getContractFactory("Prestige");
      const prestige = (await prestigeFactory.deploy()) as Prestige;
      const minimumStatus = Status.NIL;

      const trustFactory = await ethers.getContractFactory("Trust", {
        libraries: {
          RightsManager: rightsManager.address,
        },
      });

      const tokenName = "Token";
      const tokenSymbol = "TKN";

      const reserveInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const redeemInit = ethers.BigNumber.from("2000" + Util.eighteenZeros);
      const initialValuation = ethers.BigNumber.from(
        "10000" + Util.eighteenZeros
      );
      const totalTokenSupply = ethers.BigNumber.from(
        "2000" + Util.eighteenZeros
      );

      const minimumCreatorRaise = ethers.BigNumber.from(
        "100" + Util.eighteenZeros
      );
      const seederFee = ethers.BigNumber.from("100" + Util.eighteenZeros);
      const seederUnits = 0;
      const seederCooldownDuration = 0;

      const creator = signers[0];
      const seeder = signers[1]; // seeder is not creator
      const deployer = signers[2]; // deployer is not creator
      const hodler1 = signers[3];

      const successLevel = redeemInit
        .add(minimumCreatorRaise)
        .add(seederFee)
        .add(reserveInit);
      const finalValuation = successLevel;

      const minimumTradingDuration = 50;

      const trustFactoryDeployer = new ethers.ContractFactory(
        trustFactory.interface,
        trustFactory.bytecode,
        deployer
      );

      const trust = (await trustFactoryDeployer.deploy(
        {
          creator: creator.address,
          minimumCreatorRaise,
          seeder: seeder.address,
          seederFee,
          seederUnits,
          seederCooldownDuration,
          minimumTradingDuration,
          redeemInit,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          prestige: prestige.address,
          minimumStatus,
          totalSupply: totalTokenSupply,
        },
        {
          crpFactory: crpFactory.address,
          balancerFactory: bFactory.address,
          reserve: reserve.address,
          reserveInit,
          initialValuation,
          finalValuation,
        }
      )) as Trust;

      await trust.deployed();

      // seeder needs some cash, give enough to seeder
      await reserve.transfer(seeder.address, reserveInit);

      const reserveSeeder = new ethers.Contract(
        reserve.address,
        reserve.interface,
        seeder
      );

      // seeder must transfer seed funds before pool init
      await reserveSeeder.transfer(await trust.pool(), reserveInit);

      await trust.anonStartDistribution({ gasLimit: 100000000 });

      const startBlock = await ethers.provider.getBlockNumber();

      const token = new ethers.Contract(
        await trust.token(),
        redeemableTokenJson.abi,
        creator
      );
      const pool = new ethers.Contract(
        await trust.pool(),
        poolJson.abi,
        creator
      ) as RedeemableERC20Pool;
      let [crp, bPool] = await Util.poolContracts(signers, pool);

      const reserveSpend = successLevel.div(10);

      const swapReserveForTokens = async (hodler, spend) => {
        // give hodler some reserve
        await reserve.transfer(hodler.address, spend);

        const reserveHodler = reserve.connect(hodler);
        const crpHodler = crp.connect(hodler);
        const bPoolHodler = bPool.connect(hodler);

        await crpHodler.pokeWeights();
        await reserveHodler.approve(bPool.address, spend);
        await bPoolHodler.swapExactAmountIn(
          reserve.address,
          spend,
          token.address,
          ethers.BigNumber.from("1"),
          ethers.BigNumber.from("1000000" + Util.eighteenZeros)
        );
      };

      // failed to reach success level
      // while ((await reserve.balanceOf(bPool.address)).lte(successLevel)) {
      await swapReserveForTokens(hodler1, reserveSpend);
      // }

      // create empty transfer blocks until reaching unblock block, so distribution can end
      while (
        (await ethers.provider.getBlockNumber()) <=
        startBlock + minimumTradingDuration
      ) {
        await reserve.transfer(signers[9].address, 0);
      }

      const creatorBalanceBefore = await reserve.balanceOf(creator.address);

      await trust.anonEndDistribution();

      const creatorBalanceAfter = await reserve.balanceOf(creator.address);

      assert(
        creatorBalanceAfter.eq(creatorBalanceBefore),
        "creator wrongly received payout after failed distribution"
      );
    });
  });
});
