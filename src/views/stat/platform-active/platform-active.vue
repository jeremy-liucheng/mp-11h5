<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import LineChart from '@/components/Chart/charts.vue';
import { FromItemData } from '@/types/mgr';
import { getPlatformDataList } from '@/service/api/stat';
import useStore from '@/store';
import Search from '@/components/Search/search.vue';

const state = reactive({
  options: {
    legend: {
      data: ['平台活跃', '爱微游活跃', '应用宝活跃', '玩吧活跃']
    },
    tooltip: {
      show: true, // 是否显示
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '平台活跃',
        type: 'line',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      },
      {
        name: '爱微游活跃',
        type: 'line',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      },
      {
        name: '应用宝活跃',
        type: 'line',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      },
      {
        name: '玩吧活跃',
        type: 'line',
        data: [],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      }
    ]
  } as any,
  searchConfig: [
    {
      type: 'daterange',
      model: 'time',
      label: '时间',
      placeholder: '请选择时间'
    }
  ] as FromItemData[],
  showCharts: false
});

async function getData() {
  const {
    searchModel: { time }
  } = useStore();
  const [res] = await getPlatformDataList({
    startDate: time![0],
    endDate: time![1]
  });
  if (!res) return;
  const chartObj = res.data.reduce(
    (
      acc: {
        date: Array<number>;
        active: Array<number>;
        awy_active: Array<number>;
        wanba_active: Array<number>;
        yyb_active: Array<number>;
      },
      cur
    ) => {
      acc.date.push(cur.date);
      acc.active.push(cur.active);
      acc.awy_active.push(cur.awy_active);
      acc.wanba_active.push(cur.wanba_active);
      acc.yyb_active.push(cur.yyb_active);
      return acc;
    },
    {
      date: [],
      active: [],
      awy_active: [],
      wanba_active: [],
      yyb_active: []
    }
  );
  state.options.xAxis.data = chartObj.date;
  state.options.series[0].data = chartObj.active;
  state.options.series[1].data = chartObj.awy_active;
  state.options.series[2].data = chartObj.wanba_active;
  state.options.series[3].data = chartObj.yyb_active;
  state.showCharts = true;
}

const { options, searchConfig, showCharts } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="searchConfig" :handle="getData" @ready="getData" />
  <div class="card table">
    <line-chart v-if="showCharts" :options="options" height="700px"></line-chart>
  </div>
</template>
