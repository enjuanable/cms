// 引入api操作函数
import { getUserList, delUserById, addUser, updateUser } from "@/api/admin";
import request from '@/utils/request.js'

export default {
    name: "list",
    data() {
        // 自定义一个手机号码验证
        const validatePhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入联系方式'))
            } else {
                const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/
                // const phoneReg = /^1[34578]\d{9}$/
                if (reg.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的电话'))
                }
            }
        }
        return {
            keyword: '',
            currentPage: 1,
            size: 2,
            total: 100,
            // 存储查询获取的用户列表
            userList: [],
            // 添加用户的对话框是否显示
            addFormModal: false,
            // 编辑用户的对话框是否显示
            updateFormModal: false,
            // 分配角色的对话框是否显示
            selectRolesDialogVisible: false,
            // 分配角色 ，绑定下拉框的角色列表
            options: [],
            selectRolesFormData: {
                username: '',
                roleName: '',
                rid: ''
            },
            // 更改用户
            updateForm: {
                id: 0,
                email: '',
                mobile: '',
            },
            // 添加用户
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 引入验证包进行验证操作
            // rules:rules

            // 验证操作
            rules: {
                username: [
                    // trigger: 'blur'失去焦点时验证
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                ],
                email: [
                    { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' },
                ],
                mobile: [
                    // 使用自定义的检验方法
                    { validator:validatePhone, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        // 不要在此使用异步方法：可以在methods创建函数先调用异步方法再调用该函数
        // create周期调用getUsers函数渲染表格
        this.getUsers();
    },
    methods: {
        // 调用更新用户操作
        updateUser() {
            // 打印表单数据
            // console.log(this.updateForm);
        },
        // U-3
        // 在用户点击确认后执行异步更新用户操作
        // 设置手机号的验证规则
        async updateUserHandler() {
            // 异步调用updateUser函数并传去表单数据进行调加用户操作,用info接收传回来的结果
            // 引入外部的updateUser函数
            let info = await updateUser(this.updateForm);
            // console.log(info);
            // 如果info的头信息的状态值等于200
            if (info.meta.status == 200) {
                // 则$message的类型为success并打印info头信息的msg值
                this.$message.success(info.meta.msg);
                // 更新表单模型的值改为false
                this.updateFormModal = false;
                // 调用getUsers函数渲染表格
                this.getUsers();
                // 如果info的头信息的状态值 不等于 200
            } else {
                // 则$message的类型为error并打印info头信息的msg值
                this.$message.error(info.meta.msg);
            }
            // 更新操作完成要重置updateForm的值为''
            this.updateForm = {
                email: '',
                mobile: '',
            }
        },
        // store：存储。异步存储(新增)用户
        async storeUser() {
            // 数据入库 自动验证
            // elementui的form事件函数：validate	任一表单项被校验后触发	被校验的表单项 prop 值，校验是否通过，错误消息（如果存在）
            // ref可以以属性的形式添加给标签或者组件、此处使用this.$refs.addForm.validate()来获取表单数据
            this.$refs.addForm.validate(async (valid) => {
                // valid = addForm的校验结果
                if (!valid) {
                    // return;
                    this.$message.error('请填写用户信息');
                    return false;
                }
                // console.log(this.addForm);
                // 异步调用addUser函数进行调加用户操作,用info接收传回来的结果
                let info = await addUser(this.addForm);
                // console.log(info);
                // 接口是使用 http 状态码来标识信息的。
                if (info.meta.status == 201) {

                    this.$message.success(info.meta.msg);
                    this.addForm = {
                        username: '',
                        password: '',
                        email: '',
                        mobile: '',
                    }
                    this.getUsers();

                } else {
                    this.$message.error(info.meta.msg);
                }
                this.addFormModal = false;
            });
        },
        addUser() {
            this.addFormModal = true;
        },
        // 获取用户列表
        async getUsers(query = '') {
            let info = await getUserList(query, this.currentPage, this.size);
            // console.log(info);
            this.userList = info.data.users;
            this.total = info.data.total;

        },
        // 修改每页数量的时候触发
        handleSizeChange(size) {
            console.log('handleSizeChange', size);
            this.size = size;
            this.getUsers();

        },
        // 页码
        handleCurrentChange(page) {
            // console.log('handleCurrentChange', page);
            this.currentPage = page;
            this.getUsers();
        },

        // 用户状态改变
        async handleChange(val, id) {
            const data = await request.put(`/users/${id}/state/${val}`);
            if (data.meta.status === 200) {
                this.$message({
                    type: 'success',
                    message: data.meta.msg
                });
            } else {
                this.$message({
                    type: 'error',
                    message: data.meta.msg
                });
            }
        },
        // U-1
        // 在表单点击编辑触发handleEdit事件
        // 这里的scoped的是elementui-表格-自定义列模板那里定义的,获取页面表单的数据
        async handleEdit(scoped) {
            // 修改updateFormModal为true
            this.updateFormModal = true;
            // 使用data里的updateForm对象接收该事件的传来的值
            // this.updateForm = scoped.row;
            this.updateForm = {
                id: scoped.row.id,
                email: scoped.row.email,
                mobile: scoped.row.mobile,
            }
        },
        handleDelete(scoped) {
            console.log('del', scoped.row.id);

            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 点击确定
                let info = await delUserById(scoped.row.id);
                console.log(info);
                if (info.meta.status == 200) {
                    this.$message({
                        type: 'success',
                        message: info.meta.msg
                    });
                    // 获取最新的用户列表
                    this.getUsers();

                } else {
                    this.$message.error(info.meta.msg);
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        searchHandler() {
            let kw = this.keyword.trim();
            if (!kw) {
                this.$message.error('请输入搜索关键字');
                return;
            }
            // 调用接口进行搜索
            this.getUsers(kw);
            this.keyword = '';
        },
        // 显示分配角色的对话框
        async showSelectRoles(user) {
            const userRes = await request.get(`/users/${user.id}`);
            // 请求所有的角色，绑定到下拉框中
            const res = await request.get('/roles');
            this.options = res.data;
            this.selectRolesDialogVisible = true;
            this.selectRolesFormData = userRes.data;
        },
        // 分配角色
        async handleRole() {
            this.selectRolesDialogVisible = false;
            const res = await request.put(`users/${this.selectRolesFormData.id}/role`, {
                rid: this.selectRolesFormData.rid
            });
            if (res.meta.status === 200) {
                this.selectRolesDialogVisible = false;
                this.$message({
                    type: 'success',
                    message: '分配角色成功'
                });
                // 调用getUsers函数重新渲染表格
                this.getUsers();
            } else {
                this.$message({
                    type: 'error',
                    message: '分配角色失败'
                });
            }
        }
    }
}