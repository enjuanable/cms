<template>
    <div>
        <!-- 面包屑组件 -->
        <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
            <!-- 这里不处理的话、会出现重复点击报错 https://blog.csdn.net/qq_29252021/article/details/109615753 -->
            <!-- https://www.cnblogs.com/xinheng/p/13019818.html -->
            <el-breadcrumb-item :to="{ path: '/admin/user/list' }">用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <div class="seach">
            <el-input placeholder="请输入用户名" v-model="keyword" class="input-with-select kw">
                <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
            </el-input>
            <div class="btns">
                <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
            </div>
        </div>
        <!-- 用户列表 -->
        <div class="user-list">
            <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据;用label属性来定义表格的列名;可以使用width属性来定义列宽。 -->
            <el-table :border="true" :stripe="true" :data="userList" style="width: 100%; margin-bottom: 10px">
                <el-table-column type="expand">
                    <!-- Elementui-表格-自定义列模板：通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
                    <!-- 这里slot-scope="props",那么,要引用就要引用props,也有起名为scope的 -->
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="序号" class=".label">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="用户名">
                                <span>{{ props.row.username }}</span>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <span>{{ props.row.mobile }}</span>
                            </el-form-item>
                            <el-form-item label="邮箱">
                                <span>{{ props.row.email }}</span>
                            </el-form-item>
                            <el-form-item label="角色名称">
                                <span>{{ props.row.role_name }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <!-- eleui自带的表格index索引 -->
                <el-table-column type="index" width="30">
                </el-table-column>
                <!-- prop的数据是:data="userList"给的 -->
                <el-table-column label="姓名" prop="username">
                </el-table-column>
                <el-table-column label="邮箱" prop="email">
                </el-table-column>
                <el-table-column label="电话" prop="mobile">
                </el-table-column>
                <el-table-column label="用户状态" width="80">
                    <template slot-scope="scope">
                        <el-switch @change="(val) => {
                            handleChange(val, scope.row.id)
                        }" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope)" size="mini" icon="el-icon-edit" plain>编辑
                        </el-button>
                        <el-button type="danger" @click="handleDelete(scope)" size="mini" icon="el-icon-delete" plain>删除
                        </el-button>
                        <el-button type="warning" @click="showSelectRoles(scope.row)" size="mini" icon="el-icon-check"
                            plain>分配角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 表格分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[1, 2, 3, 10]" :page-size="size"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 增加用户的对话框 -->
            <el-dialog title="增加用户" :visible.sync="addFormModal">
                <!-- check-1 -->
                <!-- 在这里引入验证规则 -->
                <!-- 只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
                <!-- :model="addForm"对应JS的data里的addForm对象 -->
                <!-- check-1-a -->
                <!-- ref="formData"是用来检查验证是否通过的 -->
                <!-- ref可以以属性的形式添加给标签或者组件 -->
                <el-form :model="addForm" :rules="rules" ref="addForm">
                    <!-- check-1-b -->
                    <!-- prop验证username -->
                    <!-- prop：表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 -->
                    <el-form-item label="用户名" label-width="80" prop="username">
                        <el-input v-model="addForm.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- prop验证password -->
                    <el-form-item label="密码" label-width="80" prop="password">
                        <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- el-form-item设置prop验证email -->
                    <el-form-item label="邮箱" label-width="80" prop="email">
                        <el-input v-model="addForm.email" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- prop验证mobile -->
                    <el-form-item label="手机号" label-width="80" prop="mobile">
                        <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormModal = false">取 消</el-button>
                    <el-button type="primary" @click="storeUser">确 定</el-button>
                </div>

            </el-dialog>

            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户" :visible.sync="updateFormModal">
                <!-- model是双向绑定 -->
                <!-- ref用来给元素或子组件注册引用信息 -->
                <el-form :model="updateForm" :rules="rules" ref="updateForm">

                    <el-form-item label="邮箱" label-width="80" prop="email">
                        <!-- v-model双向绑定 -->
                        <el-input v-model="updateForm.email" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号" label-width="80" prop="mobile">
                        <el-input v-model="updateForm.mobile" autocomplete="off"></el-input>
                    </el-form-item>


                </el-form>


                <div slot="footer" class="dialog-footer">

                    <el-button @click="updateFormModal = false">取 消</el-button>
                    <!-- U-2 -->
                    <!-- 执行更新用户操作 -->
                    <el-button type="primary" @click="updateUserHandler">确 定</el-button>
                </div>


            </el-dialog>

            <!-- 分配角色的对话框 -->
            <el-dialog title="分配角色" :visible.sync="selectRolesDialogVisible">
                <el-form label-width="100px" label-position="right" :model="selectRolesFormData">
                    <el-form-item label="当前用户">
                        <span>{{ selectRolesFormData.username }}</span>
                    </el-form-item>
                    <el-form-item label="请选择角色">
                        <el-select v-model="selectRolesFormData.rid">
                            <el-option :value="-1" label="请选择角色" disabled></el-option>
                            <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="selectRolesDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleRole">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<!-- 如果拆分vue和js,记得给routes里的路径加后缀导向vue而不是其他 -->
<script src="@/views/user/List.js"></script>

<!-- 这里的样式不取消scoped没办法生效 -->
<style lang="less">
.demo-table-expand {
    font-size: 0;
    padding: 0px 20px 0px 20px;

    label{
        width: 120px;
        color: #99a9bf!important;
    }
    .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
    
}
</style>
<style scoped lang="less">
.breadcrumb {
    margin-bottom: 20px;
}

.seach {
    display: flex;
    margin-bottom: 20px;

    .kw {
        width: 400px;
        margin-right: 20px;
    }


}
</style>
