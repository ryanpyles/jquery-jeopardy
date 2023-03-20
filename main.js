// Load the Jeopardy JSON file using fetch()
fetch('jeopardy.json')
  .then(response => response.json())
  .then(data => {
    // Generate a random show number from the available options
    const showNumbers = Array.from(new Set(data.map(clue => clue.showNumber)));
    const randomShowNumber = showNumbers[Math.floor(Math.random() * showNumbers.length)];

    // Filter the JSON data to only include the clues for the selected show
    const clues = data.filter(clue => clue.showNumber === randomShowNumber);

    // Initialize game variables
    let score = 0;
    let cluesRemaining = clues.length;
    let currentRound = 1;

    // Generate the Jeopardy board dynamically
    const categories = Array.from(new Set(clues.map(clue => clue.category)));
    const dollarAmounts = ['$200', '$400', '$600', '$800', '$1000'];
    const board = document.querySelector('.board');
    const boardHead = board.createTHead();
    const headRow = boardHead.insertRow();
    headRow.insertCell();
    for (let i = 0; i < dollarAmounts.length; i++) {
      const headCell = headRow.insertCell();
      headCell.classList.add('value');
      headCell.textContent = dollarAmounts[i];
    }
    const boardBody = board.createTBody();
    for (let i = 0; i < categories.length; i++) {
      const categoryRow = boardBody.insertRow();
      const categoryCell = categoryRow.insertCell();
      categoryCell.textContent = categories[i];
      categoryCell.classList.add('category');
      for (let j = 0; j < dollarAmounts.length; j++) {
        const valueCell = categoryRow.insertCell();
        valueCell.classList.add('question');
        valueCell.dataset.value = dollarAmounts[j];
        const question = clues.find(clue => clue.category === categories[i] && clue.value === dollarAmounts[j]);
        if (question) {
          valueCell.dataset.answer = question.answer;
          valueCell.textContent = dollarAmounts[j];
          valueCell.addEventListener('click', () => {
            // Display the selected clue and prompt the player for their answer
            const playerAnswer = prompt(`${categories[i]} - ${dollarAmounts[j]}\n\n${question.question}`);

            // Check if the player's answer is correct and update their score accordingly
            if (playerAnswer && playerAnswer.toLowerCase() === question.answer.toLowerCase()) {
              score += parseInt(dollarAmounts[j].slice(1));
              alert('Correct!');
            } else {
              score -= parseInt(dollarAmounts[j].slice(1));
              alert(`Incorrect! The correct answer was "${question.answer}".`);
            }

            // Remove the used clue from the array of clues
            clues.splice(clues.indexOf(question), 1);
            cluesRemaining--;

            // Move on to the next round if all categories have been used in the current round
            if (cluesRemaining > 0 && categories.every(category => clues.some(clue => clue.category === category))) {
              currentRound++;
              alert(`Round ${currentRound}!`);
            }

            // Update the score in the scoreboard
            const scoreValue = document.querySelector('.score-value');
            scoreValue.textContent = score;

            // Update the cell to be disabled and show the answer
            valueCell.classList.add('disabled');
            valueCell.textContent = question.answer;
          });
        } else {
          valueCell.classList.add('disabled');
          valueCell.textContent = '-';
        }
      }
    }

    // Add event listeners to the reset button
    const resetButton = document.querySelector('.reset');
    resetButton.addEventListener('click', () => {
      // Reset the game variables
      score = 0;
      cluesRemaining = clues.length;
      currentRound = 1;
    
      // Reset the score in the scoreboard
      const scoreValue = document.querySelector('.score-value');
      scoreValue.textContent = score;
    
      // Enable all the question cells and reset their values
      const questionCells = document.querySelectorAll('.question');
      questionCells.forEach(cell => {
        cell.classList.remove('disabled');
        cell.textContent = cell.dataset.value;
      });
    
      // Re-shuffle the clues if there are more rounds to play
      if (cluesRemaining > 0) {
        const shuffledClues = shuffle(clues);
        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < dollarAmounts.length; j++) {
            const valueCell = boardBody.rows[i].cells[j + 1];
            const question = shuffledClues.find(clue => clue.category === categories[i] && clue.value === dollarAmounts[j]);
            if (question) {
              valueCell.classList.remove('disabled');
              valueCell.dataset.answer = question.answer;
            } else {
              valueCell.classList.add('disabled');
              valueCell.textContent = '-';
            }
          }
        }
      }
    });
    
})
.catch(error => console.error(error));

// Shuffle an array using the Fisher-Yates algorithm
function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}
