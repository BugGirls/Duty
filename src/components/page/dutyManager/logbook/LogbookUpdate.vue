// 更新 值班日志

<template>
    <div>
        <el-table :data="tableData" style="width: 100%" :span-method="arraySpanMethod">
            <el-table-column label="值班日志" align='center'>
                <el-table-column label="岗位 \ 班次" align='center' prop='label'></el-table-column>
                <el-table-column :label="dutyTitle" align='center'>
                    <el-table-column label="值班长" align='center'>
                        <template slot-scope="scope">
                            <el-select v-if='scope.row.type===1' v-model="dutyData.duty.one.employeeIds" multiple placeholder="请选择" style="width:100%">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                            <el-time-picker v-if='scope.row.type===2' value-format='HH:mm:ss' v-model="dutyData.duty.one.time" placeholder="时间" style="width:100%">
                            </el-time-picker>
                            <template v-if='scope.row.type===3'>
                                <el-radio v-model="dutyData.isOk" label="1">正常</el-radio>
                                <el-radio v-model="dutyData.isOk" label="0">异常</el-radio>
                            </template>
                            <el-input v-if='scope.row.type===4' type="textarea" :rows="4" placeholder="请输入内容" v-model="dutyData.notOkDesc">
                            </el-input>
                            <el-input v-if='scope.row.type===5' type="textarea" :rows="2" placeholder="请输入内容" v-model="dutyData.remark">
                            </el-input>
                            <template v-if='scope.row.type===6'>
                                <el-radio v-model="dutyData.shift" label="1">早班</el-radio>
                                <el-radio v-model="dutyData.shift" label="0">晚班</el-radio>
                            </template>
                        </template>
                </el-table-column>
                <el-table-column label="维护岗" align='center'>
                    <template slot-scope="scope">
                        <el-select v-if='scope.row.type===1' v-model="dutyData.duty.two.employeeIds" multiple placeholder="请选择" style="width:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-time-picker v-if='scope.row.type===2' value-format='HH:mm:ss' v-model="dutyData.duty.two.time" placeholder="时间" style="width:100%">
                        </el-time-picker>
                    </template>
                </el-table-column>
                <el-table-column label="1岗" align='center'>
                    <template slot-scope="scope">
                        <el-select v-if='scope.row.type===1' v-model="dutyData.duty.p1.employeeIds" multiple placeholder="请选择" style="width:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-time-picker v-if='scope.row.type===2' value-format='HH:mm:ss' v-model="dutyData.duty.p1.time" placeholder="时间" style="width:100%">
                        </el-time-picker>
                    </template>
                </el-table-column>
                <el-table-column label="2岗" align='center'>
                    <template slot-scope="scope" style="width:100%">
                        <el-select v-if='scope.row.type===1' v-model="dutyData.duty.p2.employeeIds" multiple placeholder="请选择" style="width:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-time-picker v-if='scope.row.type===2' value-format='HH:mm:ss' v-model="dutyData.duty.p2.time" placeholder="时间" style="width:100%">
                        </el-time-picker>
                    </template>
                </el-table-column>
                </el-table-column>
            </el-table-column>
        </el-table>

        <el-row style="margin-top:30px" type="flex" justify="end">
            <el-button type="primary" icon="el-icon-check" @click="submitLogbook">提交</el-button>
        </el-row>
    </div>
</template>

<script>
import _ from 'lodash'

const initTableData = [
    {
        label: '值班员',
        type: 1
    },
    {
        label: '到岗时间',
        type: 2
    },
    {
        label: '工作情况',
        type: 3
    },
    {
        label: '异常描述',
        type: 4
    },
    {
        label: '备注',
        type: 5
    },
    {
        label: '班次',
        type: 6
    }
]
export default {
    props: {
        logbookDetail: {
            type: Object,
            default: function(){
                return this.dutyData
            }
        }
    },
    data() {
        return {
            dutyTitle: '白班/夜班',
            options: [],
            tableData: initTableData,
            dutyData: {
                duty: {
                    one: {
                        id: '',
                        employeeIds: [],
                        time: ''
                    },
                    two: {
                        id: '',
                        employeeIds: [],
                        time: ''
                    },
                    p1: {
                        id: '',
                        employeeIds: [],
                        time: ''
                    },
                    p2: {
                        id: '',
                        employeeIds: [],
                        time: ''
                    }
                },
                id: '',
                shift: '0',
                isOk: '0',
                notOkDesc: '',
                remark: ''
            }
        }
    },
    created() {
        this.loadEmployeeSelect()
        this.loadEmplyeeInfo()
    },
    watch:{
        logbookDetail:{
            // 深度监听
            handler: function (newVal, oldVal) {
                this.loadEmplyeeInfo()
            },
            deep:true
        }
    },
    methods: {
        // 加载值班人员选择列表
        loadEmployeeSelect() {
            this.$axios('/employee/list.json').then((res)=>{
                if (res.data.success) {
                    if (res.data.data && res.data.data.length > 0) {
                        _.forEach(res.data.data, (employee, index) => {
                            this.options.push({
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
        loadEmplyeeInfo() {
            let detail = this.logbookDetail
            if (detail) {
                if (detail.logbookDetailDTOList && detail.logbookDetailDTOList.length > 0) {
                    _.forEach(detail.logbookDetailDTOList, logbookDetail => {
                        if (logbookDetail.position == 1) {
                            this.dutyData.duty.one = {
                                id: logbookDetail.id,
                                employeeIds: logbookDetail.employeeIdList,
                                time: logbookDetail.arrivalTime
                            }
                        } else if (logbookDetail.position == 2) {
                            this.dutyData.duty.two = {
                                id: logbookDetail.id,
                                employeeIds: logbookDetail.employeeIdList,
                                time: logbookDetail.arrivalTime
                            }
                        } else if (logbookDetail.position == 3) {
                            this.dutyData.duty.p1 = {
                                id: logbookDetail.id,
                                employeeIds: logbookDetail.employeeIdList,
                                time: logbookDetail.arrivalTime
                            }
                        } else if (logbookDetail.position == 4) {
                            this.dutyData.duty.p2 = {
                                id: logbookDetail.id,
                                employeeIds: logbookDetail.employeeIdList,
                                time: logbookDetail.arrivalTime
                            }
                        }
                    })
                }
                this.dutyData.id = detail.id
                this.dutyData.shift = detail.shift
                this.dutyData.isOk = detail.going
                this.dutyData.notOkDesc = detail.description
                this.dutyData.remark = detail.remark
            }
        },
        // 提交
        submitLogbook() {
            let postData = ({
                id: this.dutyData.id,
                shift: this.dutyData.shift,
                going: this.dutyData.isOk,
                description: this.dutyData.notOkDesc,
                remark: this.dutyData.remark,
                logbookDetailParamList: [{
                    id: this.dutyData.duty.one.id,
                    position: 1,
                    employeeIds: this.dutyData.duty.one.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.one.time
                }, {
                    id: this.dutyData.duty.two.id,
                    position: 2,
                    employeeIds: this.dutyData.duty.two.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.two.time
                }, {
                    id: this.dutyData.duty.p1.id,
                    position: 3,
                    employeeIds: this.dutyData.duty.p1.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.p1.time
                }, {
                    id: this.dutyData.duty.p2.id,
                    position: 4,
                    employeeIds: this.dutyData.duty.p2.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.p2.time
                }]
            })
            this.$axios({
                method: 'post',
                url: '/logbook/update.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`值班日志更新成功`)
                    this.$emit('on-submit', true)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex >= 2) {
                if (columnIndex >= 1) {
                    return [1, 4]
                }
            }
        }
    }
}
</script>

<style>

</style>
