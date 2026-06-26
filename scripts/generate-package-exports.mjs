/**
 * Generates the package.json `exports` map after the CJS and ESM builds complete.
 *
 * Scans dist/ for every compiled entry point (top-level modules, components, mixins, etc.) and
 * writes canonical subpath exports such as `expensify-common/Device` and `expensify-common/utils`.
 * Each subpath points at the matching CJS file for `require`, the ESM file in dist/esm for
 * `import` when available, and the shared .d.ts for types. The barrel entry (`.`) is configured
 * separately to use the CJS index for both import and require.
 *
 * Run as the final step of `npm run build`; it overwrites `package.json` exports in place.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(dirname, "..");
const distDir = path.join(packageRoot, "dist");
const esmDir = path.join(distDir, "esm");

/**
 * Collects every compiled JS entry under dist/, excluding the ESM output tree.
 *
 * @param {string} directory
 * @param {string} [relativePath]
 * @returns {string[]}
 */
function collectCjsEntryPaths(directory, relativePath = "") {
  const entries = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "esm") {
      continue;
    }

    const entryRelativePath = relativePath
      ? `${relativePath}/${entry.name}`
      : entry.name;

    if (entry.isDirectory()) {
      entries.push(
        ...collectCjsEntryPaths(
          path.join(directory, entry.name),
          entryRelativePath,
        ),
      );
      continue;
    }

    if (!entry.name.endsWith(".js") || entry.name === "cli.esm.js") {
      continue;
    }

    entries.push(entryRelativePath.replace(/\.js$/, ""));
  }

  return entries.sort();
}

function hasEsmBuild(relativePathWithoutExtension) {
  return fs.existsSync(path.join(esmDir, `${relativePathWithoutExtension}.js`));
}

function createSubpathExport(relativePathWithoutExtension) {
  const typesPath = `./dist/${relativePathWithoutExtension}.d.ts`;
  const requirePath = `./dist/${relativePathWithoutExtension}.js`;
  const exportEntry = {
    types: typesPath,
    require: requirePath,
  };

  if (hasEsmBuild(relativePathWithoutExtension)) {
    exportEntry.import = `./dist/esm/${relativePathWithoutExtension}.js`;
    exportEntry.default = exportEntry.import;
  } else {
    exportEntry.default = requirePath;
  }

  return exportEntry;
}

function buildExportsMap() {
  const entryPaths = collectCjsEntryPaths(distDir);
  const exportsMap = {
    ".": {
      types: "./dist/index.d.ts",
      // The barrel re-exports the full legacy graph (jQuery, lodash, React, etc.). Keep CJS as the
      // ESM entry so native Node `import` and bundlers resolve the same stable build.
      import: "./dist/index.js",
      require: "./dist/index.js",
      default: "./dist/index.js",
    },
  };

  for (const entryPath of entryPaths) {
    if (entryPath === "index") {
      continue;
    }

    const subpathExport = createSubpathExport(entryPath);

    exportsMap[`./${entryPath}`] = subpathExport;
  }

  return exportsMap;
}

function main() {
  const packageJsonPath = path.join(packageRoot, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.exports = buildExportsMap();

  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log(
    `Updated package.json exports with ${Object.keys(packageJson.exports).length} entries.`,
  );
}

main();
