# Repository Contextualizer for AI Prompting

This Node.js CLI application reads all files in the current directory, excluding those specified in the `.gitignore`
file and a hardcoded blacklist, and aggregates them into a single output file named `fullrepo.txt`.

When run from the root of your repository, it effectively builds a context you can use to prompt AI's with.

## Features

* Reads all files in the current directory.
* Excludes files and directories specified in the `.gitignore` file.
* Excludes a hardcoded blacklist of files and directories.
  *   `package-lock.json`
  *   `yarn.lock`
  *   `.git/**/*`
  *   `fullrepo.txt`
  *   `package-lock.json`
  *   `yarn.lock`
  *   `*.png`
  *   `*.jpg`
  *   `*.jpeg`
  *   `*.gif`
  *   `*.svg`
  *   `*.ico`
  *   `*.pdf`
  *   `*.zip`
  *   `*.tar.gz`
  *   `*.rar`
  *   `*.7z`
  *   `*.mp3`
  *   `*.mp4`
  *   `*.wav`
  *   `*.mov`
  *   `*.av`
* Aggregates file contents into a single output file (`fullrepo.txt`).
* Wraps each file's content in an XML-like "envelope" with the file path as an attribute.
```
<file path=.........>
...content ....
</file> 
```
* Warns if the output file exceeds 10MB in size.

## Usage
```bash
npx @mashtuntech/repo-to-ai-context@latest
```

You can install the package globally and run it without the @mashtuntech scope but be sure to update to latest version periodically
```bash
npm install -g @mashtuntech/repo-to-ai-context@latest
npx repo-to-ai-context
```
