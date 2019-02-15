// 生成值班表

<template>
    <div>
        <el-table row-key="order" ref="table" border :data="tableData" style="width: 100%">
            <el-table-column label="值班时间" width="150" align='center'>
                <el-table-column prop='order' label='组 \ 岗位' align='center'></el-table-column>
            </el-table-column>
            <TableColumn v-for='timeItem in timeLimitList' :key="timeItem.timer" @visi-handler='visiHandler' 
            @remove-handler='removeHandler' :tiemTypeOrder='timeItem.timer' :options='options' :timeLimit='timeItem.value'></TableColumn>
            <el-table-column label='休息' align='center'>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.rest" multiple placeholder="请选择" filterable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label='操作' align='center'>
                <template slot-scope="scope" v-if='tableLen-1 === scope.$index'>
                    <el-button size="mini" @click="handlerAdd(scope.$index, scope.row)">增加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top:30px" type="flex" justify="end">
            <el-date-picker format="yyyy 年 MM 月" value-format="yyyy-MM" v-model="yearAndMonth" type="month" @change="selectMonth" placeholder="选择月">
            </el-date-picker>
            <el-button style="margin-left:30px" type='primary' @click='initTableListHandler'>生成值班表</el-button>
        </el-row>

        <el-dialog title="值班表预览" :visible.sync="previewVisible" width="80%">
            <duty-preview :tableList="tableList" :residueList="residueList" :yearAndMonth="yearAndMonth"
             :employeeList="employeeList" :type="type" @save-result="saveAfter($event)"></duty-preview>
        </el-dialog>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import TableColumn from './tableColumn'
import DutyPreview from './DutyPreview'
import _ from 'lodash'

export default {
    components: {
        TableColumn, DutyPreview
    },
    data() {
        return {
            originOptions:[],
            previewVisible: false,
            prevMonthRestList: [],
            yearAndMonth: '',
            options: [],
            timeLimitList: [
                //三个时间阶段
                {
                    timer: 1,
                    value: '0:00-8:30'
                },
                {
                    timer: 2,
                    value: '8:30-24:00'
                },
                // {
                //     timer: 3,
                //     value: '18:00-0:00'
                // }
            ],
            tableData: [
                {
                    order: 1,
                    one1: [],
                    one2: [],
                    one3: [],
                    two1: [],
                    two2: [],
                    two3: [],
                    three1: [],
                    three2: [],
                    three3: [],
                    rest: []
                }
            ],
            tableList: [],
            residueList: [],
            type: 'save'
        }
    },
    computed: {
        employeeList:function() {
            return this.originOptions
        },
        tableLen: function() {
            return this.tableData.length
        },
        prevMonthRestDay: function() {
            return this.prevMonthRestList.length || 0
        }
    },
    watch: {
        tableLen: function() {
            this.options = []
            this.options = this.originOptions
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

        this.loadEmployeeSelect()
    },
    methods: {
        removeHandler() {
            this.options = this.originOptions
        },
        visiHandler(isShow) {
            if (!isShow) {
                this.options = this.removeSelected()
            }
        },
        // 从值班人员列表中移除已经选择的值班人员
        removeSelected() {
            let data = this.tableData[this.tableLen - 1]

            let selectedData = [
                ...data.one1,
                ...data.one2,
                ...data.one3,
                ...data.two1,
                ...data.two2,
                ...data.two3,
                // ...data.three1,
                // ...data.three2,
                // ...data.three3,
                ...data.rest
            ]
            let options = this.options
            for (let i = 0; i < selectedData.length; i++) {
                let selectedVal = selectedData[i]
                options = options.filter(item => {
                    return item.value !== selectedVal
                })
            }

            return options
        },
        // 判断是否能增加下一行
        isCanAdd(data) {
            let {
                one1,
                one2,
                one3,
                two1,
                two2,
                two3,
                // three1,
                // three2,
                // three3,
                rest
            } = data
            if (
                one1.length == 0 ||
                one2.length == 0 ||
                one3.length == 0 ||
                two1.length == 0 ||
                two2.length == 0 ||
                two3.length == 0 ||
                // three1.length == 0 ||
                // three2.length == 0 ||
                // three3.length == 0 ||
                rest.length == 0
            ) {
                return false
            } else {
                return true
            }
        },
        handlerAdd(index, row) {
            let isAdd = this.isCanAdd(row)
            if (!isAdd) {
                this.$message.error('请选择值班人员')
                return
            }
            let newRow = {
                order: this.tableLen + 1,
                one1: [],
                one2: [],
                one3: [],
                two1: [],
                two2: [],
                two3: [],
                // three1: [],
                // three2: [],
                // three3: [],
                rest: []
            }
            this.tableData = [...this.tableData, newRow]
        },
        //生成值班列表
        initTableListHandler() {
            this.initTableList()
        },
        //获取年月
        getYearAndMonth() {
            let data = this.yearAndMonth
            return data.split('-')
        },
        //获取某月有多少天
        getCurrentDays(year, month) {
            return new Date(year, month, 0).getDate()
        },
        getFirstDay(year, month) {
            month = parseInt(month) - 1
            return new Date(year, month, 1).getDay()
        },
        initDateList(year, month) {
            let days = this.getCurrentDays(year, month)
            let firstWeek = this.getFirstDay(year, month)
            let weekList = ['日', '一', '二', '三', '四', '五', '六']
            let dateList = []
            for (let i = 1; i <= days; i++) {
                let weekIndex = (firstWeek + i - 1) % 7
                if(i<10){[
                    i = '0' +i
                ]}
                let day = `${year}-${month}-${i}`
                dateList.push({
                    day,
                    week: weekList[weekIndex]
                })
            }
            return dateList
        },
        // 选择月份，加载上一月的值班表信息
        selectMonth() {
            this.loadLastMonthDuty()
        },
        // 生成值班列表
        initTableList() {
            if (!this.yearAndMonth) {
                this.$message.error('请选择日期')
                return
            }
            let tableLen = this.tableLen
            let [year, month] = this.getYearAndMonth()
           
            let weekList = this.initDateList(year, month)
            let maxDay = this.getCurrentDays(year, month)
            maxDay = maxDay - this.prevMonthRestDay
            let forLen = parseInt(maxDay / tableLen) //循环次数
            let restLen = parseInt(maxDay % tableLen) //余数量

            // 循环生成值班表
            this.forTable(forLen, restLen, weekList)
        },
        // 循环生成值班表
        forTable(forLen, restLen, weekList) {
            let arr = [...this.tableData]
            let data = []
            for (let i = 0; i < forLen; i++) {
                data.push(...arr)
            }
            data.push(...arr.slice(0, restLen))
            let tableList = []
            let prevMonthRestDay = this.prevMonthRestDay
            for (let i = 0; i < data.length; i++) {
                let item = Object.assign({}, data[i], weekList[i + prevMonthRestDay])
                tableList.push(item)
            }

            let nextMonthList = []
            let nextMonthLen = null
            if (restLen === 0) {
                nextMonthList = []
                nextMonthLen = 0
            } else {
                nextMonthLen = this.tableLen - restLen
                nextMonthList = arr.slice(-nextMonthLen)
            }

            console.log(tableList, nextMonthList, nextMonthLen)
            this.tableList = tableList
            // 将上一个月剩余的值班表添加到当前值班表前面
            this.tableList = [...this.prevMonthRestList, ...tableList]
            // 获取当前月剩余的值班表
            this.residueList = this.initNextMonthList(nextMonthList)
            this.previewVisible = true
        },
        // nextMonthList 多余列表
        initNextMonthList(list) {
            let [year, month] = this.getNextMonth();
            let weekList = this.initDateList(year, month);
            let len = list.length;
            let nextList = [];
            if (list && list.length) {
                for (let index in list) {
                    let item = list[index];
                    item = Object.assign({}, item, weekList[index]);
                    nextList.push(item);
                }
            }
            return nextList;
        },
        //获取下个月
        getNextMonth() {
            let date = this.yearAndMonth;
            let [year, month] = date.split("-");
            year = parseInt(year)
            month = parseInt(month)
            month++;
            if (month > 12) {
                year++;
                month %= 12;
            }
            if(month<10){
                month = `0${month}`
            }
            
            return [year, month];
        },
        // 加载值班人员选择列表
        loadEmployeeSelect() {
            let originOptions = []
            this.originOptions = []
            this.options = []
            this.$axios('/employee/list.json').then((res)=>{
                if (res.data.success) {
                    if (res.data.data && res.data.data.length > 0) {
                        _.forEach(res.data.data, (employee, index) => {
                            originOptions.push({
                                value: employee.id,
                                label: employee.name
                            })
                        })
                        this.originOptions = originOptions;
                        this.options = originOptions
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        // 获取上一个月的值班表
        loadLastMonthDuty() {
            let postData = this.$qs.stringify({
                month: this.yearAndMonth
            })
            this.$axios({
                method: 'post',
                url: '/dutyInfo/get_duty_by_month.json',
                data: postData
            }).then((res)=>{
                if (res.data.success) {
                    // 设置上一个月剩余的值班表
                    let {data} = res.data
                    if (data) {
                        this.prevMonthRestList = JSON.parse(res.data.data.residueData)
                    } else {
                        this.prevMonthRestList.splice(0)
                    }
                } else {
                    this.$message.error(` ${res.data.msg} `)
                }
            })
        },
        saveAfter(result) {
            if (result) {
                this.previewVisible = false
                this.$message.success('值班表已生成')
            }
        }
    }
}
</script>
    
<style>

</style>
