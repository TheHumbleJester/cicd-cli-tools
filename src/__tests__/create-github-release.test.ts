import github from 'octonode';

import { createGithubRelease } from '../create-github-release';

describe('create-github-release', () => {
  describe('#createGithubRelease', () => {
    const clientSpy = jest.spyOn(github, 'client');
    const repoMock = jest.fn();
    const releaseMock = jest.fn();
    let exitSpy: jest.SpyInstance;
    let writeSpy: jest.SpyInstance;

    beforeAll(() => {
      exitSpy = jest.spyOn(process, 'exit');
      writeSpy = jest.spyOn(process.stderr, 'write');
    });

    beforeEach(() => {
      exitSpy.mockImplementation(() => {});
      clientSpy.mockReturnValue({ repo: repoMock });
      repoMock.mockReturnValue({ release: releaseMock });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('should create a new github release on the given repo and with the given tag', async () => {
      process.env.GITHUB_TOKEN = 'test_github_token';
      process.argv[2] = 'test_repo_name';
      process.argv[3] = 'test_tag';
      releaseMock.mockImplementationOnce((_data, cb: Function) => {
        cb();
      });

      await createGithubRelease();

      expect(clientSpy).toHaveBeenCalledWith('test_github_token');
      expect(repoMock).toHaveBeenCalledWith('test_repo_name');
      expect(releaseMock).toHaveBeenCalledWith(
        {
          tag_name: 'test_tag',
          draft: false,
        },
        expect.any(Function),
      );
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('should exit with failure if an error occurs while creating the release', async () => {
      process.env.GITHUB_TOKEN = 'test_github_token';
      process.argv[2] = 'test_repo_name';
      process.argv[3] = 'test_tag';
      releaseMock.mockImplementationOnce((_data, cb: Function) => {
        cb({ body: { message: 'test_error_message' } });
      });

      await createGithubRelease();

      expect(clientSpy).toHaveBeenCalledWith('test_github_token');
      expect(repoMock).toHaveBeenCalledWith('test_repo_name');
      expect(releaseMock).toHaveBeenCalledWith(
        {
          tag_name: 'test_tag',
          draft: false,
        },
        expect.any(Function),
      );
      expect(writeSpy).toHaveBeenCalledWith('test_error_message\n');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('should exit with failure if the GITHUB_TOKEN env variable does not exist', async () => {
      delete process.env.GITHUB_TOKEN;

      await createGithubRelease();

      expect(writeSpy).toHaveBeenCalledWith('GITHUB_TOKEN env variable does not exist\n');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
