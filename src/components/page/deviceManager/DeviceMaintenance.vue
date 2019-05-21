// 设备管理 -> 设备维护

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-record"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备维护</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">新增维护信息</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <!-- <el-table-column prop="id" label="ID" width="170"></el-table-column> -->
                <el-table-column prop="categoryName" label="设备类别"></el-table-column>
                <el-table-column prop="deviceNames" label="维护的设备">
                    <template slot-scope="scope">
                        <label v-show="scope.row.deviceNames === ''">暂无</label>
                        <label v-show="scope.row.deviceNames !== ''">{{scope.row.deviceNames}}</label>
                    </template>
                </el-table-column>
                <el-table-column prop="maintenanceTime" label="维护时间"></el-table-column>
                <el-table-column prop="content" label="维护内容"></el-table-column>
                <!-- <el-table-column prop="question" label="维护中遇到的问题" width="200">
                    <template slot-scope="scope">
                        <label v-show="scope.row.question === ''">暂无</label>
                        <label v-show="scope.row.question !== ''">{{scope.row.question}}</label>
                    </template>
                </el-table-column>
                <el-table-column prop="answer" label="问题的解决方法" width="200">
                    <template slot-scope="scope">
                        <label v-show="scope.row.answer === ''">暂无</label>
                        <label v-show="scope.row.answer !== ''">{{scope.row.answer}}</label>
                    </template>
                </el-table-column>
                <el-table-column prop="testSituation" label="测试情况" width="200">
                    <template slot-scope="scope">
                        <label v-show="scope.row.testSituation === ''">暂无</label>
                        <label v-show="scope.row.testSituation !== ''">{{scope.row.testSituation}}</label>
                    </template>
                </el-table-column> -->
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">有效</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="danger">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handleView(scope.$index, scope.row)">预览</el-button>
                        <el-button type="text" icon="el-icon-edit" :disabled="!scope.row.updateBtnEdit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="!scope.row.deleteBtnEdit" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 预览 -->
        <el-dialog title="预览" :visible.sync="viewVisible" width="33%">
            <el-form ref="form" label-position="right" :model="deviceMainDetail" label-width="150px">
                <el-form-item label="ID">
                    <el-alert :title="deviceMainDetail.id" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="设备类别">
                    <el-alert :title="deviceMainDetail.categoryName" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="维护的设备">
                    <el-alert v-show="deviceMainDetail.deviceNames !== ''" :title="deviceMainDetail.deviceNames" type="info" :closable="false"></el-alert>
                    <el-alert v-show="deviceMainDetail.deviceNames === ''" title="暂无" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="维护时间">
                    <el-alert :title="deviceMainDetail.maintenanceTime" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="维护内容">
                    <el-alert :title="deviceMainDetail.content" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="维护中遇到的问题">
                    <el-alert v-show="deviceMainDetail.question !== ''" :title="deviceMainDetail.question" type="info" :closable="false"></el-alert>
                    <el-alert v-show="deviceMainDetail.question === ''" title="暂无" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="问题的解决方法">
                    <el-alert v-show="deviceMainDetail.answer !== ''" :title="deviceMainDetail.answer" type="info" :closable="false"></el-alert>
                    <el-alert v-show="deviceMainDetail.answer === ''" title="暂无" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="测试情况">
                    <el-alert v-show="deviceMainDetail.testSituation !== ''" :title="deviceMainDetail.testSituation" type="info" :closable="false"></el-alert>
                    <el-alert v-show="deviceMainDetail.testSituation === ''" title="暂无" type="info" :closable="false"></el-alert>
                </el-form-item>
                <el-form-item label="状态">
                    <el-tag v-show="deviceMainDetail.status === '1'">有效</el-tag>
                    <el-tag v-show="deviceMainDetail.status !== '1'" type="danger">无效</el-tag>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增维护信息" :visible.sync="insertVisible" width="40%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="150px">
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="form.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceIds" v-show="deviceInfos.length > 0">
                    <el-checkbox-group v-model="form.deviceIds" size="small">
                        <el-checkbox-button v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="维护时间" prop="maintenanceTime">
                    <el-date-picker v-model="form.maintenanceTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="维护内容" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="维护中遇到的问题" prop="question">
                    <el-input type="textarea" v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item label="问题的解决方法" prop="answer">
                    <el-input type="textarea" v-model="form.answer"></el-input>
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
        <el-dialog title="编辑维护信息" :visible.sync="editVisible" width="40%">
            <el-form ref="form" label-position="right" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="form.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceIds" v-show="deviceInfos.length > 0">
                    <el-checkbox-group v-model="form.deviceIds" size="small">
                        <el-checkbox-button v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="维护时间" prop="maintenanceTime">
                    <el-date-picker v-model="form.maintenanceTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="维护内容" prop="content">
                    <el-input type="textarea" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="维护中遇到的问题" prop="question">
                    <el-input type="textarea" v-model="form.question"></el-input>
                </el-form-item>
                <el-form-item label="问题的解决方法" prop="answer">
                    <el-input type="textarea" v-model="form.answer"></el-input>
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
        <el-dialog title="删除维护信息" :visible.sync="delVisible" width="300px" center>
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
            deviceMainDetail: '',
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            viewVisible: false,
            idx: -1,
            del_id: '',
            form: {
                id: '',
                categoryId: '',
                deviceIds: [],
                maintenanceTime: '',
                content: '',
                question: '',
                answer: '',
                testSituation: '',
                status: '1'
            },
            rules: {
                categoryId: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
                maintenanceTime: [
                    { required: true, message: '请选择维护时间', trigger: 'blur' }
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
                let deviceNames = []
                if (d.deviceInfoDTOList && d.deviceInfoDTOList.length > 0) {
                    _.forEach(d.deviceInfoDTOList, (item, index) => {
                        deviceNames.push(item.name)
                    })
                }
                d.deviceNames = deviceNames.join(',')
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
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/deviceMaintenance/page.json',
                data: postData
            }).then((res)=>{
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
        handleView(index, row) {
            this.deviceMainDetail = row
            console.log(row)
            this.viewVisible = true
        },
        handleInsert() {
            this.insertVisible = true
            this.form = {
                id: '',
                categoryId: '',
                deviceIds: [],
                maintenanceTime: '',
                content: '',
                question: '',
                answer: '',
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
                        deviceIds: this.form.deviceIds.join(','),
                        maintenanceTime: this.form.maintenanceTime,
                        content: this.form.content,
                        question: this.form.question,
                        answer: this.form.answer,
                        testSituation: this.form.testSituation,
                        status: this.form.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceMaintenance/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`设备维护信息添加成功`)
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
                deviceIds: item.deviceIdList,
                maintenanceTime: item.maintenanceTime,
                content: item.content,
                question: item.question,
                answer: item.answer,
                testSituation: item.testSituation,
                status: item.status.toString()
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
                        deviceIds: this.form.deviceIds.join(','),
                        maintenanceTime: this.form.maintenanceTime,
                        content: this.form.content,
                        question: this.form.question,
                        answer: this.form.answer,
                        testSituation: this.form.testSituation,
                        status: this.form.status
                    })
                    this.$axios({
                        method: 'post',
                        url: '/deviceMaintenance/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`设备维护信息更新成功`)
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
                maintenanceId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/deviceMaintenance/delete.json',
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
