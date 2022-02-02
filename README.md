<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
    <img src="public/cypress_runner_big.png" alt="Logo">

  <p align="center">
    Welcome to Cypress Runner Docs!
    <br />
    ¯\_(ツ)_/¯
    <br />
    <a href="https://github.com/G-Fidalgo/cypress-runner"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/G-Fidalgo/cypress-runner/issues">Report Bug</a>
    ·
    <a href="https://github.com/G-Fidalgo/cypress-runner/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#features">Features</a></li>
    <li><a href="#extension-settings">Extension Settings</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Features

Simple way to run a single (or multiple) Cypress tests from Code Lens, automatically adding or removing .only to the single test or block you would like to run

Also available the possibility to remove all .only added from a single button on status bar

![Extension Example](./public/run_only.gif)

<p align="center">(<a href="#top">🔝 Back to top 🔝</a>)</p>

## Running Cypress Runner on Monorepos

If you want to use Cyppress Runner with mono repo, depending on your configuration, you migth need to change the extension settings in order to modify the cypress runner command, for example if you are working with Nx, you migth have a custom command to run Cypress test as so

_workspace.json_

```
{"ui-e2e": {{
      "root": "apps/ui-e2e",
      "sourceRoot": "apps/ui-e2e/src",
      "projectType": "application",
      "targets": {
        "cypress": {
          "executor": "@nrwl/cypress:cypress",
          "options": {
            "cypressConfig": "apps/ui-e2e/cypress.json",
            "devServerTarget": "ui:serve"
          },
          "configurations": {
            "production": {
              "devServerTarget": "ui:serve:production"
            }
          }
        },
        "lint": {
          "executor": "@nrwl/linter:eslint",
          "outputs": ["{options.outputFile}"],
          "options": {
            "lintFilePatterns": ["apps/ui-e2e/**/*.{js,ts}"]
          }
        }
      },
```

Then to properly compile and run all the test you will need to modify over extension settings

```
cypressrunner.cypressCommand: nx run ui-e2e:cypress
```

Now the extension instead of looking for your installed Cypress to execute the file, will execute the NX command with all the other configurations

<p align="center">(<a href="#top">🔝 Back to top 🔝</a>)</p>

## Extension Settings

Cypress Runner will work out of the box, with a valid Cypress config.  
If you have a custom setup use the following options to configure Cypress Runner:

| Command                                      | Description                                                                                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cypressrunner.templates                      | Array to control extension behaviour over codeLens                                                                                                                      |
| cypressrunner.removeAllOnlyButton            | Control if you want to see Remove All Only button over status bar                                                                                                       |
| cypressrunner.configPath                     | Cypress config path (relative to ${workFolder} e.g. cypress-config.json)                                                                                                |
| cypressrunner.cypressPath                    | Absolute path to cypress bin file (e.g. /usr/lib/node_modules/cypress/bin/cypress.js)                                                                                   |
| cypressrunner.projectPath                    | Absolute path to project directory (e.g. /home/me/my-project/sub-folder)                                                                                                |
| cypressrunner.runOptions                     | Add CLI Options to the Jest Command (e.g. `"cypressrunner.runOptions": ["--browser chrome", "--quiet"]`) https://docs.cypress.io/guides/guides/command-line#cypress-run |
| cypressrunner.cypressCommand                 | Define an alternative Cypress command (e.g. for nx run ui-e2e:cypress)                                                                                                  |
| cypressrunner.codeLensSelector               | CodeLens will be shown on files matching this pattern (default \*_/_.{test,spec}.{js,jsx,ts,tsx})                                                                       |
| cypressrunner.changeDirectoryToWorkspaceRoot | Changes directory to workspace root before executing the test                                                                                                           |

<p align="center">(<a href="#top">🔝 Back to top 🔝</a>)</p>

## Contributing

<p align="center">(<a href="#top">🔝 Back to top 🔝</a>)</p>

## Acknowledgments

Based on VsCode extensions:

-   [vscode-jest-runner](https://github.com/firsttris/vscode-jest-runner)
-   [add-only](https://github.com/ub1que/add-only)

And special thanks to @[WanManolo](https://github.com/WanManolo) as instigator of this project

<a href="https://github.com/WanManolo">
 <img src="https://avatars.githubusercontent.com/u/1674789?s=96&amp;v=4" width="100" height="100" alt="@WanManolo">
 <p>@WanManolo</p>
</a>

Made with love & passion 🚀

<p align="center">(<a href="#top">🔝 Back to top 🔝</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/G-Fidalgo/cypress-runner?style=for-the-badge
[contributors-url]: https://github.com/G-Fidalgo/cypress-runner/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/G-Fidalgo/cypress-runner?style=for-the-badge
[forks-url]: https://github.com/G-Fidalgo/cypress-runner/network/members
[stars-shield]: https://img.shields.io/github/stars/G-Fidalgo/cypress-runner?style=for-the-badge
[stars-url]: https://github.com/G-Fidalgo/cypress-runner/stargazers
[issues-shield]: https://img.shields.io/github/issues/G-Fidalgo/cypress-runner?style=for-the-badge
[issues-url]: https://github.com/G-Fidalgo/cypress-runner/issues
[license-shield]: https://img.shields.io/github/license/G-Fidalgo/cypress-runner?style=for-the-badge
[license-url]: https://github.com/G-Fidalgo/cypress-runner/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/gonzalo-fidalgo-martinez-merello/
