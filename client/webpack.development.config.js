const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCss = require('purifycss-webpack');//去掉多余css，没有使用的css代码
const Glob = require('glob');//搜索引用；
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
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].bundle.js'
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {//先抽离第三方插件
            test: '/node_modules/',
            chunks: 'initial',//初始化时进行打包
            name: 'vendor',
            priority: 10 //优先级 数越大，优先越高
          },
          commons: {
            chunks: 'initial',
            name: 'commons',
            minSize: 0 //只要超出0字节就生成新包
          }
        }
      }
    },
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
          test: /\.(scss|css)$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        // {
        //   test: /\.(scss|css)$/,
        //   use: ExtractTextPlugin.extract({
        //     fallback: 'style-loader',
        //     use: [{
        //       loader: 'css-loader'
        //     }]
        //   })
        // },
        {
          test: /\.(png|gif|jpg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 5, //大于5自己，调用file-loader，生成图片，否则生成base64数据
              outputPath: 'images/'
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
      port: 9090,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/': {
          bypass: function (req, res, proxyOptions) {
            console.log('Skipping proxy for browser request.');
            return `./client/template/index.html`;
          }
        }
      }
    },
    // 插件项
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin([{ //拷贝静态资源
        from: './client/static',
        to: 'public'
      }]),
      new PurifyCss({
        paths: Glob.sync(path.join(__dirname, 'src/*.html'))
      }),
      new HtmlWebpackPlugin({
        template: './client/template/index.html',
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
