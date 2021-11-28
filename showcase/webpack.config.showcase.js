
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const tsconfig = require('./tsconfig.json');

const { compilerOptions } = tsconfig;
const { baseUrl, paths } = compilerOptions;
const entries = Object.entries(paths);
const aliases = entries.reduce(alias, { });

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: './main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new MiniCssExtractPlugin(),
        new TsconfigPathsPlugin({/* options: see below */}),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            }, 
            {  
               test: /\.html$/,  
               loader: 'html-loader',
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js', '.json', '.html', '.css', '.scss' ],
        alias: {
            ...aliases,
        }
    },
};

function alias(aliases, entry) {
    var [ k, locations, key = k.replace('/*', '') ] = entry;
    return locations.reduce( (aliases, location) => ({ ...aliases, [key]: path.resolve(__dirname, baseUrl, location.replace('/*', '/')) }), aliases );
}

module.exports = () => {
    if (isProduction) config.mode = 'production';
    else config.mode = 'development';
    return config;
};
