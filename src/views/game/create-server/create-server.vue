<script lang="tsx" setup>
import TabNav from '@/components/TabNav/tabNav.vue';
import { useCurrentGameInfo } from '@/hook/utils';
import { FromItemData } from '@/types/mgr';
import { reactive, toRefs, watch } from 'vue';
import { getZoneList, addZone, delZone } from '@/service/api/game';
import { $cm } from '@/utils/utils';
import { createFormItems, formRules } from './fomrItems';
import { TableStrMap } from '@/types/field';
import { usePagination, useTableField } from '@/hook/table';
import { useForm } from '@/hook/form';
import { useRouter } from 'vue-router';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import Search from '@/components/Search/search.vue';

const { gameid, gName } = useCurrentGameInfo();
const state = reactive({
  loading: false,
  searchArr: [
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
  modelValue: {
    open_time: 0,
    title: ''
  },
  dialog: {
    title: '添加开服服务',
    visible: false
  },
  search: { gameid: +gameid! }
});

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    width: 180,
    visible: 1,
    type: 'html',
    render: (args: any) => (
      <div>
        <el-row justify="space-evenly">
          <el-link type="warning" onClick={() => generateGame(args)}>
            修改
          </el-link>
          <el-link type="danger" onClick={() => del(args)}>
            删除
          </el-link>
        </el-row>
      </div>
    )
  }
];
const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);

const { setTotal } = usePagination(getData);
async function getData() {
  state.loading = true;
  console.log(state.search);
  const [res, err] = await getZoneList({
    gameid: state.search.gameid
  });
  if (err) return;
  setTotal();
  setFormatTableData(res!.data);
  state.loading = false;
}

const { formCreate, upFormData } = useForm(createFormItems, formRules);
const generateGame = (args: any) => {
  state.dialog.title = args?.id ? '修改开服服务' : '添加开服服务';
  state.dialog.visible = true;
  if (state.dialog.title === '添加开服服务') return;
  upFormData(args, state.modelValue);
};

const handleSubmit = async () => {
  await addZone({ ...state.modelValue, gameid: state.search.gameid, showSuccess: true });
  state.dialog.visible = false;
  getData();
};

const closeDialog = () => {
  state.modelValue = { title: '', open_time: 0 };
  state.dialog.visible = false;
};
const del = async (args: { id: number; title: string }) => {
  const { id, title } = args;
  await $cm({
    content: `是否删除区服：${title}`
  });
  await delZone({
    gameid: state.search.gameid,
    id,
    showSuccess: true
  });
  getData();
};

const router = useRouter();
watch(
  () => state.search.gameid,
  v => {
    router.replace({
      name: 'create-server',
      query: {
        gameid: v
      }
    });
  }
);

const { searchArr, search, dialog, modelValue, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchArr" :handle="getData" @ready="getData">
    <template #ext-btn>
      <el-button type="primary" @click="generateGame({})"> 添加服务器信息 </el-button>
    </template>
  </Search>

  <app-table :loading="loading" :table-base="tableBase.tabStr" :table-data="tableData">
    <template #tableHeader>
      <Tab-Nav title="开服列表" :g-name="gName" />
    </template>
  </app-table>
  <Dialog :dialog-visible="dialog.visible" :title="dialog.title" @close-dialog="closeDialog">
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modelValue"
      :form="formCreate"
      @handler-submit="handleSubmit"
      @cancel="closeDialog"
    />
  </Dialog>
</template>
