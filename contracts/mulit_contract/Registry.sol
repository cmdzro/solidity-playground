// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Registry is Ownable {
    mapping(address => uint256) internal deviceId;
    mapping(address => uint8) internal region;
    mapping(uint256 => address) internal deviceIdToAddress;

    function register(uint256 _deviceId, uint8 _region) public {
        require(_deviceId > 0, "DeviceId can't be 0");
        require(_region > 0, "Region can't be 0");
        require(deviceId[msg.sender] == 0, "Already registered");
        require(deviceIdToAddress[_deviceId] == address(0), "DeviceId already registered");

        deviceId[msg.sender] = _deviceId;
        region[msg.sender] = _region;
        deviceIdToAddress[_deviceId] = msg.sender;
    }

    function getDeviceId() external view returns (uint256) {
        return deviceId[msg.sender];
    }

    function getRegion() external view returns (uint8) {
        return region[msg.sender];
    }

    function getRegionByDeviceId(uint256 _deviceId) external view returns (uint8) {
        return region[deviceIdToAddress[_deviceId]];
    }

    function getAddressByDeviceId(uint256 _deviceId) external view returns (address) {
        return deviceIdToAddress[_deviceId];
    }
}