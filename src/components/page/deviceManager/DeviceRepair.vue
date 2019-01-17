// 设备管理 -> 设备维修

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备维修</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">新增维修信息</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="170"></el-table-column>
                <el-table-column prop="categoryName" label="设备类别" width="200"></el-table-column>
                <el-table-column prop="deviceName" label="维护的设备" width="150"></el-table-column>
                <el-table-column prop="breakdownTime" label="故障时间" width="200"></el-table-column>
                <el-table-column prop="repairTime" label="维修时间" width="200"></el-table-column>
                <el-table-column prop="content" label="维修内容" width="200"></el-table-column>
                <el-table-column prop="testSituation" label="测试情况" width="200">
                    <template slot-scope="scope">
                        <label v-show="scope.row.testSituation === ''">暂无</label>
                        <label v-show="scope.row.testSituation !== ''">{{scope.row.testSituation}}</label>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">有效</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="danger">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
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
        <el-dialog title="新增维护信息" :visible.sync="insertVisible" width="40%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="150px">
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="form.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceId" v-show="deviceInfos.length > 0">
                    <el-radio-group v-model="form.deviceId" size="small">
                        <el-radio border v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="故障时间" prop="breakdownTime">
                    <el-date-picker v-model="form.breakdownTime" type="datetime" placeholder="选择故障时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="维修时间" prop="repairTime">
                    <el-date-picker v-model="form.repairTime" type="datetime" placeholder="选择维修时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="故障说明" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="测试情况" prop="testSituation">
                    <el-input type="textarea" v-model="form.testSituation"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="insert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑调度信息" :visible.sync="editVisible" width="36%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="form.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceId" v-show="deviceInfos.length > 0">
                    <el-radio-group v-model="form.deviceId" size="small">
                        <el-radio border v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="故障时间" prop="breakdownTime">
                    <el-date-picker v-model="form.breakdownTime" type="datetime" placeholder="选择故障时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="维修时间" prop="repairTime">
                    <el-date-picker v-model="form.repairTime" type="datetime" placeholder="选择维修时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="故障说明" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="测试情况" prop="testSituation">
                    <el-input type="textarea" v-model="form.testSituation"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit('form')">确 定</el-button>
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
import _ from 'lodash'

export default {
    data() {
        return {
            tableData: [],
            categoryOptions: [],
            deviceInfos: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            idx: -1,
            del_id: '',
            form: {
                id: '',
                categoryId: '',
                deviceId: '',
                breakdownTime: '',
                repairTime: '',
                content: '',
                testSituation: '',
                status: '1'
            },
            rules: {
                categoryId: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
                deviceIds: [
                    { required: true, message: '请选择设备', trigger: 'blur' }
                ],
                breakdownTime: [
                    { required: true, message: '请选择故障时间', trigger: 'blur' }
                ],
                repairTime: [
                    { required: true, message: '请选择维修时间', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请填写维护内容', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.getData()
        this.getDeviceCategoryList()
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
        handleCurrentChange() {

        },
        getData() {
            this.$axios('/deviceRepair/page.json').then((res)=>{
                if (res.data.success) {
                    let page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        getDeviceCategoryList() {
            this.$axios('/deviceCategory/tree.json').then((res) => {
                if (res.data.success) {
                    var categoryTree = res.data.data
                    this.categoryOptions = []
                    this.recursiveRenderDeviceCategorySelect(categoryTree, 1)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
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
                    let option = {
                        value: category.id,
                        label: blank + category.title,
                    }
                    this.categoryOptions.push(option)
                    if (category.children && category.children.length > 0) {
                        this.recursiveRenderDeviceCategorySelect(category.children, level + 1);
                    }
                })
            }
        },
        cagegoryChange() {
            this.deviceInfos = []
            this.getDeviceByCategoryId()
        },
        getDeviceByCategoryId() {
            let postData = this.$qs.stringify({
                categoryId: this.form.categoryId
            })
            this.$axios({
                method: 'post',
                url: '/deviceInfo/list.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.deviceInfos = []
                    _.forEach(res.data.data, (device, index) => {
                        let option = {
                            value: device.id,
                            label: device.name
                        }
                        this.deviceInfos.push(option)
                    })
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        handleInsert() {
            this.insertVisible = true
            this.form = {
                id: '',
                categoryId: '',
                deviceId: '',
                breakdownTime: '',
                repairTime: '',
                content: '',
                testSituation: '',
                status: '1'
            }
            this.deviceInfos = []
        },
        insert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        categoryId: this.form.categoryId,
                        deviceId: this.form.deviceId,
                        breakdownTime: this.form.breakdownTime,
                        repairTime: this.form.repairTime,
                        content: this.form.content,
                        testSituation: this.form.testSituation,
                        status: this.form.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceRepair/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`设备维修信息添加成功`)
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
        handleEdit(index, row) {
            this.idx = index
            const item = this.tableData[index]
            this.form = {
                id: item.id,
                categoryId: item.categoryId,
                deviceId: item.deviceId,
                breakdownTime: item.breakdownTime,
                repairTime: item.repairTime,
                content: item.content,
                testSituation: item.testSituation,
                status: item.status
            }
            this.getDeviceByCategoryId(item.categoryId)
            this.editVisible = true
        },
        edit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.form.id,
                        categoryId: this.form.categoryId,
                        deviceId: this.form.deviceId,
                        breakdownTime: this.form.breakdownTime,
                        repairTime: this.form.repairTime,
                        content: this.form.content,
                        testSituation: this.form.testSituation,
                        status: this.form.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceRepair/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`设备维修信息更新成功`)
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
        handleDelete(index, row) {
            this.idx = index
            this.del_id = row.id
            this.delVisible = true
        },
        deleteRow() {
            let postData = this.$qs.stringify({
                repairId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/deviceRepair/delete.json',
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

<style>
.handle-box {
    margin-bottom: 20px;
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
    width: 120px;
}
.el-table .cell {
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

