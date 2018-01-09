const webpack = require('webpack');
const path = require('path');
const config = {
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
};

module.exports = config;
