// buff buttons need to be disabled when game ends
// features to add:
//When reset button pressed mult times, attack buttons disabledonce attack takes place, per turn.
//new UI... more compact
//allow health buff to take effect over time



let health,
  autoAttack,
  choice,
  noBuffsThisTurn,
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
  isArtificial,
  strengthCount;

resetGame(); //load all game presets

document
  .querySelector(`#attack-${whichPlayer}`) //attack button; highlighted based on which player is active
  .addEventListener("click", attack);

document.getElementById("reset").addEventListener("click", resetGame); // reset button

//player selects to play against the CPU; non selected player now is CPU
document.getElementById(`CPU`).addEventListener("click", function () {
  if (whichPlayer === 0) {
    document.getElementById(`h2-player-1`).textContent = "CPU";
    isArtificial[1] = true;
  } else {
    document.getElementById(`h2-player-0`).textContent = "CPU";
    isArtificial[0] = true;
  }
});
/*****************
 *
 * Attack button is pressed
 *
 * ***************/

function attack() {
  //autmoates the attack button
  //disables the attack/reset/buff buttons while setInterval threeTurns() is in progess

  document.getElementById(`attack-${whichPlayer}`).disabled = true;
  document.getElementById(`reset`).disabled = true;
  for (var i = 0; i < buffs.length; i++) {
    buffs[i].disabled = true;
  }

  autoAttack = setInterval(threeTurns, 1000);
}

function threeTurns() {
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
  buffHeart = [false, false];
  buffShield = [false, false];
  buffStrength = [false, false];
  isArtificial = [false, false];
  hitValue = [10, 10];
  healthCount = [0, 0];
  shieldCount = [0, 0];
  strengthCount = [0, 0];
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

  //icons set for buff selection
  buffs = document.querySelectorAll(".buff");
  for (var i = 0; i < buffs.length; i++) {
    buffs[i].classList.remove("inactiveBuff");
    buffs[i].disabled = false;
  }

  //set up icons for mini active buffs, opaque when not active, controlled
  //dynamically through the buffControl() function
  activeBuffs = document.querySelectorAll(`.icon-active-buff`);
  for (var i = 0; i < activeBuffs.length; i++) {
    activeBuffs[i].classList.add("inactiveBuff");
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

  clearInterval(autoAttack); // stop auto attack of previous player
  turnCount = 0;
  document.getElementById(`reset`).disabled = false; // re-enable reset button for next player
  for (var i = 0; i < buffs.length; i++) {
    //re-enable buffs
    buffs[i].disabled = false;
  }

  console.log(`nextPlayer() called, var whichPlayer = ${whichPlayer}.`);

  if (isArtificial[whichPlayer] === true) {
    //check to see if opponent is using the AI
    artificialPlayer();
  }
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
  document.getElementById(`reset`).disabled = false;
  document.getElementById(`attack-0`).disabled = true;
  document.getElementById(`attack-1`).disabled = true;

  console.log(`endGame(), GAME OVER!`);
  return;
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

        buffHeart[whichPlayer] = true;
        buffControl();
        nextPlayer();
      } else if (
        this.id === `shield-${whichPlayer}` &&
        whichPlayer === whichPlayer
      ) {
        if (whichPlayer === 0) {
          hitValue[1] = 4; // lower the hitValue of offensive player for perceived gain in defense for the defensive player
          if (buffStrength[1] === true) {
            hitValue[1] = 12; // if offensive player has strength active, set to 12 as median between defense and strength
          }
        } else {
          hitValue[0] = 4;
          if (buffStrength[0] === true) {
            hitValue[0] = 12;
          }
        }
        console.log(`(Player ${whichPlayer}) selected the sheild buff`);

        buffShield[whichPlayer] = true;
        buffControl();
        nextPlayer();
      } else if (
        this.id === `strength-${whichPlayer}` &&
        whichPlayer === whichPlayer
      ) {
        hitValue[whichPlayer] = 20;
        // if shield was selected before strength, then set hitValue to 12 as above as a median
        if (buffShield[0] === true && hitValue[1] === 20) {
          hitValue[whichPlayer] = 12;
        } else if (buffShield[1] === true && hitValue[0] === 20) {
          hitValue[whichPlayer] = 12;
        }
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
 
  /****************************/

function buffControl() {
  // changes the active mini buff icons dynamically; defaults located under resetGame()
  if (buffShield[whichPlayer] === true) {
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
  shieldControl(); // conditions in these functions are checked on every button click
  strengthControl(); //*****************************************************************/
  healthControl();
}

//check conditions for health buff
function healthControl() {
  if (buffHeart[whichPlayer] === true) {
    document.getElementById(`heart-${whichPlayer}`).disabled = true; //icon can not be selected
    document
      .getElementById(`heart-${whichPlayer}`)
      .classList.add("inactiveBuff"); // make icon clear
    healthCount[whichPlayer]++;
  }

  if (healthCount[whichPlayer] >= 20) {
    buffHeart[whichPlayer] = false;
    healthCount[whichPlayer] = 0;

    document.getElementById(`heart-${whichPlayer}`).disabled = false;

    document
      .getElementById(`heart-${whichPlayer}`)
      .classList.remove("inactiveBuff");
  }
}

//check conditions for shield buff
function shieldControl() {
  if (buffShield[whichPlayer] === true) {
    document.getElementById(`shield-${whichPlayer}`).disabled = true;
    document
      .getElementById(`shield-${whichPlayer}`)
      .classList.add("inactiveBuff"); //make icon clear

    shieldCount[whichPlayer]++;
  }
  if (shieldCount[whichPlayer] >= 9) {
    shieldCount[whichPlayer]++;
    if (whichPlayer === 0) {
      hitValue[1] = 10;
    } else {
      hitValue[0] = 10; // reinstate original hit value for opposing player
    }

    //after 15 turns, buff icon available for use again; set to false
    if (shieldCount[whichPlayer] >= 15) {
      buffShield[whichPlayer] = false;
      shieldCount[whichPlayer] = 0;
      document.getElementById(`shield-${whichPlayer}`).disabled = false;
      document
        .getElementById(`shield-${whichPlayer}`)
        .classList.remove("inactiveBuff");
    }
  }
}

//check conditions for strength buff 
function strengthControl() {
  //when buffStrength is true
  if (buffStrength[whichPlayer] === true) {
    document.getElementById(`strength-${whichPlayer}`).disabled = true; //button disabled
    document
      .getElementById(`strength-${whichPlayer}`)
      .classList.add("inactiveBuff"); //make icon clear

    strengthCount[whichPlayer]++;
    console.log(`str count:${strengthCount[whichPlayer]}`);
  }
  // as above; after 9 turns, buff no longer active;
  if (strengthCount[whichPlayer] >= 9) {
    strengthCount[whichPlayer]++;
    if (whichPlayer === 0) {
      hitValue[whichPlayer] = 10;
    } else {
      hitValue[whichPlayer] = 10;
    }

    //after 15 turns, buff icon available for use again; set to false
    if (strengthCount[whichPlayer] >= 15) {
      buffStrength[whichPlayer] = false;
      strengthCount[whichPlayer] = 0;
      document
        .getElementById(`strength-${whichPlayer}`)
        .classList.remove("inactiveBuff");
      console.log(`str count:${strengthCount[whichPlayer]}`);
    }
  }
}

/*********
 *
 * AI
 * Playing against the computer
 */

function artificialPlayer() {
  choice = Math.floor(Math.random() * 100);

  console.log(`${health[whichPlayer]} health`);
  console.log(choice);

  //check health
  if (health[whichPlayer] === 100) {
    if (choice > 10 && choice <= 45) {
      artificialStrength(); //choose strength
    } else if (choice > 45) {
      artificialShield(); //choose shield
    } else {
      // up to 10% chance of AI attacking
      attack();
    }
  }
  //check health between 75 && 100
  if (health[whichPlayer] >= 75 && health[whichPlayer] < 100) {
    if (choice <= 33) {
      attack();
    } else if (choice > 33 && choice < 66) {
      artificialStrength();
    } else if (choice >= 66) {
      artificialShield();
    }
  }
  //check health between 50 && 75
  if (health[whichPlayer] >= 50 && health[whichPlayer] < 75) {
    if (choice <= 10) {
      //10% chance of selecting to heal itself
      artificialHealth();
    } else if (choice > 10 && choice <= 40) {
      attack();
    } else if (choice > 40 && choice <= 70) {
      artificialStrength();
    } else if (choice > 70) {
      artificialShield();
    }
  }
  //check health between 25 && 50
  if (health[whichPlayer] >= 25 && health[whichPlayer] < 50) {
    if (choice <= 30) {
      artificialHealth();
    } else if (choice > 30 && choice <= 53) {
      attack();
    } else if (choice > 53 && choice <= 76) {
      artificialStrength();
    } else if (choice > 76) {
      artificialStrength();
    }
  }
  //check health between 10 && 25
  if (health[whichPlayer] >= 10 && health[whichPlayer] < 25) {
    if (choice <= 75) {
      artificialHealth();
    } else if (choice > 75 && choice <= 83) {
      attack();
    } else if (choice > 83 && choice <= 91) {
      artificialStrength();
    } else if (choice > 91) {
      artificialStrength();
    }
  }

  //check health below 10
  if (health[whichPlayer] < 10) {
    artificialHealth();
  }
}

//function used by AI to determine which action to take based on num

//AI chose health buff
function artificialHealth() {
  // if buffHeart is active; attempt to apply the shield else attack opponent
  //************this section is buggy********/
  if (buffHeart[whichPlayer] === true && buffShield[whichPlayer] === true) {
    attack();
    console.log(`AI has chosen to attack`);
    return;
  } else if (
    buffHeart[whichPlayer] === true &&
    buffShield[whichPlayer] === false
  ) {
    buffShield[whichPlayer] === true;
    console.log(`AI has chosen to apply the shield`);
  }

  buffHeart[whichPlayer] = true;
  document.getElementById(`heart-${whichPlayer}`).classList.add("inactiveBuff");
  health[whichPlayer] += 50;
  if (health[whichPlayer] > 100) {
    //if health is over 100, set it to 100
    health[whichPlayer] = 100;
  }
  document
    .getElementById(`meter-${whichPlayer}`)
    .setAttribute("value", health[whichPlayer]);
  document.getElementById(`health-num-${whichPlayer}`).textContent =
    health[whichPlayer]; // health numerical display
  console.log(`AI has chosen to heal itself`);
  buffControl();
  nextPlayer();
}

//AI chose str buff
function artificialStrength() {
  if (buffStrength[whichPlayer] === true) {
    attack();
    console.log(`AI has selected attack`);
    return;
  }

  //make stength buff active
  buffStrength[whichPlayer] = true;
  document
    .getElementById(`strength-${whichPlayer}`)
    .classList.add("inactiveBuff");
  console.log(`AI chose Str`);
  buffControl();
  nextPlayer();
}

//AI chose shield buff
function artificialShield() {
  if (buffShield[whichPlayer] === true) {
    attack();
    console.log(`AI has selected attack`);
    return;
  }

  //make shield buff active
  buffShield[whichPlayer] = true;
  console.log(`AI chose shield`);
  buffControl();
  nextPlayer();
}
