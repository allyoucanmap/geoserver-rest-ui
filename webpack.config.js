const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DefinePlugin = require("webpack/lib/DefinePlugin");

const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === "development"
});

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: {
            'geoserver-rest-ui': './index.js',
            'theme': './static/theme/index.scss'
        },
        output: {
            path: __dirname + '/dist',
            publicPath: 'dist',
            filename: '[name].js',
            globalObject: 'this'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [ 'babel-loader' ]
                },
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "less-loader"
                    ]
                },
                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        use: [
                            { loader: "to-string-loader" },
                            { loader: "css-loader" },
                            { loader: "sass-loader" }
                        ],
                        fallback: "style-loader"
                    })
                },
                {
                    test: /\.worker\.js$/,
                    use: { loader: 'worker-loader' }
                }
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        plugins: [
            new DefinePlugin({
                '__DEVELOPMENT__': !isProduction
            }),
            extractSass,
            ...(
                isProduction
                ? [ ]
                : [ new webpack.HotModuleReplacementPlugin() ]
            )
        ],
        devServer: isProduction
            ? undefined
            : {
                port: 8087,
                contentBase: './',
                hot: true
            },
        devtool: isProduction ? undefined : 'eval'
    }
};
