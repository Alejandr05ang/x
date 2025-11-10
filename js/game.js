const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector("#statusText");
const rematchBtn = document.querySelector("#rematchBtn");
const newGameBtn = document.querySelector("#newGameBtn");
const moveCountDisplay = document.querySelector('#moveCount');
const timerDisplay = document.querySelector('#timer');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const winConditions = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]  
]
let options = ['', '', '', '', '', '', '', '', '',]
let currentPlayer = "X";
let running = false;
let moveCount = 0;
let timerInterval = null;
let startTime = null;
let elapsedMs = 0;
const avatarOptions = [
    'assets/players/batman.svg',
    'assets/players/musulman.svg',
    'assets/players/robot.svg',
    'assets/players/saw.svg',
    'assets/players/stalin.svg',
    'assets/players/tesla.svg',
    'assets/players/trump.svg',
    'assets/players/user1.svg',
    'assets/players/user2.svg'
];
let avatarX = avatarOptions[7];
let avatarO = avatarOptions[8];
let finalChoiceX = avatarX;
let finalChoiceO = avatarO;
let avatarSelecting = null; 
let xWins = 0;
let oWins = 0;

function getPlayerName(player){
    const sel = player === 'X' ? '#xPlayerDisplay .player-name' : '#oPlayerDisplay .player-name';
    const el = document.querySelector(sel);
    if(el && el.textContent && el.textContent.trim() !== '') return el.textContent.trim();
    return player === 'X' ? 'JUGADOR1' : 'JUGADOR2';
}

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    if(rematchBtn) rematchBtn.addEventListener('click', rematchGame);
    if(newGameBtn) newGameBtn.addEventListener('click', newGame);
    statusText.textContent = `Turno de ${getPlayerName(currentPlayer)}`;
    updateActivePlayerUI();
    resetMatchState();
    updateScoreboard();
    const avatarXEl = document.getElementById('avatarX');
    const avatarOEl = document.getElementById('avatarO');
    const nameXEl = document.getElementById('nameX');
    const nameOEl = document.getElementById('nameO');
    if(avatarXEl) setAvatarBackground(avatarXEl, avatarX, avatarOptions[7]);
    if(avatarOEl) setAvatarBackground(avatarOEl, avatarO, avatarOptions[8]);
    if(nameXEl && nameXEl.textContent.trim() === '') nameXEl.textContent = 'JUGADOR1';
    if(nameOEl && nameOEl.textContent.trim() === '') nameOEl.textContent = 'JUGADOR2';
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cell-index");

    if(options[cellIndex] !== "" || !running){
        return;
    }

    if(moveCount === 0){
        startTimer();
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = (currentPlayer == "X") ? "#1892EA" : "#A737FF";
    moveCount++;
    updateMoveCountUI();
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `Turno de ${getPlayerName(currentPlayer)}`;
    updateActivePlayerUI();
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }

        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }

    }

    if(roundWon){
        statusText.textContent = `${getPlayerName(currentPlayer)} gana!`;
        if(currentPlayer === 'X'){
            xWins++;
        } else {
            oWins++;
        }
        updateScoreboard();
        running = false;
        stopTimer();
        
        registrarPartida(currentPlayer === 'X' ? 'jugador1' : 'jugador2');
    } else if(!options.includes("")){
        statusText.textContent = `Empate!`;
        running = false;
        stopTimer();
        
        registrarPartida('Empate');
    } else {
        changePlayer();
    }
}

function resetMatchState(){
    currentPlayer = "X";
    options = ['', '', '', '', '', '', '', '', '',];
    moveCount = 0;
    elapsedMs = 0;
    clearTimerDisplay();
    updateMoveCountUI();
    cells.forEach(cell => { cell.textContent = ""; cell.style.color = ""; });
    statusText.textContent = `Turno de ${getPlayerName(currentPlayer)}`;
    updateActivePlayerUI();
}

function openAvatarModal(player) {
    // show the player's display name (not the letter X/O)
    document.getElementById('playerLabel').textContent = getPlayerName(player);
    avatarSelecting = player;
    const modalEl = document.getElementById('avatarModal');
    if(modalEl) modalEl.classList.add('modal--open');

    const container = document.getElementById('avatarOptionsContainer');
    container.innerHTML = '';

    avatarOptions.forEach((avatarPath) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'avatar-option';
        const img = document.createElement('img');
        img.src = avatarPath;
        img.alt = avatarPath.split('/').pop();
        img.onclick = () => selectAvatar(avatarPath);
        wrapper.appendChild(img);
        container.appendChild(wrapper);
    });
}

function closeAvatarModal() {
    const modalEl = document.getElementById('avatarModal');
    if(modalEl) modalEl.classList.remove('modal--open');
    if(finalChoiceX && finalChoiceO){
        avatarX = finalChoiceX;
        avatarO = finalChoiceO;
        const avatarXEl = document.getElementById('avatarX');
        const avatarOEl = document.getElementById('avatarO');
        if(avatarXEl) setAvatarBackground(avatarXEl, avatarX, avatarOptions[7]);
        if(avatarOEl) setAvatarBackground(avatarOEl, avatarO, avatarOptions[8]);
    }
}

function selectAvatar(selectedAvatarPath){
    if(avatarSelecting === 'X'){
        finalChoiceX = selectedAvatarPath;
        openAvatarModal('O');
    } else if(avatarSelecting === 'O'){
        finalChoiceO = selectedAvatarPath;
        avatarSelecting = null;
        closeAvatarModal();
    }
}

function rematchGame(){
    stopTimer();
    resetMatchState();
    running = true;
}


function newGame(){
    stopTimer();
    const currentNameXEl = document.querySelector('#xPlayerDisplay .player-name');
    const currentNameOEl = document.querySelector('#oPlayerDisplay .player-name');
    const defaultX = currentNameXEl ? currentNameXEl.textContent.trim() : 'JUGADOR1';
    const defaultO = currentNameOEl ? currentNameOEl.textContent.trim() : 'JUGADOR2';
    const nameX = prompt('Nombre del jugador X (Enter para mantener):', defaultX);
    const nameO = prompt('Nombre del jugador O (Enter para mantener):', defaultO);
    if(nameX !== null && nameX.trim() !== ''){
        if(currentNameXEl) currentNameXEl.textContent = nameX.trim();
    }
    if(nameO !== null && nameO.trim() !== ''){
        if(currentNameOEl) currentNameOEl.textContent = nameO.trim();
    }
    openAvatarModal('X');
    resetMatchState();
    running = true;
}

window.onclick = function(event) {
    const modal = document.getElementById('avatarModal');
    if (event.target == modal) {
        closeAvatarModal(); 
    }
}

function updateMoveCountUI(){
    if(moveCountDisplay) moveCountDisplay.textContent = `Movimientos: ${moveCount}`;
}

function setAvatarBackground(imgEl, url, fallback){
    const tester = new Image();
    tester.onload = function(){
        if(imgEl.parentElement) imgEl.parentElement.style.backgroundImage = `url('${url}')`;
        imgEl.src = url;
    };
    tester.onerror = function(){
        const use = fallback || avatarOptions[7];
        if(imgEl.parentElement) imgEl.parentElement.style.backgroundImage = `url('${use}')`;
        imgEl.src = use;
    };
    tester.src = url;
}

function updateScoreboard(){
    const scoreX = document.querySelector('#scoreX');
    const scoreO = document.querySelector('#scoreO');
    if(scoreX) scoreX.textContent = xWins;
    if(scoreO) scoreO.textContent = oWins;
}

function formatMsToMMSS(ms){
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function updateTimerDisplay(){
    const now = Date.now();
    elapsedMs = now - startTime;
    if(timerDisplay) timerDisplay.textContent = formatMsToMMSS(elapsedMs);
}

function startTimer(){
    if(timerInterval) return;
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 500);
    updateTimerDisplay();
}

function stopTimer(){
    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if(startTime){
        elapsedMs = Date.now() - startTime;
        if(timerDisplay) timerDisplay.textContent = formatMsToMMSS(elapsedMs);
    }
    startTime = null;
}

function clearTimerDisplay(){
    if(timerDisplay) timerDisplay.textContent = '00:00';
    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
    startTime = null;
    elapsedMs = 0;
}

function updateActivePlayerUI(){
    if(!xPlayerDisplay || !oPlayerDisplay) return;
    if(currentPlayer === 'X'){
        xPlayerDisplay.classList.add('player-active');
        oPlayerDisplay.classList.remove('player-active');
    } else {
        oPlayerDisplay.classList.add('player-active');
        xPlayerDisplay.classList.remove('player-active');
    }
}


function registrarPartida(resultado) {
    if (typeof gameStorage === 'undefined') {
        console.warn('gameStorage no disponible');
        return;
    }

    const partidaData = {
        jugador1: getPlayerName('X'),
        jugador2: getPlayerName('O'),
        ganador: resultado,
        duracion: elapsedMs,
        movimientos: moveCount,
        avatarJ1: avatarX || '',
        avatarJ2: avatarO || ''
    };

    gameStorage.registerGame(partidaData);
    console.log('✅ Partida guardada:', partidaData);
}