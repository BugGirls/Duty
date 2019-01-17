// 角色管理

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="12">
                <el-col :span="6">
                    <!-- 角色列表 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>角色列表</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleRoleInsert()">新增角色</el-button>
                        </div>
                        <el-tree :data="roleList" @node-click="handleNodeClick" :default-expand-all="true" 
                        :highlight-current="true" :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleRoleEdit(data)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleRoleDelete(data)"></el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <el-card shadow="hover">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="角色-权限" name="acl">
                                <el-tree :data="aclTree" :show-checkbox="true" ref="tree" node-key="id"
                                :highlight-current="true" :render-content="renderContent"
                                :default-expanded-keys="aclDefaultExpanded" :default-checked-keys="aclDefaultChecked">
                                </el-tree>
                                <el-button v-show="aclTree.length > 0" @click="aclsChange" type="primary" icon="el-icon-check" size="mini" class="el-btn">保存</el-button>
                            </el-tab-pane>
                            <el-tab-pane label="角色-用户" name="user">
                                <el-transfer :data="userList" style="text-align: left; display: inline-block" v-model="userSelected"
                                    @change="usersChange" :titles="['用户[未选择]', '用户[已选择]']" :button-texts="['到左边', '到右边']">
                                </el-transfer>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 新增角色 -->
        <el-dialog title="新增角色" :visible.sync="insertRoleVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="roleRules" :model="roleForm" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="roleForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="roleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色 -->
        <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="roleRules" :model="roleForm" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="roleForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="roleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除角色 -->
        <el-dialog title="删除角色" :visible.sync="deleteRoleVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            roleId: '',
            roleList: [],
            aclTree: [],
            aclDefaultChecked: [],
            aclDefaultExpanded: [],
            userList: [],
            userSelected: [],
            insertRoleVisible: false,
            editRoleVisible: false,
            deleteRoleVisible: false,
            idx: -1,
            activeName: 'acl',
            roleForm: {
                id: '',
                name: '',
                status: '',
                remark: ''
            },
            roleRules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.loadRoleList()
    },
    methods: {
        // 加载角色列表
        loadRoleList() {
            this.$axios('/sys/role/list.json').then((res) => {
                if (res.data.success) {
                    this.roleList = []
                    this.roleList = res.data.data
                    if (this.roleList && this.roleList.length > 0) {
                        _.forEach(this.roleList, (role, index) => {
                            role.label = role.name
                            role.status = role.status.toString()
                        })
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        handleRoleInsert() {
            this.insertRoleVisible = true
            this.roleForm = {
                id: '',
                name: '',
                status: '1',
                remark: ''
            }
        },
        roleInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        name: this.roleForm.name,
                        status: this.roleForm.status,
                        remark: this.roleForm.remark,
                        type: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/role/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertRoleVisible = false
                            this.$message.success(`角色《 ${this.roleForm.name} 》添加成功`)
                            this.loadRoleList()
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
        handleRoleEdit(data) {
            this.editRoleVisible = true
            this.roleForm = {
                id: data.id,
                name: data.name,
                status: data.status,
                remark: data.remark
            }
        },
        roleEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.roleForm.id,
                        name: this.roleForm.name,
                        status: this.roleForm.status,
                        remark: this.roleForm.remark,
                        type: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/sys/role/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editRoleVisible = false
                            this.$message.success(`角色《 ${this.roleForm.name} 》修改成功`)
                            this.loadRoleList()
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
        handleRoleDelete(data) {
            this.roleForm = {
                id: data.id
            }
            this.deleteRoleVisible = true
        },
        roleDelete() {
            let postData = this.$qs.stringify({
                roleId: this.roleForm.id
            })
            this.$axios({
                method: 'post',
                url: '/sys/role/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`角色删除成功`)
                    this.deleteRoleVisible = false
                    this.loadRoleList()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteRoleVisible = false
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        handleNodeClick(data) {
            this.roleId = data.id
            this.loadAclTreeByRoleId(data.id)
            this.loadUsersByRoleId(data.id)
        },

        // 角色-权限
        loadAclTreeByRoleId(roleId) {
            let postData = this.$qs.stringify({
                roleId: roleId
            })
            this.$axios({
                method: 'post',
                url: '/sys/role/roleTree.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    // 渲染权限树
                    this.aclTree = res.data.data

                    // 准备权限树 数据
                    this.aclDefaultChecked = []
                    this.aclDefaultExpanded = []
                    this.recursivePrepareTreeData(this.aclTree)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        // 准备权限树 数据
        recursivePrepareTreeData(aclModuleList) {
            if (aclModuleList && aclModuleList.length > 0) {
                // 是否被选中
                _.forEach(aclModuleList, (aclModule, index) => {
                    // 判断是否展开节点
                    let hasExpanded = false
                    // 处理权限点
                    if (aclModule.aclDTOList && aclModule.aclDTOList.length > 0) {
                        // 判断是否展开
                        _.forEach(aclModule.aclDTOList, acl => {
                            // 添加权限点
                            aclModule.children.push(acl)
                            // 判断是否被选中
                            if (acl.checked) {
                                hasExpanded = true
                                this.aclDefaultChecked.push(acl.id)
                            }
                        })
                    }
                    if (hasExpanded) {
                        this.aclDefaultExpanded.push(aclModule.id)
                    }
                    this.recursivePrepareTreeData(aclModule.children)
                })
            }
        },
        renderContent(h, { node, data, store }) {
            let icon = null
            if (data.aclDTOList) {
                icon = (<i class="el-icon-lx-file red"></i>)
            } else {
                icon = (<i class="el-icon-lx-text"></i>)
            }
            return (
                <span style="font-size: 14px; padding-right: 8px">
                    <span class="normalText">
                        {icon}
                        <span style="color: #333;"> {node.label} </span>
                    </span>
                </span>
            )
        },
        // 加载 角色-用户 信息
        loadUsersByRoleId(roleId) {
            let postData = this.$qs.stringify({
                roleId: roleId
            })
            this.$axios({
                method: 'post',
                url: '/sys/role/users.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    // 所有用户数据
                    this.userList = res.data.data.userList
                    if (this.userList && this.userList.length > 0) {
                        _.forEach(this.userList, (user, index) => {
                            user.key = user.id
                            user.label = user.username
                        })
                    }

                    // 已选择的用户
                    let selected = res.data.data.selected
                    this.userSelected = []
                    if (selected && selected.length > 0) {
                        _.forEach(selected, (user, index) => {
                            this.userSelected.push(user.id)
                        })
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        // 修改角色-用户信息
        usersChange(value, direction, movedKeys) {
            let postData = this.$qs.stringify({
                roleId: this.roleId,
                userIds: this.userSelected.join(',')
            })
            this.$axios({
                method: 'post',
                url: '/sys/role/changeUsers.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.loadUsersByRoleId(this.roleId)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        aclsChange() {
            let aclIdList = this.$refs.tree.getCheckedKeys(true)
            let postData = this.$qs.stringify({
                roleId: this.roleId,
                aclIds: aclIdList.join(',')
            })
            this.$axios({
                method: 'post',
                url: '/sys/role/changeAcls.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.loadAclTreeByRoleId(this.roleId)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
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
.el-tree-node__content {
    padding: 10px 0px;
}
.red{
    color: #ff0000;
}
.el-btn {
    margin-top: 10px;
    margin-left: 10px;
}
</style>
