import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(dirname, "..");
const distDir = path.join(packageRoot, "dist");
const esmDir = path.join(distDir, "esm");

/**
 * Collects every compiled JS entry under dist/, excluding the ESM output tree.
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

    // Canonical subpath without `dist/` prefix (e.g. expensify-common/Device).
    exportsMap[`./${entryPath}`] = subpathExport;

    // Backward-compatible `dist/` prefix (e.g. expensify-common/dist/Device).
    exportsMap[`./dist/${entryPath}`] = subpathExport;
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
