# ESLint 9 Migration and Linting Fixes

## Overview

This branch addresses a security vulnerability in `js-yaml` (CVE-2025-64718 / SNYK-JS-JSYAML-13961110) by upgrading ESLint and related dependencies, and migrating to ESLint 9's new flat config format.

## Dependency Upgrades

- **eslint**: `^8.57.1` → `^9.0.0`
- **eslint-config-expensify**: `^2.0.59` → `^2.0.89`
- **@lwc/eslint-plugin-lwc**: `^1.8.2` → `^3.3.0` (required for ESLint 9 compatibility)

## Configuration Migration

### ESLint Flat Config

Migrated from the deprecated `.eslintrc.js` format to the new ESLint 9 flat config format:

- **Removed**: `.eslintrc.js` and `.eslintignore`
- **Added**: `eslint.config.mjs` (ES module format)

The new configuration:
- Uses ES module syntax (`import`/`export`)
- Directly imports and spreads `eslint-config-expensify` (already flat config compatible)
- Migrates ignore patterns from `.eslintignore` to the `ignores` property
- Maintains all existing rule overrides and customizations

## Linting Fixes

The upgraded `eslint-config-expensify` introduced stricter linting rules. All violations have been fixed:

### JSDoc Improvements (191+ fixes)
- Added missing `@param` type annotations throughout the codebase
- Fixed parameter name mismatches in JSDoc comments
- Files updated: `Logger.ts`, `ExpensiMark.ts`, `str.ts`, `utils.ts`, `md5.ts`, `fastMerge.ts`, `StepProgressBar.js`

### Code Style Modernization
- **For-of loops**: Converted traditional `for` loops to `for-of` loops (7 instances)
- **Array methods**: Replaced `.forEach()` with `for-of` loops (5 instances)
- Files updated: `BrowserDetect.jsx`, `ExpensiMark.ts`, `combobox.js`, `jquery.expensifyIframify.js`, `Templates.jsx`

### Unused Variables
- Removed unused catch variables (`err`, `exception`) where error details weren't needed
- Files updated: `Cookie.jsx`, `jquery.expensifyIframify.js`

### Empty Functions
- Added `eslint-disable-next-line` comments for intentional empty placeholder functions (9 instances)
- Files updated: `CopyText.jsx`, `PubSub.jsx`, form components (`combobox.js`, `dropdown.js`, `dropdownItem.js`, `onOffSwitch.jsx`, `switch.js`)

### Other Fixes
- Fixed `this` alias warning in `jquery.expensifyIframify.js`
- Fixed Prettier formatting issues

## Files Modified

### Configuration
- `package.json` - Dependency upgrades
- `eslint.config.mjs` - New ESLint flat config (replaces `.eslintrc.js`)

### Source Files (20+ files)
- `lib/API.jsx`
- `lib/BrowserDetect.jsx`
- `lib/components/CopyText.jsx`
- `lib/components/StepProgressBar.js`
- `lib/components/form/element/combobox.js`
- `lib/components/form/element/dropdown.js`
- `lib/components/form/element/dropdownItem.js`
- `lib/components/form/element/onOffSwitch.jsx`
- `lib/components/form/element/switch.js`
- `lib/Cookie.jsx`
- `lib/ExpensiMark.ts`
- `lib/fastMerge.ts`
- `lib/jquery.expensifyIframify.js`
- `lib/Logger.ts`
- `lib/md5.ts`
- `lib/PubSub.jsx`
- `lib/str.ts`
- `lib/Templates.jsx`
- `lib/utils.ts`

## Result

✅ All ESLint errors resolved
✅ Linting passes with zero errors and zero warnings
✅ Codebase modernized to use ESLint 9 flat config format
✅ Security vulnerability addressed

