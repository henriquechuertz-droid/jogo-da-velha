// Questões do 6º Ano para cada posição do tabuleiro
const questions = [
  { question: "Quanto é 15 + 5 × 4?", answer: 35 },
  { question: "Qual a raiz quadrada de 49?", answer: 7 },
  { question: "Quanto é 3³ (3 elevado a 3)?", answer: 27 },
  { question: "Quanto é 4,5 + 2,7?", answer: 7.2 },
  { question: "Quanto é 144 ÷ 12?", answer: 12 },
  { question: "Quanto é 25% de 80?", answer: 20 },
  { question: "Qual o perímetro de um quadrado de lado 6cm?", answer: 24 },
  { question: "Qual o MMC entre 3 e 4?", answer: 12 },
  { question: "Quanto é 1,5 × 4?", answer: 6 }
];

let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let selectedIndex = null;
let gameActive = true;

const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const modal = document.getElementById('mathModal');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const feedbackText = document.getElementById('feedbackText');
const restartBtn = document.getElementById('restartBtn');

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontais
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticais
  [0, 4, 8], [2, 4, 6]             // Diagonais
];

// Clique na casa
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.getAttribute('data-index'));
    
    if (boardState[index] !== null || !gameActive) return;

    selectedIndex = index;
    questionText.textContent = questions[index].question;
    answerInput.value = '';
    feedbackText.textContent = '';
    modal.style.display = 'flex';
    answerInput.focus();
  });
});

// Responder a questão
submitAnswerBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

function checkAnswer() {
  const userAnswer = parseFloat(answerInput.value.replace(',', '.'));
  const correctAnswer = questions[selectedIndex].answer;

  if (isNaN(userAnswer)) {
    feedbackText.style.color = '#e74c3c';
    feedbackText.textContent = 'Por favor, digite um número!';
    return;
  }

  if (Math.abs(userAnswer - correctAnswer) < 0.01) {
    // Acertou
    boardState[selectedIndex] = currentPlayer;
    const targetCell = cells[selectedIndex];
    targetCell.textContent = currentPlayer;
    targetCell.classList.add(currentPlayer.toLowerCase());

    modal.style.display = 'none';

    if (checkWin()) {
      alert(`🎉 Parabéns! O Jogador ${currentPlayer} venceu!`);
      gameActive = false;
      return;
    }

    if (boardState.every(cell => cell !== null)) {
      alert('🤝 Empate! Deu velha!');
      gameActive = false;
      return;
    }

    switchTurn();
  } else {
    // Errou
    feedbackText.style.color = '#e74c3c';
    feedbackText.textContent = 'Resposta incorreta! Você perdeu a vez.';
    setTimeout(() => {
      modal.style.display = 'none';
      switchTurn();
    }, 1500);
  }
}

function switchTurn() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerDisplay.textContent = currentPlayer;
  currentPlayerDisplay.style.color = currentPlayer === 'X' ? '#e74c3c' : '#3498db';
}

function checkWin() {
  return winningCombinations.some(combination => {
    return combination.every(index => boardState[index] === currentPlayer);
  });
}

// Reiniciar o jogo
restartBtn.addEventListener('click', () => {
  boardState.fill(null);
  currentPlayer = 'X';
  gameActive = true;
  currentPlayerDisplay.textContent = 'X';
  currentPlayerDisplay.style.color = '#e74c3c';

  cells.forEach((cell, index) => {
    cell.textContent = index + 1;
    cell.classList.remove('x', 'o');
  });
});
