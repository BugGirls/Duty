// 用户登录

<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入邮箱">
                        <el-button slot="prepend" icon="el-icon-lx-mail"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入登录密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn" style="margin-bottom: 30px;">
                    <el-button type="success" @click="submitForm('ruleForm')">登录</el-button>
                    <span>
                        <el-button type="info" style="float: left; width: 49%" class="el-button--primary" @click="gotoRegister()">没有账号？去注册</el-button>
                        <el-button type="warning" style="float: right; width: 49%" @click="gotoRetrieve()">忘记密码？</el-button>
                    </span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import connectSocket from '../common/WebSocket.js'

    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let postData = this.$qs.stringify({
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        })
                        this.$axios({
                            method: 'post',
                            url: '/login.json',
                            data: postData
                        }).then((res)=>{
                            if (res.data.success) {
                                console.log(res.data.data)
                                localStorage.setItem('username', res.data.data.username)
                                localStorage.setItem('email', res.data.data.mail)
                                this.$router.push('/');
                                this.getAcls()
                                this.getRoles()
                                connectSocket((v)=>{
                                    this.$notify({
                                        title: '提醒',
                                        message: v,
                                        duration: 0
                                    })
                                })
                            } else {
                                this.$message.error(` ${res.data.msg} `)
                            }
                        });
                    } else {
                        this.$message.error(` 参数错误 `)
                        return false;
                    }
                });
            },
            gotoRegister() {
                this.$router.push({
                    path:'/register',
                })
            },
            gotoRetrieve() {
                this.$router.push({
                    path:'/retrieve',
                })
            },
            // 用户登录成功后，获取当前登录用户所对应的权限
            getAcls() {
                this.$axios('/sys/acl/get_acl_url_list.json').then((res) => {
                    if (res.data.success) {
                        localStorage.setItem('acls', res.data.data)
                    } else {
                        this.$message.error(` ${res.data.msg} `)
                    }
                })
            },
            // 获取当前用户所分配的角色
            getRoles() {
                this.$axios('/sys/role/get_user_role_list.json').then((res) => {
                    if (res.data.success) {
                        localStorage.setItem('roles', res.data.data)
                    } else {
                        this.$message.error(` ${res.data.msg} `)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .el-button+.el-button {
        margin: auto;
    }
    .el-button--primary {
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
    }
</style>