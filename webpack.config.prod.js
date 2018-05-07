const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin'); //删除上次打包的文件；
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCss = require('purifycss-webpack');//去掉多余css，没有使用的css代码
const Glob = require('glob');//搜索引用；

const extractCSS = new ExtractTextPlugin('css/style.css');
const extractSCSS = new ExtractTextPlugin('css/main.css');

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
    // 优化的处理
    // optimization: {
    //   // 代码分割，提取公共部分（包）
    //   splitChunks: {
    //     // 缓存
    //     cacheGroups: {
    //       // 先抽离三方插件
    //       vendor: {
    //         test: '/node_modules/',//只抽离三方插件
    //         chunks: 'initial',//初始化时进行打包
    //         name: 'vendor',//公共部分名字
    //         priority: 10 //优先级 数越大，优先越高
    //       },
    //       // 再抽离公共的自定义模块
    //       commons: {
    //         chunks: 'initial',
    //         name: 'commons',
    //         minSize: 1024, //只要超出1KB就生成新包
    //         priority: 0
    //       }
    //     }
    //   }
    // },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
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
          test: /\.css$/,
          use: extractCSS.extract({
            use: ['css-loader', 'postcss-loader'],
            publicPath: '/'
          })
        },
        {
          test: /\.(scss|sass)$/i,
          use: extractSCSS.extract({
            use: ['css-loader', 'postcss-loader', 'sass-loader'],
            publicPath: '/'
          }),
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
          loader: 'source-map-loader'
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new cleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([{ //拷贝静态资源
        from: './public',
        to: 'public'
      }]),
      extractCSS,
      extractSCSS,
      // 去掉未引用的CSS样式
      // new PurifyCss({
      //   paths: Glob.sync(path.join(__dirname, 'client/*.html'))
      // }),
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
    ]

  };
};
module.exports = config;
