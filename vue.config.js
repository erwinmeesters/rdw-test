// vue.config.js
module.exports = {
  transpileDependencies: [],
  assetsDir: './assets',

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/styles/_variables.scss";'
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    public: '0.0.0.0:8080',
    disableHostCheck: true
  }
};
