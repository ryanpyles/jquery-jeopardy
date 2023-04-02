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
    const showNumbers = new Set();
    data.forEach(item => showNumbers.add(item.showNumber));
    const showNumbersArray = Array.from(showNumbers);
    return showNumbersArray[Math.floor(Math.random() * showNumbersArray.length)];
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
          });

          board.append(cell);
        });
      }
    });
  }

  startButton.on("click", function () {
    score = 0;
    updateScore(0);
    startRound(1);
    // You can add a delay or another button to start the second round
    // startRound(2);
  });
});
