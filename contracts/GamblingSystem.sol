pragma solidity ^0.4.18;


contract GamblingSystem {
    address owner;
    
    struct Player {
       uint amountBet;
       uint numberSelected;
    }
   
    uint numberOfBets;
    uint maxAmountOfBets = 100;
    address[] players;
    
    uint minimumBet;
    uint totalBet;
    
    
    mapping(address => Player) playerInfo;

   function GamblingSystem(uint _minBet){
      owner = msg.sender;
      if(_minBet > 0 ) minimumBet = _minBet;
   }
   
   function bet(uint number) payable{
       assert(checkPlayerExists(msg.sender) == false);
       assert(number >= 1 && number <= 10);
       assert(msg.value >= minimumBet);
       
       playerInfo[msg.sender].amountBet = msg.value;
       playerInfo[msg.sender].numberSelected = number;
       
       numberOfBets += 1;
       players.push(msg.sender);
       totalBet += msg.value;
   }
}