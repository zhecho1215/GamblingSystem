pragma solidity 0.4.20;
contract Bingo {
   address public owner;
   uint256 public totalBet;
   uint256 public allCardsCount;
   uint256 public lastNumber;
   
   uint256 public cardWinner;
   
   uint256[] drawnNumbers;
   address[] public players;
   
   struct Player {
      uint256 cardsCount;
      uint256[] cardsIDs;
   }
   
   mapping(address => Player) public playerInfo;
  
   function() public payable {}
   
   function Bingo() public {
      owner = msg.sender;
   }
   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
   }
   function checkPlayerExists(address player) public constant returns(bool){
      for(uint256 i = 0; i < players.length; i++){
         if(players[i] == player) return true;
      }
      return false;
   }
   
   function buy() public payable {
       
       uint cardsRequested = msg.value/10**15;
      playerInfo[msg.sender].cardsCount = cardsRequested;
      allCardsCount += cardsRequested;
      
      for(uint i=1; i<=cardsRequested; i++)
      {
          playerInfo[msg.sender].cardsIDs.push(allCardsCount+i);
      }
      
      if(!checkPlayerExists(msg.sender))
      {
          players.push(msg.sender);
      }
      totalBet += msg.value;
   }
   
   /*function initiate
   
   // Generates a number between 1 and 75 
   function generateNextNumber() public {
      lastNumber = block.number*block.number*block.timestamp % 75 + 1; // This isn't secure
      drawnNumbers.push(lastNumber);
      checkForWinners();
   }
   function checkForWinners() private {
       for(uint i=0; i < players.length; i++)
       {
           bool isWinner =true;
           for(uint256 j =0; j< playerInfo[players[i]].cardsCount; j++)
           {
               for(uint k=0; k<)
               if(!containing(drawnNumbers, playerInfo[players[i]].numbers[j]))
               {
                   isWinner = false;
                   break;
               }
           }
           
           if(isWinner)
           {
               payPrize(players[i]);
               break;
           }
       }
   }
   
   function containing(uint256[] array, uint256 number)returns (bool) 
   {
        for(uint i=0; i < array.length; i++)
        {
            if(number == array[i])
            {
                return true;
            }
        }
        return false;
   }*/
   
   function resetData() private{
        for(uint256 i = 0; i < players.length; i++){
            delete playerInfo[players[i]]; // Delete all the players
        }
        
       players.length = 0;
       
       totalBet = 0;
       allCardsCount = 0;
    }
   
   // Sends the ether to the winner depending on the total bets
   function payPrize(uint winnerID) public {
        for(uint256 i = 0; i < players.length; i++){
            
            if(playerInfo[players[i]].cardsIDs[0] + playerInfo[players[i]].cardsCount > winnerID && 
                playerInfo[players[i]].cardsIDs[0] <= winnerID){
                
                 players[i].transfer(totalBet);// TODO : probably not the correct way
            }
            
            delete playerInfo[players[i]]; // Delete all the players
        }
        
      
        resetData();
   }
}