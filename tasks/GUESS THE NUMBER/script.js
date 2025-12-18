(function(){
  const guessInput = document.getElementById('guessInput');
  const checkBtn = document.getElementById('checkBtn');
  const newBtn = document.getElementById('newBtn');
  const messageEl = document.getElementById('message');
  const hintEl = document.getElementById('hint');
  const meterFill = document.getElementById('meterFill');
  const attemptsText = document.getElementById('attemptsText');
  const rangeText = document.getElementById('rangeText');
  const highscoreEl = document.getElementById('highscore');
  const minRangeInput = document.getElementById('minRange');
  const maxRangeInput = document.getElementById('maxRange');
  const applyRangeBtn = document.getElementById('applyRange');

  let min = 1, max = 100;
  let secret = randomBetween(min, max);
  let maxAttempts = 10;
  let attemptsLeft = maxAttempts;
  let highscore = 0;

  function randomBetween(a,b){
    a = Math.ceil(a); b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function resetGame(initAttempts){
    attemptsLeft = initAttempts || 10;
    secret = randomBetween(min, max);
    attemptsText.textContent = attemptsLeft;
    rangeText.textContent = `${min} - ${max}`;
    messageEl.textContent = 'New game started. Good luck! 🎲';
    hintEl.textContent = `Guess a number between ${min} and ${max}.`;
    meterFill.style.width = '0%';
    guessInput.value = '';
    guessInput.focus();
  }

  function updateMeter(guess){
    const dist = Math.abs(secret - guess);
    const maxDist = Math.max(Math.abs(secret - min), Math.abs(secret - max));
    let percent = Math.max(0, 20 - Math.round((dist / maxDist) * 100));
    meterFill.style.width = percent + '%';
  }

  function showWin(){
    messageEl.textContent = `You guessed it! 🎉 The number was ${secret}.`;
    hintEl.textContent = `You had ${attemptsLeft} attempt(s) left.`;
    if (attemptsLeft > highscore) {
      highscore = attemptsLeft;
      highscoreEl.textContent = highscore;
    }
    meterFill.style.width = '100%';
  }

  function showLose(){
    messageEl.textContent = `Out of attempts — you lost. The number was ${secret}.`;
    hintEl.textContent = 'Press New Game to try again.';
    meterFill.style.width = '0%';
  }

  checkBtn.addEventListener('click', handleGuess);
  guessInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') handleGuess(); });
  newBtn.addEventListener('click', ()=>resetGame(maxAttempts));

  applyRangeBtn.addEventListener('click', ()=>{
    const mn = parseInt(minRangeInput.value,10);
    const mx = parseInt(maxRangeInput.value,10);
    if (isNaN(mn) || isNaN(mx) || mn >= mx){
      alert('Please enter a valid range (min < max).');
      return;
    }
    min = mn; max = mx;
    const rangeSize = max - min + 1;
    maxAttempts = Math.max(5, Math.min(20, Math.round(Math.log2(rangeSize) * 3)));
    resetGame(maxAttempts);
  });

  function handleGuess(){
    const raw = guessInput.value.trim();
    if(raw === ''){ alert('Enter a number first.'); guessInput.focus(); return; }
    const guess = Number(raw);
    if (!Number.isFinite(guess) || guess < min || guess > max){
      alert(`Please enter a number between ${min} and ${max}.`);
      guessInput.focus();
      return;
    }

    if (attemptsLeft <= 0) { showLose(); return; }

    attemptsLeft--;
    attemptsText.textContent = attemptsLeft;

    if (guess === secret){
      showWin();
      return;
    }

    const diff = Math.abs(secret - guess);
    messageEl.textContent = guess < secret ? 'Too low ⬇️' : 'Too high ⬆️';

    let tempHint = '';
    if (diff <= Math.max(1, Math.round((max - min) * 0.02))) tempHint = 'Boiling 🔥';
    else if (diff <= Math.max(2, Math.round((max - min) * 0.05))) tempHint = 'Very hot 🔥';
    else if (diff <= Math.max(5, Math.round((max - min) * 0.12))) tempHint = 'Warm ♨️';
    else if (diff <= Math.max(10, Math.round((max - min) * 0.25))) tempHint = 'Cool ❄️';
    else tempHint = 'Cold 🧊';

    hintEl.textContent = `${tempHint} — ${Math.min(diff, max)} away.`;
    updateMeter(guess);

    if (attemptsLeft <= 0){
      showLose();
    } else {
      guessInput.value = '';
      guessInput.focus();
    }
  }

  resetGame(maxAttempts);
})();
