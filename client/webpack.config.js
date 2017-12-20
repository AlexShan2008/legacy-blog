const webpack = require('webpack');
const path = require('path');

const config = {
    // 页面入口文件配置
    entry: {
        main :'./index.js',
        login :'./container/login/login.js'
    },
    // 入口文件输出配置；path：编译后文件出口；publicPath：引用编译后文件的base路径；
    output: {
        path: path.resolve(__dirname,"static/dist"),
        publicPath: "/static/",
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
        })
    ]
};

module.exports = config;