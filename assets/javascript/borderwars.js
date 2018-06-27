$(document).ready(function() {

    // game characters arrar are global variables 

    var characters = {
        "Asylum Seeker": {
          name: "Asylum Seeker",
          health: 90,
          attack: (Math.floor(Math.random() * (40-10)) + 10),
          imageUrl: "assets/images/bw/asylum-seeker.png",
          enemyAttackBack: (Math.floor(Math.random() * (50-20)) + 20)
        },
        "Refugee Child": {
          name: "Refugee Child",
          health: 75,
          attack: (Math.floor(Math.random() * (20-10)) + 10),
          imageUrl: "assets/images/bw/refugee-child.png",
          enemyAttackBack: (Math.floor(Math.random() * (60-10)) + 10)
        },
        "Jeff Sessions": {
          name: "Jeff Sessions",
          health: 33,
          attack: (Math.floor(Math.random() * (80-40)) + 40),
          imageUrl: "assets/images/bw/jeff-sessions.png",
          enemyAttackBack: (Math.floor(Math.random() * (60-30)) + 30)
        },
        "ICE Agent": {
          name: "ICE Agent",
          health: 50,
          attack: (Math.floor(Math.random() * (70-30)) + 30),
          imageUrl: "assets/images/bw/ice-agent.png",
          enemyAttackBack: (Math.floor(Math.random() * (50-20)) + 10)
        }
      };

    

  // Object to fill selected character information
  var player;
  // Populated with all the characters the player didn't select.
  var battleground = [];
  // Will be populated when the player chooses an opponent.
  var defender;
  // Will keep track of turns during combat. Used for calculating player damage.
  var battleCount = 1;
  // Tracks number of defeated opponents.
  var winCount = 0;

  // FUNCTIONS
  // ===================================================================

  // This function will render a character card to the page.
  // The character rendered, the area they are rendered to, and their status is determined by the arguments passed in.
  var createCharacter = function(character, buildBattlefield) {
    // This block of code builds the character card, and renders it to the page.
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(buildBattlefield).append(charDiv);
  };

  // this function will load all the characters into the character section to be selected
  var startGame = function() {
    // Loop through the characters object and call the createCharacter function on each character to render their card.
    for (var key in characters) {
      createCharacter(characters[key], "#characters-section");
    }
  };

  // remember to run the function here
  startGame();

  // This function handles updating the selected player or the current defender. If there is no selected player/defender this
  // function will also place the character based on the battlefield chosen (e.g. #selected-character or #defender)
  var updateCharacter = function(charObj, battlefield) {
    // First we empty the area so that we can re-render the new object
    $(battlefield).empty();
    createCharacter(charObj, battlefield);
  };

  // This function will render the available-to-attack enemies. This should be run once after a character has been selected
  var createEnemies = function(enemyArr) {
    for (var i = 0; i < enemyArr.length; i++) {
      createCharacter(enemyArr[i], "#available-to-attack-section");
    }
  };

  // Function to handle rendering game messages.
  var renderMessage = function(message) {
    // Builds the message and appends it to the page.
    var gameMessageSet = $("#game-message");
    var newMessage = $("<div>").text(message);
    gameMessageSet.append(newMessage);
  };

  // Function which handles restarting the game after victory or defeat.
  var restartGame = function(resultMessage) {
    // When the 'Restart' button is clicked, reload the page.
    var restart = $("<button>Restart</button>").click(function() {
      location.reload();
    });

    // Build div that will display the victory/defeat message.
    var gameState = $("<div>").text(resultMessage);

    // Render the restart button and victory/defeat message to the page.
    $("body").append(gameState);
    $("body").append(restart);
  };

  // Function to clear the game message section
  var clearMessage = function() {
    var gameMessage = $("#game-message");

    gameMessage.text("");
  };

  // ===================================================================

  // On click event for selecting our character.
  $("#characters-section").on("click", ".character", function() {
    // Saving the clicked character's name.
    var name = $(this).attr("data-name");

    // If a player character has not yet been chosen...
    if (!player) {
      // We populate player with the selected character's information.
      player = characters[name];
      // We then loop through the remaining characters and push them to the battleground array.
      for (var key in characters) {
        if (key !== name) {
          battleground.push(characters[key]);
        }
      }

      // Hide the character select div.
      $("#characters-section").hide();

      // Then render our selected character and our battleground.
      updateCharacter(player, "#selected-character");
      createEnemies(battleground);
    }
  });

  // Creates an on click event for each enemy.
  $("#available-to-attack-section").on("click", ".character", function() {
    // Saving the opponent's name.
    var name = $(this).attr("data-name");

    // If there is no defender, the clicked enemy will become the defender.
    if ($("#defender").children().length === 0) {
      defender = characters[name];
      updateCharacter(defender, "#defender");

      // remove element as it will now be a new defender
      $(this).remove();
      clearMessage();
    }
  });

  // When you click the attack button, run the following game logic...
  $("#attack-button").on("click", function() {
    // If there is a defender, combat will occur.
    if ($("#defender").children().length !== 0) {
      // Creates messages for our attack and our opponents counter attack.
      var attackMessage = "You attacked " + defender.name + " for " + player.attack * battleCount + " damage.";
      var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
      clearMessage();

      // Reduce defender's health by your attack value.
      defender.health -= player.attack * battleCount;

      // If the enemy still has health..
      if (defender.health > 0) {
        // Render the enemy's updated character card.
        updateCharacter(defender, "#defender");

        // Render the combat messages.
        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        // Reduce your health by the opponent's attack value.
        player.health -= defender.enemyAttackBack;

        // Render the player's updated character card.
        updateCharacter(player, "#selected-character");

        // If you have less than zero health the game ends.
        // We call the restartGame function to allow the user to restart the game and play again.
        if (player.health <= 0) {
          clearMessage();
          restartGame("You've lost the battle but the struggle continues.");
          $("#attack-button").off("click");
        }
      }
      else {
        // If the enemy has less than zero health they are defeated.
        // Remove your opponent's character card.
        $("#defender").empty();

        var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
        renderMessage(gameStateMessage);

        // Increment your kill count.
        winCount++;

        // If you have killed all of your opponents you win.
        // Call the restartGame function to allow the user to restart the game and play again.
        if (winCount >= battleground.length) {
          clearMessage();
          $("#attack-button").off("click");
          restartGame("The huddled masses still breathe free!!!!! Continue the struggle?");
        }
      }
      // Increment turn counter. This is used for determining how much damage the player does.
      battleCount++;
    }
    else {
      // If there is no defender, render an error message.
      clearMessage();
      renderMessage("Vanquishment!");
    }
  });
});

