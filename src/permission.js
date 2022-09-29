import router from '@/router'
import store from '@/store'
const whiteList=['/login','/404']
router.beforeEach(async (to, from, next) => {
    if (store.getters.token) {
        if (!store.getters.userId) {
            await store.dispatch('user/getUserInfo')
        }
        // 如果处于登录状态
        if (to.path == '/login') {
            next("/")
        } else {
            next()
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next('/login')
        }
    }
})