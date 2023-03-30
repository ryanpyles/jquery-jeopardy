// Load the Jeopardy.json file
const jeopardy = JSON.parse(fs.readFileSync("Jeopardy.json"));

// Create a game board
const gameBoard = document.createElement("div");
gameBoard.id = "game-board";

// Add the columns to the game board
for (const category of jeopardy.categories) {
  const column = document.createElement("div");
  column.id = category;
  column.style.width = "200px";
  gameBoard.appendChild(column);
  for (const question of jeopardy[category]) {
    const questionElement = document.createElement("div");
    questionElement.id = question;
    questionElement.innerText = question.question;
    questionElement.style.fontSize = "18px";
    column.appendChild(questionElement);
  }
}

// Add the value of each question to the game board
for (const question of jeopardy.questions) {
  const value = document.createElement("span");
  value.id = question.value;
  value.innerText = question.value;
  gameBoard.appendChild(value);
}

// Add a click event listener to each question
for (const questionElement of gameBoard.querySelectorAll("div.question")) {
  questionElement.addEventListener("click", function(event) {
    // Get the value of the question
    const value = event.target.id;

    // Get the answer
    const answer = event.target.innerText;

    // Check if the answer is correct
    if (answer === jeopardy[value].answer) {
      // Add the value of the question to the user's score
      gameBoard.getElementById(value).innerText += " " + jeopardy[value].value;
    } else {
      // Deduct the value of the question from the user's score
      gameBoard.getElementById(value).innerText -= " " + jeopardy[value].value;
    }
  });
}

// Add a start button to the game board
const startButton = document.createElement("button");
startButton.id = "start-button";
startButton.innerText = "Start Game";
gameBoard.appendChild(startButton);

// Add an event listener to the start button
startButton.addEventListener("click", function() {
  // Start the game
  gameStart();
});

// Start the game
function gameStart() {
  // Get the user's name
  const userName = prompt("Enter your name: ");

  // Initialize the user's score
  const score = 0;

  // Start the game loop
  while (true) {
    // Get the current question
    const question = gameBoard.getElementById(Math.random() * jeopardy.questions.length);

    // Get the answer
    const answer = prompt("Enter your answer: ");

    // Check if the answer is correct
    if (answer === jeopardy[question].answer) {
      // Add the value of the question to the user's score
      score += jeopardy[question].value;
    } else {
      // Deduct the value of the question from the user's score
      score -= jeopardy[question].value;
    }

    // Show the user's score
    document.getElementById("score").innerText = score;

    // Get the next question
    question = gameBoard.getElementById(Math.random() * jeopardy.questions.length);
  }

  // Display the final score
  document.getElementById("score").innerText = score;
}