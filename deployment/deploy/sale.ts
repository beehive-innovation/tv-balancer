import { ethers } from "hardhat";
import { CloneFactory, RainterpreterExpressionDeployer } from "../../typechain";
import { InterpreterCallerV1ConstructionConfigStruct } from "../../typechain/contracts/flow/FlowCommon";
import {
  getRainMetaDocumentFromContract,
  redeemableERC20DeployImplementation,
} from "../../utils";
import { registerContract } from "../utils";
import {
  Sale as SaleType,
  SaleConstructorConfigStruct,
} from "../../typechain/contracts/sale/Sale";
import { verifyContract } from "../verify";

export const deploySale = async (
  deployer_: RainterpreterExpressionDeployer,
  cloneFactory_: CloneFactory,
  maximumSaleTimeout_: number
) => {
  const saleFactory = await ethers.getContractFactory("Sale");

  const interpreterCallerConfig: InterpreterCallerV1ConstructionConfigStruct = {
    meta: getRainMetaDocumentFromContract("sale"),
    deployer: deployer_.address,
  };

  const RedeemableERC20 = await redeemableERC20DeployImplementation();

  await RedeemableERC20.deployed();

  const saleConstructorConfig: SaleConstructorConfigStruct = {
    maximumSaleTimeout: maximumSaleTimeout_,
    cloneFactory: cloneFactory_.address,
    redeemableERC20Implementation: RedeemableERC20.address,
    interpreterCallerConfig: interpreterCallerConfig,
  };

  const Sale = (await saleFactory.deploy(saleConstructorConfig)) as SaleType;

  registerContract("RedeemableERC20", RedeemableERC20.address);
  registerContract("Sale", Sale.address);

  // Calling verify
  // RedeemableERC20 does not have args !!!
  verifyContract("RedeemableERC20", RedeemableERC20.address);

  verifyContract("Sale", Sale.address, saleConstructorConfig);
};