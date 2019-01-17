<template>
    <div class='render' v-if='obj'>
        <el-input v-if="obj.type==2" v-model="obj.value" placeholder="请输入" clearable></el-input>
        <el-checkbox v-else v-model="obj.value"></el-checkbox>
    </div>
</template>

<script>
export default {
    name: 'xun-render',
    props: {
      obj: Object,
      default: function() {
        return {}
      }
    },
    created() {},
    mounted() {}
}
</script>


