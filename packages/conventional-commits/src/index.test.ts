import { conventionalCommit } from './index';
import * as Enquirer from 'enquirer';
import { exec } from 'child_process';

jest.mock('enquirer', () => ({
  ...jest.requireActual('enquirer'),
  __esModule: true,
  default: { prompt: jest.fn() }
}));

jest.mock('child_process');

describe('conventionalCommit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a commit with the correct message', async () => {
    // Mock prompt answers
    const promptMock = jest.spyOn((Enquirer as any).default, 'prompt').mockResolvedValue({
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
    promptMock.mockRestore();  
  });

  it('should handle git commit errors', async () => {
    // Mock prompt answers
    const promptMock = jest.spyOn((Enquirer as any).default, 'prompt').mockResolvedValue({
      commitType: 'fix',
      package: 'external-promises',
      feature: 'bug',
      commitMessage: 'fix bug',
    });

    // Mock exec to simulate git commands
    ((exec as unknown) as jest.Mock).mockImplementation((cmd, cb) => {
      if (cmd.startsWith('git diff')) cb(null, '', '');
      else if (cmd.startsWith('git add')) cb(null, '', '');
      else if (cmd.startsWith('git commit')) cb(new Error('commit failed'), '', '');
    });

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await conventionalCommit();
    const err = new Error('commit failed');
    expect(errorSpy).toHaveBeenCalledWith('/!\\ ERROR /!\\\n', err, '/!\\ COMMIT MESSAGE /!\\\n', '🐛fix(external-promises|bug): fix bug', '\n==========================================');
    errorSpy.mockRestore();
  });
});
