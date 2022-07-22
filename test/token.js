const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", () => {
    let Token, hardHatToken, owner, addr1, addr2, addrs;
    
    beforeEach(async () => {
        Token = await ethers.getContractFactory("Token");   //creating object of Token contract
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();    //get access to accounts
        hardHatToken = await Token.deploy();        //deploy contract on hardhat
    });

    describe("Deployment", () => {
        it("should set the right owner", async () => {
            //check wheather owner of the contract is equal to the owner.address
            expect(await hardHatToken.owner()).to.equal(owner.address);
        });

        it("should assign the total supply of tokens to the owner", async () => {
            const ownerBalance = await hardHatToken.balanceOf(owner.address);   //get owner balance
            expect(await hardHatToken.totalSupply()).to.equal(ownerBalance);    //total supply must be equal to owner balance
        })
    });

    describe("Transactions", () => {
        it("should transfer tokens between accounts", async () => {
            //hardhat already assumes the sender is owner, so we don't need to connect to owner
            await hardHatToken.transfer(addr1.address, 10000);  //transferring from owner to address1, 10000 tokens
            const addr1Balance = await hardHatToken.balanceOf(addr1.address);   //get balance of addr1
            expect(await addr1Balance).to.equal(10000);        //balance of addr1 must be equal to 10000

            //connect to address1 and send tokens to address2
            await hardHatToken.connect(addr1).transfer(addr2.address, 5000);    //transfer 5000 tokens from addr1 to addr2
            const addr2Balance = await hardHatToken.balanceOf(addr2.address);   //get balance of addr2
            expect(await addr2Balance).to.equal(5000);      //balance of addr2 must be 5000 tokens
        });

        it("Should fail if sender does not have enough balance", async () => {
            const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);    //getting owner balance "1000000"
            //connect to addr1 and transfer 1 token to owner, but addr1 have 0 tokens
            //so it will return "Not Enough Tokens"
            await expect(hardHatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("Not Enough Tokens");
            expect(await hardHatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);  //check owner balance is still the initialOwnerBalance or not i.e. "1000000"
        })

        it("Should update the balance after transfer", async () => {
            const initialOwnerBalance = await hardHatToken.balanceOf(owner.address);    //getting initial balance of owner "1000000"
            await hardHatToken.transfer(addr1.address, 5000);   //transfer 5000 tokens to address1
            await hardHatToken.transfer(addr2.address, 5000);   //transfer 5000 tokens to address2

            const finalBalanceOfOwner = await hardHatToken.balanceOf(owner.address);    //get balance after transffering tokens
            expect(finalBalanceOfOwner).to.equal(initialOwnerBalance - 10000);  //balance must be -10000 tokens

            const addr1Balance = await hardHatToken.balanceOf(addr1.address);   //balance of address1
            expect(addr1Balance).to.equal(5000);    

            const addr2Balance = await hardHatToken.balanceOf(addr2.address);   //balance of address2
            expect(addr2Balance).to.equal(5000);
        })
    })
});