import {
  countAdjacentSeatPairs,
  TOTAL_COLS,
  TOTAL_ROWS,
  countSeats,
  findAdjacentSeats,
  initializeSeating,
  reserveSeat,
  type SeatingGrid,
} from "./cinema-logic";

function renderCinemaUI(): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  app.innerHTML = `
    <main class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:px-6">
      <header class="mb-8">
        <h1 class="mb-2 text-3xl font-bold tracking-tight text-slate-900">Cinema Seat Reservation Dashboard</h1>
        <p class="text-sm text-slate-600">Reserve seats, review availability, and locate the first adjacent pair for walk-up customers.</p>
      </header>

      <section class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
          <div class="mx-auto mb-8 w-full max-w-2xl">
            <div class="rounded-t-3xl bg-slate-800 py-3 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-100 shadow-lg">
              Screen
            </div>
            <div class="h-2 rounded-b-3xl bg-slate-300"></div>
          </div>

          <div class="mx-auto w-full max-w-3xl overflow-x-auto">
            <div
              id="seat-grid"
              class="grid min-w-[44rem] grid-cols-[2.5rem_repeat(10,minmax(0,1fr))] gap-2 sm:gap-3"
              aria-label="Cinema seat map"
            ></div>
          </div>

          <div class="mx-auto mt-8 grid w-full max-w-3xl grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <div class="flex items-center justify-center gap-2 text-center">
              <span class="inline-block h-4 w-4 rounded bg-green-500"></span>
              <span>Available (L)</span>
            </div>
            <div class="flex items-center justify-center gap-2 text-center">
              <span class="inline-block h-4 w-4 rounded bg-red-500"></span>
              <span>Reserved (X)</span>
            </div>
            <div class="flex items-center justify-center gap-2 text-center">
              <span class="inline-block h-4 w-4 rounded bg-yellow-300 ring-1 ring-yellow-400"></span>
              <span>Suggested pair</span>
            </div>
          </div>
        </div>

        <aside class="grid gap-6">
          <section class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 class="mb-4 text-lg font-semibold text-slate-900">Seat Overview</h2>
            <div class="grid gap-3 text-sm text-slate-600">
              <div class="rounded-xl bg-green-50 p-4 ring-1 ring-green-100">
                <p class="text-xs font-semibold uppercase tracking-wide text-green-700">Available Seats</p>
                <p id="available-count" class="mt-2 text-3xl font-bold text-green-700"></p>
              </div>
              <div class="rounded-xl bg-red-50 p-4 ring-1 ring-red-100">
                <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Reserved Seats</p>
                <p id="reserved-count" class="mt-2 text-3xl font-bold text-red-700"></p>
              </div>
              <div class="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
                <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Available Adjacent Pairs</p>
                <p id="pair-count" class="mt-2 text-3xl font-bold text-amber-700"></p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 class="mb-4 text-lg font-semibold text-slate-900">First Available Pair</h2>
            <p id="first-pair" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"></p>
          </section>

          <section class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 class="mb-4 text-lg font-semibold text-slate-900">Adjacent Seat Finder</h2>
            <button
              id="find-pair-button"
              type="button"
              class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Find Adjacent Seats
            </button>
            <p id="finder-result" class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">Click the button to locate the first available adjacent pair.</p>
          </section>
        </aside>
      </section>
    </main>
  `;

  const seatGrid = document.querySelector<HTMLDivElement>("#seat-grid");
  const availableCountElement = document.querySelector<HTMLParagraphElement>("#available-count");
  const reservedCountElement = document.querySelector<HTMLParagraphElement>("#reserved-count");
  const pairCountElement = document.querySelector<HTMLParagraphElement>("#pair-count");
  const firstPairElement = document.querySelector<HTMLParagraphElement>("#first-pair");
  const finderResultElement = document.querySelector<HTMLParagraphElement>("#finder-result");
  const findPairButton = document.querySelector<HTMLButtonElement>("#find-pair-button");
  if (
    !seatGrid ||
    !availableCountElement ||
    !reservedCountElement ||
    !pairCountElement ||
    !firstPairElement ||
    !finderResultElement ||
    !findPairButton
  ) {
    return;
  }

  const seating: SeatingGrid = initializeSeating();
  let highlightedPair: { row: number; seats: [number, number] } | null = null;

  const updateDashboard = (): void => {
    const { occupied, available } = countSeats(seating);
    const firstPair = findAdjacentSeats(seating);
    const pairCount = countAdjacentSeatPairs(seating);

    availableCountElement.textContent = String(available);
    reservedCountElement.textContent = String(occupied);
    pairCountElement.textContent = String(pairCount);
    firstPairElement.textContent = firstPair
      ? `Row ${firstPair.row}, seats ${firstPair.seats[0]} and ${firstPair.seats[1]}`
      : "No adjacent available seats found.";
  };

  const renderGrid = (): void => {
    seatGrid.innerHTML = "";

    const corner = document.createElement("div");
    corner.className = "flex h-10 items-center justify-center text-xs font-semibold uppercase tracking-wide text-slate-400";
    corner.textContent = "";
    seatGrid.appendChild(corner);

    for (let col = 1; col <= TOTAL_COLS; col += 1) {
      const columnLabel = document.createElement("div");
      columnLabel.className = "flex h-10 items-center justify-center text-sm font-semibold text-slate-500";
      columnLabel.textContent = String(col);
      seatGrid.appendChild(columnLabel);
    }

    for (let row = 1; row <= TOTAL_ROWS; row += 1) {
      const rowLabel = document.createElement("div");
      rowLabel.className = "flex items-center justify-center text-sm font-semibold text-slate-500";
      rowLabel.textContent = String(row);
      seatGrid.appendChild(rowLabel);

      for (let col = 1; col <= TOTAL_COLS; col += 1) {
        const occupied = seating[row - 1][col - 1] === 1;
        const isHighlighted =
          highlightedPair?.row === row && highlightedPair.seats.includes(col);

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = occupied ? "X" : "L";
        button.className = [
          "aspect-square w-full rounded-md text-sm font-bold shadow-sm transition",
          isHighlighted
            ? "cursor-pointer bg-yellow-300 text-slate-900 ring-2 ring-yellow-500"
            : occupied
            ? "cursor-not-allowed bg-red-500 text-white"
            : "cursor-pointer bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2",
        ].join(" ");

        button.setAttribute(
          "aria-label",
          `Row ${row} Seat ${col} ${occupied ? "occupied" : "available"}`
        );
        button.disabled = occupied;

        button.addEventListener("click", () => {
          highlightedPair = null;
          const result = reserveSeat(seating, row, col);
          if (result.startsWith("Success")) {
            renderGrid();
            updateDashboard();
          }
        });

        seatGrid.appendChild(button);
      }
    }
  };

  findPairButton.addEventListener("click", () => {
    highlightedPair = findAdjacentSeats(seating);

    finderResultElement.textContent = highlightedPair
      ? `Row ${highlightedPair.row}, seats ${highlightedPair.seats[0]} and ${highlightedPair.seats[1]} are available.`
      : "No adjacent available seats found.";

    renderGrid();
    updateDashboard();
  });

  renderGrid();
  updateDashboard();
}

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    renderCinemaUI();
  });
} else {
  // Run the cinema CLI scenarios when executed from the terminal.
  void import("./cinema-cli");
}

export {};
