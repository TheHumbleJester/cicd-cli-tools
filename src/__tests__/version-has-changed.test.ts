import path from 'path';
import { exec } from 'child_process';

import { versionHasChanged } from '../version-has-changed';

jest.mock('child_process');

describe('version-has-changed', () => {
  describe('#versionHasCHanged', () => {
    jest.doMock(path.resolve('./package.json'), () => ({ version: '0.0.1' }), { virtual: true });
    jest.doMock(path.resolve('./lerna.json'), () => ({ version: '0.0.2' }), { virtual: true });

    const execMock: jest.Mock = (exec as unknown) as jest.Mock;
    let exitSpy: jest.SpyInstance;
    beforeAll(() => {
      exitSpy = jest.spyOn(process, 'exit');
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

    it('should exit successfully if the version has change', async () => {
      execMock.mockImplementationOnce((_cmd, callback: Function) => {
        callback(null, { stdout: JSON.stringify({ version: '0.0.0' }) });
      });

      await versionHasChanged();

      expect(execMock).toHaveBeenCalledWith('git show HEAD~1:package.json', expect.any(Function));
      expect(exitSpy).toHaveBeenNthCalledWith(1, 0);
    });

    it("should not exit successfully if the version hasn't changed", async () => {
      execMock.mockImplementationOnce((_cmd, callback: Function) => {
        callback(null, { stdout: JSON.stringify({ version: '0.0.1' }) });
      });

      await versionHasChanged();

      expect(execMock).toHaveBeenCalledWith('git show HEAD~1:package.json', expect.any(Function));
    });

    it('should not exit successfully if an error occurs', async () => {
      execMock.mockImplementationOnce((_cmd, callback: Function) => {
        callback(new Error(), { stdout: '', stderr: 'Error' });
      });

      await versionHasChanged();

      expect(execMock).toHaveBeenCalledWith('git show HEAD~1:package.json', expect.any(Function));
      expect(exitSpy).toHaveBeenNthCalledWith(1, 1);
    });

    it('should accept an optional parameter allowing to define in what file it should look to the version number', async () => {
      process.argv[2] = 'lerna.json';

      execMock.mockImplementationOnce((_cmd, callback: Function) => {
        callback(null, { stdout: JSON.stringify({ version: '0.0.1' }) });
      });

      await versionHasChanged();

      expect(execMock).toHaveBeenCalledWith('git show HEAD~1:lerna.json', expect.any(Function));
      expect(exitSpy).toHaveBeenNthCalledWith(1, 0);
    });
  });
});
