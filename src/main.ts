if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLParagraphElement>("#app");
    if (app) {
      app.textContent = "If you can see this, Tailwind is working.";
    }
  });
} else {
  // Run the cinema CLI scenarios when executed from the terminal.
  void import("./cinema-cli");
}

export {};
