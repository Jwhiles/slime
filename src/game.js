import { curry, filter, reduce, map, concat, split, pipe, assoc  } from 'ramda';

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

export default tick = (coords) => {
  const toCheck = countAllNeighbours(coords)
  return filter(checkLife(toCheck, coords), Object.keys(toCheck))
}
