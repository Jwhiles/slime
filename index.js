import { curry, filter, reduce, map, concat, split, pipe, assoc  } from 'ramda';
import Rx from 'rxjs';

import md from './src/mouseDrag.js';

const neighboursFromCoord =
  pipe(
    split(':'),
    map(Number),
    ([x, y]) =>
    [
      `${x - 1}:${y - 1}`,
      `${x - 1}:${y}`,
      `${x - 1}:${y + 1}`,
      `${x}:${y - 1}`,
      `${x}:${y + 1}`,
      `${x + 1}:${y - 1}`,
      `${x + 1}:${y}`,
      `${x + 1}:${y + 1}`
    ]
  );

const findLiveNeighbours =
  reduce((acc, x) => {
    return assoc(x, (acc[x] || 0) + 1, acc)
  }, {})

const checkLife = curry((count, startPos, coord) => {
  return startPos.indexOf(coord) !== -1
    ? count[coord] === 2 || count[coord] === 3 : count[coord] === 3
})

const countAllNeighbours =
  pipe(
    map(neighboursFromCoord),
    reduce((acc, x) => concat(acc, x), []),
    findLiveNeighbours
  )

const tick = (coords) => {
  const toCheck = countAllNeighbours(coords)
  return filter(checkLife(toCheck, coords), Object.keys(toCheck))
}

let state = ['2:4','2:5','2:3']
const gridSize = 20
const boards = Array.from(document.getElementsByClassName('b1'));
const board = document.querySelector('.gameBoard')
const startButt = document.querySelector('.start')
const stopButt = document.querySelector('.stop')
const cxt = board.getContext('2d')
cxt.moveTo(0,0)

const contexts = boards.map(b => b.getContext('2d'))
contexts.forEach(x => x.moveTo(0,0))

// stuff about the board
const getX = (x) => Math.floor(x.offsetX / gridSize) 
const getY = (x) => Math.floor(x.offsetY / gridSize) 
const clickO = (x) => `${getX(x)}:${getY(x)}`

const drawCoords = (coords, c) => {
  const [x, y] = coords.split(':').map(Number).map(x => x * gridSize)
  c.fillRect(x, y, gridSize, gridSize)
}

const fillAllBoards = (x) => {
  console.log(x)
  drawCoords(x, cxt);
  contexts.forEach(c => {
    drawCoords(x, c)
  })
  state.push(x);
}

const source = Rx.Observable.fromEvent(board, 'click');
const ex = source.map(x => clickO(x));
const sub = ex.subscribe(
  x => { 
    fillAllBoards(x)
  }
);

const doIt = () => {
  state = tick(state)

  contexts.forEach(c => {
    c.clearRect(0, 0, board.width, board.height);
    state.forEach(x => drawCoords(x, c))
  })
} 


let int;

startButt.addEventListener('click', () => {
  if (int) clearInterval(int);
  int = setInterval(doIt, 456)
});

stopButt.addEventListener('click', () => {
  state = [];
  if (int) clearInterval(int);
  cxt.clearRect(0, 0, board.width, board.height);
})
doIt()
state.forEach(x => drawCoords(x, cxt));
const cb = pipe(clickO, fillAllBoards)
md(cb, board);
