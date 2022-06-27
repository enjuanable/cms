<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item  :to="{ path: level2_link }">{{ level2 }}</el-breadcrumb-item>
    <el-breadcrumb-item  :to="{ path: level3_link }">{{ level3 }}</el-breadcrumb-item>
    <!-- <el-breadcrumb-item :to="{ path: level4_link }">{{ level4 }}</el-breadcrumb-item> -->
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  data() {
    return {
    };
  },
  props: ['level2', 'level2_link', 'level3','level3_link', 'level4','level4_link']
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
