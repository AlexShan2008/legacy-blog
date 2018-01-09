const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const PUBLICPATH = '/static/';
const PORT = '9090';
const ENV = process.env.NODE_ENV || 'develop';

const options = {
    publicPath: PUBLICPATH,
    // globals: {
    //     'process.env': {
    //         'NODE_ENV': JSON.stringify(ENV)
    //     },
    //     '__DEV__': ENV === 'develop',
    //     '__PROD__': ENV === 'production',
    //     '__TEST__': ENV === 'test'
    // },
    // beforePlugins: [
    //     new webpack.HotModuleReplacementPlugin()
    // ]
};

module.exports = function (args) {
    options.ROOTPATH = args.ROOTPATH;
    options.env = args.env;
    return webpackMerge(require('./base.config')(options), {
        devServer: {
            // contentBase: path.join(args.ROOTPATH, './client'),
            historyApiFallback: true,
            inline: true,
            hot: true,
            port: PORT,
            host: '0.0.0.0',
            proxy: {
                '/': {
                    bypass: function (req, res, proxyOptions) {
                        console.log('Skipping proxy for browser request.');
                        return `./client/containers/index.html`
                        // return `${PUBLICPATH}index.html`
                    }
                }
            }
        },
        plugins: []
    })
};
