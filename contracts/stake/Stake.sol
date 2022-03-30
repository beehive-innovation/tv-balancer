// SPDX-License-Identifier: CAL
pragma solidity =0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// solhint-disable-next-line max-line-length
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "../tier/libraries/TierReport.sol";

struct StakeConfig {
    address token;
    string name;
    string symbol;
}

struct Deposit {
    uint32 blockNumber;
    uint224 amount;
}

contract Stake is ERC20Upgradeable {
    event Initialize(address sender, StakeConfig config);
    using SafeERC20 for IERC20;
    using SafeCast for uint256;

    IERC20 private token;

    mapping(address => Deposit[]) private deposits;

    function initialize(StakeConfig calldata config_) external initializer {
        __ERC20_init(config_.name, config_.symbol);
        token = IERC20(config_.token);
        emit Initialize(msg.sender, config_);
    }

    function deposit(uint256 amount_) external {
        require(amount_ > 0, "0_AMOUNT");
        token.safeTransferFrom(msg.sender, address(this), amount_);
        _mint(
            msg.sender,
            (totalSupply() * amount_) / token.balanceOf(address(this))
        );

        uint224 highwater_ = deposits[msg.sender].length > 0
            ? deposits[msg.sender][deposits[msg.sender].length - 1].amount
            : 0;
        deposits[msg.sender].push(
            Deposit(uint32(block.number), highwater_ + amount_.toUint224())
        );
    }

    function withdraw(uint256 amount_) external {
        token.safeTransfer(
            msg.sender,
            (amount_ * token.balanceOf(address(this))) / totalSupply()
        );
        _burn(msg.sender, amount_);
        // MUST revert if length is 0 so we're guaranteed to have some amount
        // for the old highwater. Users without deposits can't withdraw.
        uint256 i_ = deposits[msg.sender].length - 1;
        uint256 oldHighwater_ = uint256(deposits[msg.sender][i_].amount);
        // MUST revert if withdraw amount exceeds highwater.
        uint256 newHighwater_ = oldHighwater_ - amount_;

        while (deposits[msg.sender][i_].amount > newHighwater_) {
            delete deposits[msg.sender][i_];
            if (i_ == 0) {
                break;
            }
            i_--;
        }
        // If the newHighwater_ is anything above zero then the ledger needs
        // finalizing of the top entry. If a top exists and is exactly the same
        // as the newHighwater_ we do nothing.
        uint256 cmpHighwater_ = deposits[msg.sender].length > 0
            ? deposits[msg.sender][deposits[msg.sender].length - 1].amount
            : 0;
        if (newHighwater_ > cmpHighwater_) {
            deposits[msg.sender].push(
                Deposit(uint32(block.number), newHighwater_.toUint224())
            );
        }
    }

    function report(address account_, bytes calldata data_)
        external
        view
        returns (uint256)
    {
        uint256[] memory thresholds_ = abi.decode(data_, (uint256[]));
        uint256 report_ = type(uint256).max;
        if (thresholds_.length > 0) {
            uint256 t_ = 0;
            for (uint256 i_ = 0; i_ < deposits[account_].length; i_++) {
                while (
                    t_ < thresholds_.length &&
                    deposits[account_][i_].amount >= thresholds_[t_]
                ) {
                    TierReport.updateBlockAtTier(
                        report_,
                        t_,
                        deposits[account_][i_].blockNumber
                    );
                    t_++;
                }
                if (t_ == thresholds_.length) {
                    break;
                }
            }
        }
        return report_;
    }
}