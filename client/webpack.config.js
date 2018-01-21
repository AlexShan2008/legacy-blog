const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
let isDev = process.env.NODE_ENV; // 是否是开发环境
const publicPath = isDev === 'develop' ? 'http://localhost:9090/' : '/';
const entry = (isDev === 'develop' || isDev === 'production') ? './client/index.js' : './index.js';
const port = (isDev === 'develop' || isDev === 'production') ? 9090 : 8080;

let config = function () {
    return {
        name: 'browser',
        // 入口文件；
        entry: {
            vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
            main: entry,
        },
        // 输出配置; path：编译后文件出口；publicPath：引用编译后文件的base路径；
        output: {
            path: path.resolve(__dirname,"../dist"),
            publicPath: publicPath,
            filename: '[name].bundle.js'
        },
        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",
        // 其他解决方案配置
        resolve: {
            extensions: [' ', ".ts", ".tsx", '.js', '.jsx', '.css', '.json'],
        },
        module: {
            // 加载器配置
            loaders: [
                {
                    test: /\.(tsx|ts)$/, 
                    loader: "ts-loader"
                },
                {
                    test: /\.(jsx|js)$/,
                    exclude: path.resolve(__dirname, '../node_modules/'),
                    use: 'babel-loader',
                },
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                },
                { 
                    enforce: "pre", 
                    test: /\.js$/, 
                    loader: "source-map-loader" }
            ]
        },
        // externals: {
        //     "react": "React",
        //     "react-dom": "ReactDOM"
        // },
        devServer: {
            historyApiFallback: true,
            inline: true,
            hot: true,
            port: 9090,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            proxy: {
                '/': {
                    bypass: function (req, res, proxyOptions) {
                        console.log('Skipping proxy for browser request.');
                        return `./client/template/index.html`
                    }
                }
            }
        },
        // 插件项
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: '[name].bundle.js',
                minChunks: Infinity
            }),
            new HtmlWebpackPlugin({
                template: './client/template/index.html',
                filename: 'index.html',
                chunks: ['vendor', 'main'],
                inject: true
            }),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false,
            //     },
            //     output: {
            //         comments: false,
            //     }
            // }),
            new OpenBrowserPlugin({ url: `http://${"localhost"}:${port}/` })
        ]

    }
};
module.exports = config;
