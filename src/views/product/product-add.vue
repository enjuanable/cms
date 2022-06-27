<template>
    <div>
        <!-- <my-breadcrumb level2="商品管理" level2_link="/"  level3="商品列表" level3_link="/admin/product/product-list" level4="添加商品" level4_link="/admin/product/product-add"></my-breadcrumb> -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/product/product-list' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/product/product-add' }">添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-alert title="添加商品信息" type="info" center show-icon>
        </el-alert>

        <!-- element-ui的Timeline组件 -->
        <el-steps :space="200" align-center :active="activeTabName - 0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
            <el-tabs tab-position="left" v-model="activeTabName" @tab-click="handleTabClick">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader placeholder="请选择商品分类" clearable style="width: 250px" expand-trigger="hover"
                            :props="{ label: 'cat_name', value: 'cat_id' }" :options="options" @change="handleChange"
                            v-model="addForm.goods_cat">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item v-for="item in dymanicParams" :key="item.attr_id" :label="item.attr_name">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox v-for="(val, index) in item.attr_vals" border :key="index" :label="val">
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item v-for="item in staticParams" :key="item.attr_id" :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :headers="uploadHeaders" name="file"
                        :on-success="uploadSuccess" :on-preview="handlePreview" :on-remove="handleRemove"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                    <quillEditor v-model="addForm.goods_introduce" class="editor"></quillEditor>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script src="@/views/product/product-add.js"></script>

<style scoped>
.el-tabs {
    margin-top: 20px;
}

.el-alert {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
