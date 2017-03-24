# pbz-uber
[![Code Climate](https://codeclimate.com/github/Trikolon/pbz-uber/badges/gpa.svg)](https://codeclimate.com/github/Trikolon/pbz-uber)

## Setup
To set up the dependencies switch to the directory you cloned and run:
``` bash
npm install
```

Once the installation has completed provision the files:
``` bash
npm run build
```
This will create the folder ```./paul.zuehlcke.de/dist``` which contains
 a bundled and transpiled (from es6 to es5) version of the js files from ```./paul.zuehlcke.de/js```.

## Development
If you are developing you can run:
``` bash
npm run build-dev
```
This will generate a source-map and watch file changes for easier debugging.