const webpack = require("webpack");
const path = require("path");

module.exports = {
  // mode:"production",
  entry: {
    index: "./src/main.ts",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "js/[name].js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  devtool: "source-map",
  mode: "development",
  devServer: {
    contentBase: "./dist",
    writeToDisk: true,
    open: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src", "link:href"]
            }
          }
        ]
      },
      {
        test: /\.glsl$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/img'
        },
      },
      {
        test: /\.s[ac]ss$/i,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/i,
        loaders: ['style-loader', 'css-loader']
      },
    ]
  },
};
