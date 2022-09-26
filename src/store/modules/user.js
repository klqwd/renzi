import { login } from '@/api/login'
import { getUserDetailById, getUserInfo } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo:{}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token=token
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo=userInfo
    },
    RMOVE_USER_INFO(state) {
      state.userInfo={}
    }
  },
  actions: {
   async loginAction({ commit },loginData) {
      const data = await login(loginData)
      console.log(data);
      commit("SET_TOKEN",data)
    },
    async getUserInfo({ commit }) {
      //接口要求
      const res = await getUserInfo() 
      console.log(res);
      const res1=await getUserDetailById(res.userId)
      console.log(res1);
      const result ={...res,...res1}
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    }
  }
}