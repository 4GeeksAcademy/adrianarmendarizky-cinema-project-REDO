type SeatingGrid = number[][];

const TOTAL_ROWS = 8;
const TOTAL_COLS = 10;

function initializeSeating(): SeatingGrid {
  return Array.from({ length: TOTAL_ROWS }, () => Array(TOTAL_COLS).fill(0));
}

function displaySeating(seating: SeatingGrid): void {
  const columnLabels = Array.from({ length: TOTAL_COLS }, (_, i) => String(i + 1).padStart(2, " ")).join(" ");
  console.log(`     ${columnLabels}`);
  console.log(`    ${"---".repeat(TOTAL_COLS)}`);

  for (let row = 0; row < TOTAL_ROWS; row += 1) {
    const rowLabel = String(row + 1).padStart(2, " ");
    const symbols = seating[row].map((seat) => (seat === 0 ? "L" : "X")).join("  ");
    console.log(`R${rowLabel} | ${symbols}`);
  }
}

function reserveSeat(seating: SeatingGrid, row: number, col: number): string {
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

function countSeats(seating: SeatingGrid): { occupied: number; available: number } {
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

function findAdjacentSeats(
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

function printSeatCounts(seating: SeatingGrid): void {
  const counts = countSeats(seating);
  console.log(`Occupied seats: ${counts.occupied}`);
  console.log(`Available seats: ${counts.available}`);
}

function printAdjacentSeatResult(seating: SeatingGrid): void {
  const adjacent = findAdjacentSeats(seating);
  if (adjacent) {
    console.log(
      `First adjacent available seats found at row ${adjacent.row}, columns ${adjacent.seats[0]} and ${adjacent.seats[1]}.`
    );
  } else {
    console.log("No adjacent available seats found.");
  }
}

function fillAllSeats(seating: SeatingGrid): void {
  for (let row = 0; row < TOTAL_ROWS; row += 1) {
    for (let col = 0; col < TOTAL_COLS; col += 1) {
      seating[row][col] = 1;
    }
  }
}

console.log("\n=== SCENARIO 1: EMPTY ROOM ===");
const emptyRoom = initializeSeating();
console.log("Initial seating layout:");
displaySeating(emptyRoom);
printSeatCounts(emptyRoom);
printAdjacentSeatResult(emptyRoom);
console.log(reserveSeat(emptyRoom, 1, 1));
console.log("Layout after reserving seat (1, 1):");
displaySeating(emptyRoom);

console.log("\n=== SCENARIO 2: PARTIALLY FILLED ROOM ===");
const partialRoom = initializeSeating();
console.log("Reserving several seats...");
console.log(reserveSeat(partialRoom, 2, 3));
console.log(reserveSeat(partialRoom, 2, 4));
console.log(reserveSeat(partialRoom, 4, 7));
console.log(reserveSeat(partialRoom, 6, 10));
console.log(reserveSeat(partialRoom, 2, 3));
console.log(reserveSeat(partialRoom, 10, 1));
console.log("Current seating layout:");
displaySeating(partialRoom);
printSeatCounts(partialRoom);
printAdjacentSeatResult(partialRoom);

console.log("\n=== SCENARIO 3: NEARLY FULL ROOM (ISOLATED SINGLE SEATS ONLY) ===");
const isolatedSinglesRoom = initializeSeating();
fillAllSeats(isolatedSinglesRoom);
for (let row = 0; row < TOTAL_ROWS; row += 1) {
  for (let col = 0; col < TOTAL_COLS; col += 2) {
    isolatedSinglesRoom[row][col] = 0;
  }
}
console.log("Layout with only isolated available seats:");
displaySeating(isolatedSinglesRoom);
printSeatCounts(isolatedSinglesRoom);
printAdjacentSeatResult(isolatedSinglesRoom);

console.log("\n=== SCENARIO 4: COMPLETELY FULL ROOM ===");
const fullRoom = initializeSeating();
fillAllSeats(fullRoom);
console.log("Full room layout:");
displaySeating(fullRoom);
printSeatCounts(fullRoom);
printAdjacentSeatResult(fullRoom);
console.log(reserveSeat(fullRoom, 3, 5));
