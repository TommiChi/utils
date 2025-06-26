"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const Enquirer = __importStar(require("enquirer"));
const child_process_1 = require("child_process");
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
        const promptMock = jest.spyOn(Enquirer.default, 'prompt').mockResolvedValue({
            commitType: 'feat',
            package: 'external-promises',
            feature: 'new-feature',
            commitMessage: 'add new feature',
        });
        // Mock exec to simulate git commands
        child_process_1.exec.mockImplementation((cmd, cb) => {
            if (cmd.startsWith('git diff'))
                cb(null, '', '');
            else if (cmd.startsWith('git add'))
                cb(null, '', '');
            else if (cmd.startsWith('git commit'))
                cb(null, 'commit success', '');
        });
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        await (0, index_1.conventionalCommit)();
        expect(logSpy).toHaveBeenCalledWith('commit success');
        logSpy.mockRestore();
        promptMock.mockRestore();
    });
    it('should handle git commit errors', async () => {
        // Mock prompt answers
        const promptMock = jest.spyOn(Enquirer.default, 'prompt').mockResolvedValue({
            commitType: 'fix',
            package: 'external-promises',
            feature: 'bug',
            commitMessage: 'fix bug',
        });
        // Mock exec to simulate git commands
        child_process_1.exec.mockImplementation((cmd, cb) => {
            if (cmd.startsWith('git diff'))
                cb(null, '', '');
            else if (cmd.startsWith('git add'))
                cb(null, '', '');
            else if (cmd.startsWith('git commit'))
                cb(new Error('commit failed'), '', '');
        });
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        await (0, index_1.conventionalCommit)();
        const err = new Error('commit failed');
        expect(errorSpy).toHaveBeenCalledWith('/!\\ ERROR /!\\\n', err, '\n/!\\ COMMIT MESSAGE /!\\\n', '🐛fix(external-promises | bug): fix bug', '\n==========================================');
        errorSpy.mockRestore();
    });
});
