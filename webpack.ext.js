const path = require('path');

module.exports = {
    target: 'node',
    mode: "production",
    entry: path.join(__dirname, 'src', 'extension.ts'),
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: '/node_modules/',
            },
        ],
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    output: {
        filename: 'extension.js',
        path: path.resolve(__dirname, 'out', 'src'),
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
};
