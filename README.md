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
* Aggregates file contents into a single output file (`fullrepo.txt`).
* Wraps each file's content in an XML-like "envelope" with the file path as an attribute.
```
<file path=.........>
...content ....
</file> 
```
* Warns if the output file exceeds 10MB in size.

## Installation

```bash
npm install @mashtuntech/repo-to-ai-context
```

## Usage
```bash
npx repo-to-ai-context
```