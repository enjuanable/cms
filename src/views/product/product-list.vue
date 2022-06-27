<template>
  <div>
    <my-breadcrumb level2="商品管理" level2_link="/" level3="商品列表" level3_link="/admin/product/product-list">
    </my-breadcrumb>
    <el-row>
      <el-col :span="24">
        <div class="search">
          <el-input v-model="query" v-if="select === '1'" placeholder="请输入商品关键字" clearable>
            <el-select v-model="select" slot="prepend" placeholder="选择搜索模式" style="width: 136px;">
              <el-option label="搜索关键字" value="1"></el-option>
              <el-option label="搜索商品 ID" value="2"></el-option>
            </el-select>
            <el-button @click="searchByName" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-input v-model="goodsId" v-if="select === '2'" placeholder="请输入商品 ID" clearable>
            <el-select v-model="select" slot="prepend" placeholder="选择搜索模式" style="width: 136px;">
              <el-option label="搜索关键字" value="1"></el-option>
              <el-option label="搜索商品 ID" value="2"></el-option>
            </el-select>
            <el-button @click="searchByID" slot="append" icon="el-icon-search"></el-button>
          </el-input>

          <el-button type="success" plain @click="$router.push({ name: 'product-add' })">添加商品</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 商品列表 -->
    <el-table :data="tableData" stripe fit border v-loading="loading" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID">
              <span>{{ props.row.goods_id }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.goods_name }}</span>
            </el-form-item>
            <el-form-item label="商品价格(元)">
              <span>{{ props.row.goods_price }}</span>
            </el-form-item>
            <el-form-item label="商品重量">
              <span>{{ props.row.goods_weight }}</span>
            </el-form-item>
            <el-form-item label="商品状态">
              <span>{{ props.row.goods_state }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.goods_cat }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{ props.row.add_time | dateFormat }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.upd_time | dateFormat }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goods_introduce }}</span>
            </el-form-item>
            <el-form-item label="商品参数">
              <span>{{ props.row.attrs }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column label="商品 ID" prop="goods_id" width="100">
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="500">
      </el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="120">
      </el-table-column>
      <el-table-column label="商品状态" prop="goods_state" width="80">
        <template slot-scope="scope">

          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-tag  :key="checkStatus(scope)" :type="checkStatusType(scope)" effect="dark">
                {{ checkStatus(scope) }}
              </el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tag key="已审核" type="success" effect="dark" @click="statusChange(scope,'2','已审核','success')">
                已审核
              </el-tag>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tag key="审核中" type="" effect="dark" @click="statusChange(scope,'1','审核中','')">
                审核中
              </el-tag>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tag key="未通过" type="danger" effect="dark" @click="statusChange(scope,'0','未通过','danger')">
                未通过
              </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- U-1-a 点击触发事件 -->
          <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="handleEdit(scope)">编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.goods_id)" size="mini" icon="el-icon-delete" plain>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- U-2 弹出修改对话框 -->
    <!-- 修改商品的对话框 -->
    <el-dialog title="修改商品" :visible.sync="updateFormModal">

      <el-form :model="updateForm">

        <el-form-item label="商品 ID" label-width="80">
          <el-input v-model="updateForm.goods_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称" label-width="80">
          <el-input v-model="updateForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" label-width="80">
          <el-input v-model="updateForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="80">
          <el-input v-model="updateForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" label-width="80">
          <el-input v-model="updateForm.goods_cat" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品描述" label-width="80">
          <el-input v-model="updateForm.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="商品参数" label-width="80">
          <el-input v-model="updateForm.attrs" disabled></el-input>
        </el-form-item>


      </el-form>


      <div slot="footer" class="dialog-footer">

        <el-button @click="updateFormModal = false">取 消</el-button>
        <!-- U-2 -->
        <!-- 执行更新用户操作 -->
        <el-button type="primary" @click="updateGoodsHandler">确 定</el-button>
      </div>


    </el-dialog>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script src="@/views/product/product-list.js"></script>

<style scoped lang="less">
.search .el-input {
  width: 400px;
}
</style>
