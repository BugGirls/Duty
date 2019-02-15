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
            <el-row>
                <el-col :span="4" v-for="(item, index) in dutyList" :key="item.id" :offset="index > 0 ? 2 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.img" class="image">
                        <div style="padding: 14px;">
                            <span>{{ item.name }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.gender }}</time>
                                <el-button type="text" class="button" @click="handleChange(item)">换班</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <div style="margin-top: 40px;">
                <duty-preview :tableList="tableList" :residueList="tableList" :employeeList="employeeList"
                :type="type" @save-result="saveAfter($event)"></duty-preview>
            </div>
        </div>
        
        <el-dialog title="换班" :visible.sync="changeVisible" width="30%" center>
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
                <el-button @click="changeVisible = false">取 消</el-button>
                <el-button type="primary" @click="shiftChange('form')">换 班</el-button>
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
            tableList: [],
            employeeList: [],
            type: 'null',
            changeVisible: false,
            employeeNumber:'',
            photoUrl: '',
            name: '',
            gender: '',
            shiftForm: {
                shiftChangeId: '',
                employeeName: '',
                photoUrl: '',
            }
        }
    },
    mounted() {
        this.loadCurrentDateDuty()
        this.loadEmployeeSelect()
    },
    computed: {
        cardNum:function() {
            let num = this.employeeNumber
            let card = ''
            let len = num.length
            
            if (len > 0 && len % 8 === 0) {
                card = num.substring(len-8)
                this.employeeNumber = card
            }
            return card
        }
    },
    watch:{
        cardNum:function(newVal,oldVal) {
            if(newVal !== oldVal) {
                this.loadSlotCardEmployee()
            }
        }
    },
    methods: {
        // 加载当前时间的值班表
        loadCurrentDateDuty() {
            this.dutyList = []
            this.tableList = []
            this.$axios('/dutyInfo/get_detail_by_now.json').then((res) => {
                if (res.data.success) {
                    this.tableList = []
                    this.dutyList = []
                    this.tableList.push(res.data.data)
                    this.loadEmployeeList(res.data.data)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载当前班期值班人员列表
        loadEmployeeList(employeeList) {
            if (employeeList.shiftChangeList && employeeList.shiftChangeList.length > 0) {
                _.forEach(employeeList.shiftChangeList, (item, index) => {
                    let employee = item.employee
                    let option = {
                        shiftId: item.id,
                        id: employee.id,
                        img: employee.photoUrl,
                        name: employee.name,
                        gender: employee.gender == 1 ? '男' : '女'
                    }
                    this.dutyList.push(option)
                })
            }
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
        // 加载刷卡的员工信息
        loadSlotCardEmployee() {
            this.$axios('http://172.20.0.12:8083/loginapi/askLogin.do?identifier=' + this.employeeNumber).then((res)=>{
                if (res.status == 200) {
                    var detail = JSON.parse(res.data.s)
                    this.name = detail.fConsumername
                    this.photoUrl = detail.fPhotoaddr
                }
            })
        },
        // 点击“换班”按钮
        handleChange(item) {
            this.employeeNumber = ''
            this.name = ''
            this.photoUrl = ''
            this.changeVisible = true
            setTimeout(() => {
                this.$refs.card.focus()
            },20)
            this.shiftForm = {
                shiftChangeId: item.shiftId,
                photoUrl: item.img,
            }
        },
        // 换班操作
        shiftChange() {
            let postData = this.$qs.stringify({
                id: this.shiftForm.shiftChangeId,
                employeeName: this.name,
                photoUrl: this.shiftForm.photoUrl
            })
            this.$axios({
                method: 'post',
                url: '/shiftChange/employeeChange.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.changeVisible = false
                    this.loadCurrentDateDuty()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }

}
</script>

<style>
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
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
  
.clearfix:after {
    clear: both
}
</style>
