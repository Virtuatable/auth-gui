const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    output: {
      filename: "[name].js",
      chunkFilename: "[name].chunk.js"
    },
  },
  css: {
    extract: {
      filename: "[name].css",
      chunkFilename: "[name].chunk.css"
    }
  }
})
