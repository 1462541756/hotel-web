import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/rms',
    component: Layout,
    redirect: '/rms/room',
    name: 'rms',
    meta: {title: '房间', icon: 'room'},
    children: [{
      path: 'room',
      name: 'room',
      component: () => import('@/views/rms/room/index'),
      meta: {title: '房间列表', icon: 'room'}
    },
      {
        path: 'addRoom',
        name: 'addRoom',
        component: () => import('@/views/rms/room/add'),
        meta: {title: '添加房间', icon: 'room'}
      },
      {
        path: 'updateRoom',
        name: 'updateRoom',
        component: () => import('@/views/rms/room/update'),
        meta: {title: '修改房间', icon: 'room'},
        hidden: true
      },
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
      path: 'order',
      name: 'order',
      component: () => import('@/views/oms/order/index'),
      meta: {title: '订单列表', icon: 'order-list'}
    },
      {
        path: 'detailOrder',
        name: 'detailOrder',
        component: () => import('@/views/oms/order/detail'),
        meta: {title: '订单详情', icon: 'order'},
        hidden: true
      },
    ]
  },
  {
    path:'/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: {title: '权限', icon: 'ums'},
    children: [
 /*     {
        path: 'test',
        name: 'test',
        component: () => import('@/views/test'),
        meta: {title: '测试', icon: 'order'}
      },*/
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: {title: '用户列表', icon: 'ums-admin'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: {title: '角色列表', icon: 'ums-role'}
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: {title: '分配菜单'},
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: {title: '分配资源'},
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: {title: '菜单列表', icon: 'ums-menu'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: {title: '添加菜单'},
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: {title: '修改菜单'},
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: {title: '资源列表', icon: 'ums-resource'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: {title: '资源分类'},
        hidden: true
      }
    ]
  },
  {
    path:'/cms' ,
    component: Layout,
    redirect: '/cms/checkIn',
    name: 'cms',
    meta: {title: '权限', icon: 'ums'},
    children: [
      {
        path: 'check',
        name: 'check',
        component: () => import('@/views/cms/check'),
        meta: {title: '入住管理', icon: 'ums-admin'}
      },
      {
        path: 'checkList',
        name: 'checkList',
        component: () => import('@/views/cms/index'),
        meta: {title: '入住管理', icon: 'ums-admin'}
      },
    ]
  },

  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

