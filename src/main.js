import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import moment from 'moment'

// import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/theme-green/index.css'       // 浅绿色主题
import '../static/css/icon.css'
import "babel-polyfill"

Vue.use(ElementUI, { size: 'small' })
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$moment = moment

Vue.prototype.$axios.defaults.baseURL = 'http://172.20.0.21:8082'
// Vue.prototype.$axios.defaults.baseURL = 'http://localhost:8082'

// 请求的响应方法
axios.interceptors.response.use(
    response => {
        if(response.data.code === 100) {
            if (response.data.msg === '需要登录') {
                localStorage.removeItem('username')
                localStorage.removeItem('acls')
                localStorage.removeItem('roles')
                webSocket.close()
                router.push({
                    path: '/login',
                    query: {redirect: router.history.current.fullPath}
                })
            }
            // 显示错误信息
            return Promise.reject(response.data)
        }
        return response;
}, error => {
    return Promise.reject(error.response.data)
})

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const username = localStorage.getItem('username')
    const roles = localStorage.getItem('roles')
    const acls = localStorage.getItem('acls')
    if (username) {
        // 已经登录
        if (roles) {
            console.log(roles)
            if (roles.includes('系统') || roles.includes('超级')) {
                next()
            } else {
                console.log(acls)
                if (to.path === '/login') {
                    next('/index')
                } else if (to.path === '/index') {
                    next()
                } else if (to.path === '/403') {
                    next()
                } else {
                    if (acls) {
                        if(acls.includes(to.path)) {
                            next()
                        } else {
                            next('/403')
                        }
                    } else {
                        next('/403')
                    }
                }
            }
        }
    } else {
        // 没有登录
        if (to.path === '/login' || to.path === '/register' || to.path === '/retrieve') {
            next()
        } else {
            next('/login')
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');