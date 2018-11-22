// 下拉框组件

<template>
    <el-select v-model="selectId" clearable placeholder="请选择分类" @change="chooseSelection">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: [{
                label: '请选择',
                value: 0
            }]
        },
        defaultValue: {
            default: ''
        }
    },
    data() {
        return {
            selectId: ''
        }
    },
    created() {
        this.selectId = this.defaultValue
    },
    watch: {
        defaultValue() {
            this.selectId = this.defaultValue
        }
    },
    methods: {
        chooseSelection() {
            this.$emit('on-change', this.selectId)
        }
    }
}
</script>

<style>

</style>
