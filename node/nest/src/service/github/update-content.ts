import { GITHUB_PASSWORD, GITHUB_USERNAME } from './private';

const GitHub = require('github-api');

const gh = new GitHub({
  username: GITHUB_USERNAME,
  password: GITHUB_PASSWORD,
});

export async function insertText(
  repository: string,
  path: string,
  text: string,
  anchor: string = null
) {
  // 获取到 Repository 对象
  const repo = gh.getRepo('wxyyxc1992', repository);

  let content = (await repo.getContents('master', path, true)).data;

  if (anchor) {
    content = content.replace(anchor, anchor + '\n\n' + text);
  } else {
    // 插入最后一行
    content += '\n' + text;
  }

  await repo.writeFile('master', path, content, 'Update Content', {
    encode: true,
  });
}

// insertText(
//   'Coder-Knowledge-Management',
//   'Awesome-Reference/DataScienceAI/DataScienceAI-Reference.md',
//   '11',
//   '# Overview: 概念明晰与指南'
// ).then();

export async function searchRepo(key: string) {
  const result = await gh.search().forRepositories({ q: key });

  console.log(result);
}

searchRepo("DataScienceAI-Reference.md").then();