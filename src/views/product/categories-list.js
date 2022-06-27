import request from '@/utils/request.js'

export default {
    data() {
        return {
            options: [],
            selectedOptions: [],
            activeName: 'many',
            dynamicTableData: [],
            staticTableData: [],
            
            inputVisible: false,
            inputValue: '',
            btnDisabled: true,
            addDynamicFormVisible: false,
            editDynamicFormVisible: false,
            addStaticFormVisible: false,
            editStaticFormVisible: false,
            DynamicFormData: {
                attr_id: '',
                attr_name: '',
                attr_sel: 'many'
            },
            rules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ],
                attr_vals: [
                    { required: true, message: '请输入参数值', trigger: 'blur' }
                ]
            }
        };
    },
    mounted() {
        this.loadOptions();
    },
    methods: {
        // 级联下拉发生改变：选择商品改变时执行
        handleChange() {
            // console.log(val);
            // console.log(this.selectedOptions);
            // 如果不是选择最后一级即第三级分类  就清空列表
            if (this.selectedOptions.length !== 3) {
                this.dynamicTableData = [];
                this.staticTableData = [];
            } else {
                this.btnDisabled = false;
                this.loadTableData();
            }
        },
        // 动态的tag标签：切换动态参数/静态参数、动态刷新渲染
        async handleClose(row, index) {
            row.params.splice(index, 1);
            // postdata
            const postData = {};
            postData.attr_name = row.attr_name;
            postData.attr_sel = row.attr_sel;
            postData.attr_vals = row.params.join(',');
            row.attr_vals = postData.attr_vals;
            const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
            const res = await request.put(url, postData);
            if (res.meta.status === 200) {
                this.$message.success('更新成功');
            } else {
                this.$message.error('更新失败');
            }
        },
        async handleInputConfirm(row) {
            const inputValue = this.inputValue;
            if (inputValue) {
                row.params.push(inputValue);
                // 创建局部对象
                const postData = {};
                // 将表单数据赋值给对象
                postData.attr_name = row.attr_name;
                postData.attr_sel = row.attr_sel;
                postData.attr_vals = row.params.join(',');
                row.attr_vals = postData.attr_vals;
                // 模板原型写url
                const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
                // 发起请求
                const res = await request.put(url, postData);
                if (res.meta.status === 200) {
                    this.$message.success('更新成功');
                } else {
                    this.$message.error('更新失败');
                }
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async loadOptions() {
            // 获取第三层分类列表
            const res = await request.get('/categories?type=3');
            if (res.meta.status === 200) {
                this.options = res.data;
            }
        },
        // 点击tab
        handleTabClick() {
            if (this.selectedOptions.length === 3) {
                this.loadTableData();
            }
        },
        async loadTableData() {
            // 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
            const url = `categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`;
            const res = await request.get(url);
            console.log(res);
            if (res.meta.status === 200) {
                if (this.activeName === 'many') {
                    // 绑定数据
                    this.dynamicTableData = res.data;
                    // 给数组中的每一项添加params属性，把attr_vals用,分割，转换成数组存储到params中
                    this.dynamicTableData.forEach((item) => {
                        const arr = [];
                        item.attr_vals.trim().split(',').forEach((item1) => {
                            if (item1) {
                                arr.push(item1);
                            }
                        });
                        // console.log(arr);
                        this.$set(item, 'params', arr);
                    });
                } else {
                    // 绑定数据
                    this.staticTableData = res.data;
                }
            }
        },
        // 添加动态参数
        async handleAddDynamic() {
            this.$refs.addDynamicForm.validate(async (valide) => {
                if (!valide) {
                    return;
                }
                const url = `/categories/${this.selectedOptions[2]}/attributes`;
                const res = await request.post(url, this.DynamicFormData);
                // console.log(res);
                if (res.meta.status === 201) {
                    this.addDynamicFormVisible = false;
                    this.$message.success('添加参数成功');
                    this.loadTableData();
                } else {
                    this.$message.error('添加参数失败');
                }
            });
        },
        // 删除参数
        async handleDelete(row) {
            // 删除提示
            this.$confirm('确认删除该参数？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.DynamicFormData.attr_sel = 'many';
                const url = `/categories/${row.cat_id}/attributes/${row.attr_id}`;
                const res = await request.delete(url);
                if (res.meta.status === 200) {
                    this.loadTableData();
                    // 删除成功
                    this.$message.success('删除成功');
                } else {
                    this.$message.error('删除失败');
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 打开编辑动态参数的窗口
        openEditDynamic(row) {
            this.DynamicFormData.attr_id = row.attr_id;
            this.DynamicFormData.attr_name = row.attr_name;
            this.DynamicFormData.attr_vals = row.attr_vals;
            this.editDynamicFormVisible = true;
        },
        // 编辑动态参数
        async handleEditDynamic() {
            const attrId = this.DynamicFormData.attr_id;
            const url = `/categories/${this.selectedOptions[2]}/attributes/${attrId}`;
            this.DynamicFormData.attr_sel = 'many';
            const res = await request.put(url, this.DynamicFormData);
            // console.log(res);
            if (res.meta.status === 200) {
                this.editDynamicFormVisible = false;
                this.loadTableData();
                this.$message.success('更新成功');
            } else {
                this.$message.error('更新失败');
            }
        },
        // 添加静态参数
        async handleAddStatic() {
            this.$refs.addStaticForm.validate(async (valide) => {
                if (!valide) {
                    return;
                }
                this.DynamicFormData.attr_sel = 'only';
                const url = `/categories/${this.selectedOptions[2]}/attributes`;
                const res = await request.post(url, this.DynamicFormData);
                if (res.meta.status === 201) {
                    this.addStaticFormVisible = false;
                    this.$message.success('添加参数成功');
                    this.loadTableData();
                } else {
                    this.$message.error('添加参数失败');
                }
            });
        },
        // 打开编辑静态参数的窗口
        openEditStatic(row) {
            this.DynamicFormData.attr_id = row.attr_id;
            this.DynamicFormData.attr_name = row.attr_name;
            this.DynamicFormData.attr_vals = row.attr_vals;
            this.editStaticFormVisible = true;
        },
        async handleEditStatic() {
            const attrId = this.DynamicFormData.attr_id;
            const url = `/categories/${this.selectedOptions[2]}/attributes/${attrId}`;
            this.DynamicFormData.attr_sel = 'only';
            const res = await request.put(url, this.DynamicFormData);
            if (res.meta.status === 200) {
                this.editStaticFormVisible = false;
                this.loadTableData();
                this.$message.success('更新成功');
            } else {
                this.$message.error('更新失败');
            }
        }
    }
};