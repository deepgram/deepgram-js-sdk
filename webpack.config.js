const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist/umd"),
    filename: "deepgram.js",
    library: {
      type: "umd",
      name: "deepgram",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.versions.node": JSON.stringify(process.versions.node),
    }),
  ],
};
