export type SeatingGrid = number[][];

export const TOTAL_ROWS = 8;
export const TOTAL_COLS = 10;

export function initializeSeating(): SeatingGrid {
  return Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(0));
}

export function reserveSeat(seating: SeatingGrid, row: number, col: number): string {
  if (row < 1 || row > TOTAL_ROWS || col < 1 || col > TOTAL_COLS) {
    return `Error: seat (${row}, ${col}) is out of bounds. Valid rows: 1-${TOTAL_ROWS}, columns: 1-${TOTAL_COLS}.`;
  }

  const rowIndex = row - 1;
  const colIndex = col - 1;

  if (seating[rowIndex][colIndex] === 1) {
    return `Error: seat (${row}, ${col}) is already occupied.`;
  }

  seating[rowIndex][colIndex] = 1;
  return `Success: seat (${row}, ${col}) reserved.`;
}

export function countSeats(seating: SeatingGrid): { occupied: number; available: number } {
  let occupied = 0;

  for (let row = 0; row < TOTAL_ROWS; row += 1) {
    for (let col = 0; col < TOTAL_COLS; col += 1) {
      if (seating[row][col] === 1) {
        occupied += 1;
      }
    }
  }

  const totalSeats = TOTAL_ROWS * TOTAL_COLS;
  return { occupied, available: totalSeats - occupied };
}

export function findAdjacentSeats(
  seating: SeatingGrid
): { row: number; seats: [number, number] } | null {
  for (let row = 0; row < TOTAL_ROWS; row += 1) {
    for (let col = 0; col < TOTAL_COLS - 1; col += 1) {
      if (seating[row][col] === 0 && seating[row][col + 1] === 0) {
        return { row: row + 1, seats: [col + 1, col + 2] };
      }
    }
  }

  return null;
}

export function countAdjacentSeatPairs(seating: SeatingGrid): number {
  let pairs = 0;

  for (let row = 0; row < TOTAL_ROWS; row += 1) {
    for (let col = 0; col < TOTAL_COLS - 1; col += 1) {
      if (seating[row][col] === 0 && seating[row][col + 1] === 0) {
        pairs += 1;
      }
    }
  }

  return pairs;
}
