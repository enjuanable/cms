<template>
  <div>
    <my-breadcrumb level2="订单管理" level2_link="/" level3="订单列表" level3_link="/admin/orders/orders-list"></my-breadcrumb>
    <el-table :data="tableData" stripe border fit v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="300px">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="80px">
      </el-table-column>
      <el-table-column label="支付方式" prop="order_pay" width="80">
        <template slot-scope="scope">

          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-tag :key="checkPayWay(scope)" :type="checkPayWayType(scope)" effect="dark">
                {{ checkPayWay(scope) }}
              </el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tag key="未支付" type="danger" effect="dark" @click="changePay(scope, '0')">
                  未支付
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tag key="支付宝" type="" effect="dark" @click="changePay(scope, '1')">
                  支付宝
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tag key="微信" type="" effect="dark" @click="changePay(scope, '2')">
                  微信
                </el-tag>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-tag key="银行卡" type="" effect="dark" @click="changePay(scope, '3')">
                  银行卡
                </el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column prop="pay_status" label="是否付款" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
          <el-tag v-else type="success">已付款</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" plain @click="addFormVisible = true">修改信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="修改订单地址" :visible="addFormVisible">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="省市区/县">
          <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange"
            style="width: 500px">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="@/views/orders/orders-list.js"></script>

<style>
</style>
