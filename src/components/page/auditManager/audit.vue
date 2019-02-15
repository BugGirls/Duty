// 审核管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-service"></i> 审核管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="applyEmployeeName" label="申请的员工" width="150"></el-table-column>
                <el-table-column prop="applyTime" label="申请的换班日期" width="150"></el-table-column>
                <el-table-column prop="replaceEmployeeName" label="替换的员工" width="150"></el-table-column>
                <el-table-column prop="replaceTime" label="替换的换班日期" width="150"></el-table-column>
                <el-table-column prop="applyStatus" label="审核状态" width="100">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.applyStatus === '0'">正在审核</el-tag>
                        <el-tag v-show="scope.row.applyStatus === '1'" type="success">通过</el-tag>
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
                <el-table-column prop="cause" label="换班原因"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-success" v-bind:disabled="scope.row.applyStatus === '1' || scope.row.applyStatus === '2'" @click="auditPass(scope.$index, scope.row)">通过</el-button>
                        <el-button type="text" icon="el-icon-error" v-bind:disabled="scope.row.applyStatus === '2' || scope.row.applyStatus === '1'" class="red" @click="handleReject(scope.row)">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 驳回提示框 -->
        <el-dialog title="驳回说明" :visible.sync="rejectVisible" width="33%">
            <el-form ref="form" label-position="right" label-width="100px">
                <el-input type="textarea" :rows="2" placeholder="请填写驳回原因" v-model="rejectCause"></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rejectVisible = false">取 消</el-button>
                <el-button type="primary" @click="auditReject('form')">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            rejectVisible: false,
            id: '',
            rejectCause: ''
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
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/shiftApply/page.json',
                data: postData
            }).then((res) => {
                let page = res.data.data
                this.tableData = page.list
                this.total = page.total
            })
        },
        auditPass(index, row) {
            let postData = this.$qs.stringify({
                shiftApplyId: row.id
            })
            this.$axios({
                method: 'post',
                url: '/shiftApply/shift.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.$message.success('值班表已更改')
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleReject(row) {
            this.rejectVisible = true
            this.id = row.id
            this.rejectCause = ''
        },
        // 驳回
        auditReject() {
            let postData = this.$qs.stringify({
                id: this.id,
                rejectCause: this.rejectCause
            })
            this.$axios({
                method: 'post',
                url: '/shiftApply/reject.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.rejectVisible = false
                    this.$message.success(` 申请已经被驳回 `)
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
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
