<template>
  <el-scrollbar ref="scrollContainer" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import useStore from '@/store';

const tagAndTagSpacing = ref(4);
const { proxy } = getCurrentInstance() as any;

const emits = defineEmits(['scroll']);
const emitScroll = () => {
  emits('scroll');
};

const { tagsView } = useStore();

const visitedViews = computed(() => tagsView.visitedViews);

const scrollWrapper = computed(() => proxy?.$refs.scrollContainer?.wrap$);

onMounted(() => {
  scrollWrapper.value &&
    scrollWrapper.value.addEventListener('scroll', emitScroll, { passive: true });
});
onBeforeUnmount(() => {
  scrollWrapper.value && scrollWrapper.value.removeEventListener('scroll', emitScroll);
});

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as any).wheelDelta;
  scrollWrapper.value.scrollLeft = scrollWrapper.value?.scrollLeft + eventDelta / 4;
}

function moveToTarget(currentTag: any) {
  const $container = proxy.$refs.scrollContainer.$el;
  const $containerWidth = $container?.offsetWidth;
  const $scrollWrapper = scrollWrapper.value;

  let firstTag = null;
  let lastTag = null;

  // find first tag and last tag
  if (visitedViews.value.length > 0) {
    firstTag = visitedViews.value[0];
    lastTag = visitedViews.value[visitedViews.value.length - 1];
  }

  if (firstTag === currentTag) {
    if ($scrollWrapper) {
      $scrollWrapper.scrollLeft = 0;
    }
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
  } else {
    const tagListDom = document.getElementsByClassName('tags-view__item');
    const currentIndex = visitedViews.value.findIndex((item: any) => item === currentTag);
    let prevTag = null;
    let nextTag = null;
    for (const k in tagListDom) {
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if ((tagListDom[k] as any).dataset.path === visitedViews.value[currentIndex - 1].path) {
          prevTag = tagListDom[k];
        }
        if ((tagListDom[k] as any).dataset.path === visitedViews.value[currentIndex + 1].path) {
          nextTag = tagListDom[k];
        }
      }
    }

    // 这个标签下一个标签的offsetleft
    const afterNextTagOffsetLeft =
      (nextTag as any).offsetLeft + (nextTag as any).offsetWidth + tagAndTagSpacing.value;

    // 这个标签上一个标签的offsetleft
    const beforePrevTagOffsetLeft = (prevTag as any).offsetLeft - tagAndTagSpacing.value;

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
}

defineExpose({
  moveToTarget
});
</script>

<style lang="scss" scoped>
.scroll-container {
  .el-scrollbar__bar {
    bottom: 0px;
  }

  .el-scrollbar__wrap {
    height: 49px;
  }
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
</style>
