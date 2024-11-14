#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const micromatch = require("micromatch");
const {walk} = require("node-os-walk");
const ignore = require("ignore");


/**
 * Lists all files in the current directory (excluding .git folder and .gitignore entries) and reads their contents.
 *
 * @returns {object} - A dictionary where keys are file paths and values are their contents.
 */
async function listAndReadRepoFiles() {
    const rootPath = process.cwd();

    const gitignorePath = path.join(rootPath, '.gitignore');
    const gitIgnorePatterns = fs.existsSync(gitignorePath)
        ? fs
            .readFileSync(gitignorePath, 'utf-8')
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'))
            .map(line => line.endsWith("/") ? `${line}**/*` : line)
        : [];

    const gitPatternsBlacklist = [
        'fullrepo.txt',
        'package-lock.json',
        'yarn.lock',
        '*.png',
        '*.jpg',
        '*.jpeg',
        '*.gif',
        '*.svg',
        '*.ico',
        '*.pdf',
        '*.zip',
        '*.tar.gz',
        '*.rar',
        '*.7z',
        '*.mp3',
        '*.mp4',
        '*.wav',
        '*.mov',
        '*.avi'
    ];
    gitIgnorePatterns.push(gitPatternsBlacklist)
    const ig = ignore().add(gitIgnorePatterns);

    const otherBlacklistPatterns = [".git/**/*"];


    const fileContents = {};
    for await (const [root, _, files] of walk(rootPath)) {
        for (const file of files) {
            const filePath = path.resolve(root, file.name);
            const relativeFilePath = filePath.slice(rootPath.length + 1);
            // Exclude .gitignore and blacklist patterns
            if (!ig.ignores(relativeFilePath) && !shouldIgnore(rootPath, filePath, otherBlacklistPatterns)) {
                console.log(relativeFilePath)
                try {
                    fileContents[relativeFilePath] = fs.readFileSync(filePath, 'utf-8');
                } catch (e) {
                    console.error(`An unexpected error occurred while reading ${filePath}: ${e}`);
                }
            }
        }
    }
    return fileContents;
}

/**
 * Checks if a file path should be ignored based on .gitignore patterns.
 *
 * @param {string} rootPath - The absolute path to the root directory being checked.
 * @param {string} filePath - The file path to check.
 * @param {string[]} ignorePatterns - An array of .gitignore patterns.
 * @returns {boolean} - True if the file path should be ignored, false otherwise.
 */
function shouldIgnore(rootPath, filePath, ignorePatterns) {
    const relativePath = filePath.slice(rootPath.length + 1);
    return ignorePatterns.some(pattern => {
        return micromatch.isMatch(relativePath, pattern, {dot: true})
    });
}

async function main() {
    const fileData = await listAndReadRepoFiles();

    let output = "";
    for (const filePath in fileData) {
        output += `<file path="${filePath}">\n`;
        output += fileData[filePath];
        output += "\n</file>\n";
    }

    fs.writeFileSync("fullrepo.txt", output);
    const stats = fs.statSync("fullrepo.txt");
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    console.log("File data written to fullrepo.txt");
    if (fileSizeInMegabytes > 10) {
        console.warn(`Warning: fullrepo.txt is ${fileSizeInMegabytes.toFixed(2)} MB. This may be too large.`);
    }
}

main().then(() => 0).catch(e => {
    console.error(e);
    return 1;
});