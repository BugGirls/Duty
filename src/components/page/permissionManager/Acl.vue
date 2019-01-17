// 权限管理

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="12">
                <el-col :span="6">
                    <!-- 权限模块树 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>模块分类</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleAclModuleInsert()">添加模块</el-button>
                        </div>
                        <el-tree :data="aclModuleTree" @node-click="handleNodeClick" :default-expand-all="true" 
                        :highlight-current="true" :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleAclModuleEdit(data)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleAclModuleDelete(data)"></el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <!-- 权限列表 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>权限列表</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleAclInsert()">添加权限</el-button>
                        </div>
                        <el-table border :data="data" class="table" ref="multipleTable">
                            <el-table-column prop="id" label="ID"></el-table-column>
                            <el-table-column prop="name" label="权限名称" width="150"></el-table-column>
                            <el-table-column prop="url" label="请求的URL" width="200"></el-table-column>
                            <el-table-column prop="type" label="类型">
                                <template slot-scope="scope">
                                    <el-tag v-show="scope.row.type === '1'">菜单</el-tag>
                                    <el-tag v-show="scope.row.type === '2'" type="success">按钮</el-tag>
                                    <el-tag v-show="scope.row.type === '3'" type="info">其他</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="seq" label="顺序"></el-table-column>
                            <el-table-column prop="remark" label="备注" width="100"></el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" @click="handleAclEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleAclDelete(scope.$index, scope.row)">删除</el-button>
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

        <!-- 新增权限模块 -->
        <el-dialog title="添加权限模块" :visible.sync="insertAclModuleVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="aclModuleRules" :model="aclModuleForm" label-width="100px">
                <el-form-item label="选择模块">
                    <el-select v-model="aclModuleForm.parentId" clearable placeholder="请选择分类">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="aclModuleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="aclModuleForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="aclModuleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertAclModuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclModuleInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改权限模块 -->
        <el-dialog title="修改权限模块" :visible.sync="editAclModuleVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="aclModuleRules" :model="aclModuleForm" label-width="100px">
                <el-form-item label="选择模块">
                    <el-select v-model="aclModuleForm.parentId" clearable placeholder="请选择权限模块">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="aclModuleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="aclModuleForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="aclModuleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAclModuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclModuleEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除权限模块 -->
        <el-dialog title="提示" :visible.sync="deleteAclModuleVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteAclModuleVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclModuleDelete">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增权限 -->
        <el-dialog title="添加权限信息" :visible.sync="insertAclVisible" width="36%">
            <el-form ref="form" label-position="right" :rules="aclRules" :model="aclForm" label-width="120px">
                <el-form-item label="选择权限模块" prop="aclModuleId">
                    <el-select v-model="aclForm.aclModuleId" clearable placeholder="请选择权限模块">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="aclForm.name" placeholder="输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="请求URL" prop="url">
                    <el-input v-model="aclForm.url" placeholder="输入请求URL"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="aclForm.type" size="small">
                        <el-radio-button label="1" border>菜单</el-radio-button>
                        <el-radio-button label="2" border>按钮</el-radio-button>
                        <el-radio-button label="3" border>其他</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="aclForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="aclForm.remark" placeholder="输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertAclVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改权限 -->
        <el-dialog title="修改权限信息" :visible.sync="updateAclVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="aclRules" :model="aclForm" label-width="120px">
                <el-form-item label="选择权限模块" prop="aclModuleId">
                    <el-select v-model="aclForm.aclModuleId" clearable placeholder="请选择权限模块">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="aclForm.name" placeholder="输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="请求URL" prop="url">
                    <el-input v-model="aclForm.url" placeholder="输入请求URL"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="aclForm.type" size="small">
                        <el-radio-button label="1" border>菜单</el-radio-button>
                        <el-radio-button label="2" border>按钮</el-radio-button>
                        <el-radio-button label="3" border>其他</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="aclForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="aclForm.remark" placeholder="输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateAclVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclUpdate('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除权限 -->
        <el-dialog title="提示" :visible.sync="deleteAclVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteAclVisible = false">取 消</el-button>
                <el-button type="primary" @click="aclDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            aclModuleTree: [],
            tableData: [],
            options: [],
            pageNum: 1,
            pageSize: 10, 
            total: 0,
            insertAclModuleVisible: false,
            editAclModuleVisible: false,
            deleteAclModuleVisible: false,
            insertAclVisible: false,
            updateAclVisible: false,
            deleteAclVisible: false,
            idx: -1,
            aclModuleForm: {
                id: '',
                name: '',
                parentId: '',
                seq: 1,
                remark: ''
            },
            aclForm: {
                id: '',
                aclModuleId: '',
                name: '',
                url: '',
                type: '',
                seq: 0,
                remark: ''
            },
            aclModuleRules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ]
            },
            aclRules: {
                aclModuleId: [
                    { required: true, message: '请选择权限模块', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入权限名称', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: '请输入请求URL', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择类型', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.loadAclModuleTree()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.type = d.type.toString()
                return d;
            })
        }
    },
    methods: {
        // 加载权限模块树
        loadAclModuleTree() {
            this.$axios('/sys/aclModule/tree.json').then((res) => {
                if (res.data.success) {
                    // 获取权限模块树
                    this.aclModuleTree = res.data.data

                    // 递归渲染权限模块树选择列表
                    this.options = []
                    this.recursiveRenderAclModuleSelect(this.aclModuleTree, 1)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        // 递归渲染权限模块树选择列表
        recursiveRenderAclModuleSelect(aclModuleList, level) {
            level = level | 0
            if (aclModuleList && aclModuleList.length > 0) {
                _.forEach(aclModuleList, (aclModule, index) => {
                    var blank = ''
                    if (level > 1) {
                        for (var j = 3; j <= level; j++) {
                            blank += '..'
                        }
                        blank += '∟'
                    }
                    this.options.push({
                        value: aclModule.id,
                        label: blank + aclModule.label
                    })
                    if (aclModule.children && aclModule.children.length > 0) {
                        this.recursiveRenderAclModuleSelect(aclModule.children, level + 1);
                    }
                })
            }
        },
        handleAclModuleInsert() {
            this.insertAclModuleVisible = true
            this.aclModuleForm = {
                id: '',
                parentId: '',
                name: '',
                seq: 0,
                remark: ''
            }
        },
        aclModuleInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        name: this.aclModuleForm.name,
                        parentId: this.aclModuleForm.parentId ? this.aclModuleForm.parentId : 0,
                        seq: this.aclModuleForm.seq,
                        remark: this.aclModuleForm.remark,
                        status: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/aclModule/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertAclModuleVisible = false
                            this.$message.success(`权限模块信息《 ${this.aclModuleForm.name} 》添加成功`)
                            this.loadAclModuleTree()
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
        handleAclModuleEdit(data) {
            this.aclModuleForm = {
                id: data.id,
                parentId: data.parentId == 0 ? '' : data.parentId,
                name: data.name,
                seq: data.seq,
                remark: data.remark
            }
            // this.defaultDept = data.parentId
            this.editAclModuleVisible = true
        },
        aclModuleEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.aclModuleForm.id,
                        name: this.aclModuleForm.name,
                        parentId: this.aclModuleForm.parentId ? this.aclModuleForm.parentId : 0,
                        seq: this.aclModuleForm.seq,
                        remark: this.aclModuleForm.remark,
                        status: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/aclModule/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editAclModuleVisible = false
                            this.$message.success(`权限模块信息《 ${this.aclModuleForm.name} 》更新成功`)
                            this.loadAclModuleTree()
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
        handleAclModuleDelete(data) {
            this.aclModuleForm = {
                id: data.id
            }
            this.deleteAclModuleVisible = true
        },
        aclModuleDelete() {
            let postData = this.$qs.stringify({
                aclModuleId: this.aclModuleForm.id
            })
            this.$axios({
                method: 'post',
                url: '/sys/aclModule/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`权限模块删除成功`)
                    this.deleteAclModuleVisible = false
                    this.loadAclModuleTree()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteAclModuleVisible = false
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        handleNodeClick(data) {
            this.aclForm.aclModuleId = data.id
            this.loadAclByAclModuleId(data.id)
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.loadAclByAclModuleId(this.aclModuleForm.parentId)
        },
        loadAclByAclModuleId(aclModuleId) {
            let postData = this.$qs.stringify({
                aclModuleId: aclModuleId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/sys/acl/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    console.log(res.data.data)
                    var page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },

        handleAclInsert() {
            this.insertAclVisible = true
            this.aclForm = {
                aclModuleId: this.aclForm.aclModuleId,
                name: '',
                url: '',
                type: '1',
                seq: 0,
                remark: ''
            }
        },
        aclInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        aclModuleId: this.aclForm.aclModuleId,
                        name: this.aclForm.name,
                        url: this.aclForm.url,
                        type: this.aclForm.type,
                        seq: this.aclForm.seq,
                        remark: this.aclForm.remark,
                        status: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/acl/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertAclVisible = false
                            this.$message.success(`权限《 ${this.aclForm.name} 》添加成功`)
                            this.loadAclByAclModuleId(this.aclForm.aclModuleId)
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
        handleAclEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.aclForm = {
                id: item.id,
                aclModuleId: item.aclModuleId,
                name: item.name,
                url: item.url,
                type: item.type,
                seq: item.seq,
                remark: item.remark
            }
            this.updateAclVisible = true
        },
        aclUpdate(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.aclForm.id,
                        aclModuleId: this.aclForm.aclModuleId,
                        name: this.aclForm.name,
                        url: this.aclForm.url,
                        type: this.aclForm.type,
                        seq: this.aclForm.seq,
                        remark: this.aclForm.remark,
                        status: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/acl/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.updateAclVisible = false
                            this.$message.success(`权限《 ${this.aclForm.name} 》修改成功`)
                            this.loadAclByAclModuleId(this.aclForm.aclModuleId)
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
        handleAclDelete(index, row) {
            this.idx = index
            this.aclForm = {
                id: row.id,
                aclModuleId: row.aclModuleId
            }
            this.deleteAclVisible = true
        },
        aclDelete() {
            let postData = this.$qs.stringify({
                aclId: this.aclForm.id
            })
            this.$axios({
                method: 'post',
                url: '/sys/acl/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success(`权限删除成功`)
                    this.deleteAclVisible = false
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteAclVisible = false
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        }
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
