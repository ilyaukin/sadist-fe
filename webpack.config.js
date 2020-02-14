const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
      new HtmlWebPackPlugin({
        "template": "./src/index.html",
        "filename": "./index.html"
      })
  ],
  resolve: {
    modules: [
        path.resolve("./src"),
        path.resolve("./node_modules")
    ],
    extensions: [".js", ".jsx"]
  },
  // API mock
  devServer: {
    proxy: {
      '/ls': {
        bypass: (req, res) => {
          res.send({
            list: [
              {
                id: '1111',
                name: 'Data Set 1111'
              },
              {
                id: '2222',
                name: 'Data Set 2222'
              }
            ],
            success: true
          })
        }
      }
    }
  }
} 
