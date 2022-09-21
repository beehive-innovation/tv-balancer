// SPDX-License-Identifier: CAL
pragma solidity =0.8.17;

import "./FlowVM.sol";
import "./libraries/LibFlow.sol";
import {ReentrancyGuardUpgradeable as ReentrancyGuard} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

SourceIndex constant CAN_FLOW_ENTRYPOINT = SourceIndex.wrap(0);

contract Flow is ReentrancyGuard, FlowVM {
    using LibVMState for VMState;

    event Initialize(address sender, StateConfig[] flows);

    /// flow index => id => time
    mapping(SourceIndex => mapping(uint256 => uint256)) private _flows;

    constructor(address vmIntegrity_) FlowVM(vmIntegrity_) {}

    /// @param flows_ source and token config. Also controls delegated claims.
    function initialize(StateConfig[] calldata flows_) external initializer {
        __FlowVM_init(flows_);
        emit Initialize(msg.sender, flows_);
    }

    function _previewFlow(
        VMState memory state_,
        uint256 id_
    ) internal view returns (FlowIO memory flowIO_) {
        StackTop stackTop_ = flowStack(state_, id_);
        flowIO_ = LibFlow.stackToFlow(state_.stackBottom, stackTop_);
    }

    function previewFlow(uint flow_, uint256 id_)
        external
        view
        virtual
        returns (FlowIO memory flowIO_)
    {
        flowIO_ = _previewFlow(_loadVMState(flow_), id_);
    }

    function flow(uint flow_, uint256 id_)
        external
        virtual
        payable
        nonReentrant
        returns (FlowIO memory flowIO_)
    {
        VMState memory state_ = _loadVMState(flow_);
        flowIO_ = _previewFlow(state_, id_);
        registerFlowTime(IdempotentFlag.wrap(state_.scratch), flow_, id_);
        LibFlow.flow(flowIO_, address(this), payable(msg.sender));
    }


}
