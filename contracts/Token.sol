// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

contract Token {
  string public name = "Mattes Awesome Token";
  string public symbol = "MAT";

  uint256 public totalSupply = 1000000;

  address public owner;

  mapping(address => uint256) private balances;

  constructor() {
    balances[msg.sender] = totalSupply;
    owner = msg.sender;
  }

  function transfer(address _to, uint256 _amount) external {
    require(balances[msg.sender] >= _amount, "Not enough tokens");

    balances[msg.sender] -= _amount;
    balances[_to] += _amount;
  }

  function balanceOf(address _account) external view returns (uint256) {
    return balances[_account];
  }
}
