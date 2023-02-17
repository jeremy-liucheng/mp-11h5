import { AppState } from '@/types/store';
import { localStorage } from '@/utils/storage';
import { defineStore } from 'pinia';

export default defineStore({
  id: 'app',
  state: (): AppState => ({
    device: 'desktop',
    sidebar: {
      opened: localStorage.get('sidebarStatus') ? !!+localStorage.get('sidebarStatus') : true,
      withoutAnimation: false
    }
  }),
  actions: {
    // 左侧路由栏状态
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        localStorage.set('sidebarStatus', 1);
      } else {
        localStorage.set('sidebarStatus', 0);
      }
    },
    // 关闭路由栏
    closeSideBar(withoutAnimation: any) {
      localStorage.set('sidebarStatus', 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    // 切换设备
    toggleDevice(device: string) {
      this.device = device;
    }
  }
});
