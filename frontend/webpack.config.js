const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")



module.exports = {
  entry: "./src/app.js",
  mode: "development",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: '.dist',
    compress: true,
    port: 9000,
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
    new CopyPlugin({
      patterns: [
        { from: "./src/templates", to: "templates" },
        { from: "./src/styles", to: "styles" },
        { from: "./src/assets/fonts", to: "fonts" },
        { from: "./src/assets/images", to: "images" }
      ]
    }),

  ],
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: [
    //           ['@babel/preset-env', { targets: "defaults" }]
    //         ]
    //       }
    //     }
    //   }
    // ]
  },

}