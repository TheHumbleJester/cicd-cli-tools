#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import set from 'lodash.set';

const writeAsync = promisify(fs.writeFile);

export async function setPackageValue() {
  /* eslint-disable import/no-dynamic-require, global-require */
  const pkg = require(path.resolve('./package.json'));
  const property = process.argv[2];
  const value = process.argv[3];

  set(pkg, property, value);

  await writeAsync(path.resolve('./package.json'), JSON.stringify(pkg, null, 2));
}

/* istanbul ignore if */
if (!module.parent) {
  setPackageValue();
}
