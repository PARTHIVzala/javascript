const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
var score = 0;

const candyColors = [
  'url(images/red.jpeg)',
  'url(images/yellow.jpeg)',
  'url(images/green.jpeg)',
  'url(images/blue.jpeg)',
  'url(images/orange.jpeg)',
  'url(images/purple.jpeg)'
];

function createBoard() {
  for (var i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    var randomColor = Math.floor(Math.random() * candyColors.length);
    square.style.backgroundImage = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

var colorBeingDragged;
var colorBeingReplaced;
var squareIdBeingDragged;
var squareIdBeingReplaced;

squares.forEach(square => square.addEventListener('dragstart', dragStart));
squares.forEach(square => square.addEventListener('dragend', dragEnd));
squares.forEach(square => square.addEventListener('dragover', dragOver));
squares.forEach(square => square.addEventListener('dragenter', dragEnter));
squares.forEach(square => square.addEventListener('dragleave', dragLeave));
squares.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
  colorBeingDragged = this.style.backgroundImage;
  squareIdBeingDragged = parseInt(this.id);
}
function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); }
function dragLeave() {}
function dragDrop() {
  colorBeingReplaced = this.style.backgroundImage;
  squareIdBeingReplaced = parseInt(this.id);
  this.style.backgroundImage = colorBeingDragged;
  squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
}
function dragEnd() {
  var validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged + 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + width
  ];
  var validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }
}
function moveDown() {
  for (var i = 0; i < 55; i++) {
    if (squares[i + width].style.backgroundImage === '') {
      squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;

      if (squares[i + width].style.backgroundImage !== '') {
        squares[i + width].classList.remove("fall");
        void squares[i + width].offsetWidth;
        squares[i + width].classList.add("fall");
      }

      squares[i].style.backgroundImage = '';

      const firstRow = [0,1,2,3,4,5,6,7];
      firstRow.forEach(index => {
        if (squares[index].style.backgroundImage === '') {
          var randomColor = Math.floor(Math.random() * candyColors.length);
          squares[index].style.backgroundImage = candyColors[randomColor];
          squares[index].classList.add("fall");
          setTimeout(() => squares[index].classList.remove("fall"), 400);
        }
      });
    }
  }
}

function checkRowForThree() {
  for (var i = 0; i < 61; i++) {
    var rowOfThree = [i, i + 1, i + 2];
    var decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';
    const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];
    if (notValid.includes(i)) continue;

    if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 3;
      scoreDisplay.textContent = score;
      rowOfThree.forEach(index => {
        squares[index].classList.add("disappear");
        setTimeout(() => {
          squares[index].style.backgroundImage = '';
          squares[index].classList.remove("disappear");
        }, 400);
      });
    }
  }
}

function checkColumnForThree() {
  for (var i = 0; i < 47; i++) {
    var columnOfThree = [i, i + width, i + width * 2];
    var decidedColor = squares[i].style.backgroundImage;
    const isBlank = decidedColor === '';

    if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
      score += 3;
      scoreDisplay.textContent =    ore;
      columnOfThree.forEach(index => {
        squares[index].classList.add("disappear");
        setTimeout(() => {
          squares[index].style.backgroundImage = '';
          squares[index].classList.remove("disappear");
        }, 400);
      });
    }
  }
}
window.setInterval(function () {
  checkRowForThree();
  checkColumnForThree();
  moveDown();
}, 100);