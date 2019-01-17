// 值班管理 -》 值班巡检 -》 巡检项管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班巡检</el-breadcrumb-item>
                <el-breadcrumb-item>巡检项配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">添加巡检项</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="200"></el-table-column>
                <el-table-column prop="title" label="巡检名称" width="200"></el-table-column>
                <el-table-column prop="type" label="记录类型" width="200">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.type === '1'">勾选</el-tag>
                        <el-tag v-show="scope.row.type !== '1'" type="warning">文本</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="seq" label="展示顺序"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增巡检项" :visible.sync="insertVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="rules" :model="itemForm" label-width="100px">
                <el-form-item label="巡检项名称" prop="title">
                    <el-input v-model="itemForm.title"></el-input>
                </el-form-item>
                <el-form-item label="记录类型" prop="type">
                    <el-radio-group v-model="itemForm.type" size="small">
                        <el-radio label="1" border>勾选</el-radio>
                        <el-radio label="2" border>文本</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="itemForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑巡检项" :visible.sync="editVisible" width="30%">
            <el-form ref="form" label-position="right" :rules="rules" :model="itemForm" label-width="100px">
                <el-form-item label="巡检项名称" prop="title">
                    <el-input v-model="itemForm.title"></el-input>
                </el-form-item>
                <el-form-item label="记录类型" prop="type">
                    <el-radio-group v-model="itemForm.type" size="small">
                        <el-radio label="1" border>勾选</el-radio>
                        <el-radio label="2" border>文本</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="itemForm.seq" controls-position="right" :min="1"></el-input-number>
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
            idx: -1,
            del_id: '',
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            itemForm: {
                id: '',
                title: '',
                type: '1',
                seq: 1
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
                d.type = d.type.toString()
                return d
            })
        }
    },
    methods: {
        getData() {
            this.$axios('/inspectionItem/list.json')
            .then((res) => {
                this.tableData = res.data.data
            })
        },
        handleInsert () {
            this.insertVisible = true
        },
        handleEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.itemForm = {
                id: item.id,
                title: item.title,
                type: item.type.toString(),
                seq: item.seq
            }
            this.editVisible = true
        },
        handleDelete(index, row) {
            this.idx = index
            this.del_id = row.id
            this.delVisible = true
        },
        saveInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        title: this.itemForm.title,
                        type: this.itemForm.type,
                        seq: this.itemForm.seq
                    })
                    this.$axios({
                        method: 'post',
                        url: '/inspectionItem/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`添加巡检项 ${this.itemForm.title} 成功`)
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
        saveEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.itemForm.id,
                        title: this.itemForm.title,
                        type: this.itemForm.type,
                        seq: this.itemForm.seq
                    })
                    this.$axios({
                        method: 'post',
                        url: '/inspectionItem/update.json',
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
        deleteRow(){
            let postData = this.$qs.stringify({
                itemId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/inspectionItem/delete.json',
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
