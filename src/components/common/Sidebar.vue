<template>
    <div class="sidebar">
        <!-- background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" -->
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'index',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-bell',
                        index: '1',
                        title: '值班管理',
                        subs: [
                            {
                                index: 'employee',
                                title: '值班人员'
                            },
                            {
                                index: '1-2',
                                title: '值班表',
                                subs: [
                                    {
                                        index: 'duty-info',
                                        title: '查看值班表'
                                    },
                                    {
                                        index: 'duty-generator',
                                        title: '生成值班表'
                                    }
                                ]
                            },
                            {
                                index: 'shift-change',
                                title: '交接班'
                            },
                            {
                                index: 'logbook',
                                title: '值班日志'
                            },
                            {
                                index: '1-5',
                                title: '值班巡检',
                                subs: [
                                    {
                                        index: 'inspection',
                                        title: '巡检管理'
                                    },
                                    {
                                        index: 'inspection-item',
                                        title: '巡检项配置'
                                    },
                                ]
                            },
                            {
                                index: 'remind',
                                title: '值班提醒'
                            },
                            {
                                index: 'shift-apply',
                                title: '换班申请'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-file',
                        index: 'datum',
                        title: '资料管理'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: '2',
                        title: '题库管理',
                        subs: [
                            {
                                index: 'question_category',
                                title: '分类管理'
                            },
                            {
                                index: 'question',
                                title: '试题管理'
                            },
                            {
                                index: 'answer',
                                title: '网上作答'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-time',
                        index: 'dispatch',
                        title: '调度管理'
                    },
                    {
                        icon: 'el-icon-lx-record',
                        index: '3',
                        title: '设备管理',
                        subs: [
                            {
                                index: 'device',
                                title: '设备信息'
                            },
                            {
                                index: 'device-maintenance',
                                title: '设备维护'
                            },
                            {
                                index: 'device-repair',
                                title: '设备维修'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-unlock',
                        index: '4',
                        title: '权限管理',
                        subs: [
                            {
                                index: 'user',
                                title: '用户管理'
                            },
                            {
                                index: 'acl',
                                title: '权限管理'
                            },
                            {
                                index: 'role',
                                title: '角色管理'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-service',
                        index: 'audit',
                        title: '审核管理'
                    },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'table',
                    //     title: '基础表格'
                    // },
                    // {
                    //     icon: 'el-icon-lx-copy',
                    //     index: 'tabs',
                    //     title: 'tab选项卡'
                    // },
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: '4',
                    //     title: '表单相关',
                    //     subs: [
                    //         {
                    //             index: 'form',
                    //             title: '基本表单'
                    //         },
                    //         {
                    //             index: '4-2',
                    //             title: '三级菜单',
                    //             subs: [
                    //                 {
                    //                     index: 'editor',
                    //                     title: '富文本编辑器'
                    //                 },
                    //                 {
                    //                     index: 'markdown',
                    //                     title: 'markdown编辑器'
                    //                 },
                    //             ]
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-emoji',
                    //     index: 'icon',
                    //     title: '自定义图标'
                    // },
                    // {
                    //     icon: 'el-icon-lx-favor',
                    //     index: 'charts',
                    //     title: 'schart图表'
                    // },
                    // {
                    //     icon: 'el-icon-rank',
                    //     index: 'drag',
                    //     title: '拖拽列表'
                    // },
                    // {
                    //     icon: 'el-icon-lx-warn',
                    //     index: '5',
                    //     title: '错误处理',
                    //     subs: [
                    //         {
                    //             index: 'permission',
                    //             title: '权限测试'
                    //         },
                    //         {
                    //             index: '404',
                    //             title: '404页面'
                    //         }
                    //     ]
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
