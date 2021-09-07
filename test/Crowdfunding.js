const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding Contract", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let contractFactory;
  let contract;

  const goal = ethers.utils.parseEther("10.0");

  beforeEach(async function () {
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
      contractFactory = await ethers.getContractFactory("Crowdfunding");
      contract = await contractFactory.deploy(3, goal);
  });

  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right deadline", async function() {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const timestamp = block.timestamp;

      expect(await contract.deadline()).to.equal(timestamp + (3 * 24 * 60 * 60));
    });

    it("Should set the right goal", async function() {
      expect(ethers.utils.formatEther(await contract.goal())).to.equal("10.0");
    });
  });

  describe("Pledging", function() {
    it("Should pledge the right amount", async function() {
      const value = ethers.utils.parseEther("7.0");

      await contract.pledge(value, {value: value});

      expect(await ethers.provider.getBalance(contract.address)).to.equal(value);
    });

    it("Should revert if amount mismatches", async function() {
      const value = ethers.utils.parseEther("7.0");

      await expect(contract.pledge(3, {value: value})).to.be.revertedWith("Amount mismatch");
    });

    it("Should revert if deadline passed", async function() {
      const value = ethers.utils.parseEther("7.0");
      const fourDays = 4 * 24 * 60 * 60;

      await ethers.provider.send('evm_increaseTime', [fourDays]);
      await ethers.provider.send('evm_mine');

      await expect(contract.pledge(value, {value: value})).to.be.revertedWith("Funding period ended");
    });
  });

  describe("Claim funds", function() {
    describe("With enough funding", function() {
      const value = ethers.utils.parseEther("10.0");

      beforeEach(async function() {
        await contract.connect(addr1).pledge(value, {value: value});
      });

      it("Should revert if deadline did not pass yet", async function() {
        await expect(contract.claimFunds()).to.be.revertedWith("Funding period not finished yet");
      });
    });

    describe("With insufficient funds", function() {
      beforeEach(async function() {
        const value = ethers.utils.parseEther("5.0");
        await contract.connect(addr1).pledge(value, {value: value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("Should revert if funding goal was not met", async function() {
        await expect(contract.claimFunds()).to.be.revertedWith("Funding goal missed");
      });
    });

    describe("With enough funding and time passed", function() {
      beforeEach(async function() {
        // supply enough funds
        const value = ethers.utils.parseEther("15.0");
        await contract.connect(addr1).pledge(value, {value: value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("should revert if claimer is not owner", async function() {

        await expect(contract.connect(addr1).claimFunds()).to.be.revertedWith("Not the owner");
      });

      it("Should transfer funds", async function() {
        await expect(await contract.claimFunds())
          .to.changeEtherBalance(owner, ethers.utils.parseEther("15.0"));
      });
    });
  });
});
