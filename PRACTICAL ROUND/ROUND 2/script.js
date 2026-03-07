const QUESTIONS = [
    { q: "What is the full name of HTML?", a: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language", "HighText Machine Language"], correct: 0 },
    { q: "What is the capital of India?", a: ["Mumai", "Delhi", "Kolkata", "Chennai"], correct: 1 },
    { q: "Gurudwara is associated with which religion?", a: ["Hindu", "Sikh", "Buddhist", "A sect who follow the teachings of Jain Tirthankar"], correct: 1 },
    { q: "2 * 2 * 3 = ?", a: ["12", "8", "10", "6"], correct: 0 },
    { q: "Who invented the WWW?", a: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"], correct: 0 },
];

const PRIZES = [
    "₹3,20,000", "₹1,60,000", "₹80,000", "₹40,000", "₹20,000"
];

let state = {
    index: 0,
    timer: null,
    timeLeft: 15,
    answered: false,
    won: "₹0"
};

const startBtn = document.getElementById("start-btn");
const playScreen = document.getElementById("play-screen");
const startScreen = document.getElementById("start-screen");
const optionsEl = document.getElementById("options");
const qText = document.getElementById("question-text");
const timerEl = document.getElementById("timer");
const qIndexEl = document.getElementById("q-index");
const qTotalEl = document.getElementById("q-total");
const nextBtn = document.getElementById("next-btn");
const statusEl = document.getElementById("status");
const endScreen = document.getElementById("end-screen");
const endTitle = document.getElementById("end-title");
const endMsg = document.getElementById("end-msg");
const playAgain = document.getElementById("play-again");
const ladder = document.getElementById("prize-ladder");

function renderLadder() {
    ladder.innerHTML = "";
    PRIZES.forEach((p, i) => {
        let div = document.createElement("div");
        div.className = "prize " + (i === PRIZES.length - 1 - state.index ? "current" : "");
        div.innerHTML = `<span>${p}</span><small>#${i + 1}</small>`;
        ladder.appendChild(div);
    });
}

startBtn.onclick = () => {
    startScreen.style.display = "none";
    playScreen.style.display = "block";
    state.index = 0;
    qTotalEl.textContent = QUESTIONS.length;
    renderLadder();
    showQ();
};

function showQ() {
    clearInterval(state.timer);
    state.timeLeft = 15;
    timerEl.textContent = state.timeLeft;
    state.answered = false;
    nextBtn.style.display = "auto"
    statusEl.textContent = "Answer";

    const q = QUESTIONS[state.index];
    qText.textContent = q.q;
    qIndexEl.textContent = state.index + 1;

    optionsEl.innerHTML = "";
    q.a.forEach((opt, i) => {
        let d = document.createElement("div");
        d.className = "option";
        d.textContent = opt;
        d.dataset.i = i;
        d.onclick = optionClick;
        optionsEl.appendChild(d);
    });

    renderLadder();
    startTimer();
}

function startTimer() {
    state.timer = setInterval(() => {
        state.timeLeft--;
        timerEl.textContent = state.timeLeft;
        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            revealCorrect(QUESTIONS[state.index].correct);
            end(false);
        }
    }, 1000);
}

function optionClick(e) {
    if (state.answered) return;
    state.answered = true;
    clearInterval(state.timer);

    let chosen = Number(e.target.dataset.i);
    let correct = QUESTIONS[state.index].correct;

    e.target.classList.add(chosen === correct ? "correct" : "wrong");

    if (chosen === correct) {
        statusEl.textContent = "Correct!";
        statusE2.textContent = "Wrong!";
        state.won = PRIZES[PRIZES.length - 1 - state.index];
        disableExcept(correct);
        nextBtn.style.display = "inline-block";
    } else {
        revealCorrect(correct);
        end(false);
    }
}

function disableExcept(i) {
    [...optionsEl.children].forEach((c, x) => {
        c.classList.add("disabled");
        if (x === i) c.classList.remove("disabled");
    });
}

function revealCorrect(i) {
    [...optionsEl.children].forEach((c, x) => {
        c.classList.add("disabled");
        if (x === i) c.classList.add("correct");
    });
}


playAgain.onclick = () => location.reload();