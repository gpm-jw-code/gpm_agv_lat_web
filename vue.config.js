const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({

  transpileDependencies: true,
  outputDir: "../gpm_agv_lat_app/wwwroot",
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'GPM LAT',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
})
