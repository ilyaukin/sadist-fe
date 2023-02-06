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
        test: /\.(js|jsx|ts|tsx)$/,
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
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
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
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  // API mock
  devServer: {
    setup(app) {
      app.use('/static/', express.static(path.join(__dirname, 'dist')))
    },
    after(app) {
      app.get('/user/whoami', function (req, res) {
        res.send({
          user: {
            type: 'google',
            name: 'Ilya L.',
            avatar: 'https://lh3.googleusercontent.com/a/AATXAJwje0PGgbSrqZp0L1U3HtI7AZwwabLNw7-xhz8f=s96-c'
          },
          success: true
        })
      });
      app.post('/user/login', function (req, res) {
        res.send({
          user: {
            type: 'google',
            name: 'Ilya L.',
            avatar: 'https://lh3.googleusercontent.com/a/AATXAJwje0PGgbSrqZp0L1U3HtI7AZwwabLNw7-xhz8f=s96-c'
          },
          success: true
        })
      });
      app.post('/user/logout', function (req, res) {
        res.send({
          user: {
            type: 'anon'
          },
          success: true
        })
      });
      app.get('/ls', function (req, res) {
        res.send({
          list: [
            {
              id: '1111',
              name: 'Data Set 1111',
              type: 'GoogleSheet',
              cols: ['Fruit', 'On Counter', 'Sold Out'],
              classification: {
                status: 'finished'
              }
            },
            {
              id: '2222',
              name: 'Data Set 2222',
              type: 'GoogleSheet',
              cols: ['Location', 'Comment'],
              classification: {
                status: 'finished'
              },
              detailization: {
                Location: {
                  status: 'finished',
                  labels: ['city', 'country']
                }
              }
            }
          ],
          success: true
        })
      });
      app.get('/ds/1111', function (req, res) {
        res.send({
          list: [
            {
              id: '4uitbfq3',
              'Fruit': 'Banana',
              'On Counter': 100,
              'Sold Out': false
            },
            {
              id: 'ndisohfw',
              'Fruit': 'Mango',
              'On Counter': 300,
              'Sold Out': true
            }
          ],
          success: true
        })
      });
      app.get('/ds/2222', function (req, res) {
        res.send({
          list: [
            {
              id: '1313523',
              'Location': 'Moscow',
              'Comment': 'Capital of Russia'
            },
            {
              id: '1325235',
              'Location': 'Paris',
              'Comment': 'LAlala'
            },
            {
              id: '3211123',
              'Location': 'Moscow',
              'Comment': 'The 4th Reich'
            },
            {
              id: '1532535',
              'Location': 'New York',
              'Comment': ''
            }
          ],
          success: true
        })

      });
      app.get('/ds/3333', function (req, res) {
        res.send({
          list: [
            {
              id: '4uitbfq3',
              'Fruit': 'Banana',
              'On Counter': 100,
              'Sold Out': false
            },
            {
              id: 'ndisohfw',
              'Fruit': 'Mango',
              'On Counter': 300,
              'Sold Out': true
            }
          ],
          success: true
        })
      });
      app.get('/ds/2222/visualize', function (req, res) {
        res.send({
          list: [
            {
              id: { id: 1, name: 'Moscow', coordinates: [ 37.61556, 55.75222 ]},
              count: 2
            },
            {
              id: { id: 2, name: 'Paris', coordinates: [ 2.3488, 48.85341 ]},
              count: 1
            },
            {
              id: { id: 3, name: 'New York', coordinates: [ -74.00597, 40.71427 ]},
              count: 1
            }
          ],
          success: true
        })
      });
      app.get('/ds/2222/filter', function (req, res) {
        res.send({
          list: [
            {
              id: '1313523',
              'Location': 'Moscow',
              'Comment': 'Capital of Russia'
            },
            {
              id: '3211123',
              'Location': 'Moscow',
              'Comment': 'The 4th Reich'
            }
          ],
          success: true
        })
      });
      app.put('/ds', function (req, res) {
        res.send({
          item: {
            id: '3333',
            name: 'Sheet 3333',
            type: 'GoogleSheet',
            cols: ['Fruit', 'On Counter', 'Sold Out'],
            classification: {
              status: 'in progress'
            }
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
