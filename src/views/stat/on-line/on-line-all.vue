<script lang="tsx" setup>
import { onMounted, reactive, toRefs } from 'vue';
import LineChart from '@/components/Chart/charts.vue';
import { getAllPlatformOnline } from '@/service/api/stat';
import { ECOption } from '@/hook/echarts';
import { timeSlot } from '@/utils/utils';
import { useTableField } from '@/hook/table';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { TableStrMap } from '@/types/field';
import AppTable from '@/components/AppTable/appTable.vue';
import { Stat } from '@/types/api/types';

const state = reactive({
  options: {
    legend: {
      data: [] as Array<any>
    },
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      show: true, // 是否显示
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 84
      },
      data: timeSlot(1)
    },
    yAxis: {
      type: 'value'
    },
    series: []
  } as ECOption,
  data: [] as Stat.AllPlatformOnline['s_data'],
  loading: false,
  search: {} as any,
  tableBase: [
    {
      label: '操作栏',
      prop: 'action',
      visible: 1,
      render: (args: any) => (
        <div>
          <el-row justify="space-evenly">
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/stat/on-line', gameid: args.gameid })}
            >
              {args.game_name}
            </el-link>
          </el-row>
        </div>
      )
    },
    {
      label: '在线人数',
      prop: 'count',
      visible: 1
    }
  ] as TableStrMap[]
});

const { tableData, setFormatTableData } = await useTableField();

const router = useRouter();
function navigateTo({ gameid, path }: any) {
  router.push({
    path,
    query: { gameid }
  });
}

onMounted(() => {
  getData();
});

async function getData() {
  state.loading = true;
  const [res] = await getAllPlatformOnline();
  if (!res) return (state.loading = true);
  state.data = res.data.s_data;
  (state.options.legend! as any).data = [];
  (state.options.series as Array<any>) = [];
  res.data.s_data.forEach(({ data, game_name }: any) => {
    (state.options.legend! as any).data.push(game_name);
    (state.options.series as Array<any>).push({
      name: game_name,
      type: 'line',
      data: Object.values(data).map(e => e),
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      }
    });
  });
  setFormatTableData(res.data.m_data);
  state.loading = false;
}

function gameChange(val: number) {
  navigateTo({ path: '/stat/on-line', gameid: val });
}

const {
  searchModel: { gameList }
} = useStore();
const { options, data, search, tableBase, loading } = toRefs(state);
</script>

<template>
  <div class="chart-container">
    <el-card>
      <line-chart :options="options" :data="data" height="350px"> </line-chart>
    </el-card>
  </div>

  <app-table :loading="loading" :table-base="tableBase" :table-data="tableData">
    <template #tableHeader>
      <el-select v-model="search.gameid" placeholder="请选择游戏" filterable @change="gameChange">
        <el-option
          v-for="(v, i) in gameList"
          :key="i"
          :value="v.value"
          :label="v.label"
        ></el-option>
      </el-select>
    </template>
  </app-table>
</template>

<style scoped>
.chart-container {
  padding-bottom: 10px;
}
</style>
