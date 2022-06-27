<!-- 如果此标签标蓝线：去jsconfig.json文件添加这个"jsx": "preserve", -->
<template>
  <div class="login-wrap">
    <!-- check-1 -->
    <!-- 在这里引入验证规则 -->
    <!-- :model="formData"对应JS的data里的formData对象 -->
    <!-- check-1-a -->
    <!-- ref="formData"是用来检查验证是否通过的 -->
    <el-form label-position="top" :rules="rules" ref="formData" :model="formData" label-width="80px">
      <h2>用户登录</h2>
      <!-- check-1-b -->
      <!-- prop验证username -->
      <el-form-item label="用户名" prop="username">
        <el-input autocomplete="off" v-model="formData.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input autocomplete="new-password" type="password" v-model="formData.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="submitForm()">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script src="@/views/login/Login.js"></script>

<style scoped>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-form.el-form--label-top {
  padding: 40px;
  width: 500px;
  border-radius: 5px;
  background-color: #fff;
}

.el-form .login-btn {
  width: 100%;
}
</style>
