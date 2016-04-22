#!/bin/bash

echo Current version:
sed -n -e '/"version"/p' package.json

echo What is the new version?
read targetVersion

echo Cleaning dist directory...
rm -rf dist
mkdir dist

echo Building...
npm run build

echo Committing build
git add .
git commit -m "build version $targetVersion"

echo Tagging release...
git tag -a "$targetVersion" -m "$targetVersion"
