const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let tokenFactory;
  let contract;

  beforeEach(async function () {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
      tokenFactory = await ethers.getContractFactory("Token");
      contract = await tokenFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Deployment should assign total supply to the owner", async function () {
      const ownerBalance = await contract.balanceOf(owner.address);

      expect(await contract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // transfer 500 token from owner to addr1
      await contract.transfer(addr1.address, 500);

      let addr1Balance = await contract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(500);

      // transfer 100 token from addr1 to addr2
      await contract.connect(addr1).transfer(addr2.address, 100);

      const addr2Balance = await contract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(100);
    });

    it("Should fail if the sender does not have enough tokens", async function () {
      const initialOwnerBalance = await contract.balanceOf(owner.address);

      await expect(
        contract.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      expect(await contract.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await contract.balanceOf(owner.address);

      // Transfer 300 token from owner to addr1
      await contract.transfer(addr1.address, 300);

      // Transfer 50 token from addr1 to addr2
      await contract.connect(addr1).transfer(addr2.address, 50);

      const ownerBalance = await contract.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialOwnerBalance - 300);

      const addr1Balance = await contract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(250);

      const addr2Balance = await contract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});
