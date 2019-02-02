const path = require('path');

module.exports = {
    entry: './src/web.js',
    optimization: { minimize: false },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/js')
    }
};