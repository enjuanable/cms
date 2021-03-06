// 轻量级富文本编辑器 https://blog.csdn.net/senmage/article/details/82388728
import request from '@/utils/request.js'
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.less';
import 'quill/dist/quill.snow.less';
import 'quill/dist/quill.bubble.less';


export default {
    components: {
        quillEditor
    },
    data() {
        return {
            // 步骤
            active: 0,
            // 已选步骤
            stepSuc: [0],
            // 步骤标题
            stepTitle: ['步骤一', '步骤二', '步骤三', '步骤四'],

            addForm: {
                goods_name: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_cat: [],
                pics: [],
                // 商品介绍
                goods_introduce: ''
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请输入商品分类', trigger: 'blur' }
                ]
            },
            activeTabName: '0',
            // 级联菜单的选项
            options: [],
            selectedOptions: [],
            // 动态参数  商品参数
            dymanicParams: [],
            // 静态参数  商品属性
            staticParams: [],
            // 上传图片时候的请求头
            uploadHeaders: {
                // 注意：必须这么写
                Authorization: localStorage.getItem('token')
            }
        };
    },
    mounted() {
        this.loadCascader();
    },
    methods: {
        // 添加商品
        async addGoods() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error('请填写必要的商品信息！');
                }
                // 把addForm对象进行浅复制
                // 提交给服务器的goods_cat使用,分割的字符串，如果直接修改addForm中的goods_cat属性的话
                // 会影响绑定的下拉框
                const o = { ...this.addForm };
                o.goods_cat = o.goods_cat.join(',');

                // 把dymanicParams和staticParams数组对象，改造
                // 给addForm新增一个attrs属性，由后面的对象形式组成 {attr_id: 1, attr_value: ''}
                const arr1 = this.dymanicParams.map(item =>
                    ({ attr_id: item.attr_id, attr_value: item.attr_vals }));
                const arr2 = this.staticParams.map(item =>
                    ({ attr_id: item.attr_id, attr_value: item.attr_vals }));

                o.attrs = [...arr1, ...arr2];

                const res = await request.post('/goods', o);

                if (res.meta.status === 201) {
                    this.$message.success('商品添加成功');
                    this.$router.push({
                        name: 'goodslist'
                    });
                } else {
                    this.$message.error('商品添加失败');
                }
            });
        },
        // 上传图片
        handleRemove(file) {
            const index = this.addForm.pics.findIndex(item => file.response.data.tmp_path === item.pic);
            this.addForm.pics.splice(index, 1);
            // 要把图片从数组中移除
            console.log(file);
        },
        handlePreview(file) {
            console.log(file);
        },
        uploadSuccess(response) {
            if (response.meta.status === 200) {
                this.$message.success('图片上传成功');
                const o = { pic: response.data.tmp_path };
                this.addForm.pics.push(o);
                // 图片上传成功后做的操作
                console.log(response);
            } else {
                this.$message.error('图片上传失败');
            }
        },
        // cascader选中后触发
        handleChange() {
            // 如果选择的不是3级分类，返回
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat.length = 0;
            }
        },
        async handleTabClick() {
            // console.log(tab, event);
            // console.log(this.activeTabName);
            // 点击tabItem的时候，判断当前的tabName是不是 商品参数 和 商品属性
            if (this.activeTabName === '1' || this.activeTabName === '2') {
                // 判断是否选择商品分类，如果没有选择提示，并返回
                // 这里length == 3是因为是数组有3级元素
                if (this.addForm.goods_cat.length !== 3) {
                    return this.$message.error('请选择商品分类');
                }
                const res = await request.get(`/categories/${this.addForm.goods_cat[2]}/attributes`, {
                    params: {
                        sel: this.activeTabName === '1' ? 'many' : 'only'
                    }
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品参数失败');
                }
                // 如果获取的是商品参数，对数据处理
                if (this.activeTabName === '1') {
                    res.data.forEach((item) => {
                        // 把逗号分隔的字符串转换成数组
                        item.attr_vals =
                            item.attr_vals.trim().length <= 0 ? [] : item.attr_vals.trim().split(',');
                    });
                    this.dymanicParams = res.data;
                } else {
                    this.staticParams = res.data;
                }
            }
        },
        // 加载下拉菜单的数据
        async loadCascader() {
            const res = await request.get('/categories?type=3');
            if (res.meta.status === 200) {
                this.options = res.data;
            }
        }
    }
};