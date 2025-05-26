import { conventionalCommit } from './index';
import * as Enquirer from 'enquirer';
import { exec } from 'child_process';

jest.mock('enquirer');
jest.mock('child_process');

describe('conventionalCommit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a commit with the correct message', async () => {
    // (console.warn as any)('/************************\n', Enquirer.default, '\n************************/')
    // Mock prompt answers
    Enquirer.default.prompt = jest.fn();
    (Enquirer.default.prompt as jest.Mock).mockResolvedValue({
      commitType: 'feat',
      package: 'external-promises',
      feature: 'new-feature',
      commitMessage: 'add new feature',
    });

    // Mock exec to simulate git commands
    ((exec as unknown) as jest.Mock).mockImplementation((cmd, cb) => {
      if (cmd.startsWith('git diff')) cb(null, '', '');
      else if (cmd.startsWith('git add')) cb(null, '', '');
      else if (cmd.startsWith('git commit')) cb(null, 'commit success', '');
    });

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await conventionalCommit();
    expect(logSpy).toHaveBeenCalledWith('commit success');
    logSpy.mockRestore();
  });

  // it('should handle git commit errors', async () => {
  //   (Enquirer.default.prompt as jest.Mock).mockResolvedValue({
  //     commitType: 'fix',
  //     package: 'external-promises',
  //     feature: 'bug',
  //     commitMessage: 'fix bug',
  //   });
  //   ((exec as unknown) as jest.Mock).mockImplementation((cmd, cb) => {
  //     if (cmd.startsWith('git diff')) cb(null, '', '');
  //     else if (cmd.startsWith('git add')) cb(null, '', '');
  //     else if (cmd.startsWith('git commit')) cb(new Error('commit failed'), '', '');
  //   });
  //   const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  //   await conventionalCommit();
  //   expect(errorSpy).toHaveBeenCalled();
  //   errorSpy.mockRestore();
  // });
});
