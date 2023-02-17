<script lang="ts">
export default { name: 'order' };
</script>

<script lang="ts" setup>
import { getOrderList } from '@/service/api/game';
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs } from 'vue';
import { usePagination, useTableField } from '@/hook/table';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';

const state = reactive({
  searchConfig: [
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
      storeField: 'gameList'
    },
    {
      type: 'input',
      model: 'uid',
      label: '账号id',
      placeholder: '请输入账号id'
    },
    {
      type: 'input',
      model: 'transId',
      label: '订单号',
      placeholder: '请输入订单号'
    },
    {
      type: 'select',
      model: 'deliveryResult',
      label: '发货状态',
      placeholder: '请选择发货状态',
      options: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '发货成功',
          value: 1
        },
        {
          label: '发货失败',
          value: 2
        }
      ]
    }
  ] as FromItemData[],
  search: {
    money: {
      minMoney: '',
      maxMoney: ''
    },
    zone: {
      minZone: '',
      maxZone: ''
    }
  },
  loading: false
});

const { tableBase, tableData, setFormatTableData } = await useTableField();
const { setTotal, total, currentPage, pageSize, pageChange } = usePagination(getData);
async function getData() {
  state.loading = true;
  const [res] = await getOrderList({
    $storeKey: ['time', 'gameid'],
    ...state.search.money,
    ...state.search.zone,
    page: currentPage.value,
    pageSize: pageSize.value
  });
  setTotal(res?.data.total);
  setFormatTableData(res?.data.list);
  state.loading = false;
}
const { searchConfig, search, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchConfig" :handle="getData" @ready="getData">
    <el-form-item label="金额区间">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-input v-model="search.money.minMoney" placeholder="请输入最小金额" />
        </el-col>
        <el-col :span="1"> - </el-col>
        <el-col :span="11">
          <el-input v-model="search.money.maxMoney" placeholder="请输入最大金额" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="区服区间">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-input v-model="search.zone.minZone" placeholder="请输入最小区服" />
        </el-col>
        <el-col :span="1"> - </el-col>
        <el-col :span="11">
          <el-input v-model="search.zone.maxZone" placeholder="请输入最大区服" />
        </el-col>
      </el-row>
    </el-form-item>
  </Search>
  <app-table
    :loading="loading"
    :table-base="tableBase.tabStr"
    :table-data="tableData"
    :total="total"
    :current-page="currentPage"
    :page-size="pageSize"
    @page-change="pageChange"
  >
  </app-table>
</template>
