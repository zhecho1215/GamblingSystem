const path = require('path')
module.exports = {
    entry: path.join(__dirname, 'code', 'index.js'), 
   output: {
      path: path.join(__dirname, 'code'),
      filename: 'build.js' 
   },
   module: {
      loaders: [{
         test: /\.css$/,
         use: ['style-loader', 'css-loader'],
         include: /code/
      }, {
         test: /\.jsx?$/, 
         loader: 'babel-loader',
         exclude: /node_modules/,
         query: {
            presets: ['es2015', 'react', 'stage-2']
         }
      }, {
         test: /\.json$/, 
         loader: 'json-loader'
      }]
   }
}