import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode:'hash',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/index',
                    component: resolve => require(['../components/page/indexManager/index.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                // {
                //     path: '/icon',
                //     component: resolve => require(['../components/page/Icon.vue'], resolve),
                //     meta: { title: '自定义图标' }
                // },
                // {
                //     path: '/table',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/tabs',
                //     component: resolve => require(['../components/page/Tabs.vue'], resolve),
                //     meta: { title: 'tab选项卡' }
                // },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }    
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }   
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: resolve => require(['../components/page/Permission.vue'], resolve),
                //     meta: { title: '权限测试', permission: true }
                // },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/employee',
                    component: resolve => require(['../components/page/dutyManager/Employee.vue'], resolve),
                    meta: { title: '值班人员' }
                },
                {
                    path: '/duty-info',
                    component: resolve => require(['../components/page/dutyManager/dutyInfo/DutyInfo.vue'], resolve),
                    meta: { title: '值班表' }
                },
                {
                    path: '/shift-change',
                    component: resolve => require(['../components/page/dutyManager/ShiftChange.vue'], resolve),
                    meta: { title: '交接班' }
                },
                {
                    path: '/logbook',
                    component: resolve => require(['../components/page/dutyManager/logbook/Logbook.vue'], resolve),
                    meta: { title: '值班日志' }
                },
                {
                    path: '/inspection',
                    component: resolve => require(['../components/page/dutyManager/inspection/Inspection.vue'], resolve),
                    meta: { title: '值班巡检' }
                },
                {
                    path: '/inspection-item',
                    component: resolve => require(['../components/page/dutyManager/inspection/InspectionItem.vue'], resolve),
                    meta: { title: '值班巡检项' }
                },
                {
                    path: '/remind',
                    component: resolve => require(['../components/page/dutyManager/Remind.vue'], resolve),
                    meta: { title: '值班提醒' }
                },
                {
                    path: '/shift-apply',
                    component: resolve => require(['../components/page/dutyManager/ShiftApply.vue'], resolve),
                    meta: { title: '换班申请' }
                },
                {
                    path: '/datum',
                    component: resolve => require(['../components/page/datumManager/DatumInfo.vue'], resolve),
                    meta: { title: '资料管理' }
                },
                {
                    path: '/question_category',
                    component: resolve => require(['../components/page/questionManager/QuestionCategory.vue'], resolve),
                    meta: { title: '分类管理' }
                },
                {
                    path: '/question',
                    component: resolve => require(['../components/page/questionManager/Question.vue'], resolve),
                    meta: { title: '试题管理' }
                },
                {
                    path: '/answer',
                    component: resolve => require(['../components/page/questionManager/Answer.vue'], resolve),
                    meta: { title: '网上作答' }
                },
                {
                    path: '/duty-generator',
                    component: resolve => require(['../components/page/dutyManager/dutyInfo/DutyGenerator.vue'], resolve),
                    meta: { title: '生成值班表' }
                },
                {
                    path: '/duty-info',
                    component: resolve => require(['../components/page/dutyManager/dutyInfo/DutyInfo.vue'], resolve),
                    meta: { title: '查看值班表' }
                },
                {
                    path: '/dispatch',
                    component: resolve => require(['../components/page/dispatchManager/Dispatch.vue'], resolve),
                    meta: { title: '调度管理' }
                },
                {
                    path: '/device',
                    component: resolve => require(['../components/page/deviceManager/Device.vue'], resolve),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/device-maintenance',
                    component: resolve => require(['../components/page/deviceManager/DeviceMaintenance.vue'], resolve),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/device-repair',
                    component: resolve => require(['../components/page/deviceManager/DeviceRepair.vue'], resolve),
                    meta: { title: '设备管理' }
                },
                {
                    path: '/acl',
                    component: resolve => require(['../components/page/permissionManager/Acl.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/permissionManager/Role.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/permissionManager/User.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/audit',
                    component: resolve => require(['../components/page/auditManager/audit.vue'], resolve),
                    meta: { title: '审核管理' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path: '/retrieve',
            component: resolve => require(['../components/page/Retrieve.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
