var path = require('path');

module.exports = {
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve("./paul.zuehlcke.de/", 'dist'),
        publicPath: "/dist/"
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
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    devServer: {
        contentBase: path.join(".", "paul.zuehlcke.de"),
        compress: true,
        port: 8080
    }
};