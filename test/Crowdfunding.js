const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe("CrowdfundingFactory Contract", () => {
  let owner;
  let contract;

  const goal = ethers.utils.parseEther("10.0");

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    contract = await deploy("CrowdfundingFactory");
  });

  xit("Should create instance", async () => {
    const tx = await contract.createCrowdfunding(4, goal, {from: owner.address});
    const { events } = await tx.wait();
    console.log(await tx.wait());
    const { address } = events.find(Boolean);
    const { interface } = await ethers.getContractFactory("Crowdfunding");
    const instance = new ethers.Contract(address, interface, owner);

    expect(await instance.goal()).to.equal(goal);
  });
});

describe("Crowdfunding Contract", () => {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let contract;

  const goal = ethers.utils.parseEther("10.0");

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    contract = await deploy("Crowdfunding");
    await contract.initialize(3, goal);
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should set the right deadline", async () => {
      const blockNum = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNum);
      const timestamp = block.timestamp;

      expect(await contract.deadline()).to.equal(timestamp + (3 * 24 * 60 * 60));
    });

    it("Should set the right goal", async () => {
      expect(ethers.utils.formatEther(await contract.goal())).to.equal("10.0");
    });
  });

  describe("Pledging", () => {
    it("Should pledge the right amount", async () => {
      const value = ethers.utils.parseEther("7.0");

      await contract.pledge(value, {value: value});

      expect(await ethers.provider.getBalance(contract.address)).to.equal(value);
    });

    it("Should emit PledgeCreated event", async () => {
      const value = ethers.utils.parseEther("7.0");

      await expect(contract.pledge(value, {value: value}))
        .to.emit(contract, "PledgeCreated")
        .withArgs(owner.address, value);
    });

    it("Should revert if amount mismatches", async () => {
      const value = ethers.utils.parseEther("7.0");

      await expect(contract.pledge(3, {value: value}))
        .to.be.revertedWith("Amount mismatch");
    });

    it("Should revert if deadline passed", async () => {
      const value = ethers.utils.parseEther("7.0");
      const fourDays = 4 * 24 * 60 * 60;

      await ethers.provider.send('evm_increaseTime', [fourDays]);
      await ethers.provider.send('evm_mine');

      await expect(contract.pledge(value, {value: value}))
        .to.be.revertedWith("Funding period ended");
    });
  });

  describe("Claim funds", () => {
    describe("With enough funding but before deadline is reached", () => {
      const value = ethers.utils.parseEther("10.0");

      beforeEach(async () => {
        await contract.connect(addr1).pledge(value, {value: value});
      });

      it("Should revert", async () => {
        await expect(contract.claimFunds())
          .to.be.revertedWith("Funding period not finished yet");
      });
    });

    describe("With insufficient funds but after deadline", () => {
      beforeEach(async () => {
        const value = ethers.utils.parseEther("5.0");
        await contract.connect(addr1).pledge(value, {value: value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("Should revert", async () => {
        await expect(contract.claimFunds())
          .to.be.revertedWith("Funding goal missed");
      });
    });

    describe("With enough funding and after deadline", () => {
      beforeEach(async () => {
        // supply enough funds
        const value = ethers.utils.parseEther("15.0");
        await contract.connect(addr1).pledge(value, {value: value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("should revert if claimer is not owner", async () => {
        await expect(contract.connect(addr1).claimFunds())
          .to.be.revertedWith("Ownable: caller is not the owner");
      });

      it("Should transfer funds", async () => {
        await expect(await contract.claimFunds())
          .to.changeEtherBalance(owner, ethers.utils.parseEther("15.0"));
      });

      it("Should emit FundsClaimed event", async () => {
        await expect(contract.claimFunds())
          .to.emit(contract, "FundsClaimed")
          .withArgs(ethers.utils.parseEther("15.0"));
      });
    });
  });

  describe("Refund", () => {
    describe("With time not yet passed", () => {
      beforeEach(async () => {
        // supply funds
        const value = ethers.utils.parseEther("5.0");
        await contract.connect(addr1).pledge(value, {value: value});
      });

      it("should revert", async () => {
        await expect(contract.connect(addr1).refund())
          .to.be.revertedWith("Funding period not finished yet");
      });
    });

    describe("With time passed but nothing pledged before", () => {
      beforeEach(async () => {
        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("Should revert", async () => {
        await expect(contract.connect(addr1).refund())
          .to.be.revertedWith("Nothing to refund");
      });
    });

    describe("With time passed and funding goal achieved", () => {
      beforeEach(async () => {
        // supply funds
        const value = ethers.utils.parseEther("15.0");
        await contract.connect(addr1).pledge(value, {value: value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("Should revert", async () => {
        await expect(contract.connect(addr1).refund())
          .to.be.revertedWith("Funding goal achieved already");
      });
    });

    describe("With not enough funding and time passed", () => {
      beforeEach(async () => {
        // supply funds
        const addr1Value1 = ethers.utils.parseEther("5.0");
        const addr1Value2 = ethers.utils.parseEther("1.0");
        const addr2Value = ethers.utils.parseEther("3.0");
        await contract.connect(addr1).pledge(addr1Value1, {value: addr1Value1});
        await contract.connect(addr1).pledge(addr1Value2, {value: addr1Value2});
        await contract.connect(addr2).pledge(addr2Value, {value: addr2Value});

        // move forward in time to simulate funding end
        const fourDays = 4 * 24 * 60 * 60;
        await ethers.provider.send('evm_increaseTime', [fourDays]);
        await ethers.provider.send('evm_mine');
      });

      it("Should refund", async () => {
        await expect(await contract.connect(addr1).refund())
          .to.changeEtherBalance(addr1, ethers.utils.parseEther("6.0"));
      });

      it("Should emit PledgeRefunded event", async () => {
        await expect(contract.connect(addr1).refund())
          .to.emit(contract, "PledgeRefunded")
          .withArgs(addr1.address, ethers.utils.parseEther("6.0"));
      });

      describe("And already refunded", () => {
        beforeEach(async () => {
          await contract.connect(addr1).refund();
        });

        it("Should fail to refund again", async () => {
          await expect(contract.connect(addr1).refund())
            .to.be.revertedWith("Nothing to refund");
        });
      });
    });
  });
});
