<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        (!item.meta || !item.meta.alwaysShow)
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <svg-icon
            v-if="onlyOneChild.meta && onlyOneChild.meta.icon"
            :name="onlyOneChild.meta.icon"
          />
          <template #title>
            {{ onlyOneChild.meta.title }}
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <!-- popper-append-to-body -->
      <template #title>
        <svg-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon"></svg-icon>
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import path from 'path-browserify';
import { isExternal } from '@/utils/validate';
import AppLink from './Link.vue';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    required: false
  },
  basePath: {
    type: String,
    required: true
  }
});

const onlyOneChild = ref();
function hasOneShowingChild(children = [] as any, parent: any) {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item: any) => {
    if (item.meta && item.meta.hidden) {
      return false;
    }
    // ??????????????????????????????????????????
    onlyOneChild.value = item;
    return true;
  });
  // ????????????????????????????????????????????????????????????
  if (showingChildren.length === 1) {
    return true;
  }
  // ?????????????????????????????????????????????????????????
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
}

// ????????????
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  return path.resolve(props.basePath, routePath);
}
</script>

<style lang="scss" scoped></style>
