const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const express = require('express');

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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: '[path][name].[ext]',
          context: 'src',
          publicPath: 'static',
        }
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
    setup(app) {
      app.use('/static/', express.static(path.join(__dirname, 'dist')))
    },
    after(app) {
      app.get('/ls', function (req, res) {
        res.send({
          list: [
            {
              id: '1111',
              name: 'Data Set 1111',
              type: 'GoogleSheet'
            },
            {
              id: '2222',
              name: 'Data Set 2222',
              type: 'GoogleSheet'
            }
          ],
          success: true
        })
      });
      app.get('/ds/1111', function (req, res) {
        res.send({
          list: [
            {
              'id': '4uitbfq3',
              'Fruit': 'Banana',
              'On Counter': 100,
              'Sold Out': false
            },
            {
              'id': 'ndisohfw',
              'Fruit': 'Mango',
              'On Counter': 300,
              'Sold Out': true
            }
          ],
          success: true
        })
      });
      app.put('/ds', function (req, res) {
        res.send({
          item: {
            'id': '3333',
            'name': 'Sheet 3333',
            'type': 'GoogleSheet'
          },
          success: true
        })
      })
    }
  }
}
