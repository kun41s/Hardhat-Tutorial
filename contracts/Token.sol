//SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.7.0 < 0.9.0;
import "hardhat/console.sol";

contract Token {
    string public name = "Hardhat Token";
    string public symbol = "HHT";
    uint public totalSupply = 1000000;      //given total supply of tokens
    address public owner;

    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = totalSupply;     //initializing total supply to owner
        owner = msg.sender;                     //owner is the creator who deploy contract
    }

    function transfer(address to, uint amount) external {
        console.log("Sender balance is %s tokens:",balances[msg.sender]);
        console.log("Sender is sending %s tokens to %s address", amount, to);

        require(balances[msg.sender] >= amount, "Not Enough Tokens");   //amount is must be greater than the account balance
        balances[msg.sender] -= amount;     //removing amount from account after transffering tokens
        balances[to] += amount;             //adding amount to senders address
    } 

    function balanceOf(address account) public view returns(uint) {
        return balances[account];           //getting balance of account
    }
}