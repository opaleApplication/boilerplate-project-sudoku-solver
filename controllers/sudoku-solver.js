class SudokuSolver {

  getValidationError(puzzleString) {
    if (typeof puzzleString !== 'string') {
      return 'Expected puzzle to be 81 characters long';
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }

    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    return null;
  }

  validate(puzzleString) {
    return this.getValidationError(puzzleString) === null;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = this._parseRow(row);
    const columnIndex = this._parseColumn(column);
    const cellValue = this._parseValue(value);

    if (
      !this.validate(puzzleString) ||
      rowIndex === null ||
      columnIndex === null ||
      cellValue === null
    ) {
      return false;
    }

    const rowStart = rowIndex * 9;

    for (let col = 0; col < 9; col += 1) {
      if (col === columnIndex) {
        continue;
      }

      if (puzzleString[rowStart + col] === cellValue) {
        return false;
      }
    }

    return true;

  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = this._parseRow(row);
    const columnIndex = this._parseColumn(column);
    const cellValue = this._parseValue(value);

    if (
      !this.validate(puzzleString) ||
      rowIndex === null ||
      columnIndex === null ||
      cellValue === null
    ) {
      return false;
    }

    for (let currentRow = 0; currentRow < 9; currentRow += 1) {
      if (currentRow === rowIndex) {
        continue;
      }

      if (puzzleString[currentRow * 9 + columnIndex] === cellValue) {
        return false;
      }
    }

    return true;

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = this._parseRow(row);
    const columnIndex = this._parseColumn(column);
    const cellValue = this._parseValue(value);

    if (
      !this.validate(puzzleString) ||
      rowIndex === null ||
      columnIndex === null ||
      cellValue === null
    ) {
      return false;
    }

    const regionRowStart = Math.floor(rowIndex / 3) * 3;
    const regionColumnStart = Math.floor(columnIndex / 3) * 3;

    for (let regionRow = regionRowStart; regionRow < regionRowStart + 3; regionRow += 1) {
      for (let regionColumn = regionColumnStart; regionColumn < regionColumnStart + 3; regionColumn += 1) {
        if (regionRow === rowIndex && regionColumn === columnIndex) {
          continue;
        }

        if (puzzleString[regionRow * 9 + regionColumn] === cellValue) {
          return false;
        }
      }
    }

    return true;

  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return false;
    }

    if (this._hasInitialConflicts(puzzleString)) {
      return false;
    }

    const board = puzzleString.split('');
    const solved = this._backtrack(board);

    return solved ? solved.join('') : false;
  }

  _parseRow(row) {
    if (typeof row === 'string') {
      if (/^[A-I]$/i.test(row)) {
        return row.toUpperCase().charCodeAt(0) - 65;
      }

      if (/^[0-8]$/.test(row)) {
        return parseInt(row, 10);
      }
    }

    if (Number.isInteger(row) && row >= 0 && row <= 8) {
      return row;
    }

    return null;
  }

  _parseColumn(column) {
    if (typeof column === 'string') {
      if (/^[1-9]$/.test(column)) {
        return parseInt(column, 10) - 1;
      }

      if (/^[0-8]$/.test(column)) {
        return parseInt(column, 10);
      }
    }

    if (Number.isInteger(column) && column >= 0 && column <= 8) {
      return column;
    }

    return null;
  }

  _parseValue(value) {
    if (typeof value === 'number' && value >= 1 && value <= 9) {
      return String(value);
    }

    if (typeof value === 'string' && /^[1-9]$/.test(value)) {
      return value;
    }

    return null;
  }

  _hasInitialConflicts(puzzleString) {
    for (let index = 0; index < puzzleString.length; index += 1) {
      const value = puzzleString[index];

      if (value === '.') {
        continue;
      }

      const row = Math.floor(index / 9);
      const column = index % 9;

      if (
        !this.checkRowPlacement(puzzleString, row, column, value) ||
        !this.checkColPlacement(puzzleString, row, column, value) ||
        !this.checkRegionPlacement(puzzleString, row, column, value)
      ) {
        return true;
      }
    }

    return false;
  }

  _isCandidateValid(board, row, column, value) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row * 9 + col] === value) {
        return false;
      }
    }

    for (let currentRow = 0; currentRow < 9; currentRow += 1) {
      if (board[currentRow * 9 + column] === value) {
        return false;
      }
    }

    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColumnStart = Math.floor(column / 3) * 3;

    for (let regionRow = regionRowStart; regionRow < regionRowStart + 3; regionRow += 1) {
      for (let regionColumn = regionColumnStart; regionColumn < regionColumnStart + 3; regionColumn += 1) {
        if (board[regionRow * 9 + regionColumn] === value) {
          return false;
        }
      }
    }

    return true;
  }

  _backtrack(board) {
    const emptyCellIndex = board.indexOf('.');

    if (emptyCellIndex === -1) {
      return board;
    }

    const row = Math.floor(emptyCellIndex / 9);
    const column = emptyCellIndex % 9;

    for (let candidate = 1; candidate <= 9; candidate += 1) {
      const candidateValue = String(candidate);

      if (this._isCandidateValid(board, row, column, candidateValue)) {
        board[emptyCellIndex] = candidateValue;

        const solved = this._backtrack(board);

        if (solved) {
          return solved;
        }

        board[emptyCellIndex] = '.';
      }
    }

    return false;
  }
}

module.exports = SudokuSolver;

