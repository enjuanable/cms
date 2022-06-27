/*
* 封装一个登录操作
* */
import request from '@/utils/request.js'

// 可以百度axios.js的请求配置相关内容


/**
 * 后台登录接口
 * @param username 用户名
 * @param password 密码
 * @returns {*} Promise对象
 */
// 暴露login接收前台参数
export const login = ({username, password}) => {
    let url = '/login';

    // request.post(url, 传参)
    return request.post(url, {username, password});
}
/**
 * 用户列表
 * @param query 查询参数
 * @param pagenum    当前页码
 * @param pagesize 每页显示条数
 * @returns {*}
 */
export const getUserList = (query = '', pagenum = 1, pagesize = 10) => {
    let url = '/users';
    /*
    * http://www.axios-js.com/zh-cn/docs/#%E8%AF%B7%E6%B1%82%E9%85%8D%E7%BD%AE
    * */
    return request.get(url, {params: {query, pagenum, pagesize}});
}


/**
 * 删除用户
 * @param id
 * @returns {*}
 */
export const delUserById = (id) => {
    let url = `users/${id}`;

    return request.delete(url);
}


/**
 * 添加用户
 * @param username
 * @param password
 * @param email
 * @param mobile
 * @returns {*}
 */
export const addUser = ({username, password, email, mobile}) => {
    let url = '/users';

    return request.post(url, {username, password, email, mobile});
}

/**
 * 
 * @param  id
 * @param  email
 * @param  mobile
 * @returns {*}
 */
// 将传来的表单数据解构获取各个值
export const updateUser = ({id, email, mobile}) => {
    let url = `users/${id}`; // user/500
    return request.put(url, {email, mobile});
}
