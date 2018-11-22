// 题库管理 -> 试题分类

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 题库管理</el-breadcrumb-item>
                <el-breadcrumb-item>试题分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">添加分类</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="200"></el-table-column>
                <el-table-column prop="title" label="分类名称"></el-table-column>
                <el-table-column prop="seq" label="展示顺序"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">有效</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="danger">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增分类" :visible.sync="insertVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="rules" :model="categoryForm" label-width="100px">
                <el-form-item label="分类名称" prop="title">
                    <el-input v-model="categoryForm.title"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="categoryForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="categoryForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑分类" :visible.sync="editVisible" width="30%">
            <el-form ref="form" label-position="right" :rules="rules" :model="categoryForm" label-width="100px">
                <el-form-item label="分类名称" prop="title">
                    <el-input v-model="categoryForm.title"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="categoryForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="categoryForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            idx: -1,
            del_id: '',
            categoryForm: {
                id: '',
                title: '',
                seq: 1,
                status: '1'
            },
            rules: {
                title: [
                    { required: true, message: '请输入巡检项名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getData()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.status = d.status.toString()
                return d
            })
        }
    },
    methods: {
        getData() {
            this.$axios('/api/questionCategory/get_list_by_param.json')
            .then((res) => {
                this.tableData = res.data.data
            })
        },
        handleInsert () {
            this.insertVisible = true
        },
        saveInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        title: this.categoryForm.title,
                        seq: this.categoryForm.seq,
                        status: this.categoryForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/api/questionCategory/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`试题分类《 ${this.categoryForm.title} 》添加成功`)
                            this.getData()
                        } else {
                            this.$message.error(` ${res.data.msg} `)
                        }
                    }, (err) => {
                        this.$message.error(` 请求失败 `)
                    })
                } else {
                    this.$message.error(` 字段填写不完整 `)
                    return false;
                }
            })
        },
        handleEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.categoryForm = {
                id: item.id,
                title: item.title,
                status: item.status.toString(),
                seq: item.seq
            }
            this.editVisible = true
        },
        saveEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.categoryForm.id,
                        title: this.categoryForm.title,
                        status: this.categoryForm.status,
                        seq: this.categoryForm.seq
                    })
                    this.$axios({
                        method: 'post',
                        url: '/api/questionCategory/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`修改第 ${this.idx+1} 行成功`)
                            this.getData()
                        } else {
                            this.$message.error(` ${res.data.msg} `)
                        }
                    }, (err) => {
                        this.$message.error(` 请求失败 `)
                    })
                } else {
                    this.$message.error(` 字段填写不完整 `)
                    return false;
                }
            })
        },
        handleDelete(index, row) {
            this.idx = index
            this.del_id = row.id
            this.delVisible = true
        },
        deleteRow(){
            let postData = this.$qs.stringify({
                categoryId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/api/questionCategory/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success('删除成功')
                    this.delVisible = false
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        }
    }
}
</script>

<style>
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
