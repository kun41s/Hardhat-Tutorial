const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", () => {
    let Token, hardHatToken, owner, addr1, addr2, addrs;
    
    beforeEach(async () => {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardHatToken = await Token.deploy();
    });

    describe("Deployment", () => {
        it("should set the right owner", async () => {
            expect(await hardHatToken.owner()).to.equal(owner.address);
        });

        it("should assign the total supply of tokens to the owner", async () => {
            const ownerBalance = await hardHatToken.balanceOf(owner.address);
            expect(await hardHatToken.totalSupply()).to.equal(ownerBalance);
        })
    });

    describe("Transactions", () => {
        it("should transfer tokens between accounts", async () => {
            await hardHatToken.transfer(addr1.address, 10000);  //transferring from owner to address1
            const addr1Balance = await hardHatToken.balanceOf(addr1.address);
            expect(await addr1Balance).to.equal(10000);

            await hardHatToken.connect(addr1).transfer(addr2.address, 5000);
            const addr2Balance = await hardHatToken.balanceOf(addr2.address);
            expect(await addr2Balance).to.equal(5000);
        });

        it("Should fail if sender does not have enough balance", async () => {
            const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);
            await expect(hardHatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not Enough Tokens");
            expect(await hardHatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        })

        it("Should update the balance after transfer", async () => {
            const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);
            await hardHatToken.transfer(addr1.address, 5000);
            await hardHatToken.transfer(addr2.address, 5000);

            const finalBalanceOfOwner = await hardHatToken.balanceOf(owner.address);
            expect(finalBalanceOfOwner).to.equal(initialOwnerBalance - 10000);

            const addr1Balance = await hardHatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5000);

            const addr2Balance = await hardHatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(5000);
        })
    })
});