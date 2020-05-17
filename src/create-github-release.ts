#!/usr/bin/env node

import github from 'octonode';

function createTag(token: string, repo: string, tag: string) {
  return new Promise((resolve, reject) => {
    github
      .client(token)
      .repo(repo)
      .release(
        {
          tag_name: tag,
          draft: false,
        },
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
  });
}

export async function createGithubRelease() {
  const repositoryName = process.argv[2];
  const tag = process.argv[3];
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    process.stderr.write('GITHUB_TOKEN env variable does not exist\n');
    process.exit(1);
    return;
  }
  try {
    await createTag(token, repositoryName, tag);
  } catch (e) {
    process.stderr.write(`${e.body.message}\n`);
    process.exit(1);
  }
}

/* istanbul ignore if */
if (!module.parent) {
  createGithubRelease();
}
