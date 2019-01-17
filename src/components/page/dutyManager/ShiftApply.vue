// 换班申请

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>换班申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="selectApplyStatus" placeholder="审核状态" clearable class="handle-select mr10" @change="getData">
                    <el-option label="正在审核" key="0" value="0"></el-option>
                    <el-option label="审核通过" key="1" value="1"></el-option>
                    <el-option label="驳回" key="2" value="2"></el-option>
                </el-select>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" class="handle-del mr10" @click="handleShiftInsert()">添加申请</el-button>
                </el-button-group>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable">
                <el-table-column prop="applyEmployeeName" label="申请的员工"></el-table-column>
                <el-table-column prop="applyTime" label="申请的换班日期"></el-table-column>
                <el-table-column prop="replaceEmployeeName" label="替换的员工"></el-table-column>
                <el-table-column prop="replaceTime" label="替换的换班日期"></el-table-column>
                <el-table-column prop="applyStatus" label="审核状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.applyStatus === '0'">正在审核</el-tag>
                        <el-tag v-show="scope.row.applyStatus === '1'" type="success">审核通过</el-tag>
                        <el-tag v-show="scope.row.applyStatus === '2'" type="danger">驳回</el-tag>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="shiftStatus" label="换班状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.shiftStatus === '0'">等待换班</el-tag>
                        <el-tag v-show="scope.row.shiftStatus === '1'" type="success">正在换班</el-tag>
                        <el-tag v-show="scope.row.shiftStatus === '2'" type="warning">换班结束</el-tag>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="cause" label="换班原因"></el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handleShiftPreview(scope.row)">详情</el-button>
                        <el-button type="text" icon="el-icon-edit" v-bind:disabled="scope.row.applyStatus !== '0'" @click="handleShiftEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" v-bind:disabled="scope.row.applyStatus !== '0'" class="red" @click="handleShiftDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="insertShiftVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="shiftRules" :model="shiftForm" label-width="120px">
                <el-form-item label="申请的员工" prop="applyEmployeeId">
                    <el-select v-model="shiftForm.applyEmployeeId" clearable placeholder="请选择员工">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请的换班日期" prop="applyTime">
                    <el-date-picker v-model="shiftForm.applyTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="替换的员工" prop="replaceEmployeeId">
                    <el-select v-model="shiftForm.replaceEmployeeId" clearable placeholder="请选择员工">
                        <el-option v-for="item in excludeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="替换的换班日期" prop="replaceTime">
                    <el-date-picker v-model="shiftForm.replaceTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="换班原因" prop="cause">
                    <el-input type="textarea" v-model="shiftForm.cause"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertShiftVisible = false">取 消</el-button>
                <el-button type="primary" @click="shiftInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editShiftVisible" width="30%">
            <el-form ref="form" label-position="right" :rules="shiftRules" :model="shiftForm" label-width="120px">
                <el-form-item label="申请的员工" prop="applyEmployeeId">
                    <el-select v-model="shiftForm.applyEmployeeId" clearable placeholder="请选择员工">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请的换班日期" prop="applyTime">
                    <el-date-picker v-model="shiftForm.applyTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="替换的员工" prop="replaceEmployeeId">
                    <el-select v-model="shiftForm.replaceEmployeeId" clearable placeholder="请选择员工">
                        <el-option v-for="item in excludeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="替换的换班日期" prop="replaceTime">
                    <el-date-picker v-model="shiftForm.replaceTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="换班原因" prop="cause">
                    <el-input type="textarea" v-model="shiftForm.cause"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShiftVisible = false">取 消</el-button>
                <el-button type="primary" @click="shiftEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteShiftVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteShiftVisible = false">取 消</el-button>
                <el-button type="primary" @click="shiftDelete">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情弹出框 -->
        <el-dialog title="详情" :visible.sync="previewShiftVisible" width="33%">
            <el-form ref="form" label-position="right" :model="shiftForm" label-width="150px">
                <el-form-item label="ID">
                    <el-alert :title="shiftForm.id" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="申请员工">
                    <el-alert :title="shiftForm.applyEmployeeName" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="申请换班日期">
                    <el-alert :title="shiftForm.applyTime" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="要替换的员工">
                    <el-alert :title="shiftForm.replaceEmployeeName" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="要替换的日期">
                    <el-alert :title="shiftForm.replaceTime" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="换班原因">
                    <el-alert :title="shiftForm.cause" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="申请状态">
                    <el-radio-group v-model="shiftForm.status" size="small">
                        <el-alert v-show="shiftForm.applyStatus === '0'" title="正在审核" type="info" :closable="false"></el-alert>
                        <el-alert v-show="shiftForm.applyStatus === '1'" title="审核通过" type="success" :closable="false"></el-alert>
                        <el-alert v-show="shiftForm.applyStatus === '2'" title="驳回" type="error" :closable="false"></el-alert>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因" v-show="shiftForm.rejectCause">
                    <el-alert :title="shiftForm.rejectCause" type="error" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="提交方式">
                    <el-radio-group v-model="shiftForm.submitType" size="small">
                        <el-alert v-show="shiftForm.submitType === '0'" title="网页提交" type="info" :closable="false"></el-alert>
                        <el-alert v-show="shiftForm.submitType === '1'" title="微信提交" type="info" :closable="false"></el-alert>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-alert :title="shiftForm.createTime" type="info" :closable="false"></el-alert>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="previewShiftVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            tableData: [],
            options: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            insertShiftVisible: false,
            editShiftVisible: false,
            deleteShiftVisible: false,
            previewShiftVisible: false,
            del_id: '',
            selectApplyStatus: '',
            shiftForm: {
                id: '',
                applyEmployeeId: '',
                applyTime: '',
                replaceEmployeeId: '',
                replaceTime: '',
                applyStatus: '',
                rejectCause: '',
                shiftStatus: '',
                cause: '',
                submitType: ''
            },
            shiftRules: {
                applyEmployeeId: [
                    { required: true, message: '请选择申请员工', trigger: 'blur' }
                ],
                applyTime: [
                    { required: true, message: '请选择申请换班日期', trigger: 'blur' }
                ],
                replaceEmployeeId: [
                    { required: true, message: '请选择要替换的员工', trigger: 'blur' }
                ],
                replaceTime: [
                    { required: true, message: '请选择要替换的换班日期', trigger: 'blur' }
                ],
                cause: [
                    { required: true, message: '请输入换班原因', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.applyTime = d.applyTime.substr(0, d.applyTime.indexOf(' '))
                d.replaceTime = d.replaceTime.substr(0, d.replaceTime.indexOf(' '))
                d.applyStatus = d.applyStatus.toString()
                d.shiftStatus = d.shiftStatus.toString()
                d.submitType = d.submitType.toString()
                return d;
            })
        },
        excludeOptions() {
            return this.options.filter((d) => {
                if (d.value.toString() !== this.shiftForm.applyEmployeeId.toString()) {
                    return d;
                }
            })
        }
    },
    mounted() {
        this.getData()
        this.loadEmployeeSelect()
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData()
        },
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                applyStatus: this.selectApplyStatus
            })
            this.$axios({
                method: 'post',
                url: '/shiftApply/page.json',
                data: postData
            }).then((res) => {
                console.log(res)
                let page = res.data.data
                this.tableData = page.list
                this.total = page.total
            })
        },
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
        handleShiftInsert() {
            this.shiftForm = {
                applyEmployeeId: '',
                applyTime: '',
                applyShift: '1',
                replaceEmployeeId: '',
                replaceTime: '',
                replaceShift: '1',
                cause: '',
                submitType: ''
            }
            this.insertShiftVisible = true
        },
        shiftInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        applyEmployeeId: this.shiftForm.applyEmployeeId,
                        applyTime: this.shiftForm.applyTime,
                        applyShift: this.shiftForm.applyShift,
                        replaceEmployeeId: this.shiftForm.replaceEmployeeId,
                        replaceTime: this.shiftForm.replaceTime,
                        replaceShift: this.shiftForm.replaceShift,
                        cause: this.shiftForm.cause,
                        submitType: 0
                    })
                    this.$axios({
                        method: 'post',
                        url: '/shiftApply/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertShiftVisible = false
                            this.$message.success(`换班申请添加成功`)
                            this.getData()
                        } else {
                            this.$message.error(` ${res.data.msg} `)
                        }
                    })
                } else {
                    this.$message.error(` 字段填写不完整 `)
                    return false;
                }
            })
        },
        handleShiftEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.shiftForm = {
                id: item.id,
                applyEmployeeId: item.applyEmployeeId,
                applyTime: item.applyTime,
                applyShift: item.applyShift,
                replaceEmployeeId: item.replaceEmployeeId,
                replaceTime: item.replaceTime,
                replaceShift: item.replaceShift,
                cause: item.cause
            }
            this.editShiftVisible = true
        },
        shiftEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.shiftForm.id,
                        applyEmployeeId: this.shiftForm.applyEmployeeId,
                        applyTime: this.shiftForm.applyTime,
                        applyShift: this.shiftForm.applyShift,
                        replaceEmployeeId: this.shiftForm.replaceEmployeeId,
                        replaceTime: this.shiftForm.replaceTime,
                        replaceShift: this.shiftForm.replaceShift,
                        cause: this.shiftForm.cause,
                        submitType: 0
                    })
                    this.$axios({
                        method: 'post',
                        url: '/shiftApply/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editShiftVisible = false
                            this.$message.success(`换班申请更新成功`)
                            this.getData()
                        } else {
                            this.$message.error(` ${res.data.msg} `)
                        }
                    })
                } else {
                    this.$message.error(` 字段填写不完整 `)
                    return false;
                }
            })
        },
        handleShiftDelete(index, row) {
            this.del_id = row.id
            this.deleteShiftVisible = true
        },
        shiftDelete() {
            let postData = this.$qs.stringify({
                shiftApplyId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/shiftApply/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success('删除成功')
                    this.deleteShiftVisible = false
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleShiftPreview(row) {
            console.log(row)
            this.previewShiftVisible = true
            this.shiftForm = {
                id: row.id,
                applyEmployeeId: row.applyEmployeeId,
                applyEmployeeName: row.applyEmployeeName,
                applyTime: row.applyTime,
                replaceEmployeeId: row.replaceEmployeeId,
                replaceEmployeeName: row.replaceEmployeeName,
                replaceTime: row.replaceTime,
                applyStatus: row.applyStatus,
                rejectCause: row.rejectCause,
                cause: row.cause,
                submitType: row.submitType,
                createTime: row.createTime
            }
        }
    }
}
</script>

<style>
.red{
    color: #ff0000;
}
.table{
    width: 100%;
    font-size: 14px;
}
.handle-box {
    margin-bottom: 20px;
}
.el-table .cell {
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
