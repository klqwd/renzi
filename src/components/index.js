// import PageTools from './PageTools/index.vue'
// const components=[PageTools]
import * as filters from '@/filters'
//实现组件的自动注册
const fn = require.context('./', true, /\.vue$/)

// console.log(fn.keys());
// console.log(fn('./PageTools/index.vue'));

// 一次性导入所有模块
const components = fn.keys().map(ele => fn(ele)) 

// Vue.use
export default (Vue)=> {
        components.forEach(ele => {
            Vue.component(ele.default.name,ele.default)
        })
    //Vue.filter('过滤器名称',过滤器的方法)
Object.keys(filters).forEach(key => {
    Vue.filter(key,filters[key])
})

}


