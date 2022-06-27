const obj = {
    install(Vue, options) {
        /*可以在Vue的原型上面增加方法或者是属性，以后在所有的Vue的组件实例对象上面都有该方法和属性*/
        Vue.prototype.$dialog = function (msg) {
            /*以后在实例对象里面 可以使用 this.$dialog('msg')*/
            alert(msg + ':' + options.type + ':' + options.duration);
        }

    }
}
export default obj;
