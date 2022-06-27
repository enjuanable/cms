<template>
  <div>
    <my-breadcrumb level2="商品管理" level2_link="/" level3="分类参数" level3_link="/admin/product/categories"></my-breadcrumb>
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon>
    </el-alert>
    <!-- 级联下拉框:选择商品分类 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span>请选择商品分类：</span>
          <!-- 数据改变事件触发handleChange函数 -->
          <el-cascader placeholder="请选择商品分类" expand-trigger="hover" :props="{ label: 'cat_name', value: 'cat_id' }"
            :options="options" v-model="selectedOptions" :show-all-levels="false" @change="handleChange">
          </el-cascader>
        </div>
      </el-col>
    </el-row>
    <!-- tab栏 -->
    <!-- elementui Tab组件 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <!-- 添加动态参数按钮 -->
        <el-button :disabled="btnDisabled" class="btn-add" type="primary" size="small"
          @click="addDynamicFormVisible = true">添加动态参数
        </el-button>
        <!-- 渲染动态参数 -->
        <el-table stripe border :data="dynamicTableData" style="width: 100%">
          <!-- 默认关闭：遍历商品参数(标签) -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 遍历标签 -->
              <el-tag :key="index" v-for="(item, index) in scope.row.params" closable :disable-transitions="false"
                @close="handleClose(scope.row, index)">
                {{ item }}
              </el-tag>
              <!-- 添加新标签：inputVisible为true -->
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
              </el-input>
              <!-- 添加新标签：else -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签
              </el-button>
            </template>
          </el-table-column>
          <!-- 表格index -->
          <el-table-column label="#" type="index">
          </el-table-column>
          <!-- 商品参数 -->
          <el-table-column label="商品参数" prop="attr_name" width="200px">
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="openEditDynamic(scope.row)">编辑
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <!-- 添加静态参数按钮 -->
        <el-button :disabled="btnDisabled" class="btn-add" type="primary" size="small"
          @click="addStaticFormVisible = true">添加静态参数
        </el-button>
        <!-- 静态参数表格 -->
        <el-table :data="staticTableData" stripe border style="width: 100%">
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200px">
          </el-table-column>
          <el-table-column prop="attr_vals" label="属性值">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="openEditStatic(scope.row)">编辑
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加动态参数 -->
    <el-dialog title="添加动态参数" :visible.sync="addDynamicFormVisible">
      <el-form label-position="right" label-width="100px" :rules="rules" ref="addDynamicForm" :model="DynamicFormData">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDynamicFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddDynamic">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数 -->
    <el-dialog title="编辑动态参数" :visible.sync="editDynamicFormVisible">
      <el-form label-position="right" label-width="100px" :rules="rules" ref="editDynamicForm" :model="DynamicFormData">
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDynamicFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDynamic">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加静态参数 -->
    <el-dialog title="添加静态参数" :visible="addStaticFormVisible">
      <el-form label-position="right" label-width="100px" :rules="rules" ref="addStaticForm" :model="DynamicFormData">
        <el-form-item label="静态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" prop="attr_vals">
          <el-input v-model="DynamicFormData.attr_vals" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStaticFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddStatic">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑动态参数 -->
    <el-dialog title="编辑静态参数" :visible="editStaticFormVisible">
      <el-form label-position="right" label-width="100px" :rules="rules" ref="editStaticForm" :model="DynamicFormData">
        <el-form-item label="静态参数" prop="attr_name">
          <el-input v-model="DynamicFormData.attr_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" prop="attr_vals">
          <el-input v-model="DynamicFormData.attr_vals" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStaticFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditStatic">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/views/product/categories-list.js"></script>

<style scoped>
.el-alert {
  margin-top: 20px;
  margin-bottom: 20px;
}

.el-col {
  margin-bottom: 20px;
}

.btn-add {
  margin-bottom: 20px;
}
</style>
