// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

contract Crowdfunding {
  address public owner;
  uint256 public deadline;
  uint256 public goal;
  mapping(address => uint256) public pledgeOf;

  constructor(uint256 _numberOfDays, uint256 _goal) {
    owner = msg.sender;
    deadline = block.timestamp + (_numberOfDays * 1 days);
    goal = _goal;
  }

  function pledge(uint256 amount) public payable {
    require(amount == msg.value, "Amount mismatch");
    require(block.timestamp < deadline, "Funding period ended");

    pledgeOf[msg.sender] = amount;
  }

  function claimFunds() public {
    require(msg.sender == owner, "Not the owner");
    require(block.timestamp >= deadline, "Funding period not finished yet");
    require(address(this).balance >= goal, "Funding goal missed");

    msg.sender.transfer(address(this).balance);
  }

  function refund() public {
    // conditions

    // effect
    uint256 amount = pledgeOf[msg.sender];
    pledgeOf[msg.sender] = 0;

    // interaction
    msg.sender.transfer(amount);
  }
}
