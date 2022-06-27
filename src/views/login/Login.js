// 获取后台数据
import { login } from "@/api/admin.js";

export default {
    name: "login",
    data() {
        return {
            formData: {
                username: '',
                password: ''
            },
            // check-2
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
                ]
            }
        };
    },
    methods: {
        submitForm() {
            // this.$refs 在vue里面获取 dom元素的集合
            // console.log(this.$refs.title.innerText);
            /*elementui 有提供自动验证的功能*/
            /* 校验表单是否合法 */

            // 获取formData这个dom
            // validate vt.	验证; 确认;
            // 异步async  https://www.runoob.com/w3cnote/es6-async.html
            // check-3
            // https://element.eleme.cn/#/zh-CN/component/form#form-methods
            // Form Methods:validate
            // 这里的validate是elementui的el-form中用ref="formData"给绑定的表单数据加上的小尾巴(方法)
            // 说明：对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
            // Function(callback: Function(boolean, object))
            this.$refs.formData.validate(
                // valid对应boolean
                async (valid) => {
                    console.log(valid);
                    // 如果valid通过
                    if (valid) {
                        // console.log(this.formData);
                        // await fun_await() 让async函数等待await函数 
                        // 调用login函数并传去登录表单信息然后用info接收传回来的值
                        let info = await login(this.formData);
                        // console.log(info); 
                        // 打印出data和meta
                        // 获取meta中的status...获取data中的...
                        // 如果接口请求成功返回数据
                        if (info.meta.status == 200) {
                            // 对info进行解构获值
                            let { data: { token, id, username } } = info;
                            // 存储登录的标识
                            localStorage.setItem('token', token);
                            localStorage.setItem('id', id);
                            localStorage.setItem('username', username);

                            // this.$message.success('登录成功，前往后台！');
                            // duration:1000  1秒后弹出
                            this.$message({ duration: 1000, message: '登录成功，前往后台！', type: 'success' });

                            this.$router.push('/admin');

                        } else {
                            console.log(info);
                            // elementui的全局方法message
                            this.$message.error(`登录失败！${info.meta.msg}请联系管理员授予权限！`);
                        }

                    } else {
                        this.$message.error('请填写用户信息');
                        return false;
                    }
                }
            );

        },
    }
};