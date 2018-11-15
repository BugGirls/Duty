<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班人员</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="select_type" placeholder="筛选状态" class="handle-select mr10">
                    <el-option key="name" label="姓名" value="name"></el-option>
                    <el-option key="mobile" label="手机号" value="mobile"></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-lx-search" @click="search">搜索</el-button>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-delete" class="handle-del mr10" @click="batchDel">批量删除</el-button>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">新增人员</el-button>
                </el-button-group>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="头像" width="140" prop="photoUrl">
                    <template slot-scope="scope">
                        <img :src="scope.row.photoUrl" class="head_pic"/>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="200"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">正常</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="warning">冻结</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="insertVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="头像">
                    <v-crop-img @on-over="uploadImage"></v-crop-img>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="form.gender" size="small">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status" size="small">
                        <el-radio label="1" border>正常</el-radio>
                        <el-radio label="0" border>冻结</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-input type="hidden" v-model="form.id"></el-input>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="头像">
                    <v-crop-img :photoUrl="form.photoUrl" @on-over="uploadImage"></v-crop-img>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="form.gender" size="small">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status" size="small">
                        <el-radio label="1" border>正常</el-radio>
                        <el-radio label="0" border>冻结</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-input type="hidden" v-model="form.id"></el-input>
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
    import VCropImg from '../../common/CropImg'

    export default {
        components: {
            VCropImg
        },
        name: 'basetable',
        data() {
            return {
                url: '/api/employee/page.json',
                tableData: [],
                pageNum: 1,
                pageSize: 10,
                total: 0,
                multipleSelection: [],
                select_type: '',
                select_word: '',
                del_id: '',
                del_list: [],
                is_search: false,
                insertVisible: false,
                editVisible: false,
                delVisible: false,
                idx: -1,
                form: {
                    id: '',
                    photoUrl: '',
                    name: '',
                    gender: '',
                    mobile: '',
                    status: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' }
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
                    let is_del = false;
                    d.status = d.status.toString()
                    d.gender = d.gender.toString()
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        // if (d.address.indexOf(this.select_cate) > -1 &&
                        //     (d.name.indexOf(this.select_word) > -1 ||
                        //         d.address.indexOf(this.select_word) > -1)
                        // ) {
                        //     return d;
                        // }
                        return d;
                    }
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData()
            },
            // 获取值班人员数据
            getData() {
                let postData = this.$qs.stringify({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    type: this.select_type,
                    code: this.select_word
                })
                this.$axios({
                    method: 'post',
                    url: '/api/employee/page_by_param.json',
                    data: postData
                }).then((res) => {
                    let page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                })
            },
            search() {
                this.getData()
            },
            formatter(row, column) {
                return row.address
            },
            filterTag(value, row) {
                return row.tag === value
            },
            handleInsert() {
                this.form = {
                    gender: '1',
                    status: '1'
                }
                this.insertVisible = true
            },
            handleEdit(index, row) {
                this.idx = index
                const item = this.tableData[index]
                this.form = {
                    id: item.id,
                    photoUrl: item.photoUrl,
                    name: item.name,
                    gender: item.gender.toString(),
                    mobile: item.mobile,
                    status: item.status.toString()
                }
                this.editVisible = true
            },
            handleDelete(index, row) {
                this.idx = index
                this.del_id = row.id
                this.delVisible = true
            },
            // 批量删除
            batchDel() {
                let idListTemp = []
                this.multipleSelection.forEach(item => {
                    idListTemp.push(item.id)
                })

                let postData = this.$qs.stringify({
                    idList: idListTemp.join(',')
                })
                this.$axios({
                    method: 'post',
                    url: '/api/employee/batch_delete.json',
                    data: postData
                }).then((res)=>{
                    if (res.data.success) {
                        let str = ''
                        this.del_list = this.del_list.concat(this.multipleSelection)
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            str += this.multipleSelection[i].name + ' '
                        }
                        this.$message.success('删除了' + str)
                        this.multipleSelection = []
                    } else {
                        this.$message.error(` ${res.data.msg} `)
                    }
                }, (err) => {
                    this.$message.error(` 请求失败 `)
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 新增保存
            saveInsert(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let postData = this.$qs.stringify({
                            photoUrl: this.form.photoUrl,
                            name: this.form.name,
                            gender: this.form.gender,
                            mobile: this.form.mobile,
                            status: this.form.status
                        })
                        this.$axios({
                            method: 'post',
                            url: '/api/employee/save.json',
                            data: postData
                        }).then((res)=>{
                            if (res.data.success) {
                                this.insertVisible = false
                                this.$message.success(`添加人员 ${this.form.name} 成功`)
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
            // 保存编辑
            saveEdit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let postData = this.$qs.stringify({
                            id: this.form.id,
                            photoUrl: this.form.photoUrl,
                            name: this.form.name,
                            gender: this.form.gender,
                            mobile: this.form.mobile,
                            status: this.form.status
                        })
                        this.$axios({
                            method: 'post',
                            url: '/api/employee/update.json',
                            data: postData
                        }).then((res)=>{
                            if (res.data.success) {
                                this.$set(this.tableData, this.idx, this.form);
                                this.editVisible = false;
                                this.$message.success(`修改第 ${this.idx+1} 行成功`);
                            } else {
                                this.$message.error(` ${res.data.msg} `)
                            }
                        }, (err) => {
                            this.$message.error(` 请求失败 `)
                            console.log(err)
                        })
                    } else {
                        this.loginTips = '参数错误'
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 确定删除
            deleteRow(){
                let postData = this.$qs.stringify({
                    employeeId: this.del_id
                })
                this.$axios({
                    method: 'post',
                    url: '/api/employee/delete.json',
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
            },
            // 上传图片
            uploadImage(img) {
                let postData = this.$qs.stringify({
                    base64Data: img
                })
                this.$axios({
                    method: 'post',
                    url: '/api/file/upload_base64.json',
                    data: postData
                }).then((res)=>{
                    if (res.data.success) {
                        this.form.photoUrl = res.data.data
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
