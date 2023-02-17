<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, toRefs, watch, withDefaults } from 'vue';
import resize from '@/utils/resize';
import * as echarts from 'echarts';
const props = withDefaults(
  defineProps<{
    options: any;
    id?: string;
    height?: string;
    width?: string;
  }>(),
  {
    id: 'lineChart',
    height: '400px',
    width: '100%'
  }
);
const { options, height, id } = toRefs(props);

const { mounted, chart, beforeDestroy } = resize();
onBeforeUnmount(() => {
  beforeDestroy();
});

onMounted(() => {
  mounted();
  nextTick(() => {
    initChart();
  });
});

let myChart = null as any;

// 接下来的使用就跟之前一样，初始化图表，设置配置项
function initChart() {
  const oEl = document.querySelector(`#${id.value}`) as HTMLElement;
  myChart = echarts.init(oEl, {});
  myChart.showLoading({
    text: '加载中...',
    color: '#409eff',
    textColor: '#409eff',
    lineWidth: 2,
    maskColor: 'rgba(255, 255, 255, 0.2)',
    zlevel: 0
  });
  setOption(options);
  chart.value = myChart;
}

function setOption(options: any) {
  if (options.value?.xAxis && !options.value.xAxis?.data.length) {
    myChart.setOption(
      {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        }
      },
      true
    );
    myChart.hideLoading();
    return;
  }
  myChart.setOption(options.value);
  myChart.hideLoading();
}

watch(
  () => options,
  () => {
    setOption(options);
  },
  {
    deep: true
  }
);
</script>

<template>
  <div :id="id" :style="{ height: height }"></div>
</template>
