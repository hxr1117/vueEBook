module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        './' : '/',
    devServer: {
        proxy: {
            '/api/**': {
                target: 'http://192.168.31.71:8081/epub/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
