// 首页

<template>
    <div>
        <el-row :gutter="20">
             <el-col :span="8" style="padding-right: 0px;">
                <el-card shadow="hover" class="mgb20" style="height:350px;">
                    <div class="user-info">
                        <v-click :size="250" style="min-height: 250px; min-width: 250px;"></v-click>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ userInfo.username }}</div>
                            <div>{{ userInfo.email }}</div>
                        </div>
                    </div>
                    <div style="text-align: center; width: 250px; margin-top: -17px;">
                        <el-button type="danger" size="medium" :loading="buttonLoading" @click="generatorLogbook()" :disabled="buttonDisabled">生成值班日志</el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" style="height:350px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                    </div>
                    <el-table :data="remindList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item">
                                    <span class="el-50" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</span>
                                    <span style="float: right">提醒时间：{{scope.row.time}}</span>
                                    <span style="float: right; margin-right: 30px;">
                                        <el-tag type="success" v-if="scope.row.status === 0">未提醒</el-tag>
                                        <el-tag type="info" v-if="scope.row.status === 1">已提醒</el-tag>
                                    </span>
                                    <span style="float: right; margin-right: 30px;">
                                        <el-tag>{{ scope.row.repetitionModeStr }}</el-tag>
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="24" style="margin-bottom: 10px; margin-top: -10px;">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>当前值班人员</span>
                    </div>
                    <div>
                        <el-col :span="3" v-for="(item, index) in dutyList" :key="item.id" :offset="index > 0 ? 2 : 0">
                            <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 20px; ">
                                <img :src="item.img" class="image">
                                <div style="padding: 14px;">
                                    <span>{{ item.name }}</span>
                                    <span style="float: right;">{{ item.gender }}</span>
                                </div>
                            </el-card>
                        </el-col>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12" style="padding-right: 0px;">
                <el-card shadow="hover"  style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>值班日志</span>
                    </div>
                    <el-table height="300" style="width: 100%;" :data="logboolTableData" class="table text-select-none" highlight-current-row @cell-dblclick="clickShowLogbook" :row-class-name="logbookTableClassName">
                        <el-table-column prop="title" label="日志表名称"></el-table-column>
                        <el-table-column prop="going" label="工作情况" width="100">
                            <template slot-scope="scope">
                                <el-tag v-show="scope.row.going === 1" type="success">正常</el-tag>
                                <el-tag v-show="scope.row.going === 0" type="danger">异常</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover"  style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>调度信息</span>
                    </div>
                    <el-table height="300" style="width: 100%;" :data="dispatchTableData" class="table text-select-none" highlight-current-row @cell-dblclick="clickShowDispatch" :row-class-name="dispatchTableClassName">
                        <el-table-column prop="deptName" label="频率" width="150"></el-table-column>
                        <el-table-column prop="program" label="转播的节目"></el-table-column>
                        <el-table-column prop="period" label="转播的周期"></el-table-column> 
                    </el-table>
                </el-card>
            </el-col>
        </el-row>

        <!-- 值班日志预览 -->
        <el-dialog title="预览值班日志" :visible.sync="viewLogbook" width="60%">
            <el-form ref="form" label-position="right" label-width="150px">
                <el-form-item label="值班员" style="text-align: center">
                    <el-row :gutter="12">
                        <el-col :span="5" v-for="item in logbookDetail.logbookDetailDTOList" :key="item.id">
                            <el-card shadow="never">
                                <img :src="item.employee.photoUrl" class="logbook_image">
                                <span>{{ item.employee.name }}</span>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="到岗时间" style="text-align: center">
                    <el-row :gutter="12">
                        <el-col :span="5" v-for="item in logbookDetail.logbookDetailDTOList" :key="item.id">
                            <el-card shadow="never">
                                <div>{{ item.arrivalTime }}</div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="班次">
                    <el-tag size="medium">{{ logbookDetail.shiftStr }}</el-tag>
                </el-form-item>
                <el-form-item label="工作情况" v-show="logbookDetail.going !== null">
                    <el-tag size="medium" type="success" v-show="logbookDetail.going == 1">正常</el-tag>
                    <el-tag size="medium" type="danger" v-show="logbookDetail.going == 0">异常</el-tag>
                </el-form-item>
                <el-form-item label="异常描述" v-show="logbookDetail.going == 0 && logbookDetail.description !== ''">
                     <el-alert type="error" :closable="false" style="width: 50%">{{ logbookDetail.description }}</el-alert>
                </el-form-item>
                <el-form-item label="备注" v-show="logbookDetail.remark !== ''">
                    <el-alert type="info" :closable="false" style="width: 50%">{{ logbookDetail.remark }}</el-alert>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewLogbook = false">关  闭</el-button>
            </span>
        </el-dialog>

        <!-- 调度信息预览 -->
        <el-dialog title="预览调度信息" :visible.sync="viewDispatch" width="40%">
            <el-form ref="form" label-position="right" label-width="100px">
                <el-form-item label="所属频率">
                    <el-alert :title="dispatchDetail.deptName" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="转播的节目">
                    <el-alert :title="dispatchDetail.program" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="是否长期转播">
                    <el-tag size="medium" type="success" v-show="dispatchDetail.longRebroadcast == 1">是</el-tag>
                    <el-tag size="medium" type="danger" v-show="dispatchDetail.longRebroadcast == 0">否</el-tag>
                </el-form-item>
                <el-form-item label="设备信息">
                    <el-alert :title="dispatchDetail.deviceInfo" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="转播周期">
                    <el-alert :title="dispatchDetail.period" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="转播时段">
                    <el-alert :title="dispatchDetail.timeInterval" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="状态">
                    <el-tag size="medium" v-show="dispatchDetail.status == 1" type="success">有效</el-tag>
                    <el-tag size="medium" v-show="dispatchDetail.status != 1" type="danger">无效</el-tag>
                </el-form-item>
                <el-form-item label="备注">
                    <el-alert :title="dispatchDetail.remark" type="info" :closable="false"></el-alert>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewDispatch = false">关  闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '../../common/bus'
import _ from 'lodash'
import VClick from '../../common/Click'

export default {
    data() {
        return {
            userInfo: {
                username: '',
                email: ''
            },
            remindList: [],
            logboolTableData: [],
            dispatchTableData: [],
            dutyList: [],
            buttonLoading: false,
            buttonDisabled: false,
            logbookDetail: '',
            viewLogbook: false,
            viewDispatch: false,
            dispatchDetail: ''
        }
    },
    components: {
        VClick
    },
    mounted() {
        this.isLogbookByCurrentShift()
        this.loadUserInfo()
        // this.loadCurrentDateDuty()
        this.loadCurrentShiftSignInList()
        this.loadCurrentDateRemind()
        this.loadLogbookList()
        this.loadDispatchList()
    },
    methods: {
        // 加载用户信息
        loadUserInfo() {
            this.userInfo = {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email')
            }
        },
        // 加载当前时间的值班表
        // loadCurrentDateDuty() {
        //     this.tableList = []
        //     this.$axios('/dutyInfo/get_detail_by_now.json').then((res) => {
        //         if (res.data.success) {
        //             this.tableList = []
        //             this.tableList.push(res.data.data)
        //         } else {
        //             this.$message.error(` ${res.data.msg} `)
        //         }
        //     })
        // },
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
        // 加载值班日志列表
        loadLogbookList() {
            this.logboolTableData = []
            let postData = this.$qs.stringify({
                dayNum: 3
            })
            this.$axios({
                method: 'post',
                url: '/logbook/get_list_by_day_num.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    _.forEach(res.data.data, (item, index) => {
                        this.logboolTableData.push(item)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载调度信息列表
        loadDispatchList() {
            let postData = this.$qs.stringify({
                dayNum: 7
            })
            this.$axios({
                method: 'post',
                url: '/dispatch/get_list_by_day_num.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.dispatchTableData = []
                    _.forEach(res.data.data, (item, index) => {
                        this.dispatchTableData.push(item)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载当天的提醒
        loadCurrentDateRemind() {
            this.$axios('/remind/get_current_date_list.json').then((res)=>{
                if (res.data.success) {
                    this.remindList = []
                    _.forEach(res.data.data, (remind, index) => {
                        var option = remind
                        option.title = remind.reminder
                        option.time = this.$moment(remind.remindTime).format('YYYY-MM-DD HH:mm')
                        this.remindList.push(option)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 判断当前班次是否填写了值班日志
        isLogbookByCurrentShift() {
            this.$axios({
                method: 'post',
                url: '/logbook/is_logbook_by_current_shift.json',
            }).then((res)=>{
                if (res.data.success) {
                    this.buttonDisabled = res.data.data
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 表格双击显示值班日志详情
        clickShowLogbook(row, clumn) {
            this.logbookDetail = row
            this.viewLogbook = true
        },
        // 生成值班日志
        generatorLogbook() {
            this.buttonLoading = true

            this.$axios({
                method: 'post',
                url: '/logbook/generator_logbook.json',
            }).then((res)=>{
                this.buttonLoading = false
                if (res.data.success) {
                    this.isLogbookByCurrentShift()
                    this.loadLogbookList()
                    this.$message.success(` 值班日志已经生成 `)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 表格双击显示调度信息详情
        clickShowDispatch(row, clumn) {
            this.dispatchDetail = row
            this.dispatchDetail.deviceInfo = row.deviceCategoryName + '[' + row.deviceInfoNames + ']'
            this.viewDispatch = true
        },
        // 判断传入的日期是今天、之前还是以后
        isToday(str) {
            if (new Date(str).toDateString() === new Date().toDateString()) {
                // 当天
                return 0
            } else if (new Date(str) < new Date()){
                // 以前的日期
                return -1
            } else if (new Date(str) > new Date()) {
                // 以后的日期
                return 1
            }
        },
        // 值班日志 表格字体样式
        logbookTableClassName({row, rowIndex}) {
            var style = this.isToday(row.dutyDate)
            if (style == 0) {
                return 'text-highligh'
            } else if (style == -1) {
                return 'text-before'
            } else if (style == 1) {
                return 'text-after'
            }
        },
        // 调度信息 表格字体样式
        dispatchTableClassName({row, rowIndex}) {
            var style = this.isToday(row.beginDate)
            if (style == 0) {
                return 'text-highligh'
            } else if (style == -1) {
                return 'text-before'
            } else if (style == 1) {
                return 'text-after'
            }
        }
    }
}
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    /* border-bottom: 2px solid #ccc; */
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.table{
    width: 100%;
    font-size: 14px;
}
.todo-item-del {
    text-decoration: line-through;
}
.el-col-4 {
    width: 16.66667%;
    margin-bottom: 20px;
}
.image {
    width: auto;
    display: block;
    height: 300px;
}

.logbook_image {
    display: block;
    height: 200px;
    margin: 0 auto;
    width: auto;
}

.el-60 {
    display: inline-block;
    width: 60%;
}
.text-highligh {
    font-size: 18px;
    color: #F56C6C;
    font-weight: 300;
}
.text-select-none {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
.el-col-3 {
    width: auto;
}
/* .text-before {
    color: #67C23A;
}
.text-after {
    color: #409EFF;
} */
</style>
