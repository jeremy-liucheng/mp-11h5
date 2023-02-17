<template>
  <div class="app-wrapper">
    <el-aside :class="classObj" :width="sidebar.opened ? '200px' : '50px'">
      <Sidebar class="sidebar-container" />
    </el-aside>
    <el-container class="main-container">
      <div class="app-main">
        <navbar /> <tags-view /><el-main>
          <div class="table-box">
            <app-main /></div
        ></el-main>
      </div>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from 'vue';
import { AppMain, Navbar, TagsView } from './components/index';
import Sidebar from './components/Sidebar/index.vue';

import useStore from '@/store';

const { app } = useStore();

const sidebar = computed(() => app.sidebar);

const classObj = computed(() => ({
  openSidebar: sidebar.value.opened,
  hideSidebar: !sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation
}));
watchEffect(() => {
  app.toggleDevice('desktop');
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
@import '@/assets/styles/variables.module.scss';

.app-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .app-main {
    display: flex;
    flex-direction: column;
  }
  .skeleton {
    display: flex;
    flex-direction: column;
    justify-items: space-around;
    height: 100%;
    .skeleton-table {
      margin-top: 20px;
      height: 100%;
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
