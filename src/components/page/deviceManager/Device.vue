// 设备管理 -> 设备信息

<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row :gutter="12">
                <el-col :span="6">
                    <!-- 设备类别树 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>设备分类</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleCategoryInsert()">添加分类</el-button>
                        </div>
                        <el-tree :data="categoryTree" :props="defaultProps" @node-click="handleNodeClick"
                        :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" icon="el-icon-edit" size="mini" @click="handleCategoryEdit(data)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" size="mini" @click="handleCategoryDelete(data)"></el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-col>
                <el-col :span="18">
                    <!-- 设备列表 -->
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>设备列表</span>
                            <el-button type="primary" style="float: right" icon="el-icon-lx-add" size="mini" @click="handleDeviceInsert()">添加设备</el-button>
                        </div>
                        <el-table border :data="data" class="table" ref="multipleTable">
                            <el-table-column prop="id" label="ID"></el-table-column>
                            <el-table-column prop="name" label="设备名称" width="200"></el-table-column>
                            <el-table-column prop="brand" label="品牌"></el-table-column>
                            <el-table-column prop="model" label="型号"></el-table-column>
                            <el-table-column prop="serial" label="序列号" width="150"></el-table-column>
                            <el-table-column prop="area" label="存放地"></el-table-column>
                            <el-table-column prop="buyTime" label="购买日期" width="150"></el-table-column>
                            <el-table-column prop="startTime" label="启用日期" width="150"></el-table-column>
                            <el-table-column prop="status" label="使用状态">
                                <template slot-scope="scope">
                                    <el-tag v-show="scope.row.status === '1'">在用</el-tag>
                                    <el-tag v-show="scope.row.status === '2'" type="success">备件</el-tag>
                                    <el-tag v-show="scope.row.status === '3'" type="info">故障</el-tag>
                                    <el-tag v-show="scope.row.status === '4'" type="warning">待报废</el-tag>
                                    <el-tag v-show="scope.row.status === '5'" type="danger">报废</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" @click="handleDeviceEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDeviceDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 新增设备类别 -->
        <el-dialog title="添加分类" :visible.sync="insertCategoryVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="categoryRules" :model="categoryForm" label-width="100px">
                <el-form-item label="选择分类" prop="parentId">
                    <el-select v-model="categoryForm.parentId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="title">
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
                <el-button @click="insertCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="categoryInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改设备类别 -->
        <el-dialog title="修改分类" :visible.sync="editCategoryVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="categoryRules" :model="categoryForm" label-width="100px">
                <el-form-item label="选择分类" prop="parentId">
                    <el-select v-model="categoryForm.parentId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="title">
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
                <el-button @click="editCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="categoryEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除设备类别 -->
        <el-dialog title="删除设备类别" :visible.sync="deleteCategoryVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteCategoryVisible = false">取 消</el-button>
                <el-button type="primary" @click="categoryDelete">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增设备 -->
        <el-dialog title="添加设备信息" :visible.sync="insertDeviceVisible" width="35%">
            <el-form ref="form" label-position="right" :rules="deviceRules" :model="deviceForm" label-width="100px">
                <el-form-item label="选择分类" prop="categoryId">
                    <el-select v-model="deviceForm.categoryId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="deviceForm.name" placeholder="输入设备名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="deviceForm.brand" placeholder="输入设备品牌"></el-input>
                </el-form-item>
                <el-form-item label="型号" prop="model">
                    <el-input v-model="deviceForm.model" placeholder="输入设备型号"></el-input>
                </el-form-item>
                 <el-form-item label="设备序列号" prop="serial">
                    <el-input v-model="deviceForm.serial" placeholder="输入设备序列号"></el-input>
                </el-form-item>
                <el-form-item label="存放地" prop="area">
                    <el-input v-model="deviceForm.area" placeholder="输入设备存放地"></el-input>
                </el-form-item>
                 <el-form-item label="购买日期" prop="buyTime">
                    <el-date-picker v-model="deviceForm.buyTime" value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择购买日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="启用日期" prop="startTime">
                    <el-date-picker v-model="deviceForm.startTime" value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择启用日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="deviceForm.status" size="small">
                        <el-radio-button label="1" border>在用</el-radio-button>
                        <el-radio-button label="2" border>备件</el-radio-button>
                        <el-radio-button label="3" border>故障</el-radio-button>
                        <el-radio-button label="4" border>待报废</el-radio-button>
                        <el-radio-button label="5" border>报废</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertDeviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="deviceInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改设备 -->
        <el-dialog title="修改设备信息" :visible.sync="updateDeviceVisible" width="33%">
            <el-form ref="form" label-position="right" :rules="deviceRules" :model="deviceForm" label-width="100px">
                <el-form-item label="选择分类" prop="categoryId">
                    <el-select v-model="deviceForm.categoryId" clearable placeholder="请选择设备类别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="deviceForm.name" placeholder="输入设备名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand">
                    <el-input v-model="deviceForm.brand" placeholder="输入设备品牌"></el-input>
                </el-form-item>
                <el-form-item label="型号" prop="model">
                    <el-input v-model="deviceForm.model" placeholder="输入设备型号"></el-input>
                </el-form-item>
                 <el-form-item label="设备序列号" prop="serial">
                    <el-input v-model="deviceForm.serial" placeholder="输入设备序列号"></el-input>
                </el-form-item>
                <el-form-item label="存放地" prop="area">
                    <el-input v-model="deviceForm.area" placeholder="输入设备存放地"></el-input>
                </el-form-item>
                 <el-form-item label="购买日期" prop="buyTime">
                    <el-date-picker v-model="deviceForm.buyTime" value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择购买日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="启用日期" prop="startTime">
                    <el-date-picker v-model="deviceForm.startTime" value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择启用日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="deviceForm.status" size="small">
                        <el-radio-button label="1" border>在用</el-radio-button>
                        <el-radio-button label="2" border>备件</el-radio-button>
                        <el-radio-button label="3" border>故障</el-radio-button>
                        <el-radio-button label="4" border>待报废</el-radio-button>
                        <el-radio-button label="5" border>报废</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDeviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="deviceUpdate('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delDeviceVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delDeviceVisible = false">取 消</el-button>
                <el-button type="primary" @click="deviceDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

const keyMap = {  
    title: 'label',
    deviceCategoryLevelDTOList: 'children'
}
export default {
    data() {
        return {
            categoryTree: [],
            tableData: [],
            options: [],
            pageNum: 1,
            pageSize: 10, 
            total: 0,
            insertCategoryVisible: false,
            editCategoryVisible: false,
            deleteCategoryVisible: false,
            insertDeviceVisible: false,
            updateDeviceVisible: false,
            delDeviceVisible: false,
            idx: -1,
            categoryForm: {
                id: '',
                parentId: '',
                title: '',
                seq: 1,
                status: '1'
            },
            deviceForm: {
                id: '',
                categoryId: '',
                name: '',
                brand: '',
                model: '',
                serial: '',
                area: '',
                buyTime: '',
                startTime: '',
                status: '1'
            },
            categoryRules: {
                categoryId: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            deviceRules: {
                categoryId: [
                    { required: true, message: '请选择设备分类', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' }
                ],
                brand: [
                    { required: true, message: '请输入品牌', trigger: 'blur' }
                ],
                model: [
                    { required: true, message: '请输入型号', trigger: 'blur' }
                ],
                serial: [
                    { required: true, message: '请输入设备序列号', trigger: 'blur' }
                ],
                area: [
                    { required: true, message: '请输入设备存放地', trigger: 'blur' }
                ],
                buyTime: [
                    { required: true, message: '请选择设备购买日期', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择设备启用日期', trigger: 'blur' }
                ]
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created() {
        this.loadCategoryTree()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.status = d.status.toString()
                d.startTime = d.startTime.substr(0, d.startTime.indexOf(' '))
                d.buyTime = d.buyTime.substr(0, d.buyTime.indexOf(' '))
                return d;
            })
        }
    },
    methods: {
        loadCategoryTree() {
            this.$axios('/deviceCategory/tree.json').then((res) => {
                this.categoryTree = res.data.data

                // 递归渲染设备类别树选择列表
                this.options = []
                this.recursiveRenderDeviceCategorySelect(this.categoryTree, 1)
            })
        },
        // 递归渲染设备类别树选择列表
        recursiveRenderDeviceCategorySelect(categoryList, level) {
            level = level | 0
            if (categoryList && categoryList.length > 0) {
                _.forEach(categoryList, (category, index) => {
                    var blank = ''
                    if (level > 1) {
                        for (var j = 3; j <= level; j++) {
                            blank += '..'
                        }
                        blank += '∟'
                    }
                    this.options.push({
                        value: category.id,
                        label: blank + category.label,
                    })
                    if (category.children && category.children.length > 0) {
                        this.recursiveRenderDeviceCategorySelect(category.children, level + 1);
                    }
                })
            }
        },
        handleCategoryInsert() {
            this.insertCategoryVisible = true
            this.categoryForm = {
                id: '',
                categoryId: '',
                title: '',
                seq: 1,
                status: '1'
            }
        },
        categoryInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        parentId: this.categoryForm.parentId,
                        title: this.categoryForm.title,
                        seq: this.categoryForm.seq,
                        status: this.categoryForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceCategory/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertCategoryVisible = false
                            this.$message.success(`设备类别《 ${this.categoryForm.title} 》添加成功`)
                            this.loadCategoryTree()
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
        handleCategoryEdit(data) {
            this.categoryForm = {
                id: data.id,
                parentId: data.parentId,
                title: data.label,
                seq: data.seq,
                status: data.status.toString()
            }
            this.editCategoryVisible = true
        },
        categoryEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.categoryForm.id,
                        parentId: this.categoryForm.parentId,
                        title: this.categoryForm.title,
                        seq: this.categoryForm.seq,
                        status: this.categoryForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceCategory/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editCategoryVisible = false
                            this.$message.success(`设备类别《 ${this.categoryForm.title} 》更新成功`)
                            this.loadCategoryTree()
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
        handleCategoryDelete(data) {
            this.categoryForm = {
                id: data.id
            }
            this.deleteCategoryVisible = true
        },
        categoryDelete() {
            let postData = this.$qs.stringify({
                categoryId: this.categoryForm.id
            })
            this.$axios({
                method: 'post',
                url: '/deviceCategory/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success(`设备类别删除成功`)
                    this.deleteCategoryVisible = false
                    this.loadCategoryTree()
                } else {
                    this.$message.error(` ${res.data.msg} `)
                    this.deleteCategoryVisible = false
                }
            })
        },
        handleNodeClick(data) {
            this.deviceForm.categoryId = data.id
            this.loadDeviceListByCategoryId(data.id)
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.loadDeviceListByCategoryId(this.deviceForm.categoryId)
        },
        loadDeviceListByCategoryId(categoryId) {
            let postData = this.$qs.stringify({
                categoryId: categoryId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/deviceInfo/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    var page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },

        handleDeviceInsert() {
            this.insertDeviceVisible = true
            this.deviceForm = {
                categoryId: this.deviceForm.categoryId,
                name: '',
                brand: '',
                model: '',
                serial: '',
                area: '',
                buyTime: '',
                startTime: '',
                status: '1'
            }
        },
        deviceInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        categoryId: this.deviceForm.categoryId,
                        name: this.deviceForm.name,
                        brand: this.deviceForm.brand,
                        model: this.deviceForm.model,
                        serial: this.deviceForm.serial,
                        area: this.deviceForm.area,
                        buyTime: this.deviceForm.buyTime,
                        startTime: this.deviceForm.startTime,
                        status: this.deviceForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceInfo/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertDeviceVisible = false
                            this.$message.success(`设备《 ${this.deviceForm.name} 》添加成功`)
                            this.loadDeviceListByCategoryId(this.deviceForm.categoryId)
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
        handleDeviceEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.deviceForm = {
                id: item.id,
                categoryId: item.categoryId,
                name: item.name,
                brand: item.brand,
                model: item.model,
                serial: item.serial,
                area: item.area,
                buyTime: item.buyTime,
                startTime: item.startTime,
                status: item.status
            }
            this.updateDeviceVisible = true
        },
        deviceUpdate(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.deviceForm.id,
                        categoryId: this.deviceForm.categoryId,
                        name: this.deviceForm.name,
                        brand: this.deviceForm.brand,
                        model: this.deviceForm.model,
                        serial: this.deviceForm.serial,
                        area: this.deviceForm.area,
                        buyTime: this.deviceForm.buyTime,
                        startTime: this.deviceForm.startTime,
                        status: this.deviceForm.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceInfo/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.updateDeviceVisible = false
                            this.$message.success(`设备《 ${this.deviceForm.name} 》修改成功`)
                            this.loadDeviceListByCategoryId(this.deviceForm.categoryId)
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
        handleDeviceDelete(index, row) {
            this.idx = index
            this.deviceForm = {
                id: row.id
            }
            this.delDeviceVisible = true
        },
        deviceDelete() {
            let postData = this.$qs.stringify({
                deviceId: this.deviceForm.id
            })
            this.$axios({
                method: 'post',
                url: '/deviceInfo/delete.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.tableData.splice(this.idx, 1)
                    this.$message.success(`设备删除成功`)
                    this.delDeviceVisible = false
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
</style>
