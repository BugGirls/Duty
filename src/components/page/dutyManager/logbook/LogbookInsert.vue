// 新增 值班日志

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
                            <el-time-picker v-if='scope.row.type===2' value-format='HH:mm:ss' v-model="dutyData.duty.one.time" placeholder="时间" style="width:100%"></el-time-picker>
                            <template v-if='scope.row.type===3'>
                                <el-radio v-model="dutyData.isOk" label="1">正常</el-radio>
                                <el-radio v-model="dutyData.isOk" label="0">异常</el-radio>
                            </template>
                            <el-input v-if='scope.row.type===4' type="textarea" :rows="4" placeholder="请输入异常描述" v-model="dutyData.notOkDesc"></el-input>
                            <el-input v-if='scope.row.type===5' type="textarea" :rows="2" placeholder="请输入备注" v-model="dutyData.remark"></el-input>
                            <template v-if='scope.row.type===6'>
                                <el-radio v-model="dutyData.shift" label="1">白班</el-radio>
                                <el-radio v-model="dutyData.shift" label="0">夜班</el-radio>
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
                return {}
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
                        employeeIds: [],
                        time: ''
                    },
                    two: {
                        employeeIds: [],
                        time: ''
                    },
                    p1: {
                        employeeIds: [],
                        time: ''
                    },
                    p2: {
                        employeeIds: [],
                        time: ''
                    }
                },
                shift: '1',
                isOk: '1',
                notOkDesc: '',
                remark: ''
            },
            nullData: {
                duty: {
                    one: {
                        employeeIds: [],
                        time: ''
                    },
                    two: {
                        employeeIds: [],
                        time: ''
                    },
                    p1: {
                        employeeIds: [],
                        time: ''
                    },
                    p2: {
                        employeeIds: [],
                        time: ''
                    }
                },
                shift: '1',
                isOk: '1',
                notOkDesc: '',
                remark: ''
            }
        }
    },
    created() {
        this.loadEmployeeSelect()
        this.loadCurrentDateDuty()
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
        // 加载当前时间的值班表
        loadCurrentDateDuty() {
            this.dutyList = []
            this.tableList = []
            this.$axios('/dutyInfo/get_detail_by_now.json').then((res) => {
                if (res.data.success) {
                    // this.tableList = []
                    // this.dutyList = []
                    // this.tableList.push(res.data.data)
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
        // 提交
        submitLogbook() {
            let postData = ({
                shift: this.dutyData.shift,
                going: this.dutyData.isOk,
                description: this.dutyData.notOkDesc,
                remark: this.dutyData.remark,
                logbookDetailParamList: [{
                    position: 1,
                    employeeIds: this.dutyData.duty.one.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.one.time
                }, {
                    position: 2,
                    employeeIds: this.dutyData.duty.two.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.two.time
                }, {
                    position: 3,
                    employeeIds: this.dutyData.duty.p1.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.p1.time
                }, {
                    position: 4,
                    employeeIds: this.dutyData.duty.p2.employeeIds.join(','),
                    arrivalTime: this.dutyData.duty.p2.time
                }]
            })
            this.$axios({
                method: 'post',
                url: '/logbook/save.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`值班日志创建成功`)
                    this.$emit('on-submit', true)
                    this.dutyData = this.nullData
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
