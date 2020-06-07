//Bugs - when player two wins, attack button is not disabled
//health div wont center in CSS
//When reset button pressed mult times, attack buttons disabled
//unable to change background element when winner class applied... not sure why 

var health, whichPlayer, attackValue, turnCount, activeGame, resetCounter;

resetGame(); //load all game presets

document
  .querySelector(`#attack-${whichPlayer}`) //attack button; highlighted based on which player is active
  .addEventListener("click", attack);

document.getElementById("reset").addEventListener("click", resetGame); // reset button

/*****************
 *
 * Attack button is pressed
 *
 * ***************/

function attack() {
  var attackValue = Math.floor((Math.random() * 10)); //Set the attackValue

  if (whichPlayer === 0) {
    health[1] = health[1] - attackValue; //Depending on the current player, remove attackValue from health of opposing player

    if (health[1] <= 0) {
      health[1] = 0;

      console.log(`(Player 1) hit a ${attackValue}.`);

      console.log(`Player 2 has ${health[1]} health left.`);

      console.log(`(Player 1) is the winner!`);

      document.getElementById(`meter-1`).value = health[1];

      endGame();

      return; // end function early
    }

    document.getElementById(`meter-1`).value = health[1];
    
    console.log(`(Player 1) hit a ${attackValue}.`);

    console.log(`Player 2 has  ${health[1]} health left.`);

    turnCount++; //Increase by 1 until 3 is reached, nextPlayer() called

    if (turnCount === 3) {
      document.getElementById(`attack-0`).disabled = true;

      console.log(`Three turns have occured. Oppenent is next.`);

      nextPlayer();
    }
  } else {
    health[0] = health[0] - attackValue; //Player 2's turn

    if (health[0] <= 0) {

      console.log(`(Player 2) hit a ${attackValue}`);

      console.log(`Player 1 has ${health[0]} health left.`);

      console.log(`(Player 2) is the winner!`);

      document.getElementById(`meter-0`).value = health[0];

      endGame();

      return; //end function early
    }

    document.getElementById(`meter-0`).value = health[0];

    console.log(`(Player 2) hit a ${attackValue}`);

    console.log(`Player 1 has ${health[0]} health left.`);

    turnCount++;

    if (turnCount === 3) {
      console.log(`Three turns have occured. Oppenent is next.`);

      document.querySelector(`#attack-1`).disabled = true;

      nextPlayer();
    }
  }
}

/***********
 *
 * Reset the game
 *
 *********/

function resetGame() {
  health = [100, 100];

  turnCount = 0;

  whichPlayer = Math.floor(Math.random() * 2); // choose randomly which player to go first

  console.log(whichPlayer);

  document
    .getElementById(`player-${whichPlayer}`)
    .classList.add(`activePlayer`);

  if (whichPlayer === 0) {
    // make sure activePlayer class applies to active player on reset
    document.getElementById(`player-1`).classList.remove("activePlayer");
    document.getElementById(`attack-0`).disabled = false;
  } else {
    document.getElementById(`player-0`).classList.remove("activePlayer");
    document.getElementById(`attack-1`).disabled = false;
  }
  // update the health meters on reset
  document.getElementById(`meter-0`).setAttribute('value', health[0]);
  document.getElementById(`meter-1`).setAttribute('value', health[1]);

  //ensure winner class has been removed from previous game
  document.getElementById(`player-0`).classList.remove("winner");
  document.getElementById(`player-1`).classList.remove("winner");

  document.getElementById(`h2-player-0`).textContent = "Player 1";
  document.getElementById(`h2-player-1`).textContent = "Player 2";

  toggleButtons();
}

/************
 *
 * Choose the next Player
 *
 ***********/

function nextPlayer() {
  if (whichPlayer === 0) {
    whichPlayer++;

    document.getElementById(`attack-1`).disabled = false;
    document.getElementById(`attack-1`).addEventListener("click", attack); // 2nd player attack button active

    document.getElementById(`player-1`).classList.add(`activePlayer`);
    document.getElementById(`player-0`).classList.remove(`activePlayer`);

    console.log(
      `nextPlayer() called, var whichPlayer = ${whichPlayer}. Output should be Player 2`
    );
  } else {
    whichPlayer--;

    document.getElementById(`attack-0`).disabled = false;
    document.getElementById(`attack-0`).addEventListener("click", attack); // 1st player attack button active

    document.getElementById(`player-0`).classList.add("activePlayer");
    document.getElementById(`player-1`).classList.remove("activePlayer");

    console.log(
      `nextPlayer() called, var whichPlayer = ${whichPlayer}. Output should be Player 1`
    );
  }

  turnCount = 0;
}

/*************
 *
 * End the Game
 *
 **********/

function endGame() {
  document
    .getElementById(`player-${whichPlayer}`)
    .classList.remove("activePlayer"); // remove activePlayer class
  document.getElementById(`player-${whichPlayer}`).classList.add("winner"); // apply winner class to winning player
  document.getElementById(`h2-player-${whichPlayer}`).textContent = "Winner!";
  toggleButtons();
  console.log(`endGame(), GAME OVER!`);
  return;
}

/***************
 *
 * Toggle the Buttons
 *
 ********/

function toggleButtons() {
  if (whichPlayer === 0 && health[1] > 0) {
    // toggles buttons at beginning of game
    document.getElementById(`attack-1`).disabled = true;
  } else if (whichPlayer === 1 && health[0] > 0) {
    document.getElementById(`attack-0`).disabled = true;
  } else if (
    // toggles buttons at the end of the game
    whichPlayer === 0 ||
    (whichPlayer === 1 && health[0] === 0) ||
    health[1] === 0
  ) {
    document.getElementById(`attack-0`).disabled = true;
    document.getElementById(`attack-1`).disablde = true;
    return;
  }
}
