import request from '@/utils/request.js'
import { OutputQuoteStyle } from 'terser';


export default {
    data() {
        return {
            loading: true,
            // 分页数据
            pagenum: 1,
            pagesize: 10,
            total: 0,
            // 查询参数
            query: '',
            goodsId: '',
            tableData: [],
            // 搜索框的select切换
            input3: '',
            select: '1',
            // 修改商品信息
            updateFormModal: false,
            updateForm: {
                goods_id: 0,
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_cat: '',
                goods_introduce: '',
                attrs: '',
            },
            // 切换商品状态
            // status: 2,
            // key: '审核中',
            // type: '',
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        checkStatus(scoped) {
            // console.log(scoped.row.goods_state);
            let status = scoped.row.goods_state;
            let key = ''
            let type = ''
            if (status == 0) {
                key = '未通过';
                type = 'danger';
            } else if (status == 1) {
                key = '审核中';
                type = '';
            } else {
                key = '已通过';
                type = 'success';
            }
            // return [key,type]
            return key
        },
        checkStatusType(scoped) {
            // console.log(scoped.row.goods_state);
            let status = scoped.row.goods_state;
            let key = ''
            let type = ''
            if (status == 0) {
                key = '未通过';
                type = 'danger';
            } else if (status == 1) {
                key = '审核中';
                type = '';
            } else {
                key = '已通过';
                type = 'success';
            }
            // return [key,type]
            return type
        },
        // 更换状态事件
        statusChange(scoped, status, key, type) {
            console.log(scoped)
            // this.status = status
            // this.key = key
            // this.type = type
        },
        // 加载商品列表
        async loadData() {
            const res = await request.get('/goods', {
                params: {
                    query: this.query,
                    pagenum: this.pagenum,
                    pagesize: this.pagesize
                }
            });
            this.loading = false;
            if (res.meta.status === 200) {
                this.tableData = res.data.goods;
                this.total = res.data.total;
                this.status = res.data.goods.goods_state;
            }
        },
        // U-1-b 先获取页面该商品的信息即要修改的内容
        // 在表单点击编辑触发handleEdit事件
        async handleEdit(scoped) {
            // 修改updateFormModal为true
            this.updateFormModal = true;
            // 使用data里的updateForm对象接收该事件的传来的页面值
            // this.updateForm = scoped.row;
            this.updateForm = {
                goods_id: scoped.row.goods_id,
                goods_name: scoped.row.goods_name,
                goods_price: scoped.row.goods_price,
                goods_weight: scoped.row.goods_weight,
                goods_cat: scoped.row.goods_cat,
                goods_introduce: scoped.row.goods_introduce,
                attrs: scoped.row.attrs,
            }
        },


        // U-3 在对话框确认修改后执行此函数
        // 在用户点击确认后执行异步更新用户操作
        async updateGoodsHandler() {
            // 异步调用updateGoods函数并传去表单数据进行调加用户操作,用info接收传回来的结果

            // U-4-a 调用异步函数进行接口请求并接收传回来的参数
            let info = await updateGoods(this.updateForm);
            console.log(info);

            // 如果info的头信息的状态值等于200
            if (info.meta.status == 201) {
                // 则$message的类型为success并打印info头信息的msg值
                this.$message.success(info.meta.msg);
                // 更新表单模型的值改为false
                this.updateFormModal = false;
                // 调用getUsers函数渲染表格
                this.loadData();
                // 如果info的头信息的状态值 不等于 200
            } else {
                // 则$message的类型为error并打印info头信息的msg值
                this.$message.error(info.meta.msg);
            }
            // 更新操作完成要重置updateForm的值为''
            this.updateForm = {
                goods_id: 0,
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_cat: '',
                goods_introduce: '',
                attrs: '',
            }
        },
        // U-4-b
        // 修改商品分类
        // updateGoods: ({ goods_id, goods_name, goods_price, goods_weight, goods_cat, goods_introduce, attrs }) => {
        //   let url = `users/${goods_id}`;
        //   return request.put(url, { goods_name, goods_price, goods_weight, goods_cat, goods_introduce, attrs });
        // },
        // 修改商品分类
        async updateGoods() {
            const res = await request.put(`/categories/${this.formData.cat_id}`, {
                cat_name: this.formData.cat_name
            });
            if (res.meta.status === 200) {
                this.editCategoryVisible = false;
                this.loadData();
                this.$message({
                    type: 'success',
                    message: '编辑分类成功'
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '编辑分类失败'
                });
            }
        },


        // 加载商品列表
        async loadDataByID() {
            const res = await request.get(`/goods/${this.goodsId}`);
            this.loading = false;
            if (res.meta.status === 200) {
                this.$message({
                    type: 'success',
                    message: '查询成功!'
                });
                // Invalid prop: type check failed for prop "data". Expected Array, got Object 
                // 期望的是得到数组但是给了一个对象
                // https://blog.csdn.net/Ppphill_C/article/details/119029467
                // 解决办法就是转换为数组
                // this.tableData = null;
                this.tableData = Array(res.data);
                this.total = res.data.total;
            } else {
                this.$message.error('查询失败');
            }
        },


        // 查找
        searchByName() {
            // let q = this.query.trim();
            // if (!q) {
            //   this.$message.error('请输入搜索关键字');
            //   return;
            // }
            // 调用接口进行搜索
            this.loadData();
            // this.query = '';
        },


        // 查找
        searchByID() {
            let id = this.goodsId.trim();
            console.log(id);
            if (!id) {
                this.$message.error('请输入商品 ID');
                return;
            }
            // 调用接口进行搜索
            this.loadDataByID()
            // this.query = '';
        },


        // 分页
        handleSizeChange(val) {
            this.pagenum = 1;
            this.pagesize = val;
            this.loadData();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.loadData();
            console.log(`当前页: ${val}`);
        },


        // 删除
        async handleDelete(goodsId) {
            this.$confirm('是否要删除该商品？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await request.delete(`/goods/${goodsId}`);
                if (res.meta.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.loadData();
                } else {
                    this.$message.error('删除失败');
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
};