// 交接班

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>交接班</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row style="margin-bottom: 40px;">
                <el-col :span="3" v-for="(item, index) in dutyList" :key="item.id" :offset="index > 0 ? 2 : 0">
                    <el-card :body-style="{ padding: '0px' }" >
                        <img :src="item.img" class="image">
                        <div style="padding: 14px;">
                            <span>{{ item.name }}</span>
                            <span style="float: right">{{ item.gender }}</span>
                        </div>
                        <el-button type="success" size="medium" style="width: 100%" @click="handleSignIn(item)" :disabled="item.signInButtonDisabled">签到</el-button>
                    </el-card>
                </el-col>
            </el-row>

            <el-collapse>
                <el-collapse-item title="显示下一个班次的值班人员" name="1">
                    <el-col :span="3" v-for="(item, index) in nextDutyList" :key="item.id" :offset="index > 0 ? 2 : 0" style="margin-bottom: 20px">
                        <el-card :body-style="{ padding: '0px' }">
                            <img :src="item.img" class="image">
                            <div style="padding: 14px;">
                                <span>{{ item.name }}</span>
                                <span style="float: right">{{ item.gender }}</span>
                            </div>
                            <el-button type="success" size="medium" style="width: 100%" @click="handleSignIn(item)" :disabled="item.signInButtonDisabled">签到</el-button>
                        </el-card>
                    </el-col>
                </el-collapse-item>
            </el-collapse>

            <div style="margin-top: 40px;">
                <duty-preview :tableList="tableList" :residueList="tableList" :employeeList="employeeList"
                :type="type" @save-result="saveAfter($event)"></duty-preview>
            </div>
        </div>
        
        <!-- 签到 -->
        <el-dialog title="签到" :visible.sync="signInVisible" width="30%" center>
            <el-form ref="form" label-position="right" label-width="100px">
                <el-form-item label="编号">
                    <el-input placeholder="刷卡读取编号" v-model="employeeNumber" autofocus ref="card"></el-input>
                </el-form-item>
                <el-form-item label="头像" v-show="photoUrl">
                    <img :src="photoUrl" style="width: 150px;">
                </el-form-item>
                <el-form-item label="姓名" v-show="name">
                    <el-tag type="info">{{ name }}</el-tag>
                </el-form-item>
                <el-form-item label="性别" v-show="gender">
                    <el-radio-group v-model="gender" size="small">
                        <el-tag v-show="gender === '1'">男</el-tag>
                        <el-tag v-show="gender !== '1'" type="danger">女</el-tag>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="signInVisible = false">取 消</el-button>
                <el-button type="primary" @click="signIn()">签 到</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DutyPreview from './dutyInfo/DutyPreview'
import _ from 'lodash'

export default {
    components: {
        DutyPreview
    },
    data() {
        return {
            dutyList: [],
            nextDutyList: [],
            tableList: [],
            employeeList: [],
            type: 'null',
            signInVisible: false,
            nextDutyVisible: false,
            employeeNumber:'',
            photoUrl: '',
            name: '',
            gender: '',
            signInForm: {
                signInId: '',
                employeeName: ''
            }
        }
    },
    mounted() {
        this.loadCurrentShiftSignInList()
        this.loadCurrentDateDuty()
        this.loadEmployeeSelect()
        this.loadNextShiftSignInList()
    },
    // computed: {
    //     cardNum:function() {
    //         let num = this.employeeNumber
    //         let card = ''
    //         let len = num.length
            
    //         if (len > 0 && len % 8 === 0) {
    //             card = num.substring(len-8)
    //             this.employeeNumber = card
    //         }
    //         return card
    //     }
    // },
    // watch:{
    //     cardNum:function(newVal,oldVal) {
    //         if(newVal !== oldVal) {
    //             this.loadSlotCardEmployee()
    //         }
    //     }
    // },
    methods: {
        // 加载当前班次签到人员列表
        loadCurrentShiftSignInList() {
            this.dutyList = []
            this.$axios('/signInInfo/sign_in_list.json').then((res) => {
                if (res.data.success) {
                    this.loadEmployeeList(res.data.data)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载当前班期值班人员列表
        loadEmployeeList(data) {
            if (data && data.length > 0) {
                _.forEach(data, (item, index) => {
                    let option = {
                        signInId: item.id,
                        img: item.employee.photoUrl,
                        name: item.employee.name,
                        gender: item.employee.gender == 1 ? '男' : '女',
                        signInButtonDisabled: item.status == 1 ? true : false
                    }
                    this.dutyList.push(option)
                })
            }
        },
        loadNextShiftSignInList() {
            this.nextDutyList = []
            this.$axios('/signInInfo/get_next_sign_in_list.json').then((res) => {
                if (res.data.success) {
                    this.loadNextEmployeeList(res.data.data)
                    console.log(res.data.data)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        loadNextEmployeeList(data) {
            if (data && data.length > 0) {
                _.forEach(data, (item, index) => {
                    let option = {
                        signInId: item.id,
                        img: item.employee.photoUrl,
                        name: item.employee.name,
                        gender: item.employee.gender == 1 ? '男' : '女',
                        signInButtonDisabled: item.status == 1 ? true : false
                    }
                    this.nextDutyList.push(option)
                })
            }
        },
        // 加载当前时间的值班表
        loadCurrentDateDuty() {
            this.tableList = []
            this.$axios('/dutyInfo/get_today_duty.json').then((res) => {
                if (res.data.success) {
                    this.tableList = []
                    this.tableList.push(res.data.data)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载值班人员选择列表
        loadEmployeeSelect() {
            this.$axios('/employee/list.json').then((res)=>{
                if (res.data.success) {
                    this.employeeList = []
                    if (res.data.data && res.data.data.length > 0) {
                        _.forEach(res.data.data, (employee, index) => {
                            this.employeeList.push({
                                value: employee.id,
                                label: employee.name
                            })
                        })
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // // 加载刷卡的员工信息
        // loadSlotCardEmployee() {
        //     this.$axios('http://172.20.0.12:8083/loginapi/askLogin.do?identifier=' + this.employeeNumber).then((res)=>{
        //         if (res.status == 200) {
        //             var detail = JSON.parse(res.data.s)
        //             this.name = detail.fConsumername
        //             this.photoUrl = detail.fPhotoaddr
        //         }
        //     })
        // },
        // 点击签到
        handleSignIn(item) {
            this.employeeNumber = ''
            this.name = item.name
            this.photoUrl = item.img
            this.signInVisible = true
            setTimeout(() => {
                this.$refs.card.focus()
            },20)
            this.signInForm = {
                signInId: item.signInId
            }
        },
        // 签到操作
        signIn() {
            let postData = this.$qs.stringify({
                id: this.signInForm.signInId,
                employeeName: this.name,
                cardNum: this.employeeNumber
            })
            this.$axios({
                method: 'post',
                url: '/signInInfo/signIn.json',
                data: postData
            }).then((res) => {
                console.log(res)
                if (res.data.success) {
                    this.loadCurrentShiftSignInList()
                    this.loadNextShiftSignInList()
                    this.signInVisible = false
                    this.$message.success(` 签到成功 `)
                } else {
                    this.signInVisible = false
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }

}
</script>

<style scoped>
.time {
    font-size: 13px;
    color: #999;
}
  
.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: auto;
    display: block;
    height: 300px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
  
.clearfix:after {
    clear: both
}

.el-col-3 {
    width: auto;
}
</style>
