// 找回密码

<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="ms-content">
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="form.mail" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="form.code" placeholder="请输入验证码">
                        <el-button  slot="append" style="background: #fff;">
                            <span v-show="!sendMsgDisabled" style="background: #fff; color: #ff6600; font-size: 12px;" @click="sendCode">获取验证码</span>
                            <span v-show="sendMsgDisabled" style="color: black; font-size: 12px;">{{time+' 秒后获取'}}</span>
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="form.checkPass" placeholder="请输入确认密码"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="warning" style="float: left; width: 49%" @click="submitForm('form')">提交</el-button>
                    <el-button type="success" style="float: right; width: 49%" @click="gotoLogin()">已有账号？去登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        data: function(){
            var validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            }
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.form.validateField('checkPass');
                    }
                    callback();
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            var checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('请输入正确的邮箱格式'))
                    }
                }, 100)
            }
            return {
                deptTree: [],
                options: [],
                time: 60, // 发送验证码倒计时
                sendMsgDisabled: false,
                form: {
                    mail: '',
                    code: '',
                    password: '',
                },
                rules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    code: [
                        { validator: validateCode, trigger: 'blur' }
                    ],
                    mail: [
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 获取验证码
            sendCode() {
                if (!this.form.mail) {
                    this.$message.error(` 请填写邮箱地址 `)
                }

                let postData = this.$qs.stringify({
                    email: this.form.mail
                })
                this.$axios({
                    method: 'post',
                    url: '/send_email.json',
                    data: postData
                }).then((res)=>{
                    if (res.data.success) {
                        this.$message.success(` 邮件发送成功 `)
                        this.getCode()
                    } else {
                        this.$message.error(` ${res.data.msg} `)
                    }
                })
            },
            getCode() {
                let me = this;
                me.sendMsgDisabled = true;
                let interval = window.setInterval(function() {
                    if ((me.time--) <= 1) {
                        me.time = 60;
                        me.sendMsgDisabled = false;
                        window.clearInterval(interval);
                    }
                }, 1000);
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let postData = this.$qs.stringify({
                            email: this.form.mail,
                            code: this.form.code,
                            password: this.form.password
                        })
                        this.$axios({
                            method: 'post',
                            url: '/retrieve_password.json',
                            data: postData
                        }).then((res)=>{
                            console.log(res)
                            if (res.data.success) {
                                this.$message.success(` 密码修改成功 `)
                                this.gotoLogin()
                            } else {
                                this.$message.error(` ${res.data.msg} `)
                            }
                        })
                    } else {
                        this.$message.error(` 参数错误 `)
                        return false;
                    }
                });
            },
            gotoLogin() {
                this.$router.push({
                    path:'/login',
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title {
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login {
        position: absolute;
        left:50%;
        top:50%;
        width:30%;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width:100%;
        height:36px;
        margin-bottom: 30px;
    }
    .login-tips {
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
    .el-button+.el-button {
        margin: auto;
    }
</style>