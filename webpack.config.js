const path = require("path");

const resolve = (url) => path.resolve(__dirname, url);

module.exports = {
  // mode:"production",
  entry: {
    index: resolve("src/main.ts"),
  },
  output: {
    path: resolve("dist/"),
    filename: "static/js/[name].js"
  },
  resolve: {
    extensions: [".ts", ".json"],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ]
  },
};
