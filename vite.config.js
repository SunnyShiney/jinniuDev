import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // 1. 对应原本的 configureWebpack.resolve.alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    // 兼容省略后缀的情况
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },

  // 2. 对应原本的 DefinePlugin
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false'
  },

  server: {
    port: 8080, // 保持端口一致
    open: false,
    
    // 3. 对应原本的 devServer.proxy (语法翻译)
    proxy: {
      "/api": {
        target: "http://localhost:8890/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "") // 翻译 pathRewrite: { "^/api": "" }
      },
      
      "/homePicture": {
        target: "https://119.4.191.13:8891/homePicture",
        changeOrigin: true,
        // 如果 HTTPS 证书有问题（比如自签名），可能需要加上 secure: false
        secure: false, 
        rewrite: (path) => path.replace(/^\/homePicture/, "")
      },

      "/ddzh": {
        target: "https://101.37.246.72:9094",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ddzh/, "")
      },

      "/jgzm/light": {
        target: "https://119.4.191.13:8091",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/jgzm\/light/, "")
      },

      "/toilet": {
        target: "http://119.4.191.13:8860",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/toilet/, "")
      },

      "/youyan": {
        target: "https://119.4.191.13:4585",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/youyan/, "")
      },

      "/diao": {
        target: "http://119.4.191.13:8880/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/diao/, "")
      }
    }
  }
})