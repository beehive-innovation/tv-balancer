import { ethers } from "hardhat";
import {
  Flow as FlowType,
  RainterpreterExpressionDeployer,
} from "../../typechain";
import { InterpreterCallerV1ConstructionConfigStruct } from "../../typechain/contracts/flow/FlowCommon";
import { getRainMetaDocumentFromContract } from "../../utils";
import { registerContract } from "../utils";
import { verifyContract } from "../verify";

export const deployFlow = async (
  deployer_: RainterpreterExpressionDeployer
) => {
  const flowFactory = await ethers.getContractFactory("Flow");

  const interpreterCallerConfig: InterpreterCallerV1ConstructionConfigStruct = {
    meta: getRainMetaDocumentFromContract("flow"),
    deployer: deployer_.address,
  };

  const Flow = (await flowFactory.deploy(interpreterCallerConfig)) as FlowType;

  registerContract("Flow", Flow.address);
  verifyContract("Flow", Flow.address, interpreterCallerConfig);
};