let points = 0;
let currentLevel = 1;
let correctItems = 0; // Contador de itens corretos no nível atual

const itemsContainer = document.getElementById('items');
const scoreDisplay = document.getElementById('points');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');
const feedbackContainer = document.getElementById('feedback-container');
const levelDisplay = document.getElementById('currentLevel');

let items = [
  { id: 'papel', name: '📰 Papel' },
  { id: 'plastico', name: '🧴 Plástico' },
  { id: 'vidro', name: '🍾 Vidro' },
  { id: 'organico', name: '🍌 Orgânico' }
];

// Função para iniciar o arrasto
function addDragListeners() {
  document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('dragstart', dragStart);
  });
}

function addBinListeners() {
  const bins = document.querySelectorAll('.bin'); // Seleciona todas as lixeiras atuais
  bins.forEach(bin => {
    bin.addEventListener('dragover', dragOver);
    bin.addEventListener('drop', dropItem);
  });
}

function dragStart(e) {
  e.dataTransfer.setData('text', e.target.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dropItem(e) {
  e.preventDefault();
  const itemId = e.dataTransfer.getData('text');
  const item = document.getElementById(itemId);

  // Verifica se o item corresponde à lixeira correta
  if (e.target.id.includes(itemId.split('-')[0])) {
    e.target.appendChild(item);
    updateScore(10); // Aumenta a pontuação por acerto
    displayMessage('Você acertou!', true); // Exibe mensagem de sucesso
    correctSound.play(); // Toca som de acerto
    correctItems++; // Incrementa o número de itens corretos

    // Verifica se todos os itens do nível foram colocados corretamente
    if (correctItems === items.length) {
      nextLevel(); // Passa para o próximo nível
    }

  } else {
    updateScore(-5); // Penalidade por erro
    displayMessage('Tente novamente!', false); // Exibe mensagem de erro
    incorrectSound.play(); // Toca som de erro
  }
}

function updateScore(value) {
  points += value;
  scoreDisplay.textContent = points;
}

// Função para exibir feedback visual
function displayMessage(message, success) {
  feedbackContainer.textContent = message;
  feedbackContainer.className = success ? 'correct' : 'incorrect'; 
  feedbackContainer.style.display = 'block';

  // Remove a mensagem após 2 segundos
  setTimeout(() => {
    feedbackContainer.style.display = 'none';
  }, 2000);
}

function shuffleItems() {
  items.sort(() => Math.random() - 0.5);
  itemsContainer.innerHTML = ''; // Limpa os itens atuais
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.id = item.id;
    div.draggable = true;

    // Criação do elemento de imagem
    const img = document.createElement('img');
    img.src = `${item.id}.png`; // Presume que a imagem segue o padrão id.png (ex: papel.png)
    img.alt = item.name;
    img.width = 50;

    div.appendChild(img); // Adiciona a imagem ao item
    div.appendChild(document.createTextNode(` ${item.name}`)); // Nome do item
    itemsContainer.appendChild(div);
  });
  addDragListeners(); // Adiciona os ouvintes de arrasto aos novos elementos
}

// Limpa todas as lixeiras e reinsere os rótulos
function clearBins() {
  const bins = document.querySelectorAll('.bin'); // Seleciona todas as lixeiras, inclusive as novas
  bins.forEach(bin => {
    while (bin.firstChild) {
      bin.removeChild(bin.firstChild);
    }

    const label = document.createElement('div');
    if (bin.id === 'papel-bin') label.textContent = 'Papel';
    if (bin.id === 'plastico-bin') label.textContent = 'Plástico';
    if (bin.id === 'vidro-bin') label.textContent = 'Vidro';
    if (bin.id === 'organico-bin') label.textContent = 'Orgânico';
    if (bin.id === 'metal-bin') label.textContent = 'Metal';
    if (bin.id === 'eletronico-bin') label.textContent = 'Eletrônico';
    if (bin.id === 'bateria-bin') label.textContent = 'Bateria';
    if (bin.id === 'oleo-bin') label.textContent = 'Óleo';
    bin.appendChild(label);
  });
}

function nextLevel() {
  currentLevel++;
  
  if (currentLevel > 3) {
    endGame(); // Finaliza o jogo após o nível 3
  } else {
    displayMessage('Parabéns! Próximo nível!', true);
    levelDisplay.textContent = currentLevel;
    loadLevel(currentLevel);
  }
}

function loadLevel(level) {
  correctItems = 0;

  clearBins(); 

  if (level === 2) {
    items.push(
      { id: 'metal', name: '🛠️ Metal' },
      { id: 'eletronico', name: '💻 Eletrônico' }
    );
    const metalBin = document.createElement('div');
    metalBin.className = 'bin';
    metalBin.id = 'metal-bin';
    metalBin.textContent = 'Metal';
    const eletronicoBin = document.createElement('div');
    eletronicoBin.className = 'bin';
    eletronicoBin.id = 'eletronico-bin';
    eletronicoBin.textContent = 'Eletrônico';

    document.getElementById('bins').appendChild(metalBin);
    document.getElementById('bins').appendChild(eletronicoBin);

    shuffleItems();
    addBinListeners();

  } else if (level === 3) {
    items.push(
      { id: 'bateria', name: '🔋 Bateria' },
      { id: 'oleo', name: '🛢️ Óleo' }
    );
    const bateriaBin = document.createElement('div');
    bateriaBin.className = 'bin';
    bateriaBin.id = 'bateria-bin';
    bateriaBin.textContent = 'Bateria';
    const oleoBin = document.createElement('div');
    oleoBin.className = 'bin';
    oleoBin.id = 'oleo-bin';
    oleoBin.textContent = 'Óleo';

    document.getElementById('bins').appendChild(bateriaBin);
    document.getElementById('bins').appendChild(oleoBin);

    shuffleItems();
    addBinListeners();
  }
}
function endGame() {
  displayMessage('Parabéns! Você chegou ao fim do jogo!', true);

  document.querySelectorAll('.item').forEach(item => {
    item.setAttribute('draggable', false);
  });
  document.querySelectorAll('.bin').forEach(bin => {
    bin.removeEventListener('dragover', dragOver);
    bin.removeEventListener('drop', dropItem);
  });

  // Cria um contêiner para a mensagem de fim de jogo e o botão
  const endContainer = document.createElement('div');
  endContainer.style.display = 'flex';
  endContainer.style.flexDirection = 'column';
  endContainer.style.alignItems = 'center';
  endContainer.style.justifyContent = 'center';
  endContainer.style.position = 'fixed';
  endContainer.style.top = '50%';
  endContainer.style.left = '50%';
  endContainer.style.transform = 'translate(-50%, -50%)';
  endContainer.style.backgroundColor = '#4caf50';
  endContainer.style.padding = '20px';
  endContainer.style.borderRadius = '10px';
  endContainer.style.color = 'white';
  endContainer.style.textAlign = 'center';

  // Adiciona a mensagem de fim de jogo
  const gameOverScreen = document.createElement('div');
  gameOverScreen.id = 'game-over';
  gameOverScreen.textContent = 'Parabéns! Você chegou ao fim do jogo!';
  gameOverScreen.style.fontSize = '24px';
  gameOverScreen.style.marginBottom = '20px'; // Adiciona espaço entre a frase e o botão

  // Adiciona o botão "Jogar Outra Vez"
  const restartButton = document.createElement('button');
  restartButton.textContent = 'Jogar Outra Vez';
  restartButton.style.padding = '10px 20px';
  restartButton.style.fontSize = '20px';
  restartButton.style.color = 'white';
  restartButton.style.backgroundColor = '#2196F3';
  restartButton.style.border = 'none';
  restartButton.style.borderRadius = '5px';
  restartButton.style.cursor = 'pointer';

  // Efeito de acender e apagar usando opacidade
  restartButton.style.transition = 'opacity 0.4s ease-in-out';
  let blinking = setInterval(() => {
    if (restartButton.style.opacity === '0') {
      restartButton.style.opacity = '1'; // Aumenta a opacidade
    } else {
      restartButton.style.opacity = '0'; // Diminui a opacidade
    }
  }, 400);

  restartButton.onclick = function() {
    clearInterval(blinking); // Para o efeito de piscar
    location.reload(); // Recarrega a página
  };

  // Adiciona a mensagem e o botão ao contêiner
  endContainer.appendChild(gameOverScreen);
  endContainer.appendChild(restartButton);

  // Adiciona o contêiner ao body
  document.body.appendChild(endContainer);
}
document.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = document.getElementById('background-music');
  const toggleMusicButton = document.getElementById('toggle-music');

  // Alterna a música de fundo ao clicar no botão
  toggleMusicButton.addEventListener('click', () => {
      if (backgroundMusic.paused) {
          backgroundMusic.play().catch(error => {
              console.log("Não foi possível reproduzir a música de fundo: ", error);
          });
          toggleMusicButton.textContent = "Parar Música";
      } else {
          backgroundMusic.pause();
          toggleMusicButton.textContent = "Iniciar Música";
      }
  });
});

// Carrega o nível inicial
loadLevel(currentLevel);
addDragListeners();
addBinListeners();
