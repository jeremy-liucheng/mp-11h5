<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="cachedViews">
      <suspense>
        <component :is="Component" :key="route.fullPath" />
      </suspense>
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@/store';

const { tagsView } = useStore();

const cachedViews = computed(() => tagsView.cachedViews);
</script>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
