$(document).ready(function () {
  const board = $("#board");
  const url = "jeopardy.json";
  const startButton = $(".start-button");
  let score = 0;
  const scoreDisplay = $("#score");

  function updateScore(amount) {
    score += amount;
    scoreDisplay.text(score);
  }

  function getRandomShowNumber(data) {
    const validShowNumbers = new Set();
    const categoriesPerRound = 5;
    const questionsPerCategory = 5;

    const roundData = ["Jeopardy!", "Double Jeopardy!"].map(round =>
      data.filter(item => item.round === round)
    );

    roundData.forEach(roundItems => {
      const showNumberCategories = new Map();

      roundItems.forEach(item => {
        if (!showNumberCategories.has(item.showNumber)) {
          showNumberCategories.set(item.showNumber, new Set());
        }
        showNumberCategories.get(item.showNumber).add(item.category);
      });

      showNumberCategories.forEach((categories, showNumber) => {
        if (categories.size === categoriesPerRound) {
          const questionsPerShowCategory = Array.from(categories).every(category => {
            const categoryQuestions = roundItems.filter(
              item => item.showNumber === showNumber && item.category === category
            );
            return categoryQuestions.length === questionsPerCategory;
          });

          if (questionsPerShowCategory) {
            validShowNumbers.add(showNumber);
          }
        }
      });
    });

    const validShowNumbersArray = Array.from(validShowNumbers);
    return validShowNumbersArray[Math.floor(Math.random() * validShowNumbersArray.length)];
  }

  function startRound(roundNumber) {
    board.empty();

    $.getJSON(url, function (data) {
      const randomShowNumber = getRandomShowNumber(data);
      const roundString = roundNumber === 1 ? "Jeopardy!" : "Double Jeopardy!";

      const filteredData = data.filter(item => item.round === roundString && item.showNumber === randomShowNumber);
      const categoriesMap = new Map();

      filteredData.forEach(item => {
        if (!categoriesMap.has(item.category)) {
          categoriesMap.set(item.category, []);
        }
        categoriesMap.get(item.category).push(item);
      });

      const categories = Array.from(categoriesMap.keys()).slice(0, 5);

      categories.forEach(category => {
        const header = $("<div>").addClass("cell header").text(category);
        board.append(header);
      });

      for (let j = 0; j < 5; j++) {
        categories.forEach((category, index) => {
          const questions = categoriesMap.get(category).sort((a, b) => parseInt(a.value.slice(1)) - parseInt(b.value.slice(1)));
          const cell = $("<div>").addClass("cell").text(questions[j].value);
          const question = $("<span>").addClass("question").text(questions[j].question).appendTo(cell);
          const answer = questions[j].answer;

          cell.on("click", function () {
            let userAnswer = prompt(question.text());
            if (userAnswer && userAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
              alert("Correct!");
              updateScore(parseInt(questions[j].value.slice(1)));
            } else {
              alert("Incorrect! The correct answer is: " + answer);
            }
            $(this).off("click").addClass("disabled").addClass("answered");
            if (board.find(".cell:not(.header):not(.answered)").length === 0) {
              board.trigger("roundFinished");
            }
          });

          board.append(cell);
        });
      }

      board.attr("data-round", roundNumber);
    });
  }

  function startNextRound(roundNumber) {
    if (roundNumber <= 2) {
      startRound(roundNumber);
    } else {
      alert("Game over! Your final score is: " + score);
    }
  }

  startButton.on("click", function () {
    score = 0;
    updateScore(0);
    startNextRound(1);
  });

  board.on("roundFinished", function () {
    const nextRound = confirm("Would you like to proceed to the next round?");
    if (nextRound) {
      const currentRound = parseInt(board.attr("data-round"));
      startNextRound(currentRound + 1);
    } else {
      alert("Game over! Your final score is: " + score);
    }
  });
});
