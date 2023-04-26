const gameBoard = $("#board");
const scoreDisplay = $("#score-display");
const startButton = $(".start-button");
const apiUrl = "jeopardy.json";

let score = 0;

function updateScore(points) {
  score += points;
  scoreDisplay.text(score);
}

function levenshteinDistance(a, b) {
  const matrix = [];

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }

  return matrix[b.length][a.length];
}

function compareAnswers(userAnswer, correctAnswer) {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

  const distance = levenshteinDistance(normalizedUserAnswer, normalizedCorrectAnswer);
  const similarity = 1 - distance / Math.max(normalizedUserAnswer.length, normalizedCorrectAnswer.length);

  return similarity >= 0.85;
}

function loadData(callback) {
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load data.");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to load data. Please try again later.");
    });
}

function createGameBoard(questions) {
  gameBoard.empty();

  const showNumbers = [...new Set(questions.map((q) => q.showNumber))];
  const randomShowNumber = showNumbers[Math.floor(Math.random() * showNumbers.length)];
  const showQuestions = questions.filter((q) => q.showNumber === randomShowNumber && q.round === "Jeopardy!");
  const categories = [...new Set(showQuestions.map((q) => q.category))];

  categories.forEach((category) => {
    const categoryQuestions = showQuestions.filter((q) => q.category === category);
    categoryQuestions.sort((a, b) => parseInt(a.value.slice(1)) - parseInt(b.value.slice(1)));

    const categoryDiv = $("<div class='column'></div>");
    categoryDiv.append(`<div class='cell header'>${category}</div>`);

    categoryQuestions.forEach((question) => {
      const {value, question: questionPrompt, answer } = question;
      const points = parseInt(value.slice(1));

      const cell = $(`<div class='cell'>${value}</div>`);
      cell.on("click", () => {
        const userAnswer = prompt(questionPrompt);
        if (userAnswer !== null) {
          const isCorrect = compareAnswers(userAnswer, answer)
          if (isCorrect) {
            alert("Correct!");
            updateScore(points);
          } else {
            alert(`Incorrect! The correct answer is: ${answer}`);
          }
          cell.addClass("disabled answered");
          cell.off("click");

          if (gameBoard.find(".cell:not(.header):not(.answered)").length === 0) {
            gameBoard.trigger("roundFinished");
          }
        }
      });
      categoryDiv.append(cell);
    });

    gameBoard.append(categoryDiv);
  });
}

function startGame() {
  loadData((data) => {
    createGameBoard(data);
  });
}

startButton.on("click", () => {
  startGame();
});

