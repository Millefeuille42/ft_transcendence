const { defineConfig } = require('@vue/cli-service')
const fs = require("fs");
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
   //https: {
   //  key: fs.readFileSync(""),
   //  cert: fs.readFileSync("")
   //},
    allowedHosts: 'all',
  },
})
