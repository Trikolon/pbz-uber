var path = require('path');

module.exports = {
    entry: './paul.zuehlcke.de/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve("./paul.zuehlcke.de/", 'dist')
    }
};