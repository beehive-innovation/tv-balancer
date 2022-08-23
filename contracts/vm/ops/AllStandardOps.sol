// SPDX-License-Identifier: CAL
pragma solidity =0.8.15;

import "../../type/LibCast.sol";
import "../../type/LibConvert.sol";
import "../../array/LibUint256Array.sol";
import "../runtime/RainVM.sol";
import "./core/OpCall.sol";
import "./core/OpCallExternal.sol";
import "./core/OpContext.sol";
import "./core/OpDebug.sol";
import "./core/OpStorage.sol";
import "./core/OpDoWhile.sol";
import "./core/OpLoopN.sol";
import "./core/OpState.sol";
import "./erc20/OpERC20BalanceOf.sol";
import "./erc20/OpERC20TotalSupply.sol";
import "./openZeppelin/erc20/snapshot/OpERC20SnapshotBalanceOfAt.sol";
import "./openZeppelin/erc20/snapshot/OpERC20SnapshotTotalSupplyAt.sol";
import "./erc721/OpERC721BalanceOf.sol";
import "./erc721/OpERC721OwnerOf.sol";
import "./erc1155/OpERC1155BalanceOf.sol";
import "./erc1155/OpERC1155BalanceOfBatch.sol";
import "./evm/OpBlockNumber.sol";
import "./evm/OpCaller.sol";
import "./evm/OpThisAddress.sol";
import "./evm/OpTimestamp.sol";
import "./list/OpExplode32.sol";
// import "./math/fixedPoint/OpFixedPointScale18.sol";
import "./math/fixedPoint/OpFixedPointDiv.sol";
import "./math/fixedPoint/OpFixedPointMul.sol";
import "./math/fixedPoint/OpFixedPointScaleBy.sol";
// import "./math/fixedPoint/OpFixedPointScaleN.sol";
import "./math/logic/OpAny.sol";
import "./math/logic/OpEagerIf.sol";
import "./math/logic/OpEqualTo.sol";
import "./math/logic/OpEvery.sol";
import "./math/logic/OpGreaterThan.sol";
import "./math/logic/OpIsZero.sol";
import "./math/logic/OpLessThan.sol";
import "./math/saturating/OpSaturatingAdd.sol";
import "./math/saturating/OpSaturatingMul.sol";
import "./math/saturating/OpSaturatingSub.sol";
import "./math/OpAdd.sol";
import "./math/OpDiv.sol";
import "./math/OpExp.sol";
import "./math/OpMax.sol";
import "./math/OpMin.sol";
import "./math/OpMod.sol";
import "./math/OpMul.sol";
import "./math/OpSub.sol";
import "./tier/OpITierV2Report.sol";
import "./tier/OpITierV2ReportTimeForTier.sol";
import "./tier/OpSaturatingDiff.sol";
import "./tier/OpSelectLte.sol";
import "./tier/OpUpdateTimesForTierRange.sol";

uint256 constant ALL_STANDARD_OPS_LENGTH = 27;

/// @title AllStandardOps
/// @notice RainVM opcode pack to expose all other packs.
library AllStandardOps {
    using LibCast for uint256;
    using LibCast for function(uint256) pure returns (uint256);
    using LibCast for function(VMState memory, uint256, StackTop)
        view
        returns (StackTop);
    using LibCast for function(VMState memory, uint256, StackTop)
        pure
        returns (StackTop);
    using LibCast for function(VMState memory, uint256, StackTop)
        view
        returns (StackTop)[];

    using AllStandardOps for function(IntegrityState memory, Operand, StackTop)
        view
        returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1];
    using AllStandardOps for function(VMState memory, Operand, StackTop)
        view
        returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1];

    using AllStandardOps for uint256[ALL_STANDARD_OPS_LENGTH + 1];

    using LibUint256Array for uint256[];
    using LibConvert for uint256[];
    using LibCast for uint256[];
    using LibCast for function(IntegrityState memory, Operand, StackTop)
        view
        returns (StackTop);
    using LibCast for function(IntegrityState memory, Operand, StackTop)
        pure
        returns (StackTop);
    using LibCast for function(IntegrityState memory, Operand, StackTop)
        view
        returns (StackTop)[];
    using LibCast for function(VMState memory, Operand, StackTop)
        view
        returns (StackTop)[];

    /// An oddly specific conversion between a fixed and dynamic uint256 array.
    /// This is useful for the purpose of building metadata for bounds checks
    /// and dispatch of all the standard ops provided by RainVM.
    /// The cast will fail if the length of the dynamic array doesn't match the
    /// first item of the fixed array; it relies on differences in memory
    /// layout in Solidity that MAY change in the future. The rollback guards
    /// against changes in Solidity memory layout silently breaking this cast.
    /// @param fixed_ The fixed size uint array to cast to a dynamic uint array.
    /// Specifically the size is fixed to match the number of standard ops.
    /// @param dynamic_ The dynamic uint array with length of the standard ops.
    function asUint256Array(
        function(IntegrityState memory, Operand, StackTop)
            view
            returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1]
            memory fixed_
    ) internal pure returns (uint256[] memory dynamic_) {
        assembly ("memory-safe") {
            dynamic_ := fixed_
        }
        require(
            dynamic_.length == ALL_STANDARD_OPS_LENGTH,
            "BAD_DYNAMIC_LENGTH"
        );
    }

    function asUint256Array(
        function(VMState memory, Operand, StackTop)
            view
            returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1]
            memory fixed_
    ) internal pure returns (uint256[] memory dynamic_) {
        assembly ("memory-safe") {
            dynamic_ := fixed_
        }
        require(
            dynamic_.length == ALL_STANDARD_OPS_LENGTH,
            "BAD_DYNAMIC_LENGTH"
        );
    }

    function integrityFunctionPointers(
        function(IntegrityState memory, Operand, StackTop)
            view
            returns (StackTop)[]
            memory locals_
    )
        internal
        pure
        returns (
            function(IntegrityState memory, Operand, StackTop)
                view
                returns (StackTop)[]
                memory
        )
    {
        unchecked {
            function(IntegrityState memory, Operand, StackTop)
                view
                returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1]
                memory pointersFixed_ = [
                    ALL_STANDARD_OPS_LENGTH.asIntegrityFunctionPointer(),
                    OpCall.integrity,
                    OpCallExternal.integrity,
                    OpContext.integrity,
                    // OpDebug.integrity,
                    OpDoWhile.integrity,
                    OpLoopN.integrity,
                    OpState.integrity,
                    OpStorage.integrity,
                    // OpERC20BalanceOf.integrity,
                    // OpERC20TotalSupply.integrity,
                    // OpERC20SnapshotBalanceOfAt.integrity,
                    // OpERC20SnapshotTotalSupplyAt.integrity,
                    // OpERC721BalanceOf.integrity,
                    // OpERC721OwnerOf.integrity,
                    // OpERC1155BalanceOf.integrity,
                    // OpERC1155BalanceOfBatch.integrity,
                    OpBlockNumber._blockNumber.integrityApplicator(),
                    // OpBlockNumber.integrity,
                    OpCaller.integrity,
                    OpThisAddress.integrity,
                    OpTimestamp.integrity,
                    OpExplode32.integrity,
                    // OpFixedPointScale18.integrity,
                    OpFixedPointDiv.integrity,
                    OpFixedPointMul.integrity,
                    OpFixedPointScaleBy.integrity,
                    // OpFixedPointScaleN.integrity,
                    OpAny.integrity,
                    OpEagerIf.integrity,
                    OpEqualTo.integrity,
                    OpEvery.integrity,
                    OpGreaterThan.integrity,
                    OpIsZero.integrity,
                    OpLessThan.integrity,
                    OpSaturatingAdd.integrity,
                    OpSaturatingMul.integrity,
                    OpSaturatingSub.integrity,
                    OpAdd.integrity,
                    OpDiv.integrity,
                    OpExp.integrity,
                    OpMax.integrity,
                    OpMin.integrity,
                    OpMod.integrity,
                    OpMul.integrity,
                    OpSub.integrity
                    // OpITierV2Report.integrity,
                    // OpITierV2ReportTimeForTier.integrity,
                    // OpSaturatingDiff.integrity,
                    // OpSelectLte.integrity,
                    // OpUpdateTimesForTierRange.integrity
                ];
            uint256[] memory pointers_ = pointersFixed_.asUint256Array();
            pointers_.extend(locals_.asUint256Array());
            return pointers_.asIntegrityPointers();
        }
    }

    function opcodeFunctionPointers(
        function(VMState memory, Operand, StackTop) view returns (StackTop)[]
            memory locals_
    )
        internal
        pure
        returns (
            function(VMState memory, Operand, StackTop)
                view
                returns (StackTop)[]
                memory opcodeFunctionPointers_
        )
    {
        unchecked {
            function(VMState memory, Operand, StackTop)
                view
                returns (StackTop)[ALL_STANDARD_OPS_LENGTH + 1]
                memory pointersFixed_ = [
                    ALL_STANDARD_OPS_LENGTH.asOpFunctionPointer(),
                    OpCall.intern,
                    OpCallExternal.intern,
                    OpContext.intern,
                    // OpDebug.debug,
                    OpDoWhile.intern,
                    OpLoopN.intern,
                    OpState.intern,
                    OpStorage.intern,
                    // OpERC20BalanceOf.intern,
                    // OpERC20TotalSupply.totalSupply,
                    // OpERC20SnapshotBalanceOfAt.balanceOfAt,
                    // OpERC20SnapshotTotalSupplyAt.totalSupplyAt,
                    // OpERC721BalanceOf.balanceOf,
                    // OpERC721OwnerOf.ownerOf,
                    // OpERC1155BalanceOf.balanceOf,
                    // OpERC1155BalanceOfBatch.balanceOfBatch,
                    OpBlockNumber.intern,
                    OpCaller.intern,
                    OpThisAddress.intern,
                    OpTimestamp.intern,
                    OpExplode32.intern,
                    // OpFixedPointScale18.scale18,
                    OpFixedPointDiv.intern,
                    OpFixedPointMul.intern,
                    OpFixedPointScaleBy.intern,
                    // OpFixedPointScaleN.scaleN,
                    OpAny.intern,
                    OpEagerIf.intern,
                    OpEqualTo.intern,
                    OpEvery.intern,
                    OpGreaterThan.intern,
                    OpIsZero.intern,
                    OpLessThan.intern,
                    OpSaturatingAdd.intern,
                    OpSaturatingMul.intern,
                    OpSaturatingSub.intern,
                    OpAdd.intern,
                    OpDiv.intern,
                    OpExp.intern,
                    OpMax.intern,
                    OpMin.intern,
                    OpMod.intern,
                    OpMul.intern,
                    OpSub.intern
                    // OpITierV2Report.report,
                    // OpITierV2ReportTimeForTier.reportTimeForTier,
                    // OpSaturatingDiff.saturatingDiff,
                    // OpSelectLte.selectLte,
                    // OpUpdateTimesForTierRange.updateTimesForTierRange
                ];
            uint256[] memory pointers_ = pointersFixed_.asUint256Array();
            pointers_.extend(locals_.asUint256Array());
            opcodeFunctionPointers_ = pointers_.asOpcodeFunctionPointers();
        }
    }
}
