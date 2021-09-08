// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

contract Crowdfunding {
  event PledgeCreated(address contributor, uint256 amount);
  event FundsClaimed(uint256 amount);
  event PledgeRefunded(address contributor, uint256 amount);

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
    require(amount == msg.value,
            "Amount mismatch");
    require(block.timestamp < deadline,
            "Funding period ended");

    pledgeOf[msg.sender] = amount;
    emit PledgeCreated(msg.sender, amount);
  }

  function claimFunds() public {
    require(msg.sender == owner,
            "Not the owner");
    require(block.timestamp >= deadline,
            "Funding period not finished yet");
    require(address(this).balance >= goal,
            "Funding goal missed");

    uint256 amount = address(this).balance;
    msg.sender.transfer(amount);
    emit FundsClaimed(amount);
  }

  function refund() public {
    uint256 amount = pledgeOf[msg.sender];

    // conditions
    require(block.timestamp >= deadline,
            "Funding period not finished yet");
    require(address(this).balance < goal,
            "Funding was successfull, nothing to refund");
    require(amount > 0,
            "Nothing to refund");

    // effect
    pledgeOf[msg.sender] = 0;

    // interaction
    msg.sender.transfer(amount);
    emit PledgeRefunded(msg.sender, amount);
  }
}
