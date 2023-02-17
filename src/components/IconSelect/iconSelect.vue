<template>
  <div class="icon-select">
    <el-input
      v-model="iconName"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <template #suffix><i class="el-icon-search el-input__icon" /></template>
    </el-input>
    <div class="icon-select__list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon color="#999" :name="item" style="height: 30px; width: 16px; margin-right: 5px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const icons = [
  'yunshangchuan',
  'search',
  'daizhifudingdan',
  'fuwuqi',
  'tongji',
  'youxiguanli',
  'close_right',
  'close',
  'close_all',
  'close_left',
  'refresh',
  'size',
  'close_other',
  'dict',
  'dict_item',
  'homepage',
  'user',
  'jk',
  'setting',
  'dashboard',
  'jiaoyi',
  'quanxian',
  'test',
  'quanbushangpin',
  'jiaose',
  'shujuhuizong',
  'xiangqing',
  'liebiao',
  'shanghuguanli',
  'shenhe',
  'shuju',
  'zaixian'
] as string[];
const iconList = ref(icons);

const iconName = ref('');

const emit = defineEmits(['selected']);

function filterIcons() {
  iconList.value = icons;
  if (iconName.value) {
    iconList.value = icons.filter(item => item.indexOf(iconName.value) !== -1);
  }
}

function selectedIcon(name: string) {
  emit('selected', name);
  document.body.click();
}

function reset() {
  iconName.value = '';
  iconList.value = icons;
}

defineExpose({
  reset
});
</script>

<style lang="scss" scoped>
.icon-select {
  width: 100%;
  padding: 10px;

  &__list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
