// 资料管理

<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-file"></i> 资料管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-upload" class="handle-del mr10" @click="handleUpload">资料上传</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable" v-loading="loading">
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="title" label="文件名称"></el-table-column>
                <el-table-column prop="size" label="文件大小"></el-table-column>
                <el-table-column prop="type" label="文件类型"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="200"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
                        <el-button type="text" icon="el-icon-lx-down" @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                        <el-button type="text" icon="el-icon-delete" :disabled="!scope.row.deleteBtnEdit" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>

        <!-- 资料上传 -->
        <el-dialog title="资料上传" :visible.sync="uploadVisible" width="30%" center>
            <el-upload class="upload-demo" action="/file/upload_file.json" style="text-align: center"
                :on-remove="handleRemove" :on-success="uploadSuccess"
                :before-remove="beforeRemove" multiple :limit="1"
                :on-exceed="handleExceed" :file-list="fileList">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <div slot="tip" class="el-upload__tip">只能上传word/excel/ppt/pdf文件，且不超过10M</div>
            </el-upload>
        </el-dialog>

        <!-- 资料预览 -->
        <el-dialog title="资料预览" :visible.sync="preivewVisible" width="80%"> 
            <pdf v-for="i in numPages" :key="i" :src="src" :page="i" style="display: inline-block; width: 100%"></pdf>
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
import pdf from 'vue-pdf'

export default {
    components: {
        pdf
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            uploadVisible: false,
            preivewVisible: false,
            delVisible: false,
            fileList: [],
            loading: false,
            previewPath: '',
            del_id: '',
            form: {
                id: '',
                title: '',
                size: 0,
                uploadTime: '',
                type: ''
            },
            src:null,
            numPages: undefined,
        }
    },
    created() {
        this.getData()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                return d;
            })
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNum = val
            this.getData()
        },
        getData() {
            this.loading = true
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/datumInfo/page.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    let page = res.data.data
                    this.tableData = page.list
                    console.log(this.tableData)
                    this.total = page.total
                    this.loading = false
                } else {
                    this.$message.error(` ${ res.data.msg } `);
                }
            })
        },
        handleUpload() {
            this.uploadVisible = true
            this.fileList = []
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleExceed() {
            // 定义超出限制时的行为
            this.$message.warning(`当前限制选择 1 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        uploadSuccess(response, file, fileList) {
            if (response.success) {
                this.$message.success(`文件 ${ file.name } 上传成功`);
                this.uploadVisible = false
                this.getData()
            } else {
                this.$message.error(response.msg);
            }
        },
        handlePreview(index, row) {
            this.loading = true
            // 文件预览，请求后台将office文件转换成PDF文件
            let postData = this.$qs.stringify({
                datumId: row.id
            })
            this.$axios({
                method: 'post',
                url: '/file/office_convert_pdf.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.loading = false
                    this.previewPath = res.data.data
                    this.src = pdf.createLoadingTask(res.data.data);
                    this.src.then(pdf => {
                        this.numPages = pdf.numPages;
                    });
                    this.preivewVisible = true
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        handleDelete(index, row) {
            this.del_id = row.id
            this.delVisible = true
        },
        deleteRow() {
            let postData = this.$qs.stringify({
                datumId: this.del_id
            })
            this.$axios({
                method: 'post',
                url: '/datumInfo/delete.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.delVisible = false
                    this.$message.success('资料删除成功');
                    this.getData()
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        handleDownload(index, row) {
            window.location.href = '/file/download.json?datumId=' + row.id
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
.el-upload--text {
    width: auto;
    height: auto;
}
</style>
