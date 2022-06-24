const path = require("path");

const clientConfig = {
  name: "client",
  target: "web", // <=== can be omitted as default is 'web'
  entry: "./bundle/browser/index.js",
  output: {
    path: path.resolve(__dirname, "dist/browser"),
    filename: "index.js",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  //…
};

const serverConfig = {
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
  //…
};

module.exports = [serverConfig, clientConfig];
