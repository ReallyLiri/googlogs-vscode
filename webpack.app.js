const path = require('path');

module.exports = {
    mode: "production",
    entry: path.join(__dirname, 'app', 'index.tsx'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "app/tsconfig.json"
                    }
                }],
                exclude: '/node_modules/',
            },
            {
                test: /\.s?[ac]ss$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'out')
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
};
