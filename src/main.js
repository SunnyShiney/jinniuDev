import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueAMap, { initAMapApiLoader } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import DataVVue3 from "@kjgl77/datav-vue3";
initAMapApiLoader({
  key: "165ffdb04e5182122b110a5d3e9928e2",
});
import "./permisson";
import store from "./store/index";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// import 'dayjs/locale/zh-cn';


// 解决 ResizeObserver loop completed with undelivered notifications 报错
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

// 覆写 ResizeObserver，增加防抖
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}

const app = createApp(App);
app.use(router).use(ElementPlus, {
  locale: zhCn,
});
app.use(VueAMap);
app.use(DataVVue3);
app.use(store);
app.mount("#app");
