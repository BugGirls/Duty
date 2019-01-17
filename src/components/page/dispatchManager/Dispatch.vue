// 调度管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-time"></i> 调度管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="selectDeptId" clearable placeholder="请选择所属频率" @change="selectChange">
                    <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-add" @click="handleInsert()">新增调度信息</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column prop="id" label="ID" width="170"></el-table-column>
                <el-table-column prop="deptName" label="频率" width="150"></el-table-column>
                <el-table-column prop="program" label="转播的节目" width="200"></el-table-column>
                <el-table-column prop="longRebroadcast" label="长期转播">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.longRebroadcast === '1'">是</el-tag>
                        <el-tag v-show="scope.row.longRebroadcast !== '1'" type="danger">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceInfo" label="设备信息" width="200"></el-table-column>
                <el-table-column prop="period" label="转播的周期" width="200"></el-table-column>
                <el-table-column prop="timeInterval" label="转播的时段" width="200"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag v-show="scope.row.status === '1'">有效</el-tag>
                        <el-tag v-show="scope.row.status !== '1'" type="danger">无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="200"></el-table-column>
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
        <el-dialog title="新增调度信息" :visible.sync="insertVisible" width="36%">
            <el-form ref="form" label-position="right" :rules="rules" :model="dispatchForm" label-width="100px">
                <el-form-item label="所属频率" prop="deptId">
                    <el-select v-model="dispatchForm.deptId" clearable placeholder="请选择所属频率">
                        <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转播的节目" prop="program">
                    <el-input type="textarea" v-model="dispatchForm.program"></el-input>
                </el-form-item>
                <el-form-item label="是否长期转播" prop="longRebroadcast">
                    <el-radio-group v-model="dispatchForm.longRebroadcast" size="small">
                        <el-radio label="1" border>是</el-radio>
                        <el-radio label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="dispatchForm.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceIds" v-show="deviceInfos.length > 0">
                    <el-checkbox-group v-model="dispatchForm.deviceIds" size="small">
                        <el-checkbox-button v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="转播周期" prop="period">
                    <el-date-picker v-model="dispatchForm.period" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="转播周期" prop="timeFrame">
                    <el-time-picker is-range v-model="dispatchForm.timeFrame" value-format="HH:mm:ss" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="dispatchForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="dispatchForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="insertVisible = false">取 消</el-button>
                <el-button type="primary" @click="dispatchInsert('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑调度信息" :visible.sync="editVisible" width="36%">
            <el-form ref="form" label-position="right" :rules="rules" :model="dispatchForm" label-width="100px">
                <el-form-item label="所属频率" prop="deptId">
                    <el-select v-model="dispatchForm.deptId" clearable placeholder="请选择所属频率">
                        <el-option v-for="item in deptOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转播的节目" prop="program">
                    <el-input type="textarea" v-model="dispatchForm.program"></el-input>
                </el-form-item>
                <el-form-item label="是否长期转播" prop="longRebroadcast">
                    <el-radio-group v-model="dispatchForm.longRebroadcast" size="small">
                        <el-radio label="1" border>是</el-radio>
                        <el-radio label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备类别" prop="categoryId">
                    <el-select v-model="dispatchForm.categoryId" clearable placeholder="请选择设备类别" @change="cagegoryChange">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择设备" prop="deviceIds" v-show="deviceInfos.length > 0">
                    <el-checkbox-group v-model="dispatchForm.deviceIds" size="small">
                        <el-checkbox-button v-for="item in deviceInfos" :label="item.value" :key="item.label">{{ item.label }}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="转播周期" prop="period">
                    <el-date-picker v-model="dispatchForm.period" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="转播周期" prop="timeFrame">
                    <el-time-picker is-range v-model="dispatchForm.timeFrame" value-format="HH:mm:ss" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="dispatchForm.status" size="small">
                        <el-radio label="1" border>有效</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="dispatchForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="dispatchEdit('form')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="dispatchDelete">确 定</el-button>
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
            pageNum: 1, 
            pageSize: 10,
            total: 0,
            insertVisible: false,
            editVisible: false,
            delVisible: false,
            deptOptions: [],
            categoryOptions: [],
            deviceInfos: [],
            defaultDeptId: '',
            defaultCategoryId: '',
            idx: -1,
            selectDeptId: '',
            dispatchForm: {
                id: '',
                deptId: '',
                program: '',
                longRebroadcast: '0',
                categoryId: '',
                deviceIds: [],
                period: '',
                timeFrame: '',
                status: '1',
                remark: ''
            },
            rules: {
                deptId: [
                    { required: true, message: '请选择部门', trigger: 'blur' }
                ],
                program: [
                    { required: true, message: '请输入转播的节目', trigger: 'blur' }
                ],
                categoryId: [
                    { required: true, message: '请选择分类', trigger: 'blur' }
                ],
                deviceIds: [
                    { required: true, message: '请选择设备', trigger: 'blur' }
                ],
                period: [
                    { required: true, message: '请选择转播的周期', trigger: 'blur' }
                ],
                timeFrame: [
                    { required: true, message: '请选择转播的时间', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.getData()
        this.loadDeptSelect()
        this.getDeviceCategoryList()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                d.status = d.status.toString()
                d.deviceInfo = d.deviceCategoryName + '[' + d.deviceInfoNames + ']'
                d.longRebroadcast = d.longRebroadcast.toString()
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
                deptId: this.selectDeptId
            })
            this.$axios({
                method: 'post',
                url: '/dispatch/page_by_param.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    let page = res.data.data
                    this.tableData = page.list
                    this.total = page.total
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 加载部门选择列表
        loadDeptSelect() {
            this.$axios('/sys/dept/tree.json').then((res) => {
                if (res.data.success) {
                    var deptTree = res.data.data
                    this.recursiveRenderDeptSelect(deptTree, 1)
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
                    let option = {
                        value: dept.id,
                        label: blank + dept.name
                    }
                    this.deptOptions.push(option)
                    if (dept.children && dept.children.length > 0) {
                        this.recursiveRenderDeptSelect(dept.children, level + 1);
                    }
                })
            }
        },
        getDeviceCategoryList() {
            this.$axios('/deviceCategory/tree.json').then((res) => {
                if (res.data.success) {
                    var categoryTree = res.data.data
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
        
        selectChange(deptId) {
            this.selectDeptId = deptId
            this.getData()
        },
        getDeptId(deptId) {
            this.dispatchForm.deptId = deptId
        },
        cagegoryChange() {
            this.deviceInfos = []
            this.getDeviceByCategoryId()
        },
        getDeviceByCategoryId() {
            let postData = this.$qs.stringify({
                categoryId: this.dispatchForm.categoryId
            })
            this.$axios({
                method: 'post',
                url: '/deviceInfo/list.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
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
            this.deviceInfos = []
            this.dispatchForm = {
                deptId: '',
                program: '',
                longRebroadcast: '0',
                categoryId: '',
                deviceIds: [],
                period: '',
                timeFrame: '',
                status: '1',
                remark: ''
            }
        },
        dispatchInsert(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        deptId: this.dispatchForm.deptId,
                        program: this.dispatchForm.program,
                        longRebroadcast: this.dispatchForm.longRebroadcast,
                        categoryId: this.dispatchForm.categoryId,
                        deviceIds: this.dispatchForm.deviceIds.join(','),
                        beginDate: this.dispatchForm.period[0],
                        endDate: this.dispatchForm.period[1],
                        beginTime: this.dispatchForm.timeFrame[0],
                        endTime: this.dispatchForm.timeFrame[1],
                        status: this.dispatchForm.status,
                        remark: this.dispatchForm.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/dispatch/save.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.insertVisible = false
                            this.$message.success(`调度信息添加成功`)
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
            this.dispatchForm = {
                id: item.id,
                deptId: item.deptId,
                program: item.program,
                longRebroadcast: item.longRebroadcast,
                categoryId: item.categoryId,
                deviceIds: item.deviceIdList,
                period: [item.beginDate, item.endDate],
                timeFrame: [item.beginTime, item.endTime],
                status: item.status,
                remark: item.remark,
            }
            this.defaultDeptId = item.deptId
            this.defaultCategoryId = item.categoryId

            // 初始化使用的设备
            this.deviceInfos = []
            this.getDeviceByCategoryId(item.categoryId)

            this.editVisible = true
        },
        dispatchEdit(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let postData = this.$qs.stringify({
                        id: this.dispatchForm.id,
                        deptId: this.dispatchForm.deptId,
                        program: this.dispatchForm.program,
                        longRebroadcast: this.dispatchForm.longRebroadcast,
                        categoryId: this.dispatchForm.categoryId,
                        deviceIds: this.dispatchForm.deviceIds.join(','),
                        beginDate: this.dispatchForm.period[0],
                        endDate: this.dispatchForm.period[1],
                        beginTime: this.dispatchForm.timeFrame[0],
                        endTime: this.dispatchForm.timeFrame[1],
                        status: this.dispatchForm.status,
                        remark: this.dispatchForm.remark
                    })
                    this.$axios({
                        method: 'post',
                        url: '/dispatch/update.json',
                        data: postData
                    }).then((res)=>{
                        if (res.data.success) {
                            this.editVisible = false
                            this.$message.success(`调度信息修改成功`)
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
        dispatchDelete() {
            let postData = this.$qs.stringify({
                dispatchId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/dispatch/delete.json',
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
.table{
    width: 100%;
    font-size: 14px;
}
.red{
    color: #ff0000;
}
.handle-box {
    margin-bottom: 20px;
}

</style>
