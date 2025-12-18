const QUESTIONS = [
    { q: "What is the capital of India?", a: ["Mumai", "Delhi", "Kolkata", "Chennai"], correct: 1 },
    { q: "What is the full name of HTML?", a: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language", "HighText Machine Language"], correct: 0 },
    { q: "Gurudwara is associated with which religion?", a: ["Hindu", "Sikh", "Buddhist", "A sect who follow the teachings of Jain Tirthankar"], correct: 1 },
    { q: "2 * 2 * 3 = ?", a: ["12", "8", "10", "6"], correct: 0 },
    { q: "Who invented the WWW?", a: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"], correct: 0 },
    { q: "What is the national animal of India?", a: ["Lion", "Elephant", "Tiger", "Rhino"], correct: 2 },
    { q: "What is the largest planet?", a: ["Earth", "the planet Venus", "the guru of god", "planet of mar"], correct: 2 },
    { q: "What are the variables in JS?", a: ["var, let, const", "int, float", "def, let", "var, set"], correct: 0 },
    { q: "When did the Constitution come into force?", a: ["26 Jan 1950", "15 Aug 1947", "26 Nov 1949", "2 Oct 1950"], correct: 0 },
    { q: "In which mineral is iron?", a: ["Obsidian", "Hematite", "Hematite", "Calcite"], correct: 1 }
];

const PRIZES = [
    "₹1,00,00,000", "₹50,00,000", "₹25,00,000", "₹12,50,000", "₹6,40,000",
    "₹3,20,000", "₹1,60,000", "₹80,000", "₹40,000", "₹20,000"
];

let state = {
    index: 0,
    timer: null,
    timeLeft: 30,
    used5050: false,
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
const lifelineBtn = document.getElementById("lifeline-5050");
const walkAway = document.getElementById("walk-away");
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
    state.timeLeft = 30;
    timerEl.textContent = state.timeLeft;
    state.answered = false;
    nextBtn.style.display = "none";
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

lifelineBtn.onclick = () => {
    if (state.used5050) return;
    state.used5050 = true;
    lifelineBtn.classList.add("used");

    let correct = QUESTIONS[state.index].correct;
    let wrongs = [...optionsEl.children].filter((c, i) => i !== correct);
    wrongs.sort(() => Math.random() - 0.5).slice(0, 2).forEach(c => c.classList.add("disabled"));
};

walkAway.onclick = () => {
    clearInterval(state.timer);
    end(true);
};

nextBtn.onclick = () => {
    state.index++;
    if (state.index >= QUESTIONS.length) end(true, true);
    else showQ();
};

playAgain.onclick = () => location.reload();

function end(walk = false, finished = false) {
    playScreen.style.display = "none";
    endScreen.style.display = "block";

    if (finished) {
        endTitle.textContent = "Champion!";
        endMsg.textContent = "You won " + PRIZES[0];
    }
    else if (walk) {
        endTitle.textContent = "Walk Away";
        endMsg.textContent = "You won(pos) " + state.won;
    }
    else {
        let g = state.index >= 6 ? "" : "₹0";
        endTitle.textContent = "Game Over";
        endMsg.textContent = "You won " + g;
    }
}