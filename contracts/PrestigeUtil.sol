// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import { IPrestige } from "./IPrestige.sol";

library PrestigeUtil {

    // Returns the highest status achieved relative to a block number and status report.
    // Note that typically the statusReport will be from the _current_ contract state.
    // When the `statusReport` comes from a later block than the `blockNumber` this means
    // the user must have held the status continuously from `blockNumber` _through_ to the report block.
    // I.e. NOT a snapshot.
    function statusAtFromReport(uint256 statusReport, uint32 blockNumber) internal pure returns (IPrestige.Status) {
        for (uint256 i = 0; i < 8; i++) {
            if (uint32(uint256(statusReport >> (i*32))) > blockNumber) {
                return IPrestige.Status(i);
            }
        }
        return IPrestige.Status(9);
    }

    // Returns the block that a given status has been held since.
    // Returns 0xffffffff if a status has never been held.
    function statusBlock(uint256 statusReport, IPrestige.Status status) internal pure returns (uint32) {
        return uint32(
            uint256(
                statusReport >> (uint256(status) * 32)
            )
        );
    }
}