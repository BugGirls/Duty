// 值班表 管理

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table border :data="tableData" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="250"></el-table-column>
                <el-table-column prop="validMonth" label="当前月份"></el-table-column>
                <el-table-column prop="title" label="值班表名称"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-attention" class="" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" v-show="scope.row.deleteBtnShow" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 值班表预览 -->
        <el-dialog title="值班表预览" :visible.sync="previewVisible" width="80%">
            <duty-preview :tableList="tableList" :residueList="residueList" :yearAndMonth="yearAndMonth"
             :employeeList="employeeList" @save-result="saveAfter($event)"></duty-preview>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="dutyDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DutyPreview from './DutyPreview'
import _ from 'lodash'

export default {
    components: {
        DutyPreview
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            previewVisible: false,
            delVisible: false,
            tableList: [],
            residueList: [],
            yearAndMonth: '',
            employeeList: [],
            del_id: ''
        }
    },
    mounted() {
        this.getData()
        this.loadEmployeeSelect()
    },
    methods: {
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/dutyInfo/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    console.log(res.data.data)
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
        handlePreview(index, row) {
            this.previewVisible = true
            if (row.tableData) {
                this.tableList = JSON.parse(row.tableData)
            }
            if (row.residueList) {
                this.residueList = JSON.parse(row.residueList)
            }
            this.yearAndMonth = row.yearAndMonth

        },
        // 加载值班人员选择列表
        loadEmployeeSelect() {
            this.$axios('/employee/list.json').then((res)=>{
                if (res.data.success) {
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
        handleDelete(index, row) {
            this.del_id = row.id
            this.delVisible = true
        },
        dutyDelete() {
            let postData = this.$qs.stringify({
                dutyId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/dutyInfo/delete.json',
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
</style>
