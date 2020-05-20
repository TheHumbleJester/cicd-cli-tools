import path from 'path';
import fs from 'fs';

import { setPackageValue } from '../set-package-value';

jest.mock('fs', () => {
  const actualFs: any = jest.requireActual('fs');

  return {
    ...actualFs,
    writeFile: jest.spyOn(actualFs, 'writeFile'),
  };
});

describe('set-package-value', () => {
  describe('#setPackageValue', () => {
    jest.doMock(
      path.resolve('./package.json'),
      () => ({
        name: 'test',
        version: '0.0.1',
        devDependencies: {
          dep1: 'version1',
          dep2: 'version2',
          dep3: 'version3',
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

    it('it should allow to update package.json value', async () => {
      process.argv = ['', '', 'devDependencies.dep2', '42'];

      await setPackageValue();

      expect(writeFileSpy).toHaveBeenCalledWith(
        path.resolve('./package.json'),
        JSON.stringify(
          {
            name: 'test',
            version: '0.0.1',
            devDependencies: {
              dep1: 'version1',
              dep2: '42',
              dep3: 'version3',
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
