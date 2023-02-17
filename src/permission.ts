// src/permission.ts
import router from '@/router';
import useStore from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { permission, user } = useStore();
  const hasGetUserInfo = user.role >= 0;
  if (hasGetUserInfo) {
    if (to.matched.length === 0) {
      from.name ? next({ name: from.name }) : next('/401');
    } else {
      return next();
    }
  }
  if (to.path === '/login' || to.path === '/register') {
    NProgress.done();
    return next();
  }
  try {
    await user.getUserInfo();
    const roles = user.role;
    const accessRoutes: any = await permission.generateRoutes(roles);
    accessRoutes.forEach((route: any) => {
      router.addRoute(route);
    });
    next({ ...to, replace: true });
  } catch (error) {
    // 移除 token 并跳转登录页
    await user.resetSession();
    next(`/login?redirect=${to.path}`);
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
