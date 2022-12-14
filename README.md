# deck.gl @ All Things Open 2022

Repo for [Visualizing Large Greenhouse Gas Datasets in the Browser With deck.gl](https://2022.allthingsopen.org/sessions/2-for-1-visualizing-large-greenhouse-gas-datasets-in-the-browser-with-deck-gl-tba/)

The goal of this visualization: answer the question "where are the biggest methane emissions and who is responsible"?

Also check out the [talk slides](https://docs.google.com/presentation/d/1ZWWzyoWJsVWcA2O52SRLX4XC59VhDE9UlZGGjdlUM5U/edit)!

## Installation

1. Install [Node.js](https://nodejs.org), which comes with [npm](https://www.npmjs.com/).
1. \$ `git clone git@github.com:davidcalhoun/deckgl-all-things-open-2022.git && cd deckgl-all-things-open-2022`
1. \$ `npm install`
1. Create an account at [mapbox.com](https://www.mapbox.com/)
1. Copy your "Default public token" from https://account.mapbox.com/access-tokens/
1. Create a new file named `.env.local` in the root directory. This file is in `.gitignore` and shouldn't be checked into Github.
1. Open `.env.local` and add this line (be sure to paste your token): `MAPBOX_ACCESS_TOKEN=PASTE_YOUR_TOKEN_HERE`
1. Edit `src/index.js` with the Step you want to run (Step 1 by default).
1. \$ `npm start`

## Step by step previews

### [Step 1](src/Step1.js)
![Step 1](images/step1.png)

### [Step 2](src/Step2.js)
![Step 2](images/step2.png)

### [Step 3](src/Step3.js)
![Step 3](images/step3.png)

### [Step 4](src/Step4.js)
![Step 4](images/step4.png)

### [Step 5](src/Step5.js)
![Step 5](images/step5.gif)

### [Step 6](src/Step6.js)
![Step 6](images/step6.gif)