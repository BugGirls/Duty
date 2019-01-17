<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import connectSocket from './components/common/WebSocket.js'
export default {
    name: 'App',
    mounted() {
        // 当在任一路由页面被刷新时,即是根组件app被重新创建,此时可以进行webSocket重连
        // 从localStorage中获取用户信息,是登录状态则可以进行webSocket重连
        let username = window.localStorage.getItem('username')
        if (username) {
            connectSocket((v)=>{
                this.$notify({
                    title: '提醒',
                    message: v,
                    duration: 0
                })
            })
        }
    }
}
</script>

<style>
    @import "../static/css/main.css";
    /*@import "../static/css/color-dark.css";     深色主题*/
    @import "../static/css/theme-green/color-green.css";   /*浅绿色主题*/
</style>