const path = require('path')
module.exports = {
    entry: path.join(__dirname, 'code', 'main.js'), 
   output: {
      path: path.join(__dirname, 'code'),
      filename: 'build.js' 
    },
  
   module: {
       rules: [{
           test: /\.css$/, // To load the css in react
           use: ['style-loader', 'css-loader'],
           include: /code/
       }, {
           test: /\.jsx?$/, // To load the js and jsx files
           loader: 'babel-loader',
           exclude: /node_modules/,
           query: {
               presets: ['es2015', 'react', 'stage-2']
           }
       }, ]
   }
}