<script setup lang="tsx">
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs, watchEffect } from 'vue';
import { getCpsData } from '@/service/api/cps';
import { usePagination, useTableField } from '@/hook/table';
import useStore from '@/store';
import LineChart from '@/components/Chart/charts.vue';
import { TableStrMap } from '@/types/field';
import { useRouter } from 'vue-router';
import { useRouteQuery } from '@/hook/utils';
import useMixin from './mixin';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import Search from '@/components/Search/search.vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const { preview, saveChartData, chartsOptions } = useMixin();
const state = reactive({
  loading: true,
  searchConfig: [
    {
      type: 'daterange',
      model: 'time',
      label: '查询时间',
      placeholder: '请选择时间'
    },
    {
      type: 'select',
      model: 'gameid',
      label: '游戏',
      placeholder: '请选择游戏',
      api: 'setGameList',
      storeField: 'gameList',
      style: {
        width: '250px'
      }
    },
    {
      type: 'select',
      model: 'chid',
      label: '渠道',
      placeholder: '请选择渠道',
      api: 'setChannelList',
      storeField: 'channelList',
      style: {
        width: '250px'
      }
    },
    {
      type: 'select',
      model: 'sortType',
      label: '排序类型',
      style: {
        width: '140px'
      },
      onPersistent: true,
      options: [
        {
          label: '收入',
          value: 'activeUserPayMoney'
        },
        {
          label: '新增收入',
          value: 'newUserPayMoney'
        },
        {
          label: '老活跃收入',
          value: 'oldUserPayMoney'
        },
        {
          label: '新增',
          value: 'newUser'
        },
        {
          label: '日均活跃',
          value: 'avgActive'
        },
        {
          label: '累计活跃',
          value: 'activeUser'
        },
        {
          label: '付费人数',
          value: 'payUser'
        },
        {
          label: '付费率',
          value: 'chargeRate'
        },
        {
          label: '日均ARPU',
          value: 'avgArpu'
        },
        {
          label: '日均ARPPU',
          value: 'avgArppu'
        }
      ]
    }
  ] as FromItemData[],
  search: { sortType: 'activeUserPayMoney' },
  chartsObj: {
    sumIncome: {}, //总收入
    sumNew: {}, // 总新增
    sumActive: {}, //总活跃
    chartsOptions
  } as any,
  dialog: {
    visible: false,
    title: '数据折线图'
  }
});

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    visible: 1,
    type: 'html',
    render: (args: any) => (
      <div>
        <el-link type="primary" onClick={() => details(args)}>
          统计
        </el-link>
      </div>
    )
  }
];
const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);
const { total, setTotal, pageChange, currentPage, pageSize } = usePagination();
const { gameid, chid } = useRouteQuery();
const { searchModel } = useStore();
gameid && (searchModel.gameid = +gameid);
chid && (searchModel.chid = +chid);

async function getData() {
  state.loading = true;
  const [res] = await getCpsData({
    cmd: 'getCpsChannelData',
    $storeKey: ['time', 'chid', 'gameid'],
    sortType: state.search.sortType,
    page: currentPage.value,
    pageSize: pageSize.value
  });
  saveChartData(state, res);
  setFormatTableData((res?.data as any).result);
  state.loading = false;
  setTotal(res?.data.total);
}

watchEffect(() => {
  if (chid) {
    tableBase.value.tabStr[1].label = '游戏ID';
    tableBase.value.tabStr[1].prop = 'gameid';
  } else {
    tableBase.value.tabStr[1].label = '渠道ID';
    tableBase.value.tabStr[1].prop = 'chid';
  }
});

function close() {
  state.dialog.visible = false;
}

const router = useRouter();
function details({ gameid, chid }: any) {
  router.push({
    path: 'stat-details',
    query: {
      gameid,
      chid
    }
  });
}

const { searchConfig, search, chartsObj, dialog, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchConfig" :handle="getData" @ready="getData">
    <template #ext-btn> <el-button type="primary"> 对比数据 </el-button> </template>
  </Search>
  <div class="pd line-charts">
    <el-card>
      <el-row justify="space-evenly" style="height: 70px">
        <el-col v-for="v in chartsObj" v-show="v.prop" :key="v.title" :span="6">
          <div class="charts-box">
            <div>{{ v.total }}</div>
            <div>
              {{ v.title
              }}<el-link @click="preview(v.prop, state)">
                <svg-icon name="shuju">查看</svg-icon>
              </el-link>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>

  <app-table
    :loading="loading"
    :table-base="tableBase.tabStr"
    :table-data="tableData"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @page-change="pageChange"
  >
  </app-table>

  <Dialog :dialog-visible="dialog.visible" :title="dialog.title" @close-dialog="close">
    <line-chart
      :options="chartsObj.chartsOptions"
      height="400px"
      :data="chartsObj.chartsOptions.series.data"
    />
  </Dialog>
</template>

<style scoped lang="scss">
.pd {
  padding-bottom: 10px;
}
.charts-box {
  text-align: center;
  height: 70px;
  div:nth-child(1) {
    font-size: 40px;
  }
  div:nth-child(2) {
    font-size: 16px;
  }
  a {
    font-size: 14px !important;
    vertical-align: middle;
  }
}
</style>
