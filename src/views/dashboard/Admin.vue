<template>
  <div class="home">
    <el-container>
      <el-header>
        <!-- 头部标题和用户选项 -->
        <h1 id="zi-hai" class="left" style="margin: 0px;font-weight:400;">中台管理系统，{{ '欢迎 ' + username }} !</h1>
        <el-dropdown>
          <el-avatar class="left" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <el-dropdown-menu slot="dropdown" style="text-align:center;">
            
            <!-- el-dropdown-item点击事件 @click.native -->
            <!-- 当父组件中引入子组件的时候，当要触发子组件点击事件的时候@click 不生效。 -->
            <!-- 解决方法一：@click.native -->
            <router-link to="/login" @click.native="exit()">
              <el-dropdown-item>退出</el-dropdown-item>
            </router-link>

          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-container>
        <!-- 左边菜单栏 -->
        <el-aside width="200px">
          <el-menu default-active="this.$router.path" router :default-openeds="['1', '2', '3', '4', '5']">

            <el-submenu index="1">
              <template slot="title"><i class="el-icon-user"></i>用户管理</template>
              <!-- index:唯一标志 -->
              <el-menu-item index="/admin/user/list">
                用户列表
              </el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title"><i class="el-icon-warning-outline"></i>权限管理</template>
              <el-menu-item index="/admin/limmit/role-list">角色列表</el-menu-item>
              <el-menu-item index="/admin/limmit/limmit-list">权限列表</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title"><i class="el-icon-goods"></i>商品管理</template>

              <el-menu-item index="/admin/product/product-list">商品列表</el-menu-item>
              <el-menu-item index="/admin/product/categories">分类参数</el-menu-item>

              <el-menu-item index="/admin/product/product-categories">商品分类</el-menu-item>

            </el-submenu>
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-tickets"></i>订单管理</template>

              <el-menu-item index="/admin/orders/orders-list">订单列表</el-menu-item>

            </el-submenu>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-data-analysis"></i>数据统计</template>

              <el-menu-item index="/admin/report/report">数据报表</el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 内容切换区域 -->
        <el-main>
          <router-view/>
        </el-main>

      </el-container>
    </el-container>
  </div>

</template>

<script>
export default {

  data() {
    return {
      username: localStorage.getItem('username')?localStorage.getItem('username'):'-请登录-'
    }
  },
  methods: {
    exit() {
      //清除所有
      localStorage.clear();
      //清除指定
      // localStorage.removeItem('token');
      console.log(localStorage)
    }
  },
}
</script>

<style lang="less" scoped>
a{
  text-decoration:none;
}
.left {
  float: left;
}

.right {
  float: right;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  color: #333;
}
</style>