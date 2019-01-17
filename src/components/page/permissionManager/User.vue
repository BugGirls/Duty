// 用户管理

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="12">
                <el-col :span="6">
                    <!-- 部门树 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>部门分类</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleDeptInsert()">添加部门</el-button>
                        </div>
                        <el-tree :data="deptTree" @node-click="handleNodeClick"
                        :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleDeptEdit(data)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleDeptDelete(data)"></el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <!-- 用户列表 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>用户列表</span>
                            <!-- <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleUserInsert()">添加用户</el-button> -->
                        </div>
                        <el-table border :data="data" class="table" ref="multipleTable">
                            <el-table-column prop="id" label="ID" width="100"></el-table-column>
                            <el-table-column prop="username" label="用户名称" ></el-table-column>
                            <el-table-column prop="telephone" label="手机号"></el-table-column>
                            <el-table-column prop="mail" label="邮箱"></el-table-column>
                            <el-table-column prop="status" label="使用状态" width="150">
                                <template slot-scope="scope">
                                    <el-tag v-show="scope.row.status === '1'">正常</el-tag>
                                    <el-tag v-show="scope.row.status === '0'" type="warning">冻结</el-tag>
                                    <el-tag v-show="scope.row.status === '2'" type="danger">删除</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="备注"></el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" @click="handleUserEdit(scope.$index, scope.row)">编辑</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 新增部门 -->
        <el-dialog title="添加部门" :visible.sync="insertDeptVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="deptRules" :model="deptForm" label-width="100px">
                <el-form-item label="选择部门">
                    <el-select v-model="deptForm.parentId" clearable placeholder="请选择部门">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="deptForm.name"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="deptForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="deptForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertDeptVisible = false">取 消</el-button>
                <el-button type="primary" @click="deptInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改部门 -->
        <el-dialog title="修改部门" :visible.sync="editDeptVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="deptRules" :model="deptForm" label-width="100px">
                <el-form-item label="选择部门">
                    <el-select v-model="deptForm.parentId" clearable placeholder="请选择部门">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="deptForm.name"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="deptForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="deptForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDeptVisible = false">取 消</el-button>
                <el-button type="primary" @click="deptEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除部门 -->
        <el-dialog title="删除部门" :visible.sync="deleteDeptVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDeptVisible = false">取 消</el-button>
                <el-button type="primary" @click="deptDelete">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增用户 -->
        <!-- <el-dialog title="添加用户信息" :visible.sync="insertUserVisible" width="35%">
            <el-form ref="form" label-position="right" :rules="userRules" :model="userForm" label-width="100px">
                <el-form-item label="选择部门" prop="deptId">
                    <el-select v-model="userForm.deptId" clearable placeholder="请选择部门">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" placeholder="输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="userForm.telephone" placeholder="输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="userForm.mail" placeholder="输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="userForm.status" size="small">
                        <el-radio-button label="1" border>正常</el-radio-button>
                        <el-radio-button label="0" border>冻结</el-radio-button>
                        <el-radio-button label="2" border>删除</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="userForm.remark" placeholder="输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertDeviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="userInsert('form')">确 定</el-button>
            </span>
        </el-dialog> -->

        <!-- 修改用户 -->
        <el-dialog title="修改用户信息" :visible.sync="updateUserVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="userRules" :model="userForm" label-width="100px">
                <el-form-item label="选择部门" prop="deptId">
                    <el-select v-model="userForm.deptId" clearable placeholder="请选择部门">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="userForm.username" placeholder="输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="telephone">
                    <el-input v-model="userForm.telephone" placeholder="输入手机号" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="userForm.mail" placeholder="输入邮箱" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="userForm.status" size="small">
                        <el-radio-button label="1" border>正常</el-radio-button>
                        <el-radio-button label="0" border>冻结</el-radio-button>
                        <el-radio-button label="2" border>删除</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="userForm.remark" placeholder="输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateUserVisible = false">取 消</el-button>
                <el-button type="primary" @click="userUpdate('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            deptTree: [],
            tableData: [],
            options: [],
            pageNum: 1,
            pageSize: 10, 
            total: 0,
            insertDeptVisible: false,
            editDeptVisible: false,
            deleteDeptVisible: false,
            insertUserVisible: false,
            updateUserVisible: false,
            idx: -1,
            deptForm: {
                id: '',
                parentId: '',
                name: '',
                seq: 1,
                remark: ''
            },
            userForm: {
                id: '',
                deptId: '',
                username: '',
                telephone: '',
                mail: '',
                status: '1',
                remark: ''
            },
            deptRules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            userRules: {
                deptId: [
                    { required: true, message: '请选择部门', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' }
                ],
                brand: [
                    { required: true, message: '请输入品牌', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                mail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.loadDeptTree()
        this.loadUserListByDeptId(0)
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.status = d.status.toString()
                return d;
            })
        }
    },
    methods: {
        // 加载部门树
        loadDeptTree() {
            this.$axios('/sys/dept/tree.json').then((res) => {
                if (res.data.success) {
                    // 获取部门树
                    this.deptTree = res.data.data

                    // 递归渲染部门树选择列表
                    this.options = []
                    this.recursiveRenderDeptSelect(this.deptTree, 1)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 递归渲染部门树选择列表
        recursiveRenderDeptSelect(deptList, level) {
            level = level | 0
            if (deptList && deptList.length > 0) {
                _.forEach(deptList, (dept, index) => {
                    var blank = ''
                    if (level > 1) {
                        for (var j = 3; j <= level; j++) {
                            blank += '..'
                        }
                        blank += '∟'
                    }
                    this.options.push({
                        value: dept.id,
                        label: blank + dept.label,
                    })
                    if (dept.children && dept.children.length > 0) {
                        this.recursiveRenderDeptSelect(dept.children, level + 1);
                    }
                })
            }
        },
        handleDeptInsert() {
            this.insertDeptVisible = true
            this.deptForm = {
                id: '',
                parentId: '',
                name: '',
                seq: 0,
                remark: ''
            }
        },
        deptInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        name: this.deptForm.name,
                        parentId: this.deptForm.parentId ? this.deptForm.parentId : 0,
                        seq: this.deptForm.seq,
                        remark: this.deptForm.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/dept/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertDeptVisible = false
                            this.$message.success(`部门信息《 ${this.deptForm.name} 》添加成功`)
                            this.loadDeptTree()
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
        handleDeptEdit(data) {
            this.deptForm = {
                id: data.id,
                parentId: data.parentId == 0 ? '' : data.parentId,
                name: data.name,
                seq: data.seq,
                remark: data.remark
            }
            this.editDeptVisible = true
        },
        deptEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.deptForm.id,
                        name: this.deptForm.name,
                        parentId: this.deptForm.parentId ? this.deptForm.parentId : 0,
                        seq: this.deptForm.seq,
                        remark: this.deptForm.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/dept/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editDeptVisible = false
                            this.$message.success(`部门信息《 ${this.deptForm.name} 》更新成功`)
                            this.loadDeptTree()
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
        handleDeptDelete(data) {
            this.deptForm = {
                id: data.id
            }
            this.deleteDeptVisible = true
        },
        deptDelete() {
            let postData = this.$qs.stringify({
                deptId: this.deptForm.id
            })
            this.$axios({
                method: 'post',
                url: '/sys/dept/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success(`部门删除成功`)
                    this.deleteDeptVisible = false
                    this.loadDeptTree()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteDeptVisible = false
                }
            })
        },

        handleNodeClick(data) {
            this.userForm.deptId = data.id
            this.loadUserListByDeptId(data.id)
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.loadUserListByDeptId(this.userForm.deptId)
        },
        loadUserListByDeptId(deptId) {
            let postData = this.$qs.stringify({
                deptId: deptId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/sys/user/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    var page = res.data.data
                    this.tableData = page.list
                    this.total = page.total

                    // 如果deptId为0，说明用户没有分配部门信息
                    if (this.total > 0 && deptId == 0) {
                        this.$message.info(` 存在新用户，没有分配部门，请及时分配 `)
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // handleUserInsert() {
        //     this.insertUserVisible = true
        //     this.userForm = {
        //         deptId: this.userForm.deptId,
        //         username: '',
        //         telephone: '',
        //         mail: '',
        //         status: '1',
        //         remark: ''
        //     }
        // },
        // userInsert(form) {
        //     this.$refs[form].validate((valid) => {
        //         if (valid) {
        //             let postData = this.$qs.stringify({
        //                 deptId: this.userForm.deptId,
        //                 username: this.userForm.username,
        //                 telephone: this.userForm.telephone,
        //                 mail: this.userForm.mail,
        //                 status: this.userForm.status,
        //                 remark: this.userForm.remark
        //             })
        //             this.$axios({
        //                 method: 'post',
        //                 url: '/sys/user/save.json',
        //                 data: postData
        //             }).then((res)=>{
        //                 if (res.data.success) {
        //                     this.insertUserVisible = false
        //                     this.$message.success(`用户《 ${this.userForm.username} 》添加成功`)
        //                     this.loadUserListByDeptId(this.userForm.deptId)
        //                 } else {
        //                     this.$message.error(` ${res.data.msg} `)
        //                 }
        //             })
        //         } else {
        //             this.$message.error(` 字段填写不完整 `)
        //             return false;
        //         }
        //     })
        // },
        handleUserEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.userForm = {
                id: item.id,
                deptId: item.deptId == 0 ? '' : item.deptId,
                username: item.username,
                telephone: item.telephone,
                mail: item.mail,
                status: item.status,
                remark: item.remark
            }
            this.updateUserVisible = true
        },
        userUpdate(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.userForm.id,
                        deptId: this.userForm.deptId,
                        username: this.userForm.username,
                        password: 'password',
                        telephone: this.userForm.telephone,
                        mail: this.userForm.mail,
                        status: this.userForm.status,
                        remark: this.userForm.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/user/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.updateUserVisible = false
                            this.$message.success(`用户《 ${this.userForm.username} 》修改成功`)
                            this.loadUserListByDeptId(this.userForm.deptId)
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
    }
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.red{
    color: #ff0000;
}
.table{
    width: 100%;
    font-size: 14px;
}
.el-tree-node__content {
    padding: 10px 0px;
}
</style>
