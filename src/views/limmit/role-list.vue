<template>
  <div>
    <my-breadcrumb level2="权限管理" level2_link="/" level3="角色列表"></my-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-button @click="addRoleFormVisible = true;">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表和可开闭的权限列表 -->
    <!-- 数据列表为tableData -->
    <el-table v-loading="loading" :data="tableData" :border="true" style="width: 100%">
      <!-- 遍历权限-默认关闭 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row class="level1-row" v-for="level1 in scope.row.children" :key="level1.id">
            <!-- 第一列渲染一级权限 -->
            <el-col :span="4">
              <el-tag closable @close="handleDeleteRights(scope.row, level1)" type="">
                {{ level1.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 第二列渲染第二级权限 -->
            <el-col :span="20">
              <!-- 二级权限-分行渲染 -->
              <el-row class="level2-row" v-for="level2 in level1.children" :key="level2.id">

                <el-col :span="5">
                  <el-tag closable @close="handleDeleteRights(scope.row, level2)" type="success">
                    {{ level2.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <!-- 三级菜单 -->
                  <el-tag class="level3-row" v-for="level3 in level2.children" :key="level3.id"
                    @close="handleDeleteRights(scope.row, level3)" closable type="warning">
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              没有分配权限
            </el-col>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showRightsDialog(scope.row)">+ 添加权限</el-button>
          </el-row>
        </template>
      </el-table-column>
      <!-- 角色列表 -->
      <el-table-column type="index">
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName">
      </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)" plain>修改角色
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" icon="el-icon-delete" plain>删除角色
          </el-button>
          <el-button type="warning" size="mini" @click="showRightsDialog(scope.row)" icon="el-icon-check" plain>分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的弹出层 -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible">
      <el-form ref="addRoleForm" :rules="rules" :model="addRoleFormData" label-position="right" label-width="100px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRoleFormData.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoleFormData.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色的弹出窗 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleFormVisible">
      <el-form ref="editRoleForm" :rules="rules" :model="addRoleFormData" label-position="right" label-width="100px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRoleFormData.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoleFormData.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEidtRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配的弹出窗 -->
    <el-dialog title="权限分配" :visible.sync="editRightsDialog">
      <div>
        <!-- 数据为树状形的权限列表 -->
        <!-- eleui的树形列表、只需给树形列表的数据就自动分级 -->
        <!-- 属性：默认全展开-开启checkbox -->
        <!-- 通过 key 来获取或设置节点、则必须设置node-key。 -->
        <el-tree :data="rightsData" ref="tree" default-expand-all :default-checked-keys="checkedKeys" show-checkbox
          node-key="id" :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<style scoped>
.level1-row {
  margin-bottom: 10px;
}

/* .level2-row {
  margin-bottom: 5px;
} */
.level3-row {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
<script src="@/views/limmit/role-list.js"></script>