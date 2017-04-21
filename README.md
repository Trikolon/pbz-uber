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
 a bundled and transpiled (from es6 to es5) version of the js files from
 ```./js```.

## Development
If you are developing you can run:
``` bash
npm run build-dev # Watches changes in js-directory and compiles
automatically
```
or:
``` bash
npm run dev # Watches changes and compiles + starts local web-server for
development (default: http://localhost:8080)
```
This will generate a source-map and watch file changes for easier debugging.

*In order to see dev log messages run ```log.setLevel("TRACE")``` in the
browser console (F12). The default log level is ```ERROR```.*