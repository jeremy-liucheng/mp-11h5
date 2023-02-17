<script lang="ts" setup>
import { reactive, onMounted, toRefs } from 'vue';
import { useTableField } from '@/hook/table';
import { getChannelMoneys } from '@/service/api/game';
import { FromItemData } from '@/types/mgr';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';

const { tableData, tableBase, setFormatTableData } = await useTableField();

const state = reactive({
  loading: false,
  formData: [
    {
      type: 'daterange',
      model: 'time',
      label: '时间',
      placeholder: '请选择时间'
    }
  ] as FromItemData[]
});
async function getData() {
  state.loading = true;
  const [res] = await getChannelMoneys({
    $storeKey: ['time']
  });
  const arr: any = [];
  Object.entries(res!.data).forEach(([_, val]: any) => {
    val.channel_data.forEach((e: any) => {
      arr.push({ ...e, date: val.date, sum: val.sum });
    });
  });
  setFormatTableData(arr);
  state.loading = false;
}

onMounted(() => {
  getData();
});

const { loading, formData } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="formData" :handle="getData" />
  <app-table
    :loading="loading"
    :table-data="tableData"
    :table-base="tableBase.tabStr"
    :merge-fields="['date', 'sum']"
    :scroll-y="{ enabled: false }"
  >
  </app-table>
</template>
