<template>
  <div :class="{ 'has-logo': true }">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="v in routes"
          :key="v.path"
          :item="v"
          :base-path="v.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElScrollbar, ElMenu } from 'element-plus';
import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/assets/styles/variables.module.scss';
import useStore from '@/store';

const { permission, app } = useStore();
const route = useRoute();
const routes = computed(() => permission.routes);
const isCollapse = computed(() => !app.sidebar.opened);
const activeMenu = computed(() => {
  const { meta, path } = route;
  // 如果已设置了路径，则侧边栏将突出显示您所设置的路径
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>
