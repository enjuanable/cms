import Vue from 'vue'
import App from './App.vue'
import router from './router/routes'
import MyBreadcrumb from '@/views/common/brandcrumb';

// 定义全局的时间过滤器
// 格式化时间的过滤器
// 用于商品列表中，创建时间的格式化
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1).toString().padStart(2, '0');
  const d = dt
    .getDate()
    .toString()
    .padStart(2, '0');

  const hh = dt
    .getHours()
    .toString()
    .padStart(2, '0');
  const mm = dt
    .getMinutes()
    .toString()
    .padStart(2, '0');
  const ss = dt
    .getSeconds()
    .toString()
    .padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

/*
* 方式一：样式重置
* */
// import './assets/css/reset.css';

/*注册插件 dialog*/
// import Dialog from './plugins/dialog/index.js'
// 如果引入的文件是某个目录下的 index.js, index.js 可以省略不写
import Dialog from './plugins/dialog/dialog'

Vue.use(Dialog, { type: 'danger', duration: 1000 });

/*注册 elementui*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
/*
* Vue.use(ElementUI); 底层就是使用
* Vue.component('el-button', {});
* Vue.component('el-xxxx', {});
* */

// 全局的面包屑组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

