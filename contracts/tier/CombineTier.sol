// SPDX-License-Identifier: CAL
pragma solidity =0.8.17;

import {TierwiseCombine} from "./libraries/TierwiseCombine.sol";
import {ITierV2} from "./ITierV2.sol";
import {TierV2} from "./TierV2.sol";
import "../interpreter/deploy/IExpressionDeployerV1.sol";
import "../interpreter/run/LibEncodedDispatch.sol";
import "../interpreter/run/LibStackPointer.sol";
import "../interpreter/run/LibInterpreterState.sol";
import "../interpreter/caller/LibContext.sol";
import "../interpreter/caller/InterpreterCallerV1.sol";
import "../interpreter/run/LibEvaluable.sol";
import "../factory/ICloneableV1.sol";

import {ERC165CheckerUpgradeable as ERC165Checker} from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";

bytes32 constant CALLER_META_HASH = bytes32(
    0x81a24b9f4f5cdef2c6ffe750f12c5be49a78fe64506d2af22505d9eaa44eda49
);

SourceIndex constant REPORT_ENTRYPOINT = SourceIndex.wrap(0);
SourceIndex constant REPORT_FOR_TIER_ENTRYPOINT = SourceIndex.wrap(1);

uint256 constant REPORT_MIN_OUTPUTS = 1;
uint256 constant REPORT_MAX_OUTPUTS = 1;

uint256 constant REPORT_FOR_TIER_MIN_OUTPUTS = 1;
uint256 constant REPORT_FOR_TIER_MAX_OUTPUTS = 1;

/// All config used during initialization of a CombineTier.
/// @param combinedTiersLength The first N values in the constants array of the
/// expressionConfig MUST be all the combined tiers that are known statically. Of
/// course some tier addresses MAY only be known at runtime and so these cannot
/// be included. For those that are included there will be additional deploy
/// time checks to ensure compatibility with each other (i.e. reportUnits).
/// @param expressionConfig Source to run for both report and reportForTier as
/// sources 0 and 1 respectively.
struct CombineTierConfig {
    uint256 combinedTiersLength;
    EvaluableConfig evaluableConfig;
}

/// @title CombineTier
/// @notice Allows combining the reports from any `ITierV2` contracts.
/// The value at the top of the stack after executing the Rain expression will be
/// used as the return of all `ITierV2` functions exposed by `CombineTier`.
contract CombineTier is ICloneableV1, TierV2, InterpreterCallerV1 {
    using LibStackPointer for StackPointer;
    using LibStackPointer for uint256[];
    using LibUint256Array for uint256;
    using LibUint256Array for uint256[];
    using LibInterpreterState for InterpreterState;

    event Initialize(address sender, CombineTierConfig config);

    Evaluable internal evaluable;

    constructor(
        InterpreterCallerV1ConstructionConfig memory config_
    ) InterpreterCallerV1(CALLER_META_HASH, config_) {
        _disableInitializers();
    }

    /// @inheritdoc ICloneableV1
    function initialize(bytes calldata data_) external initializer {
        __TierV2_init();

        CombineTierConfig memory config_ = abi.decode(
            data_,
            (CombineTierConfig)
        );

        // Integrity check for all known combined tiers.
        for (uint256 i_ = 0; i_ < config_.combinedTiersLength; i_++) {
            require(
                ERC165Checker.supportsInterface(
                    address(uint160(config_.evaluableConfig.constants[i_])),
                    type(ITierV2).interfaceId
                ),
                "ERC165_TIERV2"
            );
        }

        emit Initialize(msg.sender, config_);

        (
            IInterpreterV1 interpreter_,
            IInterpreterStoreV1 store_,
            address expression_
        ) = config_.evaluableConfig.deployer.deployExpression(
                config_.evaluableConfig.sources,
                config_.evaluableConfig.constants,
                LibUint256Array.arrayFrom(
                    REPORT_MIN_OUTPUTS,
                    REPORT_FOR_TIER_MIN_OUTPUTS
                )
            );
        evaluable = Evaluable(interpreter_, store_, expression_);
    }

    /// @inheritdoc ITierV2
    function report(
        address account_,
        uint256[] memory callerContext_
    ) external view virtual override returns (uint256) {
        unchecked {
            Evaluable memory evaluable_ = evaluable;
            (uint256[] memory stack_, ) = evaluable_.interpreter.eval(
                evaluable_.store,
                DEFAULT_STATE_NAMESPACE,
                LibEncodedDispatch.encode(
                    evaluable_.expression,
                    REPORT_ENTRYPOINT,
                    REPORT_MAX_OUTPUTS
                ),
                LibContext.build(
                    uint256(uint160(account_)).arrayFrom().matrixFrom(),
                    callerContext_,
                    new SignedContext[](0)
                )
            );
            return stack_[stack_.length - 1];
        }
    }

    /// @inheritdoc ITierV2
    function reportTimeForTier(
        address account_,
        uint256 tier_,
        uint256[] memory callerContext_
    ) external view returns (uint256) {
        unchecked {
            Evaluable memory evaluable_ = evaluable;
            (uint256[] memory stack_, ) = evaluable_.interpreter.eval(
                evaluable_.store,
                DEFAULT_STATE_NAMESPACE,
                LibEncodedDispatch.encode(
                    evaluable_.expression,
                    REPORT_FOR_TIER_ENTRYPOINT,
                    REPORT_FOR_TIER_MAX_OUTPUTS
                ),
                LibContext.build(
                    LibUint256Array
                        .arrayFrom(uint256(uint160(account_)), tier_)
                        .matrixFrom(),
                    callerContext_,
                    new SignedContext[](0)
                )
            );
            return stack_[stack_.length - 1];
        }
    }
}
