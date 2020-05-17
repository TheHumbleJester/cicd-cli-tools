#!/usr/bin/env node

import path from 'path';
import get from 'lodash.get';

export function getPackageProperty() {
  const property = process.argv[2];
  if (property) {
    /* eslint-disable import/no-dynamic-require, global-require */
    const pkg = require(path.resolve('./package.json'));
    const value = get(pkg, property);
    if (!value || (typeof value === 'object' && !(value instanceof Array))) {
      process.exit(1);
      return;
    }
    process.stdout.write((typeof value === 'string' ? [value] : value).join('\n'));
  }
}

/* istanbul ignore if */
if (!module.parent) {
  getPackageProperty();
}
