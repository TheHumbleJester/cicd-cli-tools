import path from 'path';

import { getPackageProperty } from '../package-property';

describe('package-property', () => {
  describe('#packageProperty', () => {
    jest.doMock(
      path.resolve('./package.json'),
      () => ({
        version: '0.0.1',
        objectProperty: {
          arrayOfValues: ['One', 'Two', 'Three'],
        },
      }),
      { virtual: true },
    );

    jest.doMock(
      path.resolve('./lerna.json'),
      () => ({
        version: '0.0.42',
      }),
      { virtual: true },
    );

    let exitSpy: jest.SpyInstance;
    let writeSpy: jest.SpyInstance;
    beforeAll(() => {
      exitSpy = jest.spyOn(process, 'exit');
      writeSpy = jest.spyOn(process.stdout, 'write');
    });

    beforeEach(() => {
      exitSpy.mockImplementation(() => {});
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should display a root level property', () => {
      process.argv[2] = 'version';

      getPackageProperty();

      expect(writeSpy).toHaveBeenCalledWith('0.0.1');
    });

    it('should display a sub level property', () => {
      process.argv[2] = 'objectProperty.arrayOfValues[1]';

      getPackageProperty();

      expect(writeSpy).toHaveBeenCalledWith('Two');
    });

    it('should display an array', () => {
      process.argv[2] = 'objectProperty.arrayOfValues';

      getPackageProperty();

      expect(writeSpy).toHaveBeenCalledWith('One\nTwo\nThree');
    });

    it('should fail if value is an object', () => {
      process.argv[2] = 'objectProperty';

      getPackageProperty();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(writeSpy).not.toHaveBeenCalled();
    });

    it('should not do anything if no property is provided', () => {
      process.argv[2] = (undefined as unknown) as string;

      getPackageProperty();

      expect(writeSpy).not.toHaveBeenCalled();
    });

    it('should allow to read property from a specific filename', () => {
      process.argv[2] = 'version';
      process.argv[3] = 'lerna.json';

      getPackageProperty();

      expect(writeSpy).toHaveBeenCalledWith('0.0.42');
    });
  });
});
