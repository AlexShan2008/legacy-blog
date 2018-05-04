const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin'); //删除上次打包的文件；
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCss = require('purifycss-webpack');//去掉多余css，没有使用的css代码
const Glob = require('glob');//搜索引用；

const extractCSS = new ExtractTextPlugin('css/style.css');
const extractSCSS = new ExtractTextPlugin('css/login.scss');

const host = 'localhost';
const port = 8080;

let config = function () {
  return {
    name: 'browser',
    // 入口文件；
    entry: {
      vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
      main: './client/index.js',
    },
    // 输出配置; path：编译后文件出口；publicPath：引用编译后文件的base路径；
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].bundle.js'
    },
    // 
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {//先抽离第三方插件
    //         test: '/node_modules/',
    //         chunks: 'initial',//初始化时进行打包
    //         name: 'vendor',
    //         priority: 10 //优先级 数越大，优先越高
    //       },
    //       commons: {
    //         chunks: 'initial',
    //         name: 'commons',
    //         minSize: 0 //只要超出0字节就生成新包
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
          test: /\.html$/,
          loader: 'html-withimg-loader'
        },
        {
          test: /\.(tsx|ts)$/,
          loader: 'ts-loader'
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
            publicPath: '../'
          })
        },
        {
          test: /\.(scss|sass)$/i,
          use: extractSCSS.extract({
            use: ['css-loader', 'postcss-loader', 'sass-loader'],
            publicPath: '../'
          }),
        },
        {
          test: /\.(png|gif|jpe?g|webp)$/i,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 5, //大于5字节，调用file-loader，生成图片，否则生成base64数据
              outputPath:'./static/img/'
            }
          }]
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader'
        }
      ]
    },
    devServer: {
      contentBase: './dist',
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
    // devtool: isDev ? 'cheap-module-eval-source-map' : '',
    context: __dirname,
    // 插件项
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new cleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([{ //拷贝静态资源
        from: './client/static',
        to: 'public'
      }]),
      extractCSS,
      extractSCSS,
      new PurifyCss({
        paths: Glob.sync(path.join(__dirname, 'client/*.html'))
      }),
      new HtmlWebpackPlugin({
        template: './client/index.html',
        filename: 'index.html',
        chunks: ['vendor', 'main'],
        inject: true,
        minify: {
          collapseWhitespace: true,//去空格
          removeAttributeQuotes: true//去双引号
        }
      }),
      new OpenBrowserPlugin({ url: `http://${'localhost'}:${port}/` })
    ]

  };
};
module.exports = config;
