// 值班表 预览

<template>
    <div v-if="employeeList">
        <el-table row-key="date" ref="table" border :data="tableData" style="width: 100%" id='table'>
            <el-table-column label="值班时间" align='center'>
                <el-table-column label='日期 \ 岗位' align='center' width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.day }}</span>
                    <span> （{{ scope.row.week }}）</span>
                </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="0:00-8:30" align='center'>
                <el-table-column label='带班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.one1) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='维护' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.one2) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='值班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.one3) }}</span>
                </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label='8:30-24:00' align='center'>
                <el-table-column label='带班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.two1) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='维护' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.two2) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='值班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.two3) }}</span>
                </template>
                </el-table-column>
            </el-table-column>
            <!-- <el-table-column label='18:00-0:00' align='center'>
                <el-table-column label='带班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.three1) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='维护' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.three2) }}</span>
                </template>
                </el-table-column>
                <el-table-column label='值班' align='center'>
                <template slot-scope="scope">
                    <span>{{ optionsSelect(scope.row.three3) }}</span>
                </template>
                </el-table-column>
            </el-table-column> -->
            <el-table-column label='休息' align='center'>
                <template slot-scope="scope">
                <span>{{ optionsSelect(scope.row.rest) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top:30px" type="flex" justify="end">
            <el-button v-show="type === 'save'" type="primary" @click="saveDuty">保存</el-button>
            <el-button v-show="type === 'preview'" type="primary" @click="exportExcel">导出Excel</el-button>
        </el-row>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

const originOptions = []

export default {
    props: {
        tableList: {
            type: Array,
            default: []
        },
        residueList: {
            type: Array,
            default: []
        },
        yearAndMonth: {
            type: String,
            defualt: ''
        },
        employeeList: {
            type: Array,
            default: []
        },
        type: {
            type: String,
            default: 'preview'
        }
    },
    data() {
        return {
            tableData: []
        }
    },
    watch: {
        tableList() {
            this.tableData = this.tableList
        }
    },
    mounted() {
        const table = document.querySelector('.el-table__body-wrapper tbody')
        const self = this
        Sortable.create(table, {
            onEnd({ newIndex, oldIndex }) {
                const targetRow = self.tableData.splice(oldIndex, 1)[0]
                self.tableData.splice(newIndex, 0, targetRow)
            }
        })
        this.tableData = this.tableList
    },
    methods: {
        optionsSelect (arr) {
            let newArr = this.employeeList.filter(item => {
                return arr.includes(item.value)
            })
            let selectedArr = newArr.map(item => item.label)
            return selectedArr.join('\\')
        },
        exportExcel() {
            /* generate workbook object from table */
            let wb = XLSX.utils.table_to_book(document.querySelector('#table'))
            /* get binary string as output */
            let wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            })
            try {
                FileSaver.saveAs(
                new Blob([wbout], { type: 'application/octet-stream' }),
                '播出科值班表.xlsx'
                )
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout)
            }
            return wbout
        },
        saveDuty() {
            let postData = this.$qs.stringify({
                validMonth: this.yearAndMonth,
                tableData: JSON.stringify(this.tableList),
                residueData: JSON.stringify(this.residueList)
            })
            this.$axios({
                method: 'post',
                url: '/dutyInfo/save.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    this.$emit('save-result', true)
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        }
    }
}
</script>
