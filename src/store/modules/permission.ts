import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { getUserRoutes } from '@/service/api/menu';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/layout.vue');

// 过滤生成路由对象
export const filterAsyncRoutes = (routes: RouteRecordRaw[], role: number) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach(route => {
    const tmp = { ...route } as any;

    if (tmp.path !== '') {
      if (tmp.component == 'Layout') {
        tmp.component = Layout;
      } else {
        const component = modules[`../../views/${tmp.component}.vue`] as any;
        if (component) {
          tmp.component = modules[`../../views/${tmp.component}.vue`];
        } else {
          tmp.component = modules[`../../views/error-page/404.vue`];
        }
      }
      res.push(tmp);

      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, role);
      }
    }
  });
  return res;
};

export default defineStore({
  id: 'permission',
  state: (): any => ({
    routes: [],
    addRoutes: []
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    generateRoutes(role: number) {
      return new Promise((resolve, reject) => {
        getUserRoutes()
          .then(([response]) => {
            const asyncRoutes = response?.data || [];
            const accessedRoutes = filterAsyncRoutes(asyncRoutes, role);
            this.setRoutes(accessedRoutes);
            resolve(accessedRoutes);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    }
  }
});
