const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const express = require('express');

module.exports = {
  entry: {
    root: ['./src/index.js'],
    labelling: ['./src/labelling.js'],
  },
  output: {
    filename: '[name].js'
  },
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
      template: "./src/index.html",
      filename: "./index.html",
      chunks: ["root"]
    }),
    new HtmlWebPackPlugin({
      template: "./src/labelling.html",
      filename: "./labelling.html",
      chunks: ["labelling"]
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
      app.get('/dl/session/s1234', function (req, res) {
        res.send({
          text: 'slowo za slowo',
          success: true
        })
      });
      app.post('/dl/session/s1234', function (req, res) {
        res.send({
          text: 'hue´m po stolu',
          success: true
        })
      })


      // app.post('/dl/session/s1234', function (req, res) {
      //   res.send({
      //     status: 'finished',
      //     success: true
      //   })
      // })
      // app.post('/dl/session/s1234/merge', function (req, res) {
      //   res.send({
      //     status: 'merging',
      //     conflicts: [
      //       {
      //         text: 'Washington, DC',
      //         diff: [
      //           {
      //             label: 'city',
      //             source:
      //               'master'
      //           },
      //           {
      //             label: 'trash',
      //             source: 'session'
      //           }
      //         ]
      //       },
      //       {
      //         text: 'Singapore',
      //         diff: [
      //           {
      //             label: 'city',
      //             source: 'both'
      //           },
      //           {
      //             label: 'country',
      //             source: 'master'
      //           }
      //         ]
      //       }
      //     ],
      //     success: true
      //   })
      // })
      // app.post('/dl/session/s1234/resolve-conflicts', function (req, res) {
      //   res.send({
      //     status: 'merged',
      //     success: true
      //   })
      // })

    }
  }
}
