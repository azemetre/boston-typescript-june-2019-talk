const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    target: 'node',
    mode: 'production',
    entry: path.resolve(__dirname, './src/components/index.ts'),
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'snpui-webcomponents.js',
        library: 'snpui-webcomponents',
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            // add styles alias
            '@styles': path.resolve(__dirname, 'src/styles'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ],
            },
            // split out global style, in order to include fixed className
            {
                test: /\.styl$/,
                include: path.resolve(__dirname, 'src/styles/global.styl'),
                use: [
                    'style-loader',
                    'css-loader',
                    { loader: 'stylus-loader' },
                ],
            },
            {
                test: /\.styl$/,
                exclude: path.resolve(__dirname, 'src/styles/global.styl'),
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]-[hash:base64:16]',
                        },
                    },
                    { loader: 'stylus-loader' },
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
    ],
    externals: [
        {
            ramda: 'ramda',
            lodash: {
                commonjs: 'lodash',
                commonjs2: 'lodash',
                amd: 'lodash',
                root: '_',
            },
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
            },
        },
        nodeExternals({
            whitelist: [
                'd3',
                'material-icons',
                'monaco-editor',
                'recharts',
            ],
        }),
    ],
};
