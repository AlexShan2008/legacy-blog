const webpack = require('webpack');
const path = require('path');

const config = {
    // 页面入口文件配置
    entry: {
        main :'./index.js',
        login :'./views/login/login.js'
    },
    // 入口文件输出配置
    output: {
        path: __dirname +'/static/dist/js',
        filename: '[name].bundle.js'
    },
    module: {
        // 加载器配置
        loaders: [
            {
                test: /\.(jsx|js)$/,
                exclude: path.resolve(__dirname, '../node_modules/'),
                use: 'babel-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        inline:true,
        port: 3000,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8333/api',
                pathRewrite: {"^/api" : ""}
            },
            '/login': {
                target: 'http://localhost:8333/login',
                pathRewrite: {"^/login" : ""}
            }
        }
    },
    // 其他解决方案配置
    resolve: {
        extensions: [' ', '.js', '.jsx', '.css', '.json'],
    },
    // 插件项
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;