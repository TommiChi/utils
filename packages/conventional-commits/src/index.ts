import * as Enquirer from 'enquirer';
import { exec } from 'child_process';

export type ConventionalQuestion = {
  type: 'select' | 'input';
  name: 'commitType' | 'package' | 'feature' | 'commitMessage';
  message: string;
  choices?: (keyof typeof commitTypes)[];
};

export type ConventionalAnswers = {
  commitType: keyof typeof commitTypes;
  package: string;
  feature: string;
  commitMessage: string;
};

const { prompt } = Enquirer.default;

const commitTypes = {
  build: '🛠',
  chore: '♻️',
  ci: '⚙️',
  docs: '📚',
  feat: '✨',
  fix: '🐛',
  perf: '🚀',
  refactor: '📦',
  revert: '🗑',
  style: '💎',
  test: '🚨',
};

const questions: ConventionalQuestion[] = [
  {
    type: 'select',
    name: 'commitType',
    message: 'What kind of commit are you making?',
    choices: [
      'feat',
      'fix',
      'docs',
      'style',
      'refactor',
      'perf',
      'test',
      'build',
      'ci',
      'chore',
      'revert',
    ],
  },
  {
    type: 'input',
    name: 'package',
    message: 'In what package are your changes taking place?',
  },
  {
    type: 'input',
    name: 'feature',
    message: 'What feature were you working on?',
  },
  {
    type: 'input',
    name: 'commitMessage',
    message: 'Enter your commit message:',
  },
];

const terminal = (command = ''): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
};

export async function conventionalCommit() {
  const answers: ConventionalAnswers = await prompt(questions);
  const commit = `${commitTypes[answers.commitType]}${answers.commitType}(${answers.package}|${answers.feature}): ${answers.commitMessage}`;

  try {
    const output = await terminal('git diff --cached').catch(() => Promise.resolve(null));
    if (!output) await terminal('git add --all');
    const result = await terminal(`git commit -m "${commit}"`);
    console.log(result);
  } catch(err) {
    console.error('/!\\ ERROR /!\\\n', err, '/!\\ COMMIT MESSAGE /!\\\n', commit, '\n==========================================');
  }
}
