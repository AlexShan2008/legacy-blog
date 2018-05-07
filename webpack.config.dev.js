const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin'); //删除上次打包的文件；
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const PurifyCss = require('purifycss-webpack');//去掉多余css，没有使用的css代码
// const Glob = require('glob');//搜索引用；

const host = 'localhost';
const port = 8080;

let config = function () {
  return {
    name: 'browser',
    // 入口文件；
    entry: {
      vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
      main: './client/index.js',
      login: './client/page/Login/index.js'
    },
    // 输出配置; path：编译后文件出口；publicPath：引用编译后文件的base路径；
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].bundle.js'
    },
    // Enable sourcemaps for debugging webpack's output.
    // 其他解决方案配置
    resolve: {
      extensions: [' ', '.ts', '.tsx', '.js', '.jsx', '.css', '.json'],
    },
    module: {
      // 加载器配置
      rules: [
        {
          // html 中引用image
          test: /\.html$/,
          use: 'html-withimg-loader'
        },
        {
          test: /\.(jsx|js)$/,
          exclude: path.resolve(__dirname, '../node_modules/'),
          use: 'babel-loader',
        },
        {
          test: /\.(css|scss|sass)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpe?g|gif|bmp|webp)$/i,
          use: [
            {
              // 图片
              loader: 'url-loader',
              options: {
                limit: 10000,    // 小于9k的图片自动转成base64格式，并且不会存在实体图片
                outputPath: 'static/img/'   // 图片打包后存放的目录
              }
            }
          ]
        },
        {
          // 字体
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          use: 'source-map-loader'
        }
      ]
    },
    context: __dirname,
    // 插件项
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './client/index.html',
        filename: 'index.html',
        chunks: ['vendor', 'main'],
        inject: true,
        hash: true,
        minify: {
          collapseWhitespace: true,//去空格
          removeAttributeQuotes: true//去双引号
        }
      }),
      new HtmlWebpackPlugin({
        template: './client/login.html',
        filename: 'login.html',
        chunks: ['vendor', 'login'],
        inject: true,
        hash: true,
        minify: {
          collapseWhitespace: true,//去空格
          removeAttributeQuotes: true//去双引号
        }
      }),
      new OpenBrowserPlugin({ url: `http://${'localhost'}:${port}/` })
    ],
    devServer: {
      historyApiFallback: true,
      inline: true,
      hot: true,
      port: port,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      // proxy: {
      //   '/': {
      //     bypass: function (req, res, proxyOptions) {
      //       console.log('Skipping proxy for browser request.');
      //       return `./client/template/index.html`;
      //     }
      //   }
      // }
    },
    devtool: 'cheap-module-source-map',
  };
};
module.exports = config;
