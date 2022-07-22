async function main() {
    const [deployer] = await ethers.getSigners();           //get account access
    const Token = await ethers.getContractFactory("Token"); //creating object of token contract
    const token = await Token.deploy();                     //deploy token contract with hardhat
    console.log("Token Address", token.address);
}

main()
    .then(() => process.exit(0))    //if successfully deploy then exit
    .catch((error) => {             //if not deploy and showing error then console the error and exit with false
        console.log(error);
        process.exit(1);
    });