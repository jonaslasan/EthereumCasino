pragma solidity ^0.5.0;

contract Igralnica {

    string constant Author = "Jonas Lasan";
    string constant Data = "April 20, 2019";

    address payable Owner;

    constructor () public {
        Owner = msg.sender;
    }

    uint EntranceFee = 0.05 ether;
    function getEntranceFee () public view returns (uint)
    {
        return EntranceFee;
    }

    // Automatically paid to casino owner
    uint casinoFee = 0.0050 ether;
    function getCasinoFee () public view returns (uint)
    {
        return casinoFee;
    }


    // Time limit to reveal your number after the first player (in number of blocks)
    uint timeLimit = 5760;

    enum GameState
    {
        AcceptingSignatures,
        AcceptingValues,
        End
    }

    struct Game
    {
        GameState state;

        uint gameStartBlock;

        uint PlayerCounter;
        uint RevealedNumbersCounter;

        bytes[2] DigitalSignatures;
        bytes32[2] Hashes;


        address payable[2] PlayerAddresses;

        mapping (address => uint) PlayerIndex;
        mapping (address => bool) PlayerExists;

        mapping (address => bool) PlayerAlreadyRevealed;

        // End state
        bytes32 Xor;
        uint DecimalValue;
        uint WinnerIndex;
    }

    uint gamesCounter = 1;
    mapping (uint => Game) AllGames;


    /*-- Data getters / queries --*/

    /* - Player queries (based on sender address) - */
    function getMyGameStartBlock() public view returns (uint)
    {
        uint gameId = myGame[msg.sender];

        require (gameId > 0, "Uporabnik trenutno ni v igri.");

        Game memory game = AllGames[gameId];
        return game.gameStartBlock;
    }
    function getMyIndex() public view returns (uint)
    {
        uint gameId = myGame[msg.sender];

        require (gameId > 0, "Uporabnik trenutno ni v igri.");

        Game storage game = AllGames[gameId];
        return game.PlayerIndex[msg.sender];
    }
    function getMyTimeLimit() public view returns (uint)
    {
        uint gameId = myGame[msg.sender];

        require (gameId > 0, "Uporabnik trenutno ni v igri.");

        Game storage game = AllGames[gameId];
        uint trajanje = (game.gameStartBlock + timeLimit) - block.number;
        if (trajanje < 0)
        {
            trajanje = 0;
        }

        return uint(trajanje);
    }

    function getMyWinner() public view returns(address)
    {
        uint gameId = myGame[msg.sender];

        Game memory game = AllGames[gameId];

        return game.PlayerAddresses[game.WinnerIndex];
    }

    function getMyGameState() public view returns (uint)
    {
        uint gameId = getMyGameId();
        Game storage game = AllGames[gameId];

        GameState state = game.state;

        if (state == GameState.AcceptingSignatures)
        {
            return 0;
        }
        else if (state == GameState.AcceptingValues)
        {
            bool alreadyRevealed = game.PlayerAlreadyRevealed[msg.sender];

            if (!alreadyRevealed){
                return 1;
            }
            else
            {
                // Čakamo druge na razkritje
                return 2;
            }
        }
        else
        {
            // Konec igre
            return 3;
        }
    }

    /* - Deneric queries - */
    function getDigitalSignature (uint gameId, uint playerId) public view returns (bytes memory)
    {
        require (gameId > 0, "Game ID is not valid");

        Game memory game = AllGames[gameId];
        return game.DigitalSignatures[playerId];
    }

    function getHash (uint gameId, uint playerId) public view returns (bytes32)
    {
        require (gameId > 0, "Game ID is not valid");

        Game memory game = AllGames[gameId];
        return game.Hashes[playerId];
    }

    function getPlayerAddress (uint gameId, uint playerId) public view returns (address)
    {
        require (gameId > 0, "ID Igre ni veljaven");

        Game memory game = AllGames[gameId];
        return game.PlayerAddresses[playerId];
    }

    function getXor (uint gameId) public view returns (bytes32)
    {
        require (gameId > 0, "ID Igre ni veljaven");

        Game memory game = AllGames[gameId];
        return game.Xor;
    }

    function getDecimalValue (uint gameId) public view returns (uint)
    {
        require (gameId > 0, "ID Igre ni veljaven");

        Game memory game = AllGames[gameId];

        return game.DecimalValue;
    }

    function getWinnerIndex (uint gameId) public view returns (uint)
    {
        require (gameId > 0, "ID Igre ni veljaven");

        Game memory game = AllGames[gameId];
        return game.WinnerIndex;
    }


    // One player can be present in one game at the time
    mapping (address => uint) myGame;

    function getMyGameId() public view returns(uint)
    {
        return myGame[msg.sender];
    }

    function getGameCount() view public returns(uint)
    {
        return gamesCounter;
    }

    function getContractBalance() public view returns (uint){
        return address(this).balance;
    }

    function EnterTheGame(bytes memory signature) public payable
    {
        require(msg.value >= EntranceFee, "Not enough ether for the entrance fee");

        // We return the ether in case player overpaid
        uint delta = msg.value - EntranceFee;
        msg.sender.transfer(delta);

        // Player must not already be in a game
        require(myGame[msg.sender] == 0, "Player is already in game");

        Game storage game = AllGames[gamesCounter];

        require (game.PlayerCounter < 2, "Game is already full");
        require (game.state == GameState.AcceptingSignatures, "Game is no longer in the satste of accepting signatures");

        game.DigitalSignatures[game.PlayerCounter] = signature;
        game.PlayerIndex[msg.sender] = game.PlayerCounter;
        game.PlayerAddresses[game.PlayerCounter] = msg.sender;

        game.PlayerCounter += 1;

        myGame[msg.sender] = gamesCounter;

        if (game.PlayerCounter >= 2)
        {
            game.state = GameState.AcceptingValues;
            game.gameStartBlock = block.number;
            AllGames[gamesCounter] = game;
            gamesCounter += 1;
        }
        else
        {
            AllGames[gamesCounter] = game;
        }
    }

    function Reveal(bytes32 hash) public returns (address payable)
    {
        uint gameId = myGame[msg.sender];

        require (gameId > 0, "Game ID is not valid");
        require (gameId <= gamesCounter, "Game ID is not valid");

        Game storage game = AllGames[gameId];

        require (game.state == GameState.AcceptingValues, "Game is not in the state of accepting values");
        require (game.PlayerAlreadyRevealed[msg.sender] == false, "Player already revealed his value");

        uint myIndex = game.PlayerIndex[msg.sender];

        // Check that value in fact correlates to the signature
        bytes storage mySignature = game.DigitalSignatures[myIndex];
        address recoveredAddress = recover(hash, mySignature);

        require (recoveredAddress == msg.sender, "Value does not match the signature");

        game.PlayerAlreadyRevealed[msg.sender] = true;
        game.RevealedNumbersCounter += 1;
        game.Hashes[myIndex] = hash;

        if (game.RevealedNumbersCounter == 2)
        {
            // End the game
            game.state = GameState.End;

            // Calculate the winner
            game.Xor = game.Hashes[0] ^ game.Hashes[1];
            game.DecimalValue = uint(game.Xor);
            uint winnerIndex = calculateWinner(gameId);
            game.WinnerIndex = winnerIndex;
        }

        AllGames[gameId] = game;
    }

    function LeaveTheGame() public {

        uint gameId = myGame[msg.sender];

        require(gameId > 0);

        Game storage game = AllGames[gameId];

        require (game.state == GameState.End);

        uint myIndex = game.PlayerIndex[msg.sender];

        // Igralca se sedaj sprostita in lahko pričneta novo igro
        myGame[msg.sender] = 0;

        if (game.WinnerIndex == myIndex)
        {
            uint reward = getReward();

            // Izplačamo nagrado
            address payable winner = game.PlayerAddresses[game.WinnerIndex];

            winner.transfer(reward);
            Owner.transfer(casinoFee);
        }
    }

    function getReward() public view returns (uint)
    {
        return (EntranceFee * 2) - casinoFee;
    }

    function AbortGame() public
    {
        uint myGameId = myGame[msg.sender];

        require(myGameId > 0, "Player is not in any game");

        Game memory game = AllGames[myGameId];
        require (game.state == GameState.AcceptingSignatures, "Game is no longer in entry phase");

        myGame[msg.sender] = 0;

        // Pay back the entrance fee
        msg.sender.transfer(EntranceFee);

        gamesCounter += 1;
    }

    function calculateWinner (uint gameId) public view returns (uint)
    {
        require (gameId > 0, "Game ID is not valid");
        require (gameId <= gamesCounter, "Game ID is not valid");

        Game storage game = AllGames[gameId];

        bytes32 xored = game.Hashes[0] ^ game.Hashes[1];

        uint decimal = uint(xored);

        return decimal % 2;
    }

    /// If other player didn't reveal his value in 24 hours
    function TakeReward() public
    {
        uint gameId = myGame[msg.sender];

        require(gameId > 0);

        Game storage game = AllGames[gameId];

        require (game.state == GameState.AcceptingValues);

        bool hasRevealed = game.PlayerAlreadyRevealed[msg.sender];

        require (hasRevealed == true);

        uint gameEnd = game.gameStartBlock + timeLimit;

        require (block.number >= gameEnd, "Time limit is not over yet");

        uint reward = getReward();

        msg.sender.transfer(reward);
        Owner.transfer(casinoFee);

        address firstPlayer = game.PlayerAddresses[0];
        address secondPlayer = game.PlayerAddresses[1];

        myGame[firstPlayer] = 0;
        myGame[secondPlayer] = 0;
    }


    function recover(bytes32 hash, bytes memory signature)
      public
      pure
      returns (address)
    {
      bytes32 r;
      bytes32 s;
      uint8 v;

      bytes32 newHash = toEthSignedMessageHash(hash);

      // Check the signature length
      if (signature.length != 65) {
        return (address(0));
      }

      // Divide the signature in r, s and v variables with inline assembly.
      assembly {
        r := mload(add(signature, 0x20))
        s := mload(add(signature, 0x40))
        v := byte(0, mload(add(signature, 0x60)))
      }

      // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
      if (v < 27) {
        v += 27;
      }

      // If the version is correct return the signer address
      if (v != 27 && v != 28) {
        return (address(0));
      } else {
        return ecrecover(newHash, v, r, s);
      }
    }

    function toEthSignedMessageHash(bytes32 hash)
      public
      pure
      returns (bytes32)
    {
      return keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
      );
    }
}
