// 值班日志 列表

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" class="handle-del mr10" @click="generatorLogbook" :disabled="buttonDisabled" :loading="buttonLoading">生成值班日志</el-button>
                    <el-button type="primary" class="handle-del mr10" @click="generatorLastShiftLogbook" :disabled="lastButtonDisabled" :loading="lastButtonLoading">补签</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="title" label="日志表名称" width="250"></el-table-column>
                <el-table-column prop="dutyDate" label="值班日期"></el-table-column>
                <el-table-column prop="shift" label="班次">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.shift === '2'">白班</el-tag>
                        <el-tag v-show="scope.row.shift === '1' || scope.row.shift === '3'" type="info">夜班</el-tag>
                        <span style="margin-left: 10px;">{{ scope.row.shiftTimeFrame }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="going" label="工作情况">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="success" size="mini" icon="el-icon-check" v-show="scope.row.going == null" @click="goingNormal(scope.$index, scope.row)">正常</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-close" v-show="scope.row.going == null" @click="handleGoingAbnormal(scope.$index, scope.row)">异常</el-button>
                        </el-button-group>

                        <el-tag v-show="scope.row.going === '1'" type="success">正常</el-tag>
                        <el-tag v-show="scope.row.going === '0'" type="danger">异常</el-tag>
                    </template>
                    
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handleView(scope.$index, scope.row)">预览</el-button>
                        <el-button type="text" icon="el-icon-edit" :disabled="!scope.row.updateBtnEdit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <!-- <el-button type="text" icon="el-icon-delete" class="red" v-show="scope.row.deleteBtnShow" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 修改值班日志 -->
        <el-dialog title="修改值班日志" :visible.sync="editVisible" width="80%">
            <el-form ref="form" label-position="right" label-width="150px" :rules="rules" :model="logbookDetail">
                <el-form-item label="值班员" style="text-align: center">
                    <el-row :gutter="12">
                        <el-col :span="5" v-for="item in logbookDetail.logbookDetailDTOList" :key="item.id">
                            <el-card shadow="never">
                                <img :src="item.employee.photoUrl" class="image">
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
                <el-form-item label="工作情况" prop="going">
                    <div>
                        <el-radio v-model="logbookDetail.going" label="1" border>正常</el-radio>
                        <el-radio v-model="logbookDetail.going" label="0" border>异常</el-radio>
                    </div>
                </el-form-item>
                <el-form-item label="异常描述" v-show="logbookDetail.going === '0'">
                    <el-input type="textarea" v-model="logbookDetail.description" style="width: 50%" :rows="4" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="logbookDetail.remark" style="width: 50%" :rows="4" placeholder="请输入内容" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateLogbook('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 预览 -->
        <el-dialog title="预览值班日志" :visible.sync="viewVisible" width="60%">
            <el-form ref="form" label-position="right" label-width="150px">
                <el-form-item label="值班员" style="text-align: center">
                    <el-row :gutter="12">
                        <el-col :span="5" v-for="item in logbookDetail.logbookDetailDTOList" :key="item.id">
                            <el-card shadow="never">
                                <img :src="item.employee.photoUrl" class="image">
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
                    <el-tag size="medium" type="success" v-show="logbookDetail.going === '1'">正常</el-tag>
                    <el-tag size="medium" type="danger" v-show="logbookDetail.going === '0'">异常</el-tag>
                </el-form-item>
                <el-form-item label="异常描述" v-show="logbookDetail.going === '0' && logbookDetail.description !== ''">
                     <el-alert type="error" :closable="false" style="width: 50%">{{ logbookDetail.description }}</el-alert>
                </el-form-item>
                <el-form-item label="备注" v-show="logbookDetail.remark !== ''">
                    <el-alert type="info" :closable="false" style="width: 50%">{{ logbookDetail.remark }}</el-alert>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewVisible = false">关  闭</el-button>
            </span>
        </el-dialog>

        <!-- 填写异常信息 -->
        <el-dialog title="异常信息" :visible.sync="abnormalVisible" width="33%">
            <el-form ref="form" label-position="right" label-width="100px" :model="logbookDetail">
                <el-input type="textarea" :rows="2" placeholder="请填写异常描述" v-model="logbookDetail.description"></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="abnormalVisible = false">取 消</el-button>
                <el-button type="primary" @click="goingAbnormal('form')">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="logbookDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import LogbookInsert from './LogbookInsert'
// import LogbookUpdate from './LogbookUpdate'
import _ from 'lodash'

export default {
    components: {
        // LogbookInsert, 
        // LogbookUpdate
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            editVisible: false,
            viewVisible: false,
            abnormalVisible: false,
            delVisible: false,
            logbookDetail: '',
            del_id: '',
            buttonDisabled: false,
            buttonLoading: false,
            lastButtonDisabled: false,
            lastButtonLoading: false,
            rules: {
                going: [
                    { required: true, message: '请选择工作情况', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.isLogbookByCurrentShift()
        this.isLogbookByLastShift()
        this.getData()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.shift = d.shift.toString()
                d.going = d.going == null ? null : d.going.toString()
                d.dutyDate = d.dutyDate.substr(0, d.dutyDate.indexOf(' '))
                return d;
            })
        }
    },
    methods: {
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/logbook/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    let page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData()
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
                    this.getData()
                    this.$message.success(` 值班日志已经生成 `)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 判断上个班次是否填写了值班日志
        isLogbookByLastShift() {
            this.$axios({
                method: 'post',
                url: '/logbook/is_logbook_by_last_shift.json',
            }).then((res)=>{
                if (res.data.success) {
                    this.lastButtonDisabled = res.data.data
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 生成上个班次的值班日志
        generatorLastShiftLogbook() {
            this.lastButtonLoading = true

            this.$axios({
                method: 'post',
                url: '/logbook/generator_last_shift_logbook.json',
            }).then((res)=>{
                this.lastButtonLoading = false
                if (res.data.success) {
                    this.isLogbookByLastShift()
                    this.getData()
                    this.$message.success(` 上一个班次的值班日志已经生成 `)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 工作情况 正常
        goingNormal(index, row) {
            let postData = this.$qs.stringify({
                id: row.id,
                going: 1
            })
            this.$axios({
                method: 'post',
                url: '/logbook/update.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`值班日志修改成功`)
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 工作情况 异常
        handleGoingAbnormal(index, row) {
            this.abnormalVisible = true
            this.logbookDetail = row
        },
        // 工作情况 异常
        goingAbnormal(form) {
            let postData = this.$qs.stringify({
                id: this.logbookDetail.id,
                going: 0,
                description: this.logbookDetail.description
            })
            this.$axios({
                method: 'post',
                url: '/logbook/update.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.abnormalVisible = false
                    this.$message.success(`值班日志修改成功`)
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleView(index, row) {
            this.viewVisible = true
            this.logbookDetail = row
        },
        handleEdit(index, row) {
            this.editVisible = true
            this.logbookDetail = row
        },
        updateLogbook(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.logbookDetail.id,
                        going: this.logbookDetail.going,
                        description: this.logbookDetail.going === '1' ? '' : this.logbookDetail.description,
                        remark: this.logbookDetail.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/logbook/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`值班日志修改成功`)
                            this.getData()
                        } else {
                            this.$message.error(` ${res.data.msg} `)
                        }
                    })
                } else {
                    this.$message.error(` 字段填写不完整 `)
                    return false
                }
            })
        },
        // editLogbookAfter(status) {
        //     if (status) {
        //         this.getData()
        //         this.editVisible = false
        //     }
        // },
        handleDelete(index, row) {
            this.del_id = row.id
            this.delVisible = true
        },
        logbookDelete() {
            let postData = this.$qs.stringify({
                logbookId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/logbook/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.getData()
                    this.$message.success('删除成功')
                    this.delVisible = false
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }
}
</script>

<style scoped>
.table{
    width: 100%;
    font-size: 14px;
}
.red{
    color: #ff0000;
}
.handle-box {
    margin-bottom: 20px;
}
.image {
    display: block;
    height: 200px;
    margin: 0 auto;
    width: auto;
}
</style>
