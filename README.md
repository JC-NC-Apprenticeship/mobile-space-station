# Mobile course

## Required dependencies

Please make sure you are using yarn to install the packages, as we depend on
the `yarn.lock` file to ensure the exact version number of all dependencies.

To install `yarn` globally please [read the official docs](https://classic.yarnpkg.com/en/docs/install).

You will need to install the `expo` app on your phone. When running our
application on your local machine, you can scan the generated QR code to
load the application into expo on your mobile.

## Installation

`yarn install`
`yarn start`

## Gotchas

If you experience an error that complains about too many open files along this format:

```sh
Error: EMFILE: too many open files, watch at FSEvent.FSWatcher._handle.onchange (internal/fs/watchers.js:178:28)
```

You can fix this issue by installing watchman. Using brew, this would be:

```sh
brew update
brew install watchman
```

This should solve this issue.
