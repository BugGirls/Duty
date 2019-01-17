// 用户注册

<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px" class="ms-content">
                <!-- <el-form-item label="所在部门" prop="deptId">
                    <el-select v-model="userForm.deptId" placeholder="请选择所在的部门" style="width: 100%">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名称" suffix-icon="el-icon-lx-people"></el-input>
                </el-form-item>
                <el-form-item label="设置密码" prop="password">
                    <el-input type="password" v-model="userForm.password" placeholder="请输入密码" suffix-icon="el-icon-lx-lock"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="userForm.checkPass" placeholder="请输入确认密码" suffix-icon="el-icon-lx-lock"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="userForm.telephone" placeholder="请输入手机号码" suffix-icon="el-icon-mobile-phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="userForm.mail" placeholder="请输入邮箱" suffix-icon="el-icon-message"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <span>
                        <el-button type="info" style="float: left; width: 49%" class="el-button--primary" @click="submitForm('userForm')">注册</el-button>
                        <el-button type="success" style="float: right; width: 49%" @click="gotoLogin()">已有账号？去登录</el-button>
                    </span>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        data: function(){
            var validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入用户名'));
                } else {
                    callback()
                }
            }
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.userForm.checkPass !== '') {
                        this.$refs.userForm.validateField('checkPass');
                    }
                    callback();
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            var validateDept = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择所在部门'));
                } else {
                    callback()
                }
            }
            var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
                if (!value) {
                    return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (phoneReg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式不正确'))
                        }
                    }
                }, 100)
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
                userForm: {
                    username: '',
                    password: '',
                    deptId: '',
                    telephone: '',
                    mail: ''
                },
                rules: {
                    username: [
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    deptId: [
                        { validator: validateDept, trigger: 'blur' }
                    ],
                    telephone: [
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    mail: [
                        { validator: checkEmail, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.loadDeptTree()
        },
        methods: {
            // 加载部门树
            loadDeptTree() {
                this.$axios('/open/dept/tree.json').then((res) => {
                    if (res.data.success) {
                        // 获取部门树
                        this.deptTree = res.data.data

                        // 递归渲染部门树选择列表
                        this.options = []
                        this.recursiveRenderDeptSelect(this.deptTree, 1)
                    } else {
                        this.$message.error(` ${res.data.msg} `)
                    }
                })
            },
            // 递归渲染部门树选择列表
            recursiveRenderDeptSelect(deptList, level) {
                level = level | 0
                if (deptList && deptList.length > 0) {
                    _.forEach(deptList, (dept, index) => {
                        var blank = ''
                        if (level > 1) {
                            for (var j = 3; j <= level; j++) {
                                blank += '..'
                            }
                            blank += '∟'
                        }
                        this.options.push({
                            value: dept.id,
                            label: blank + dept.label,
                        })
                        if (dept.children && dept.children.length > 0) {
                            this.recursiveRenderDeptSelect(dept.children, level + 1);
                        }
                    })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let postData = this.$qs.stringify({
                            username: this.userForm.username,
                            password: this.userForm.password,
                            deptId: this.userForm.deptId,
                            telephone: this.userForm.telephone,
                            mail: this.userForm.mail,
                            status: 1
                        })
                        this.$axios({
                            method: 'post',
                            url: '/open/user/register.json',
                            data: postData
                        }).then((res)=>{
                            if (res.data.success) {
                                this.$message.success(`用户 ${this.userForm.username} 注册成功，请使用邮箱登录 `)
                                setTimeout(() => {
                                    this.gotoLogin()
                                }, 1000)
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
    .el-button--primary {
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
    }
</style>