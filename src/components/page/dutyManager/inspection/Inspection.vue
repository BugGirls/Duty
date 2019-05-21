// 值班管理 -》 值班巡检 -》 巡检管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班巡检</el-breadcrumb-item>
                <el-breadcrumb-item>巡检管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">新增巡检</el-button>
                </el-button-group>
            </div>
            <el-table border :data="tableData" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="title" label="巡检表名称"></el-table-column>
                <el-table-column prop="createTime" label="巡检时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增巡检记录" :visible.sync="insertVisible" width="80%">
            <inspection-insert @submit-result="insertAfter"></inspection-insert>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="更新巡检记录" :visible.sync="editVisible" width="80%">
            <inspection-update :item="inspectionItem" @submit-result="editAfter"></inspection-update>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import InspectionInsert from './InspectionInsert'
import InspectionUpdate from './InspectionUpdate'

export default {
    components: {
        InspectionInsert,
        InspectionUpdate
    },
    data() {
        return {
            tableData: [],
            inspectionItem: '',
            pageNum: 1,
            pageSize: 10,
            total: 0,
            idx: -1,
            del_id: '',
            insertVisible: false,
            editVisible: false,
            deleteVisible: false
        }
    },
    created() {
        this.getData()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.type = d.type.toString()
                return d
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
                url: '/inspection/page.json',
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
        handleInsert () {
            this.insertVisible = true
            
        },
        insertAfter(result) {
            if (result) {
                this.insertVisible = false
                this.getData()
            }
        },
        handleEdit(index, row) {
            this.inspectionItem = row
            this.editVisible = true
        },
        editAfter(result) {
            if (result) {
                this.editVisible = false
                this.getData()
            }
        },
        handleDelete(index, row) {
            this.del_id = row.id
            this.deleteVisible = true
        },
        deleteRow() {
            let postData = this.$qs.stringify({
                inspectionId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/inspection/delete.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.$message.success('值班巡检信息删除成功')
                    this.deleteVisible = false
                    this.getData()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.del-dialog-cnt{
    font-size: 16px;
    text-align: center
}
.table{
    width: 100%;
    font-size: 14px;
}
.red{
    color: #ff0000;
}
.head_pic {
    border-radius: 10px;
}
</style>
