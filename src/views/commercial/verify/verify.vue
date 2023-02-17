<script lang="tsx" setup>
import { useTableField, usePagination } from '@/hook/table';
import { getRegisterList } from '@/service/api/commercial';
import { TableStrMap } from '@/types/field';
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    visible: 1,
    type: 'html',
    render: (args: any) => (
      <div>
        <el-link type="primary" onClick={() => details(args)}>
          详细信息
        </el-link>
      </div>
    )
  }
];
const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);
const router = useRouter();
function details({ nick }: any) {
  router.push({
    path: 'verify-details',
    query: {
      nick
    }
  });
}

const state = reactive({
  loading: false,
  searchArr: [
    {
      type: 'input',
      model: 'keyword',
      label: '商户名称'
    }
  ] as FromItemData[]
});

const { total, currentPage, pageSize, pageChange, setTotal } = usePagination(getData);
async function getData() {
  state.loading = true;
  const [res] = await getRegisterList({
    $storeKey: ['keyword'],
    page: currentPage.value,
    pageSize: pageSize.value
  });
  setTotal(res?.data.total);
  setFormatTableData(res?.data.list);
  state.loading = false;
}

const { searchArr, loading } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="searchArr" :handle="getData" @ready="getData"> </Search>
  <app-table
    :loading="loading"
    :table-data="tableData"
    :table-base="tableBase.tabStr"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @page-change="pageChange"
  >
  </app-table>
</template>
