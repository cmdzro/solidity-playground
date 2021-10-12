// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is Ownable {
    mapping(address => uint256) internal deviceId;
    mapping(address => uint8) internal region;

    function register(uint256 _deviceId, uint8 _region) public {
        deviceId[msg.sender] = _deviceId;
        region[msg.sender] = _region;
    }

    function getDeviceId() external view returns (uint256) {
        return deviceId[msg.sender];
    }

    function getRegion() external view returns (uint8) {
        return region[msg.sender];
    }
}