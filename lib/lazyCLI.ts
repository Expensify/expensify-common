// CLI is a generic class; the lazy proxy only needs the runtime constructor shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CLIConstructor = any;

function loadCLI(): CLIConstructor {

  return require("./CLI.js").default;
}

/**
 * Lazily loads CLI on first access so importing other expensify-common symbols does not
 * pull Node-only dependencies (e.g. readline) into environments like Metro.
 */
const CLI: CLIConstructor = new Proxy((() => {}), {
  get(_target, prop, receiver) {
    const cli = loadCLI();
    const value = Reflect.get(cli, prop, receiver);
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(cli)
      : value;
  },
  construct(_target, argArray, newTarget) {
    return Reflect.construct(loadCLI(), argArray, newTarget);
  },
});

export default CLI;
