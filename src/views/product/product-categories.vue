<template>
  <div>
    <my-breadcrumb level2='商品管理' level2_link="/" level3='商品分类' level3_link="/admin/product/product-categories">
    </my-breadcrumb>
    <el-button type='success' @click="addCategoryVisible = true" plain>添加分类</el-button>
    <!-- 分类表格 -->
    <!-- Elementui：Tree 树形控件 -->
    <el-table v-loading="loading" :data="tableData" border max-height="400">
      <el-table-tree-column prop="cat_name" label="分类名称" tree-key="cat_id" level-key="cat_level" parent-key="cat_pid"
        child-key="children" :show-overflow-tooltip="true" width="320" :indent-size="20">
      </el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">{{ !scope.row.cat_deleted ? '有效' : '无效' }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="openEditDialog(scope.row)" size="mini" icon="el-icon-edit" plain>编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.cat_id)" size="mini" icon="el-icon-delete" plain>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑商品分类" :visible.sync="editCategoryVisible">
      <el-form label-position="right" label-width="80px" :model="formData">
        <el-form-item label="分类名称">
          <el-input v-model="formData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addCategoryVisible">
      <el-form label-position="right" label-width="80px" :model="formAddData">
        <el-form-item label="三级分类">
          <el-input v-model="formAddData.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader placeholder="默认添加一级分类" clearable expand-trigger="hover" :options="level2List"
            v-model="formAddData.selectedPIds" :props="{ value: 'cat_id', label: 'cat_name', children: 'children' }"
            change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/views/product/product-categories.js"></script>

<style scoped>
</style>
