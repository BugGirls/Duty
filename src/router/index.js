import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
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
                    component: resolve => require(['../components/page/dutyManager/DutyInfo.vue'], resolve),
                    meta: { title: '值班表' }
                },
                {
                    path: '/shift-duty',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '交接班' }
                },
                {
                    path: '/logbook',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '值班日志' }
                },
                {
                    path: '/inspection',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '值班巡检' }
                },
                {
                    path: '/inspection-item',
                    component: resolve => require(['../components/page/dutyManager/InspectionItem.vue'], resolve),
                    meta: { title: '值班巡检项' }
                },
                {
                    path: '/remind',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '值班提醒' }
                },
                {
                    path: '/shift-apply',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
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
                    meta: { title: '试题类型' }
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
                    path: '/generator-duty',
                    component: resolve => require(['../components/page/dutyManager/GeneratorDuty.vue'], resolve),
                    meta: { title: '生成值班表' }
                },
                {
                    path: '/duty-info',
                    component: resolve => require(['../components/page/dutyManager/DutyInfo.vue'], resolve),
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
                    path: '/permission',
                    component: resolve => require(['../components/page/permissionManager/Acl.vue'], resolve),
                    meta: { title: '权限管理' }
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
