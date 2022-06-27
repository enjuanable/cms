import Vue from 'vue'
import VueRouter from 'vue-router'
// @代表src目录
import Dashboard from '@/views/dashboard/Admin.vue'
import Login from '@/views/login/Login.vue'
import UserList from '@/views/user/List.vue'
import RoleList from '@/views/limmit/role-list.vue'
import LimmitList from '@/views/limmit/limmit-list.vue'
import ProductList from '@/views/product/product-list.vue'
import CategoriesList from '@/views/product/categories-list.vue'
import ProductCategories from '@/views/product/product-categories.vue'
import ProductAdd from '@/views/product/product-add.vue'
import Orders from '@/views/orders/orders-list.vue'
import Report from '@/views/report/report.vue'

// 使用插件、通过全局混入来添加组件选项。
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    // 重定向
    redirect: '/admin',
    meta: {
      title: '后台首页',
      // needAuth判断是否需要登录
      needAuth: true,
    }
  },

  {
    // 用于地址
    path: '/login',
    // 单纯起名？给全局守卫的next使用
    name: 'Login',
    // RoleList才是真实地址
    component: Login,
    meta: {
      title: '登录页面',
      needAuth: false,
    }
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: Dashboard,
    // 重定向 父类path+子类path
    // redirect: '/admin/user/list',

    meta: {
      title: '后台首页',
      needAuth: true,
    },
    children: [
      {
        path: 'user/list',
        name: 'user-list',
        component: UserList,
        meta: {
          title: '用户列表',
          needAuth: true,
        },
      },
      {
        path: 'limmit/role-list',
        name: 'role-list',
        component: RoleList,
        meta: {
          title: '角色列表',
          needAuth: true,
        },
      },
      {
        path: 'limmit/limmit-list',
        name: 'limmit-list',
        component: LimmitList,
        meta: {
          title: '权限列表',
          needAuth: true,
        },
      },
      {
        path: 'product/product-list',
        name: 'product-list',
        component: ProductList,
        meta: {
          title: '商品列表',
          needAuth: true,
        },
      },
      {
        path: 'product/categories',
        name: 'categories-list',
        component: CategoriesList,
        meta: {
          title: '参数列表',
          needAuth: true,
        },
      },
      {
        path: 'product/product-categories',
        name: 'product-categories',
        component: ProductCategories,
        meta: {
          title: '商品分类',
          needAuth: true,
        },
      },
      {
        path: 'product/product-add',
        name: 'product-add',
        component: ProductAdd,
        meta: {
          title: '添加商品',
          needAuth: true,
        },
      },
      {
        path: 'orders/orders-list',
        name: 'orders',
        component: Orders,
        meta: {
          title: '订单列表',
          needAuth: true,
        },
      },
      {
        path: 'report/report',
        name: 'report',
        component: Report,
        meta: {
          title: '数据报表',
          needAuth: true,
        },
      },
    ]
  },
]

// import VueRouter from 'vue-router'
// Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
  // linkActiveClass: 'active',
  // linkExactActiveClass: 'active'
})
// 以下代码必须写在const router后
// 全局前置守卫router.beforeEach
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 验证登录状态、否：则跳转到登录页面
  if (to.name === 'Login') {
    next();
    /* 路由发生变化修改页面title https://www.jb51.net/article/173591.htm */
    
  } else {
    // 如果请求的不是登录页面，验证token
    // 1. 获取本地存储中的token
    const token = localStorage.getItem('token');
    if (!token) {
      // 使用前置守卫返回message时报错ReferenceError: message is not defined
      Vue.prototype.$message({
        type: 'warning',
        message: '请先登录!'
      });
      // 2. 如果没有token，跳转到登录
      next({
        // 这里的name是在routes定义的name
        // name: 'Login'
        path: '/login'
      });
    } else {
      // 3. 如果有token，继续往下执行
      next();
    }
  }
})
export default router
