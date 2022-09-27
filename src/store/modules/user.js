import { login } from '@/api/login'
import { getUserDetailById, getUserInfo } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime:''
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token=token
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo=userInfo
    },
    RMOVE_USER_INFO(state) {
      state.userInfo=''
    },
    REMOVE_TOKEN(state) {
      state.token=''
    },
    SET_HRSAAS_TIME(state, hrsaasTime) {
      state.hrsaasTime=hrsaasTime
    }
  },
  actions: {
   async loginAction({ commit },loginData) {
      const data = await login(loginData)
      commit("SET_TOKEN", data)
      commit("SET_HRSAAS_TIME",new Date().getTime())
    },
    async getUserInfo({ commit }) {
      //接口要求
      const res = await getUserInfo() 
      const res1=await getUserDetailById(res.userId)
      const result ={...res,...res1}
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    },
    async logout({commit}) {
       commit("RMOVE_USER_INFO"),
        commit("REMOVE_TOKEN")
    }
  }
}