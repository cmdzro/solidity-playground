const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("Registry Contract", () => {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let contract;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    contract = await deploy("Registry");
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should not find any deviceId", async () => {
        expect(await contract.getDeviceId()).to.equal(0);
    });
  });

  describe("Registration", () => {
    it("Should register", async () => {
        await contract.connect(addr1).register(123, 1);

        expect(await contract.connect(owner).getDeviceId()).to.equal(0);
        expect(await contract.connect(owner).getRegion()).to.equal(0);
        
        expect(await contract.connect(addr1).getDeviceId()).to.equal(123);
        expect(await contract.connect(addr1).getRegion()).to.equal(1);

        expect(await contract.connect(owner).getRegionByDeviceId(123)).to.equal(1);
        expect(await contract.connect(owner).getAddressByDeviceId(123)).to.equal(addr1.address);
    });

    it("Should fail to register 0 device id", async () => {
        await expect(contract.register(0, 1))
          .to.be.revertedWith("DeviceId can't be 0");
    });

    it("Should fail to register 0 region", async () => {
        await expect(contract.register(1, 0))
          .to.be.revertedWith("Region can't be 0");
    });
  });

  describe("With registration", () => {
      beforeEach(async () => {
        await contract.connect(addr1).register(123, 1);
      });

      it("Should not be able to register again", async () => {
        await expect(contract.connect(addr1).register(345, 1))
          .to.be.revertedWith("Already registered");
      });

      it("Should not be able to register same device id again", async () => {
          await expect(contract.register(123, 2))
            .to.be.revertedWith("DeviceId already registered");
      });
  })
});