// buff buttons need to be disabled when game ends
//When reset button pressed mult times, attack buttons disabled

let health,
  activeGame,
  activeBuffs,
  whichPlayer,
  attackValue,
  turnCount,
  resetCounter,
  buffs,
  buffCount,
  buffHeart,
  buffShield,
  buffStrength,
  hitValue,
  healthCount,
  shieldCount,
  strengthCount;

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
  if (whichPlayer === 0) {
    attackValue = Math.floor(Math.random() * hitValue[whichPlayer]); //Set the attackValue

    health[1] = health[1] - attackValue; //Depending on the current player, remove attackValue from health of opposing player

    if (health[1] <= 0) {
      health[1] = 0;

      console.log(`(Player 1) hit a ${attackValue}.`);

      console.log(`Player 2 has ${health[1]} health left.`);

      console.log(`(Player 1) is the winner!`);

      document.getElementById(`meter-1`).value = health[1];

      document.getElementById(`health-num-1`).textContent = health[1]; // health numerical display

      endGame();

      return; // end function early
    }

    document.getElementById(`meter-1`).value = health[1];

    document.getElementById(`health-num-1`).textContent = health[1]; // health numerical display

    console.log(`(Player 1) hit a ${attackValue}.`);

    console.log(`Player 2 has  ${health[1]} health left.`);

    turnCount++; //Increase by 1 until 3 is reached, nextPlayer() called

    if (turnCount === 3) {
      document.getElementById(`attack-0`).disabled = true;

      console.log(`Three turns have occured. Oppenent is next.`);

      nextPlayer();
    }
  } else {
    attackValue = Math.floor(Math.random() * hitValue[whichPlayer]); //Set the attackValue

    health[0] = health[0] - attackValue; //Player 2's turn

    if (health[0] <= 0) {
      health[0] = 0;

      console.log(`(Player 2) hit a ${attackValue}`);

      console.log(`Player 1 has ${health[0]} health left.`);

      console.log(`(Player 2) is the winner!`);

      document.getElementById(`meter-0`).value = health[0];

      document.getElementById(`health-num-0`).textContent = health[0]; // health numerical display

      endGame();

      return; //end function early
    }

    document.getElementById(`meter-0`).value = health[0];

    document.getElementById(`health-num-0`).textContent = health[0]; // health numerical display

    console.log(`(Player 2) hit a ${attackValue}`);

    console.log(`Player 1 has ${health[0]} health left.`);

    turnCount++;

    if (turnCount === 3) {
      console.log(`Three turns have occured. Oppenent is next.`);

      document.querySelector(`#attack-1`).disabled = true;

      nextPlayer();
    }
  }
  buffControl(); //buff conditions checked on every click
}

/***********
 *
 * Reset the game
 *
 *********/

function resetGame() {
  getBuffs(); // enable buff buttons

  health = [100, 100];
  (buffHeart = [false, false]),
    (buffShield = [false, false]),
    (buffStrength = [false, false]),
    (hitValue = [10, 10]),
    (healthCount = [0, 0]),
    (shieldCount = [0, 0]),
    (strengthCount = [0, 0]);
  turnCount = 0;

  whichPlayer = Math.floor(Math.random() * 2); // choose randomly which player to go first

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
  document.getElementById(`meter-0`).setAttribute("value", health[0]);
  document.getElementById(`meter-1`).setAttribute("value", health[1]);
  document.getElementById(`health-num-0`).textContent = health[1]; // health numerical display
  document.getElementById(`health-num-1`).textContent = health[0]; // health numerical display

  //ensure winner class has been removed from previous game
  document.getElementById(`player-0`).classList.remove("winner");
  document.getElementById(`player-1`).classList.remove("winner");

  document.getElementById(`h2-player-0`).textContent = "Player 1";
  document.getElementById(`h2-player-1`).textContent = "Player 2";

  //set up icons for mini active buffs, opaque when not active, controlled
  //dynamically through the buffControl() function
  activeBuffs = document.querySelectorAll(`.icon-active-buff`);
  for (var i = 0; i < activeBuffs.length; i++) {
    activeBuffs[i].classList.add("inactiveBuff");

    toggleButtons();
  }
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

    document.getElementById(`attack-0`).disabled = true; // 1st player attack button disabled

    document.getElementById(`player-1`).classList.add(`activePlayer`);
    document.getElementById(`player-0`).classList.remove(`activePlayer`);
  } else {
    whichPlayer--;

    document.getElementById(`attack-0`).disabled = false;
    document.getElementById(`attack-0`).addEventListener("click", attack); // 1st player attack button active

    document.getElementById(`attack-1`).disabled = true; //2nd player attack button disabled

    document.getElementById(`player-0`).classList.add("activePlayer");
    document.getElementById(`player-1`).classList.remove("activePlayer");
  }

  turnCount = 0;
  console.log(`nextPlayer() called, var whichPlayer = ${whichPlayer}.`);
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
  } else if (health[0] === 0 || health[1] === 0) {
    document.getElementById(`attack-0`).disabled = true;
    document.getElementById(`attack-1`).disablde = true;
    return;
  }
}

function getBuffs() {
  buffs = document.querySelectorAll(".buff");

  for (var i = 0; i < buffs.length; i++) {
    buffs[i].addEventListener("click", function () {
      if (this.id === `heart-${[whichPlayer]}` && whichPlayer === whichPlayer) {
        health[whichPlayer] = health[whichPlayer] + 50;
        if (health[whichPlayer] > 100) {
          health[whichPlayer] = 100;
        }
        document
          .getElementById(`meter-${whichPlayer}`)
          .setAttribute("value", health[whichPlayer]);
        document.getElementById(`health-num-${whichPlayer}`).textContent =
          health[whichPlayer];
        document
          .getElementById(`heart-${whichPlayer}`)
          .classList.add("inactiveBuff");
        buffHeart[whichPlayer] = true;
        buffControl();
        nextPlayer();
      } else if (
        this.id === `shield-${whichPlayer}` &&
        whichPlayer === whichPlayer
      ) {
        if (whichPlayer === 0) {
          hitValue[1] = 4; // lower the hitValue of offensive player for perceived gain in defense for the defensive player
        } else {
          hitValue[0] = 4;
        }
        console.log(`(Player ${whichPlayer}) selected the sheild buff`);
        document
          .getElementById(`shield-${whichPlayer}`)
          .classList.add("inactiveBuff");
        buffShield[whichPlayer] = true;
        buffControl();
        nextPlayer();
      } else if (
        this.id === `strength-${whichPlayer}` &&
        whichPlayer === whichPlayer
      ) {
        hitValue[whichPlayer] = 20;
        console.log(`(Player ${whichPlayer}) selected the strength buff`);
        buffStrength[whichPlayer] = true;
        buffControl();
        nextPlayer();
      }
    });
  }
}

//****************************
/*Buff conditions are checked by the functions below.
  buffControl(), by default will check the conditions for health
  and will always call the two other functions to check conditions
  for shield and strength
  /****************************/

function buffControl() {
  if (buffHeart[whichPlayer] === true) {
    document.getElementById(`heart-${whichPlayer}`).disabled = true;

    healthCount[whichPlayer]++;

    if (healthCount[whichPlayer] === 33) {
      buffHeart[whichPlayer] = false;

      document.getElementById(`heart-${whichPlayer}`).disabled = false;

      document
        .getElementById(`heart-${whichPlayer}`)
        .classList.remove("inactiveBuff");

      healthCount[whichPlayer] = 0;
    }
  }
  shieldControl(); // conditions in these functions are checked on every button click
  strengthControl(); //*****************************************************************/
  
  if (buffShield[whichPlayer] === true) { // changes the active mini buff icons dynamically; defaults located under resetGame()
    document
      .getElementById(`shield-current-${whichPlayer}`)
      .classList.remove("inactiveBuff");
  } else {
    document
      .getElementById(`shield-current-${whichPlayer}`)
      .classList.add("inactiveBuff");
  }
  if (buffStrength[whichPlayer] === true) {
    document
      .getElementById(`strength-current-${whichPlayer}`)
      .classList.remove("inactiveBuff");
  } else {
    document
      .getElementById(`strength-current-${whichPlayer}`)
      .classList.add("inactiveBuff");
  }
}

function shieldControl() {
  if (buffShield[whichPlayer] === true) {
    document.getElementById(`shield-${whichPlayer}`).disabled = true;

    shieldCount[whichPlayer]++;

    if (shieldCount[whichPlayer] === 9) {
      //after 9 total turns; shield buff no longer active; button still inactive for 33 turns

      if (whichPlayer === 0) {
        hitValue[1] = 10;
      } else {
        hitValue[0] = 10; // reinstate original hit value for opposing player
      }
      console.log(`Shield no longer active`);
    } else if (shieldCount[whichPlayer] === 33) {
      // make shield buff available to use again
      shieldCount[whichPlayer] = 0;
      buffShield[whichPlayer] === false;
      document.getElementById(`shield-${whichPlayer}`).disabled = false;
      document
        .getElementById(`shield-${whichPlayer}`)
        .classList.remove("inactiveBuff");
    }
  }
}

function strengthControl() {
  if (buffStrength[whichPlayer] === true) {
    document.getElementById(`strength-${whichPlayer}`).disabled = true; //button disabled
    document
      .getElementById(`strength-${whichPlayer}`)
      .classList.add("inactiveBuff");

    strengthCount[whichPlayer]++;
    // as above; after 9 turns, buff no longer active
    if (strengthCount[whichPlayer] === 9) {
      buffStrength[whichPlayer] = false;

      document.getElementById(`strength-${whichPlayer}`).disabled = false;

      if (whichPlayer === 0) {
        hitValue[whichPlayer] = 10;
      } else {
        hitValue[whichPlayer] = 10;
      }
      if (strengthCount[whichPlayer] === 33) {
        strengthCount[whichPlayer] = 0;
        buffStrength = false;
        document
          .getElementById(`strength-${whichPlayer}`)
          .classList.remove("inactiveBuff");
      }
    }
  }
}
