const path = require("path");



module.exports = {
  name: "server",
  target: "node",
  entry: "./bundle/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      name: "dg-node-sdk",
      type: "umd",
    },
  },
};


