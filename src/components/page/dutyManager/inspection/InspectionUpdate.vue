// 更新值班巡检

<template>
    <div class="table">
        <div class="container">
            <el-row type="flex" justify="end" style="margin-bottom:30px;">
                <el-button type='primary' @click="addIns">新增记录</el-button>
                <el-button type='primary' @click="inspectionSubmit">提交更新</el-button>
            </el-row>
            <el-table :data="tableData" border style="width: 100%">
                <template v-for="column of headData">
                    <el-table-column :prop="column.prop" :label="column.label" :key='column.prop' align="center">
                        <template slot-scope="scope">
                            <RenderWx :obj='scope.row[column.prop]'></RenderWx>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column fixed="right" label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="removeIns(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script>
import RenderWx from './render.vue'
import _ from 'lodash'

export default {
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    components: {
        RenderWx
    },
    data() {
        return {
            headData: [],
            tableData: JSON.parse(this.item.tableData),
            insData: {}
        }
    },
    watch: {
        item() {
            this.tableData = JSON.parse(this.item.tableData)
        }
    },
    mounted() {
        this.loadInspectionItemList()
    },
    methods: {
        addIns() {
            let addIns = JSON.parse(JSON.stringify(this.insData))
            let newData = [...this.tableData, addIns]
            this.tableData = newData
        },
        removeIns(index, row) {
            this.tableData.splice(index, 1)
        },
        // 加载巡检项
        loadInspectionItemList() {
            this.$axios('/inspectionItem/list.json').then((res)=>{
                if (res.data.success) {
                    if (res.data.data && res.data.data.length > 0) {
                        let insData = {}
                        let val = ['', false]
                        _.forEach(res.data.data, (item, index) => {
                            this.headData.push({
                                prop: 'ins' + index,
                                label: item.title
                            })

                            let name = 'ins' + index
                            insData[name] = {
                                type:item.type,
                                value:val[item.type]
                            }
                        })
                        this.insData= insData
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            }, (err) => {
                this.$message.error(` 请求失败 `)
            })
        },
        inspectionSubmit() {
            let postData = this.$qs.stringify({
                id: this.item.id,
                tableData: JSON.stringify(this.tableData)
            })
            this.$axios({
                method: 'post',
                url: '/inspection/update.json',
                data: postData
            }).then((res) => {
                if (res.data.success) {
                    this.$message.success('值班巡检信息更新成功')
                    this.$emit('submit-result', true)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }
}
</script>

<style>

</style>
