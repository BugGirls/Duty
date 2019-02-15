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
                    <el-button type="primary" icon="el-icon-lx-add" class="handle-del mr10" @click="handleInsert">新增日志</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="title" label="日志表名称" width="250"></el-table-column>
                <el-table-column prop="dutyDate" label="值班日期"></el-table-column>
                <el-table-column prop="shift" label="班次">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.shift === '1'">早班</el-tag>
                        <el-tag v-show="scope.row.shift === '0'" type="info">晚班</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="going" label="工作情况">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.going === '1'" type="success">正常</el-tag>
                        <el-tooltip :content="scope.row.description === '' ? '暂无异常信息' : '异常说明：' + scope.row.description" placement="top" effect="light">
                            <el-tag v-show="scope.row.going === '0'" type="danger">异常</el-tag>
                        </el-tooltip>
                    </template>
                    
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-show="scope.row.updateBtnShow" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" v-show="scope.row.deleteBtnShow" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 新增值班日志 -->
        <el-dialog title="新增值班日志" :visible.sync="insertVisible" width="80%">
            <logbook-insert @on-submit="insertLogbookAfter($event)"></logbook-insert>
        </el-dialog>

        <!-- 修改值班日志 -->
        <el-dialog title="新增值班日志" :visible.sync="editVisible" width="80%">
            <logbook-update :logbookDetail="logbookDetail" @on-submit="editLogbookAfter($event)"></logbook-update>
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
import LogbookInsert from './LogbookInsert'
import LogbookUpdate from './LogbookUpdate'
import _ from 'lodash'

export default {
    components: {
        LogbookInsert, LogbookUpdate
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            logbookDetail: '',
            del_id: ''
        }
    },
    created() {
        this.getData()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.shift = d.shift.toString()
                d.going = d.going.toString()
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
        handleInsert() {
            this.insertVisible = true
            this.logbookDetail = {ins:true}
        },
        insertLogbookAfter(message) {
            if (message) {
                this.getData()
                this.insertVisible = false
            }
        },
        handleEdit(index, row) {
            this.editVisible = true
            this.logbookDetail = row
        },
        editLogbookAfter(status) {
            if (status) {
                this.getData()
                this.editVisible = false
            }
        },
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

<style>
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
