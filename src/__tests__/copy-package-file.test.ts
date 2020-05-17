import path from 'path';
import fs from 'fs';

import { copyPackageFile } from '../copy-package-file';

jest.mock('fs', () => {
  const actualFs: any = jest.requireActual('fs');

  return {
    ...actualFs,
    writeFile: jest.spyOn(actualFs, 'writeFile'),
  };
});

describe('version-has-changed', () => {
  describe('#versionHasCHanged', () => {
    jest.doMock(
      path.resolve('./package.json'),
      () => ({
        name: 'test',
        version: '0.0.1',
        devDependencies: {
          dep1: 'version1',
          dep2: 'version1',
          dep3: 'version1',
        },
        scripts: {
          script1: 'cmd1',
          script2: 'cmd2',
        },
      }),
      { virtual: true },
    );

    const writeFileSpy = (fs.writeFile as unknown) as jest.SpyInstance;

    beforeEach(() => {
      writeFileSpy.mockImplementation((_file: string, _content: string, cb: Function) => {
        cb();
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should copy the package.json file in the given directory by omitting given properties', async () => {
      process.argv = ['', '', './dist', 'devDependencies', 'scripts.script1'];

      await copyPackageFile();

      expect(writeFileSpy).toHaveBeenCalledWith(
        path.resolve('./dist/package.json'),
        JSON.stringify(
          {
            name: 'test',
            version: '0.0.1',
            scripts: {
              script2: 'cmd2',
            },
          },
          null,
          2,
        ),
        expect.any(Function),
      );
    });
  });
});
