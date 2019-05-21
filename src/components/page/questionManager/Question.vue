// 题库管理 -> 试题管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 题库管理</el-breadcrumb-item>
                <el-breadcrumb-item>试题管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <category-select :options="categoryList" @on-change="selectChange($event)"></category-select>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">添加试题</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="170"></el-table-column>
                <el-table-column prop="categoryName" label="所属分类"></el-table-column>
                <el-table-column prop="subject" label="题目" width="200"></el-table-column>
                <el-table-column prop="answer" label="答案" width="200"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">有效</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="danger">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-attention" @click="handleView(scope.$index, scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" :disabled="!scope.row.updateBtnEdit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="!scope.row.deleteBtnEdit" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增试题" :visible.sync="insertVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="rules" :model="questionForm" label-width="100px">
                <el-form-item label="试题分类" prop="categoryId">
                    <category-select :options="categoryList" @on-change="getCategoryId($event)"></category-select>
                </el-form-item>
                <el-form-item label="题目" prop="subject">
                    <el-input type="textarea" v-model="questionForm.subject"></el-input>
                </el-form-item>
                <el-form-item label="答案" prop="answer">
                    <el-input type="textarea" v-model="questionForm.answer"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="questionForm.status" size="small">
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
        <el-dialog title="编辑试题" :visible.sync="editVisible" width="30%">
             <el-form ref="form" label-position="right" :rules="rules" :model="questionForm" label-width="100px">
                <el-form-item label="试题分类" prop="categoryId">
                    <category-select :options="categoryList" :defaultValue="defaultCategory" @on-change="getCategoryId($event)"></category-select>
                </el-form-item>
                <el-form-item label="题目" prop="subject">
                    <el-input type="textarea" v-model="questionForm.subject"></el-input>
                </el-form-item>
                <el-form-item label="答案" prop="answer">
                    <el-input type="textarea" v-model="questionForm.answer"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="questionForm.status" size="small">
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

        <!-- 查看弹出框 -->
        <el-dialog title="查看试题" :visible.sync="viewVisible" width="33%">
            <el-form ref="form" label-position="right" :model="questionForm" label-width="100px">
                <el-form-item label="ID" prop="id">
                    <el-alert :title="questionForm.id" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="试题分类" prop="categoryId">
                    <el-alert :title="questionForm.categoryName" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="题目" prop="subject">
                    <el-alert :title="questionForm.subject" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="答案" prop="answer">
                    <el-alert :title="questionForm.answer" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="questionForm.status" size="small">
                        <el-alert v-show="questionForm.status === '1'" title="有效" type="success" :closable="false"></el-alert>
                        <el-alert v-show="questionForm.status !== '1'" title="无效" type="error" :closable="false"></el-alert>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewVisible = false">取 消</el-button>
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
import CategorySelect from '../../common/Selection'
import _ from 'lodash'

export default {
    components: {
        CategorySelect
    },
    data() {
        return {
            tableData: [],
            insertVisible: false,
            editVisible: false,
            viewVisible: false,
            delVisible: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            categoryList: [],
            defaultCategory: '',
            select_code: '',
            select_value: '',
            questionForm: {
                id: '',
                categoryId: '',
                categoryName: '',
                subject: '',
                answer: '',
                status: '1',
                createTime: ''
            },
            rules: {
                categoryId: [
                    { required: true, message: '请选择试题分类', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: '请输入试题题目', trigger: 'blur' }
                ],
                answer: [
                    { required: true, message: '请输入试题答案', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.getData()
        this.getCategory()
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
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData()
        },
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                code: this.select_code,
                value: this.select_value
            })
            this.$axios({
                method: 'post',
                url: '/question/page_by_param.json',
                data: postData
            }).then((res) => {
                let page = res.data.data
                this.tableData = page.list
                this.total = page.total
            })
        },
        getCategory() {
            let postData = this.$qs.stringify({
                status: 1
            })
            this.$axios({
                method: 'post',
                url: '/questionCategory/get_list_by_param.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    _.forEach(res.data.data, (item) => {
                        let option = {
                            value: item.id,
                            label: item.title
                        }
                        this.categoryList.push(option)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleInsert() {
            this.insertVisible = true
            this.questionForm = {
                id: '',
                categoryId: '',
                categoryName: '',
                subject: '',
                answer: '',
                status: '1',
                createTime: ''
            }
        },
        saveInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        categoryId: this.questionForm.categoryId,
                        subject: this.questionForm.subject,
                        answer: this.questionForm.answer,
                        status: this.questionForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/question/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`试题添加成功`)
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
        getCategoryId(categoryId) {
            this.questionForm.categoryId = categoryId
            console.log(categoryId)
        },
        handleEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.questionForm = {
                id: item.id,
                categoryId: item.categoryId,
                subject: item.subject,
                answer: item.answer,
                status: item.status
            }
            this.defaultCategory = item.categoryId
            this.editVisible = true
        },
        saveEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.questionForm.id,
                        categoryId: this.questionForm.categoryId,
                        subject: this.questionForm.subject,
                        answer: this.questionForm.answer,
                        status: this.questionForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/question/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`修改第 ${this.idx+1} 行成功`)
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
        selectChange(val) {
            this.select_code = 'categoryId'
            this.select_value = val
            this.getData()
        },
        handleView(index, row) {
            const item = this.tableData[index]
            this.questionForm = {
                id: item.id,
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                subject: item.subject,
                answer: item.answer,
                status: item.status
            }
            this.defaultCategory = item.categoryId
            this.viewVisible = true
        },
        handleDelete(index, row) {
            this.idx = index
            this.del_id = row.id
            this.delVisible = true
        },
        deleteRow() {
            let postData = this.$qs.stringify({
                questionId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/question/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
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
.el-table .cell {
    text-overflow: ellipsis;
    white-space: nowrap;
}
.black {
    color: black;
}
</style>
