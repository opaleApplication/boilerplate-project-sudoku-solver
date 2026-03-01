'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  const parseCoordinate = (coordinate) => {
    if (typeof coordinate !== 'string' || !/^[A-I][1-9]$/i.test(coordinate)) {
      return null;
    }

    return {
      row: coordinate.toUpperCase().charCodeAt(0) - 65,
      column: parseInt(coordinate[1], 10) - 1
    };
  };

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (puzzle === undefined || coordinate === undefined || value === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validationError = solver.getValidationError(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }

      const parsedCoordinate = parseCoordinate(coordinate);
      if (!parsedCoordinate) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const normalizedValue = String(value);
      if (!/^[1-9]$/.test(normalizedValue)) {
        return res.json({ error: 'Invalid value' });
      }

      const conflicts = [];
      const { row, column } = parsedCoordinate;

      if (!solver.checkRowPlacement(puzzle, row, column, normalizedValue)) {
        conflicts.push('row');
      }

      if (!solver.checkColPlacement(puzzle, row, column, normalizedValue)) {
        conflicts.push('column');
      }

      if (!solver.checkRegionPlacement(puzzle, row, column, normalizedValue)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({
          valid: false,
          conflict: conflicts
        });
      }

      return res.json({ valid: true });

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (puzzle === undefined) {
        return res.json({ error: 'Required field missing' });
      }

      const validationError = solver.getValidationError(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }

      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });

    });
};
