// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract CrowdfundingFactory {
  address internal immutable crowdfundingImplementation;

  constructor() {
    crowdfundingImplementation = address(new Crowdfunding());
  }

  function createCrowdfunding(uint256 _numberOfDays, uint256 _goal) external returns (address) {
    address clone = Clones.clone(crowdfundingImplementation);
    Crowdfunding(clone).initialize(_numberOfDays, _goal);
    return clone;
  }
}

contract Crowdfunding is Ownable, Initializable {
  event PledgeCreated(address contributor, uint256 amount);
  event FundsClaimed(uint256 amount);
  event PledgeRefunded(address contributor, uint256 amount);

  uint256 public deadline;
  uint256 public goal;
  mapping(address => uint256) public pledgeOf;

  modifier deadlineReached {
    require(block.timestamp >= deadline, // solhint-disable-line not-rely-on-time
            "Funding period not finished yet");
    _;
  }

  function initialize(uint256 _numberOfDays, uint256 _goal) public initializer {
    deadline = block.timestamp + (_numberOfDays * 1 days); // solhint-disable-line not-rely-on-time
    goal = _goal;
  }

  function pledge(uint256 amount) public payable {
    require(amount == msg.value,
            "Amount mismatch");
    require(block.timestamp < deadline, // solhint-disable-line not-rely-on-time
            "Funding period ended");

    pledgeOf[msg.sender] = amount;
    emit PledgeCreated(msg.sender, amount);
  }

  function claimFunds() public onlyOwner deadlineReached {
    require(address(this).balance >= goal,
            "Funding goal missed");

    uint256 amount = address(this).balance;
    payable(msg.sender).transfer(amount);
    emit FundsClaimed(amount);
  }

  function refund() public deadlineReached {
    uint256 amount = pledgeOf[msg.sender];

    // conditions
    require(address(this).balance < goal,
            "Funding goal achieved already");
    require(amount > 0,
            "Nothing to refund");

    // effect
    pledgeOf[msg.sender] = 0;

    // interaction
    payable(msg.sender).transfer(amount);
    emit PledgeRefunded(msg.sender, amount);
  }
}
