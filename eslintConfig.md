## VS Code

- Download (ESLint)[https://github.com/Microsoft/vscode-eslint] VS Code Extension
  Click on Extensions tab and search for ESLint

- Update VS Code settings
  Press Cmd + Shift + p. Search for "Preferences: Open Settings (JSON)"
  Add the following:

  "[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.esliont": true,
    }
  },
  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.esliont": true,
    }
  },
