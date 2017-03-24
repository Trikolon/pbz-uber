var path = require('path');

module.exports = {
    entry: './paul.zuehlcke.de/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve("./paul.zuehlcke.de/", 'dist')
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015'],
                    plugins: [
                        [
                            "babel-plugin-transform-builtin-extend",
                            {
                                "globals": [
                                    "Error",
                                    "Array"
                                ]
                            }
                        ]
                    ]
                }
            }
        ]
    },
};