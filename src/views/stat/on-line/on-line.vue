<script setup lang="tsx">
import { getGamePlatformOnline, getGameCurPlatformOnline } from '@/service/api/stat';
import { ExtItem, FromItemData } from '@/types/mgr';
import { toRefs, reactive, onBeforeUnmount, watchEffect } from 'vue';
import charts from '@/components/Chart/charts.vue';
import { ECOption } from '@/hook/echarts';
import { useInterval, useRouteQuery } from '@/hook/utils';
import { timeSlot } from '@/utils/utils';
import dayJs from 'dayjs';
import { FormCreate } from '@/components/CreateForm/modules/FormCreate';
import { useRouter } from 'vue-router';
import Dialog from '@/components/Dialog/dialog.vue';
import Search from '@/components/Search/search.vue';

const state = reactive<{
  searchConfig: FromItemData[];
  options: ECOption;
  options2: ECOption;
  data: Array<any>;
  data2: Array<any>;
  dialog: { title: string; visible: boolean };
  modelValue: { ext: any };
  timer: NodeJS.Timer | undefined;
  search: any;
}>({
  timer: undefined,
  dialog: {
    title: '',
    visible: false
  },
  search: {},
  modelValue: {
    ext: []
  },
  searchConfig: [
    {
      type: 'select',
      model: 'gameid',
      label: '游戏',
      placeholder: '请选择游戏',
      api: 'setGameList',
      storeField: 'gameList',
      onPersistent: true
    }
  ],
  data: [],
  data2: [],
  options2: {
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
  },
  options: {
    toolbox: {
      feature: {
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        type: 'gauge',
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'inherit'
          }
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: 40,
          fontSize: 20
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: 'inherit'
        },
        data: [
          {
            value: 564,
            name: '当前在线'
          }
        ]
      }
    ]
  }
});

const router = useRouter();
function getData() {
  router.replace({
    name: 'on-line',
    query: {
      gameid: state.search.gameid
    }
  });
  clearInterval(state.timer);
  state.timer = useInterval(
    () => {
      compare(1);
      getPieData();
    },
    5000,
    {
      immediate: true
    }
  );
}

async function getPieData() {
  const [res] = await getGameCurPlatformOnline({
    gameid: state.search.gameid
  });
  if (!res) return;
  state.options.series![0].data[0].value = res.data.count || 0;
  state.data = [res.data];
}

async function compare(num: number) {
  state.options2.series = [];
  if (!state.dialog.visible) {
    state.modelValue = {
      ext: [
        {
          value: dayJs().format('YYYYMMDD'),
          date: dayJs().unix(),
          key: ''
        }
      ]
    };
  }
  for (let i = 1; i <= num; i += 1) {
    const d = dayJs().subtract(i, 'day');
    state.modelValue.ext.push({
      value: d.format('YYYYMMDD'),
      date: d.unix(),
      key: ''
    });
  }
  const ext = state.modelValue.ext.reduce(
    (acc: { date: any; value: any }, cur: { date: any; value: any }) => {
      acc.date.push(state.dialog.visible ? dayJs(cur.value).unix() : cur.date);
      acc.value.push(cur.value);
      return acc;
    },
    {
      date: [],
      value: []
    }
  );
  const [res] = await getGamePlatformOnline({
    gameid: state.search.gameid,
    timeObjStr: JSON.stringify(ext.date)
  });
  if (!res) return;
  state.options2.legend = {
    data: ext.value
  };
  state.modelValue.ext.forEach((v: any) => {
    (state.options2.series as Array<any>).push({
      name: v.value,
      type: 'line',
      data: Object.values(res.data[v.value]).map(e => e),
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
  state.data2 = [res.data];
}

function closeDialog() {
  state.dialog.visible = false;
}

// 删除格外参数
const removeDynamic = (item: ExtItem, key: string) => {
  const index = state.modelValue.ext.indexOf(item);
  if (index !== -1) {
    state.modelValue[key].splice(index, 1);
  }
};

// 添加额外参数
const addExtItem = (key: string) => {
  state.modelValue[key].push({
    value: '',
    key: ''
  });
};

function openCustom() {
  state.dialog.visible = true;
}

const handleSubmit = async () => {
  compare(0);
  state.dialog.visible = false;
};

onBeforeUnmount(() => {
  clearInterval(state.timer);
});

const { gameid } = useRouteQuery();

watchEffect(() => {
  state.search.gameid = Number(gameid) || '';
});

const { searchConfig, search, options, dialog, modelValue, options2, data, data2 } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchConfig" :handle="getData" @ready="getData"> </Search>
  <div class="container-box">
    <el-card> <charts id="pieCharts" :options="options" height="400px" :data="data" /> </el-card>
  </div>
  <div>
    <el-card>
      <template #header>
        <el-button type="primary" @click="compare(1)">和昨天比较</el-button
        ><el-button type="primary" @click="compare(7)">比较最近一周</el-button
        ><el-button type="primary" @click="openCustom">添加自定义比较项</el-button> </template
      ><charts id="line" :options="options2" height="400px" :data="data2" />
    </el-card>
  </div>

  <Dialog
    width="30%"
    :dialog-visible="dialog.visible"
    :title="dialog.title"
    @close-dialog="closeDialog"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modelValue"
      :form="new FormCreate()"
      @handler-submit="handleSubmit"
      @cancel="closeDialog"
    >
      <template #special>
        <el-col :span="24">
          <el-form-item>
            <template v-if="!!modelValue.ext.length">
              <el-col v-for="v in modelValue.ext" :key="v.id">
                <el-input v-model="v.value">
                  <template #prepend>日期</template>
                  <template #append>
                    <span class="close-icon" @click.prevent="removeDynamic(v, 'ext')"
                      >x</span
                    ></template
                  >
                </el-input>
              </el-col>
            </template>
          </el-form-item>
        </el-col>
      </template>
      <template #extBtn>
        <el-button type="primary" @click="addExtItem('ext')">新增</el-button>
      </template>
    </m-form>
  </Dialog>
</template>
