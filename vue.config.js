const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      "/api": {
        //target: 'http://192.168.12.112:8084',
        // target: 'http://localhost:8890',
        //政务云
        // target: "https://175.153.176.27:18801/api",
        //市政务云
        target: "https://119.4.191.13:8891/api",
        // target: 'http://101.37.246.72:8084',//服务器
        //target: 'http://192.168.43.39:8084',
        //target: 'http://192.168.50.7:8084',
        //target: 'http://192.168.12.106:8084',
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
        //target: 'http://192.168.43.39:8084',
        //target: 'http://192.168.50.7:8084',
        //target: 'http://192.168.12.106:8084',
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
