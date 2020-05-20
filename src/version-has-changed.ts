#!/usr/bin/env node

import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function versionHasChanged() {
  const file = process.argv[2] || 'package.json';
  /* eslint-disable-next-line import/no-dynamic-require, global-require */
  const pkg = require(path.resolve(`./${file}`));
  const currentVersion = pkg.version;
  try {
    const prevPkg = await execAsync(`git show HEAD~1:${file}`);
    const previousVersion = JSON.parse(prevPkg.stdout).version;

    if (currentVersion !== previousVersion) {
      process.exit(0);
    }
  } catch (e) {
    // continue regardless of error
  }
  process.exit(1);
}

/* istanbul ignore if */
if (!module.parent) {
  versionHasChanged();
}
