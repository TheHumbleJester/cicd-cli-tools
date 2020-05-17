#!/bin/sh

version="$(node dist/package-property.js version)"
name = "$(node dist/package-property.js name)"

cp README.md dist
node dist/copy-package-file.js dist devDependencies scripts
node dist/create-github-release.js $CIRCLE_PROJECT_REPONAME $version && echo "Release \"$version\" created on \"$CIRCLE_PROJECT_REPONAME\""
npm publish && "\"$name@$version\" has been successfully published on NPM"
