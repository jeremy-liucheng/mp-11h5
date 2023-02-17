<script lang="ts" setup>
import useStore from '@/store';
import { computed } from 'vue';
const props = defineProps<{
  title: string;
  gName?: string;
}>();
const {
  searchModel: { gameid, gameList }
} = useStore();
const gName = computed(
  () => props.gName || gameList.find(e => e.value === gameid)?.label || gameList[0]?.label
);
</script>
<template>
  <div class="game-title">
    {{ gName || props.gName }}<span class="product-title">:{{ props.title }}</span>
  </div>
</template>
<style lang="scss" scoped>
.game-title {
  font-size: 22px;
}
.product-title {
  margin-left: 15px;
}
.game-title span {
  vertical-align: bottom;
  font-size: 18px;
}
</style>
