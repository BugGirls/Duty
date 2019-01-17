// 值班表选择

<template>
    <el-table-column :label="timeLimit" align='center'>
        <el-table-column label='带班' align='center'>
            <template slot-scope="scope">
                <el-select v-if='tiemTypeOrder === 1' v-model="scope.row.one1" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 2' v-model="scope.row.two1" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 3' v-model="scope.row.three1" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label='维护' align='center'>
            <template slot-scope="scope">
                <el-select v-if='tiemTypeOrder === 1' v-model="scope.row.one2" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 2' v-model="scope.row.two2" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 3' v-model="scope.row.three2" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label='值班' align='center'>
            <template slot-scope="scope">
                <el-select v-if='tiemTypeOrder === 1' v-model="scope.row.one3" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 2' v-model="scope.row.two3" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
                <el-select v-if='tiemTypeOrder === 3' v-model="scope.row.three3" multiple placeholder="选择" filterable @visible-change='visiHandler' @remove-tag='removeHandler'>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
                </el-select>
            </template>
        </el-table-column>
    </el-table-column>
</template>

<script>
export default {
    name: 'tableColumn',
    props: {
        tiemTypeOrder: {
            type: Number,
            default: 0
        },
        timeLimit: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    created() {},
    mounted() {},
    methods: {
        visiHandler(isShow) {
            this.$emit('visi-handler', isShow)
        },
        removeHandler() {
            this.$emit('remove-handler')
        }
    }
}
</script>
