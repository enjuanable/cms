import request from '@/utils/request.js'
import cityData from './city_data2017_element';

export default {
    data() {
        return {
            tableData: [],
            pagenum: 1,
            pagesize: 10,
            total: 0,
            loading: true,
            options: cityData,
            selectedOptions: [],
            addFormVisible: false,
            // 修改支付方式
            // key: 
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            const res = await request.get('/orders', {
                params: {
                    pagenum: this.pagenum,
                    pagesize: this.pagesize
                }
            });
            this.loading = false;
            if (res.meta.status === 200) {
                this.tableData = res.data.goods;
                this.total = res.data.total;
            }
        },

        async updatePay(id, payWay, price) {
            console.log(id, payWay, price);
            const res = await request.put(`orders/${id}`, {
                order_pay: payWay,
                order_price: price,
            });
            console.log(res);

            this.loading = false;

            if (res.meta.status === 201) {
                this.tableData = res.data.goods;
                this.total = res.data.total;
                this.loadData();
                this.$message({
                    type: 'success',
                    message: '修改支付方式成功'
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '修改支付方式失败'
                });
            }
        },

        changePay(scoped, PayWay) {
            // console.log(scoped.row.goods_state);
            this.updatePay(scoped.row.order_id, PayWay, scoped.row.order_price)
        },
        checkPayWay(scoped) {
            // console.log(scoped.row.goods_state);
            let status = scoped.row.order_pay;
            let key = ''
            let type = ''
            if (status === '0') {
                key = '未支付';
                type = 'danger';
            } else if (status === '1') {
                key = '支付宝';
                type = '';
            } else if (status === '2') {
                key = '微信';
                type = '';
            } else if (status === '3') {
                key = '银行卡';
                type = '';
            }
            // return [key,type]
            return key
        },
        checkPayWayType(scoped) {
            // console.log(scoped.row.goods_state);
            let status = scoped.row.order_pay;
            let key = ''
            let type = ''
            if (status === '0') {
                key = '未支付';
                type = 'danger';
            } else if (status === '1') {
                key = '支付宝';
                type = '';
            } else if (status === '2') {
                key = '微信';
                type = '';
            } else if (status === '3') {
                key = '银行卡';
                type = '';
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
        handleSizeChange(val) {
            this.pagenum = 1;
            this.pagesize = val;
            this.loadData();
            console.log(val);
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.loadData();
            console.log(val);
        },
        handleChange(val) {
            console.log(val);
        }
    }
};