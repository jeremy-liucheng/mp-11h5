// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import useStore from '@/store';

export const Layout = () => import('@/layout/layout.vue');

// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/test',
    component: () => import('@/views/test/test/test.vue'),
    meta: { hidden: true }
  },
  {
    path: '/register',
    component: () => import('@/views/register/register.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/dashboard.vue'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'homepage', affix: true, hidden: false }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: { hidden: true }
      }
    ]
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// 重置路由
export function resetRouter() {
  const { permission } = useStore();
  permission.routes.forEach((route: any) => {
    const name = route.name;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
