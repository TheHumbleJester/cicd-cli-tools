#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import set from 'lodash.set';

const writeAsync = promisify(fs.writeFile);

export async function copyPackageFile() {
  /* eslint-disable import/no-dynamic-require, global-require */
  const pkg = require(path.resolve('./package.json'));
  const directory = process.argv[2];
  const propsToRemove = process.argv.slice(3);

  propsToRemove.forEach((prop) => {
    set(pkg, prop, undefined);
  });

  await writeAsync(path.resolve(directory, 'package.json'), JSON.stringify(pkg, null, 2));
}

/* istanbul ignore if */
if (!module.parent) {
  copyPackageFile();
}
