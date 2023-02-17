<script lang="ts" setup>
import TabNav from '@/components/TabNav/tabNav.vue';
import { useCurrentGameInfo } from '@/hook/utils';
import { FromItemData, SpanMethodProps } from '@/types/mgr';
import { reactive, toRefs, watch } from 'vue';
import { getSumList } from '@/service/api/game';
import { useTableField } from '@/hook/table';
import { useRouter } from 'vue-router';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';

const { gameid, gName } = useCurrentGameInfo();
const state = reactive({
  loading: false,
  searchArr: [
    {
      type: 'daterange',
      model: 'time',
      label: '时间',
      placeholder: '请选择时间'
    },
    {
      type: 'select',
      model: 'gameid',
      label: '游戏',
      placeholder: '请选择游戏',
      api: 'setGameList',
      storeField: 'gameList',
      onPersistent: true
    }
  ] as FromItemData[],
  historyTotal: '0',
  searchTotal: 0,
  hiddenMoney: true, // 显示收益
  search: { gameid: +gameid! }
});

const { tableBase, tableData, setFormatTableData } = await useTableField();

const getData = async () => {
  state.loading = true;
  const [res, err] = await getSumList({
    gameid: state.search.gameid,
    $storeKey: ['time']
  });
  if (err) return;
  state.historyTotal = res!.data.historyTotal;
  state.searchTotal = res!.data.searchTotal;
  const arr: any = [];
  Object.entries(res!.data.list).forEach(([key, val]: any) => {
    const map = new Map();
    val.list.forEach((e: any) => {
      const obj: any = {};
      if (!map.has(key)) {
        obj.row = val.list.length;
      }
      Object.assign(obj, { ...e, dayTotal: val.dayTotal });
      map.set(key, val.length);
      arr.push(obj);
    });
  });
  setFormatTableData(arr);
  state.loading = false;
};

// 显示收益字段
// 显示收益
const trigger = () => (state.hiddenMoney = !state.hiddenMoney);

const objectSpanMethod = ({ row, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0 || columnIndex === 3) {
    return {
      rowspan: row.row,
      colspan: 1
    };
  }
};

const router = useRouter();
watch(
  () => state.search.gameid,
  v => {
    router.replace({
      name: 'income',
      query: {
        gameid: v
      }
    });
  }
);

const { searchArr, searchTotal, search, historyTotal, hiddenMoney, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchArr" :handle="getData" @ready="getData" />

  <app-table
    :loading="loading"
    :table-base="tableBase.tabStr"
    :table-data="tableData"
    :span-method="objectSpanMethod"
  >
    <template #tableHeader>
      <Tab-Nav title="支付汇总" :g-name="gName" />
      <el-link v-show="!!searchTotal" type="primary" :underline="false">
        汇总收入{{ searchTotal }}
      </el-link>
      <el-button type="primary" :underline="false" @click="trigger">
        {{ hiddenMoney ? '查看收入数据' : `今日累计收入: ￥ ${historyTotal} ` }}
      </el-button>
    </template>
  </app-table>
</template>

<style lang="scss" scoped>
.pd {
  width: 100%;
  padding-bottom: 20px;
}
</style>
