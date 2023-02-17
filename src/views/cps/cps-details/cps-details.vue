<script setup lang="tsx">
import { usePagination, useTableField } from '@/hook/table';
import { getCpsGameRankList } from '@/service/api/cps';
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';

const state = reactive({
  loading: false,
  searchArr: [
    {
      type: 'datetime',
      model: 'date',
      label: '时间'
    },
    {
      type: 'select',
      model: 'sortType',
      label: '排序规则',
      options: [
        {
          label: '新增',
          value: 0
        },
        {
          label: '流水',
          value: 1
        }
      ]
    }
  ] as FromItemData[],
  tableData: {
    tabs1: []
  }
});

const { tableBase, tableData, setFormatTableData } = await useTableField();
const { total, currentPage, pageSize, pageChange, setTotal } = usePagination(getData);

const router = useRouter();
const route = useRoute();
const back = () => router.push('cps-rank');

async function getData() {
  state.loading = true;
  const { gameid } = route.query;
  if (!gameid) return back();
  const [res] = await getCpsGameRankList({
    $storeKey: ['date', 'sortType'],
    page: currentPage.value,
    pageSize: pageSize.value,
    gameid
  });
  setTotal(res?.data.total);
  setFormatTableData(res?.data.list);
  state.loading = false;
}

const { searchArr, loading } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="searchArr" :handle="getData" @ready="getData">
    <template #ext-btn>
      <el-button type="primary" @click="back()"> 返回 </el-button>
    </template>
  </Search>
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
</template>
