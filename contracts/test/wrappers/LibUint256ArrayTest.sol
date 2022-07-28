// SPDX-License-Identifier: CAL
pragma solidity ^0.8.15;

import "../../array/LibUint256Array.sol";
import "../../vm/LibStackTop.sol";

/// @title LibUint256ArrayTest
/// Thin wrapper around `LibUint256Array` library exposing methods for testing
contract LibUint256ArrayTest {
    using LibUint256Array for uint256[];
    using LibStackTop for uint256[];
    using LibStackTop for StackTop;

    function truncate(uint256[] memory array_, uint256 newLength_)
        external
        pure
        returns (uint256[] memory)
    {
        array_.truncate(newLength_);
        return array_;
    }

    function extend(uint256[] memory base_, uint256[] memory extend_)
        external
        pure
        returns (uint256[] memory baseCopy_)
    {
        baseCopy_ = new uint256[](base_.length);
        LibUint256Array.unsafeCopyValuesTo(
            base_,
            StackTop.unwrap(baseCopy_.asStackTop().up())
        );
        baseCopy_.extend(extend_);
        return baseCopy_;
    }

    function unsafeCopyValuesTo(uint256[] memory inputs_)
        external
        pure
        returns (uint256[] memory)
    {
        uint256[] memory outputs_ = new uint256[](inputs_.length);
        LibUint256Array.unsafeCopyValuesTo(
            inputs_,
            StackTop.unwrap(outputs_.asStackTop().up())
        );
        return outputs_;
    }

    function unsafeCopyValuesToNewArray(uint256[] memory inputs_)
        external
        pure
        returns (uint256[] memory)
    {
        uint256 inputCursor_;
        assembly ("memory-safe") {
            inputCursor_ := add(inputs_, 0x20)
        }
        return LibUint256Array.unsafeCopyValuesToNewArray(
            inputCursor_, inputs_.length
        );
    }

    function getUnchecked(uint256[] memory list_, uint256 i_)
        external
        pure
        returns (uint256)
    {
        return LibUint256Array.getUnchecked(
            list_, i_
        );
    }
}