const { defineConfig } = require("@vue/cli-service");
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ]
  },
  devServer: {
    proxy: {
      "/api": {
        //target: 'http://192.168.12.112:8084',
        // target: 'http://localhost:8890',
        //政务云
        // target: "https://175.153.176.27:18801/api",
        //市政务云
        // target: "https://119.4.191.13:8891/api",
        target: "http://localhost:8890/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },
      "/homePicture": {
        //target: 'http://192.168.12.112:8084',
        // target: 'http://localhost:8084',
        //政务云
        // target: "https://175.153.176.27:18801/homePicture",
        //市政务云
        target: "https://119.4.191.13:8891/homePicture",
        // target: 'http://101.37.246.72:8084',//服务器
        changeOrigin: true,
        pathRewrite: {
          "^/homePicture": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },

      "/ddzh": {
        target: "https://101.37.246.72:9094",
        changeOrigin: true,
        pathRewrite: {
          "^/ddzh": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },

      "/jgzm/light": {
        target: "https://119.4.191.13:8091",
        changeOrigin: true,
        pathRewrite: {
          "^/jgzm/light": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },

      "/youyan": {
        target: "https://119.4.191.13:4585",
        changeOrigin: true,
        pathRewrite: {
          "^/youyan": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },

      "/diao": {
        //政务云
        // target: "http://175.153.176.27:17702/",
        //市政务云
        target: "http://119.4.191.13:8880/",
        changeOrigin: true,
        pathRewrite: {
          "^/diao": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },
    },
  },
});
