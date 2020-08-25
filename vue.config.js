module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    './' : '/',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api/**': {
        target: 'http://10.1.31.199:8081/epub/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
