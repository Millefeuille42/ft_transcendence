const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    // 'auto' | 'all' [string] here
    allowedHosts: 'all',
  },
})
