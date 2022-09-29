import axios from 'axios'
import store from '@/store/index'
import { Message } from 'element-ui'
import router from '@/router'
const TimeOut = 3600
// 对比时间是否超时
function IsCheckTimeOut() {
  const currentTime=new Date()
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp>TimeOut
}

//通过axios创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout:5000,
})

// axios响应拦截器
service.interceptors.response.use(response => { 
  const { success, message, data } = response.data
  if (success) { //业务逻辑成功
    return data
  } 
  //业务逻辑没有成功
    Message.error(message)
    return Promise.reject(new Error(message))
}, error => {
  if (error.response&&error.response.status === 401) {
      store.dispatch("user/logout")
      router.push("/login")
      Message.error("token超时")
  } else {
    Message.error(error.message)
    }
    return Promise.reject(error)
})

//axios请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 如果token存在 注入token
    if (IsCheckTimeOut()) {
      store.dispatch("user/logout")
      router.push('/login')
      return Promise.reject(new Error("登录超时"))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
}) 

export default service