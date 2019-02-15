// 值班提醒

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-bell"></i> 值班管理</el-breadcrumb-item>
                <el-breadcrumb-item>值班提醒</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="12">
                <el-col :span="6">
                    <!-- 提醒类型树 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>提醒类型</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleTypeInsert()">添加分类</el-button>
                        </div>
                        <el-tree :data="typeTree" @node-click="handleNodeClick"
                        :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleTypeEdit(data)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleTypeDelete(data)"></el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <!-- 提醒列表 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>提醒列表</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleRemindInsert()">新建提醒</el-button>
                        </div>
                        <el-table :data="remindList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                            <el-table-column width="40">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.status" @change="changeStatus(scope.row)"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <div class="todo-item">
                                        <span :class="{'todo-item-del': scope.row.status, 'el-60': true}">{{scope.row.title}}</span>
                                        <span style="float: right">提醒时间：{{scope.row.time}}</span>
                                        <span style="float: right; margin-right: 30px;">
                                            <el-tag type="success" v-if="scope.row.status === 0">未提醒</el-tag>
                                            <el-tag type="info" v-if="scope.row.status === 1">已提醒</el-tag>
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template slot-scope="scope">
                                    <span>
                                        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleRemindEdit(scope.row)"></el-button>
                                        <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleRemindDelete(scope.row)"></el-button>
                                    </span>
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

        <!-- 新增提醒类型 -->
        <el-dialog title="新增提醒类型" :visible.sync="insertTypeVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="typeRules" :model="typeForm" label-width="100px">
                <el-form-item label="类型名称" prop="title">
                    <el-input v-model="typeForm.title"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="typeForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="typeForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="typeInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改提醒类型 -->
        <el-dialog title="修改提醒类型" :visible.sync="editTypeVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="typeRules" :model="typeForm" label-width="100px">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="typeForm.title"></el-input>
                </el-form-item>
                <el-form-item label="展示顺序" prop="seq">
                    <el-input-number v-model="typeForm.seq" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="typeForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="typeEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提醒类型 -->
        <el-dialog title="删除提醒类型" :visible.sync="deleteTypeVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="typeDelete">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新建提醒 -->
        <el-dialog title="新建提醒" :visible.sync="insertRemindVisible" width="35%">
            <el-form ref="form" label-position="right" :rules="remindRules" :model="remindForm" label-width="100px">
                <el-form-item label="选择分类" prop="typeId">
                    <el-select v-model="remindForm.typeId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提醒事项" prop="reminder">
                    <el-input v-model="remindForm.reminder" placeholder="输入提醒事项"></el-input>
                </el-form-item>
                <el-form-item label="提醒时间" prop="remindTime">
                    <el-date-picker v-model="remindForm.remindTime" format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertRemindVisible = false">取 消</el-button>
                <el-button type="primary" @click="remindInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改提醒 -->
        <el-dialog title="修改提醒" :visible.sync="updateRemindVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="remindRules" :model="remindForm" label-width="100px">
                <el-form-item label="选择分类" prop="typeId">
                    <el-select v-model="remindForm.typeId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提醒事项" prop="reminder">
                    <el-input v-model="remindForm.reminder" placeholder="输入提醒事项"></el-input>
                </el-form-item>
                <el-form-item label="提醒时间" prop="remindTime">
                    <el-date-picker v-model="remindForm.remindTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="remindForm.status" size="small">
                        <el-radio label="1" border>已提醒</el-radio>
                        <el-radio label="0" border>未提醒</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateRemindVisible = false">取 消</el-button>
                <el-button type="primary" @click="remindUpdate('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteRemindVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRemindVisible = false">取 消</el-button>
                <el-button type="primary" @click="remindDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
        return {
            typeTree: [],
            remindList: [],
            options: [],
            pageNum: 1,
            pageSize: 10, 
            total: 0,
            insertTypeVisible: false,
            editTypeVisible: false,
            deleteTypeVisible: false,
            insertRemindVisible: false,
            updateRemindVisible: false,
            deleteRemindVisible: false,
            selectTypeId: '',
            del_id: '',
            typeForm: {
                id: '',
                title: '',
                seq: 1,
                status: '1'
            },
            remindForm: {
                id: '',
                typeId: '',
                reminder: '',
                remindTime: '',
                status: '1'
            },
            typeRules: {
                title: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                ]
            },
            remindRules: {
                typeId: [
                    { required: true, message: '请选择提醒类型', trigger: 'blur' }
                ],
                reminder: [
                    { required: true, message: '请输入提醒事项', trigger: 'blur' }
                ],
                remindTime: [
                    { required: true, message: '请选择提醒时间', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.loadTypeTree()
        this.loadRemindListByType()
    },
    methods: {
        loadTypeTree() {
            this.$axios('/remindType/list.json').then((res) => {
                this.typeTree = res.data.data
                if (this.typeTree && this.typeTree.length > 0) {
                    _.forEach(this.typeTree, (type, index) => {
                        type.label = type.title
                    })
                }

                // 渲染提醒类型选择列表
                this.options = []
                this.loadRemindTypeSelect(this.typeTree)
            })
        },
        // 渲染提醒类型选择列表
        loadRemindTypeSelect(typeList) {
            if (typeList && typeList.length > 0) {
                _.forEach(typeList, (type, index) => {
                    this.options.push({
                        value: type.id,
                        label: type.title,
                    })
                })
            }
        },
        handleTypeInsert() {
            this.insertTypeVisible = true
            this.typeForm = {
                id: '',
                title: '',
                seq: 1,
                status: '1'
            }
        },
        typeInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        title: this.typeForm.title,
                        seq: this.typeForm.seq,
                        status: 1
                    })
                    this.$axios({
                        method: 'post',
                        url: '/remindType/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertTypeVisible = false
                            this.$message.success(`提醒类型《 ${this.typeForm.title} 》添加成功`)
                            this.loadTypeTree()
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
        handleTypeEdit(data) {
            this.typeForm = {
                id: data.id,
                title: data.label,
                seq: data.seq,
                status: data.status.toString()
            }
            this.editTypeVisible = true
        },
        typeEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.typeForm.id,
                        title: this.typeForm.title,
                        seq: this.typeForm.seq,
                        status: this.typeForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/remindType/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editTypeVisible = false
                            this.$message.success(`提醒类型《 ${this.typeForm.title} 》更新成功`)
                            this.loadTypeTree()
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
        handleTypeDelete(data) {
            this.typeForm = {
                id: data.id
            }
            this.deleteTypeVisible = true
        },
        typeDelete() {
            let postData = this.$qs.stringify({
                typeId: this.typeForm.id
            })
            this.$axios({
                method: 'post',
                url: '/remindType/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success(`提醒类型删除成功`)
                    this.deleteTypeVisible = false
                    this.loadTypeTree()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteTypeVisible = false
                }
            })
        },
        handleNodeClick(data) {
            this.selectTypeId = data.id
            this.remindForm.typeId = data.id
            this.loadRemindListByType()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.loadRemindListByType()
        },
        loadRemindListByType() {
            let postData = this.$qs.stringify({
                typeId: this.selectTypeId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/remind/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    var page = res.data.data
                    console.log(page)
                    this.total = page.total
                    this.remindList = []

                    _.forEach(page.list, (remind, index) => {
                        var option = remind
                        option.title = remind.reminder
                        option.time = this.$moment(remind.remindTime).format('YYYY-MM-DD HH:mm')
                        this.remindList.push(option)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },

        changeStatus(row) {
            let postData = this.$qs.stringify({
                id: row.id,
                status: row.status ? 1 : 0
            })
            this.$axios({
                method: 'post',
                url: '/remind/update_status.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.loadRemindListByType()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleRemindInsert() {
            this.insertRemindVisible = true
            this.remindForm = {
                typeId: this.remindForm.typeId,
                reminder: '',
                remindTime: '',
                status: '1'
            }
        },
        remindInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        typeId: this.remindForm.typeId,
                        reminder: this.remindForm.reminder,
                        remindTime: this.remindForm.remindTime
                    })
                    this.$axios({
                        method: 'post',
                        url: '/remind/save.json',
                        data: postData
                    }).then((res) => {
                        if (res.data.success) {
                            this.insertRemindVisible = false
                            this.$message.success(`提醒事项添加成功`)
                            this.loadRemindListByType()
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
        handleRemindEdit(row) {
            this.remindForm = {
                id: row.id,
                typeId: row.typeId,
                reminder: row.reminder,
                remindTime: row.remindTime,
                status: row.status.toString()
            }
            this.updateRemindVisible = true
        },
        remindUpdate(form) {
            console.log(this.remindForm)
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.remindForm.id,
                        typeId: this.remindForm.typeId,
                        reminder: this.remindForm.reminder,
                        remindTime: this.remindForm.remindTime,
                        status: this.remindForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/remind/update.json',
                        data: postData
                    }).then((res) => {
                        if (res.data.success) {
                            this.updateRemindVisible = false
                            this.$message.success(`提醒事项修改成功`)
                            this.loadRemindListByType()
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
        handleRemindDelete(row) {
            this.del_id = row.id
            this.deleteRemindVisible = true
        },
        remindDelete() {
            let postData = this.$qs.stringify({
                remindId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/remind/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$message.success(`设备删除成功`)
                    this.deleteRemindVisible = false
                    this.loadRemindListByType()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
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
.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.el-60 {
    display: inline-block;
    width: 60%;
}
</style>
