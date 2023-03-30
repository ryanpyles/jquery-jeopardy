$(document).ready(function () {
  const board = $("#board");
  const url = "jeopardy.json";
  const startButton = $("<button>").text("Start Game").addClass("start-button");
  $("body").prepend(startButton);

  function startRound(roundNumber) {
    board.empty();

    $.getJSON(url, function (data) {
      const roundString = roundNumber === 1 ? "Jeopardy!" : "Double Jeopardy!";

      const filteredData = data.filter(item => item.round === roundString && item.showNumber === 4680);
      const categoriesMap = new Map();

      // Group questions by category
      filteredData.forEach((item) => {
        if (!categoriesMap.has(item.category)) {
          categoriesMap.set(item.category, []);
        }
        categoriesMap.get(item.category).push(item);
      });

      const categories = Array.from(categoriesMap.keys());

      for (let i = 0; i < categories.length && i < 5; i++) {
        let header = $("<div>").addClass("cell header").text(categories[i]);
        board.append(header);

        const questions = categoriesMap.get(categories[i]).sort((a, b) => {
          return parseInt(a.value.slice(1)) - parseInt(b.value.slice(1));
        });

        for (let j = 0; j < questions.length && j < 5; j++) {
          let cell = $("<div>").addClass("cell").text(questions[j].value);
          let question = $("<div>").addClass("question").text(questions[j].question);
          let answer = questions[j].answer;
          cell.append(question);
          cell.on("click", function () {
            let userAnswer = prompt(question.text());
            if (userAnswer && userAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
              alert("Correct!");
            } else {
              alert("Incorrect! The correct answer is: " + answer);
            }
          });
          board.append(cell);
        }
      }
    });
  }

  startButton.on("click", function () {
    // Start first round
    startRound(1);

    // Set a timer for the first round
    setTimeout(function () {
      alert("Round 1 is over. Starting Round 2!");
      startRound(2);

      // Set a timer for the second round
      setTimeout(function () {
        alert("Round 2 is over. Game completed!");
      }, 10 * 60 * 1000); // 10 minutes for Round 2
    }, 10 * 60 * 1000); // 10 minutes for Round 1
  });
});
