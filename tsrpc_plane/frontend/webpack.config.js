const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.argv.indexOf('--mode=production') > -1;

module.exports = {
    //entry: './src/index.ts',
    entry: path.join(__dirname, './src/starttest.ts'),      //'./src/starttest.ts',  // 打包入口文件的路
    output: {
        filename: 'bundle.[contenthash].js', // 输出文件的名称
        path: path.resolve(__dirname, 'dist'), // 输出文件的存放路径  
        clean: true
    },
    // devServer: {
    //     // contentBase: __dirname, -- 请注意，这种写法已弃用
    //     static: {
    //       directory: path.join(__dirname, "/"),
    //     },
    // },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        // Compile to ES5 in production mode for better compatibility
                        // Compile to ES2018 in development for better debugging (like async/await)
                        compilerOptions: !isProduction ? {
                            "target": "es2018",
                        } : undefined
                    }
                }],
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        // Copy "public" to "dist"
        new CopyWebpackPlugin({
            patterns: [{
                from: 'public',
                to: '.',
                toType: 'dir',
                globOptions: {
                    gitignore: true,
                    ignore: [path.resolve(__dirname, 'public/index.html').replace(/\\/g, '/')]
                   //ignore: [path.resolve(__dirname, 'public/test.html').replace(/\\/g, '/'),path.resolve(__dirname, 'public/index.html').replace(/\\/g, '/')]
                },
                noErrorOnMissing: true
            }]
        }),
        // Auto add <script> to "index.html"
        new HtmlWebpackPlugin({
            //template: 'public/index.html'
            template: 'public/test.html' // 指定入口html文件
        }),
    ],
    devtool: isProduction ? false : 'inline-source-map'
}