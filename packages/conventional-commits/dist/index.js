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
exports.conventionalCommit = conventionalCommit;
const Enquirer = __importStar(require("enquirer"));
const child_process_1 = require("child_process");
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
    debug: '🐞',
};
const questions = [
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
            'debug',
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
const terminal = (command = '') => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error)
                return reject(error);
            if (stderr)
                return reject(stderr);
            resolve(stdout);
        });
    });
};
async function conventionalCommit() {
    const answers = await prompt(questions);
    let feature = (answers.package ?? '').trim() !== '' && (answers.feature ?? '').trim() !== '' ? `${answers.package} | ${answers.feature}` : answers.package || answers.feature;
    feature = feature ? `(${feature})` : '';
    const commit = `${commitTypes[answers.commitType]}${answers.commitType}${feature}: ${answers.commitMessage}`;
    try {
        const output = await terminal('git diff --cached').catch(() => Promise.resolve(null));
        if (!output)
            await terminal('git add --all');
        const result = await terminal(`git commit -m "${commit}"`);
        console.log(result);
    }
    catch (err) {
        console.error('/!\\ ERROR /!\\\n', err, '\n/!\\ COMMIT MESSAGE /!\\\n', commit, '\n==========================================');
    }
}
