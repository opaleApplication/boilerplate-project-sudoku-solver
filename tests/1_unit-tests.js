const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  const puzzle =
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
  const solution =
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = puzzle.replace('.', 'a');
    assert.isFalse(solver.validate(invalidPuzzle));
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.isFalse(solver.validate(puzzle.slice(0, 80)));
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 1, '3'));
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, '4'));
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(puzzle, 'A', 1, '3'));
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, '9'));
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', 1, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzle, 'A', 1, '6'));
  });

  test('Valid puzzle strings pass the solver', () => {
    assert.isString(solver.solve(puzzle));
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = puzzle.replace('.', '1');
    assert.isFalse(solver.solve(invalidPuzzle));
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solve(puzzle), solution);
  });

});
