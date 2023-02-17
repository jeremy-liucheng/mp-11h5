<script setup lang="tsx">
import { onMounted, reactive, toRefs } from 'vue';
import { addPayChannel, getPayChannelList } from '@/service/api/game';
import { createFormItems, formRules } from './fromItems';
import { useTableField } from '@/hook/table';
import { useForm } from '@/hook/form';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import MyForm from '@/components/CreateForm/myForm.vue';

const state = reactive({
  dialog: { visible: false, title: '新增支付渠道' } as any,
  modelValue: {
    channel_name: ''
  },
  loading: false
});

function closeDialog() {
  state.modelValue = { channel_name: '' };
  state.dialog.visible = false;
}

const { tableBase, tableData, setFormatTableData } = await useTableField();
async function getData() {
  state.loading = true;
  const [res] = await getPayChannelList({});
  setFormatTableData(res?.data);
  state.loading = false;
}
const submit = async () => {
  await addPayChannel({
    channel_name: state.modelValue.channel_name,
    showSuccess: true
  });
  closeDialog();
  getData();
};
onMounted(() => {
  getData();
});
const { dialog, modelValue, loading } = toRefs(state);
const { formCreate } = useForm(createFormItems, formRules);
</script>

<template>
  <app-table :loading="loading" :table-base="tableBase.tabStr" :table-data="tableData">
    <template #tableHeader>
      <el-button type="primary" @click="dialog.visible = true"> 新增支付渠道 </el-button>
    </template>
  </app-table>

  <Dialog :dialog-visible="dialog.visible" :title="dialog.title" @close-dialog="closeDialog">
    <my-form
      ref="formEl"
      :model-value="modelValue"
      :form="formCreate"
      @handler-submit="submit"
      @cancel="closeDialog"
    ></my-form>
  </Dialog>
</template>
