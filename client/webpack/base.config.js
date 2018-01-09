const webpack = require('webpack');
const path = require('path');

module.exports = function (options) {
    const PUBLICPATH = options.publicPath || '/static/';
    const ROOTPATH = options.ROOTPATH;
    const entry = process.env.NODE_ENV === 'develop' ? './client/index.js' : './index.js';
    return {
        name: 'browser',
        // context: path.resolve(ROOTPATH, ''),
        entry: {
            main: ["babel-polyfill", entry]
        },
        // 入口文件输出配置；path：编译后文件出口；publicPath：引用编译后文件的base路径；
        output: {
            path: path.resolve(ROOTPATH, "static/dist"),
            publicPath: PUBLICPATH,
            filename: '[name].bundle.js'
        },
        module: {
            // 加载器配置
            loaders: [
                {
                    test: /\.(jsx|js)$/,
                    exclude: path.resolve(__dirname, '../node_modules/'),
                    use: 'babel-loader',
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
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false,
            //     },
            //     output: {
            //         comments: false,
            //     }
            // })
        ]

    }
};
