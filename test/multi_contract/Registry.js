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
    })
  });
});