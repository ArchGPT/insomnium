# Insomnium API Client

Insomnium is a local-only, open-source, cross-platform API client for GraphQL, REST, WebSockets, Server-sent events and gRPC.

[![license](https://img.shields.io/github/license/Kong/insomnia.svg)](LICENSE)

![Insomnium API Client](https://raw.githubusercontent.com/ArchGPT/insomnium/develop/screenshots/main.png)

## Backstory

Insomnium is a fork of [Kong/Insomnium at 2023.5.8](https://github.com/ArchGPT/insomnia), the last commit before compulsory account login was introduced. 

In a sense, Insomnium is a community response to [the latest product update that forces account creation w/o warning](https://news.ycombinator.com/item?id=37680522).

![HN](https://github.com/ArchGPT/insomnium/blob/main/hn.png?raw=true)


<!-- ## Download

Insomnium is available for Mac, Windows, and Linux and can be downloaded
from the website. -->

<!-- **[https://insomnia.rest/download](https://insomnia.rest/download/)** -->

## Bugs and Feature Requests

Have a bug or a feature request? First, read the
[issue guidelines](CONTRIBUTING.md#using-the-issue-tracker) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/ArchGPT/insomnium/issues).

<!-- For more generic product questions and feedback, join the [Slack Team](https://chat.insomnia.rest). -->

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md). Included are directions for opening issues, coding standards, and notes on development.

## Documentation

Check out our open-source [Insomnium Documentation](https://docs.insomnia.rest/).

## Develop Insomnium

Development on Insomnium can be done on Mac, Windows, or Linux as long as you have [Node.js](https://nodejs.org) and [Git](https://git-scm.com/). See the `.nvmrc` file located in the project for the correct Node version.

<details>
<summary>Initial Dev Setup</summary>

This repository is structured as a monorepo and contains many Node.JS packages. Each package has its own set of commands, but the most common commands are available from the root [`package.json`](package.json) and can be accessed using the `npm run …` command. Here are the only three commands you should need to start developing on the app.

```shell
# Install and Link Dependencies
npm i

# Run Lint
npm run lint

# Run type checking
npm run type-check

# Run Tests
npm test

# Start App with Live Reload
npm run dev
```

### Linux

If you are on Linux, you may need to install the following supporting packages:

<details>
<summary>Ubuntu/Debian</summary>

```shell
# Update library
sudo apt-get update

# Install font configuration library & support
sudo apt-get install libfontconfig-dev
```

</details>

<details>
<summary>Fedora</summary>

```shell
# Install libcurl for node-libcurl
sudo dnf install libcurl-devel
```

</details>

Also on Linux, if Electron is failing during the install process, run the following

```shell
# Clear Electron install conflicts
rm -rf ~/.cache/electron
```

### Windows

If you are on Windows and have problems, you may need to install [Windows Build Tools](https://github.com/felixrieseberg/windows-build-tools)

</details>

<details>
<summary>Editor Requirements</summary>

You can use any editor you'd like, but make sure to have support/plugins for the following tools:

- [ESLint](http://eslint.org/) - For catching syntax problems and common errors
- [JSX Syntax](https://facebook.github.io/react/docs/jsx-in-depth.html) - For React components

</details>

## Develop Inso CLI

- `npm i`
- Start the compiler in watch mode: `npm run inso-start`
- Run: `./packages/insomnia-inso/bin/inso -v`

## License

[MIT](LICENSE)
