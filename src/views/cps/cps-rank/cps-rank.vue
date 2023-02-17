<script setup lang="tsx">
import { usePagination, useTableField } from '@/hook/table';
import { getCpsRankList } from '@/service/api/cps';
import { TableStrMap } from '@/types/field';
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
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
  ] as FromItemData[]
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
          详情
        </el-link>
      </div>
    )
  }
];
const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);
const { total, currentPage, pageSize, pageChange, setTotal } = usePagination(getData);

const router = useRouter();
function details({ gameid }: any) {
  router.push({
    path: 'cps-details',
    query: {
      gameid
    }
  });
}

async function getData() {
  state.loading = true;
  const [res] = await getCpsRankList({
    $storeKey: ['date', 'sortType'],
    page: currentPage.value,
    pageSize: pageSize.value
  });
  setTotal(res?.data.total);
  setFormatTableData(res?.data?.list);
  state.loading = false;
}

const { searchArr, loading } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="searchArr" :handle="getData" @ready="getData"> </Search>

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
