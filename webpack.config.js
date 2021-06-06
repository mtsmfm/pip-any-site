const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (_env, options) => {
  return {
    entry: {
      background: "./src/background.ts",
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    devtool: options.mode === "production" ? undefined : "inline-source-map",
    output: {
      path: path.resolve(__dirname),
      filename: "[name].js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  };
};
