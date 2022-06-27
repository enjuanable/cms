import request from '@/utils/request.js'

export default {
    data() {
        return {
            // 权限列表
            tableData: [],
            // 加载
            loading: true,
            // 新增角色表单开关
            addRoleFormVisible: false,
            // 编辑角色表单开关
            editRoleFormVisible: false,
            // 新增角色表单数据
            addRoleFormData: {
                roleName: '',
                roleDesc: ''
            },
            // 验证规则
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            // 控制权限分配的对话框的显示隐藏
            // 树形列表
            editRightsDialog: false,
            // 权限列表
            rightsData: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中的权限id
            checkedKeys: [],
            // 点击授权的时候记录下来当前的角色
            currentRole: {}
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        // 加载表格数据
        async loadData() {
            const res = await request.get('/roles');
            // console.log(res);
            if (res.meta.status === 200) {
                // 角色列表数据包含了树状显示的权限列表
                this.tableData = res.data;
                this.loading = false;
            }
        },
        // 添加角色
        async handleAddRole() {
            // 表单验证
            this.$refs.addRoleForm.validate(async (valid) => {
                if (!valid) {
                    // 表单验证失败，返回
                    return;
                }
                // 表单验证成功，添加角色
                this.addRoleFormVisible = false;
                const res = await request.post('/roles', this.addRoleFormData);
                if (res.meta.status === 201) {
                    this.$message({
                        type: 'success',
                        message: '创建角色成功'
                    });
                    // 重新加载数据
                    this.loadData();
                } else {
                    this.$message({
                        type: 'erroe',
                        message: '创建角色失败'
                    });
                }
            });
        },
        // 删除角色
        async handleDelete(role) {
            // 删除提示
            this.$confirm('确认删除该角色？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 删除操作
                const { id: roleId } = role;
                const res = await request.delete(`/roles/${roleId}`);
                if (res.meta.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除角色成功'
                    });
                    this.loadData();
                } else {
                    this.$message({
                        type: 'error',
                        message: '删除角色失败'
                    });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async showEditRoleDialog(role) {
            // 显示编辑角色的对话框
            this.editRoleFormVisible = true;
            const { id: roleId } = role;
            const res = await request.get(`/roles/${roleId}`);
            this.addRoleFormData = res.data;

            this.addOrEdit = 'edit';
        },
        // 编辑角色
        async handleEidtRole() {
            const { roleId } = this.addRoleFormData;
            const res = await request.put(`/roles/${roleId}`, this.addRoleFormData);
            this.editRoleFormVisible = false;
            if (res.meta.status === 200) {
                this.$message({
                    type: 'success',
                    message: '编辑用户成功'
                });
                this.loadData();
            } else {
                this.$message({
                    type: 'error',
                    message: '编辑用户错误'
                });
            }
        },
        // 显示权限分配的对话框
        async showRightsDialog(role) {
            // 获取当前角色具有的权限id
            function getLevel3Ids(rightsList) {
                const arr = [];
                const fn = function (list) {
                    list.forEach((item) => {
                        if (!item.children) {
                            arr.push(item.id);
                        } else {
                            fn(item.children);
                        }
                    });
                };
                fn(rightsList);
                return arr;
            }
            // 记录当前的角色
            this.currentRole = role;
            this.editRightsDialog = true;
            // 请求获取列表显示的权限列表
            const res1 = await request.get('/rights/list');
            // 请求获取树状显示的权限列表
            const res = await request.get('/rights/tree');
            // 返回结果数据绑定到data
            console.log(res1.data);
            console.log(res.data);
            this.rightsData = res.data;
            // 设置选中的权限
            this.checkedKeys = getLevel3Ids(role.children);
        },
        // 分配权限
        async handleRights() {
            // 获取所有选中的权限id
            // $refs 获取所有节点的ref
            // tree:是节点属性ref自定义的值
            // getCheckedNodes 通过node来获取选中的所有子节点
            const nodes = this.$refs.tree.getCheckedNodes();
            // 列表形数据
            // console.log(nodes);
            let arr = [];
            nodes.forEach((item) => {
                // 选中的子权限id
                arr.push(item.id.toString());

                // 子权限的id 对应的父权限的id
                if (typeof (item.pid) === 'number') {
                    arr.push(item.pid.toString());
                } else {
                    arr = arr.concat(item.pid.split(','));
                }
            });

            // 数组去重
            const set = new Set(arr);

            const ids = [...set].join(',');

            const res = await request.post(`/roles/${this.currentRole.id}/rights`, {
                rids: ids
            });
            if (res.meta.status === 200) {
                this.editRightsDialog = false;
                this.$message({
                    type: 'success',
                    message: '权限分配成功'
                });
                this.loadData();
            } else {
                this.$message({
                    type: 'error',
                    message: '权限分配失败'
                });
            }
        },
        // 删除权限
        async handleDeleteRights(role, rights) {
            // role 权限  rights 角色
            const res = await request.delete(`/roles/${role.id}/rights/${rights.id}`);
            if (res.meta.status === 200) {
                this.$message({
                    type: 'success',
                    message: '删除权限成功'
                });
                // 重新绑定数据
                role.children = res.data;
            } else {
                this.$message({
                    type: 'error',
                    message: '删除权限失败'
                });
            }
        }

    }
};