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
                <el-select placeholder="筛选状态" class="handle-select mr10">
                    <el-option key="name" label="姓名"></el-option>
                    <el-option key="mobile" label="手机号"></el-option>
                </el-select>
                <el-input placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-lx-search">搜索</el-button>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-lx-upload" class="handle-del mr10">资料上传</el-button>
                    <el-button type="primary" icon="el-icon-lx-down" class="handle-del mr10">资料下载</el-button>
                </el-button-group>
            </div>
            <el-table border :data="data" class="table" ref="multipleTable">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="文件名称" width="250"></el-table-column>
                <el-table-column prop="size" label="文件大小"></el-table-column>
                <el-table-column prop="type" label="文件类型"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="200"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit">编辑</el-button>
                        <el-button type="text" icon="el-icon-lx-attention" class="">预览</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            pageNum: 1,
            pageSize: 5,
            form: {
                id: '',
                title: '',
                size: 0,
                uploadTime: '',
                type: ''
            }
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
        getData() {
            let postData = this.$qs.stringify({
                pageNum: this.pageNum,
                pageSize: this.pageSize
            })
            this.$axios({
                method: 'post',
                url: '/api/datumInfo/page.json',
                data: postData
            }).then((res) => {
                let page = res.data.data
                this.tableData = page.list
                this.total = page.total
            })
        }
    }
}
</script>

<style>
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
