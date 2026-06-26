import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const esmDir = path.resolve(dirname, "../dist/esm");

const relativeImportPattern =
  /(?<=(?:from|export \* from) )(['"])(\.\.?\/[^'"]+?)\1/g;

function addJsExtensionToRelativeImports(source) {
  return source.replace(relativeImportPattern, (match, quote, importPath) => {
    if (importPath.endsWith(".js")) {
      return match;
    }

    return match.replace(importPath, `${importPath}.js`);
  });
}

function walkAndFix(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkAndFix(entryPath);
      continue;
    }

    if (!entry.name.endsWith(".js")) {
      continue;
    }

    const originalSource = fs.readFileSync(entryPath, "utf8");
    const updatedSource = addJsExtensionToRelativeImports(originalSource);

    if (updatedSource !== originalSource) {
      fs.writeFileSync(entryPath, updatedSource);
    }
  }
}

walkAndFix(esmDir);
console.log("Added .js extensions to relative imports in dist/esm.");
