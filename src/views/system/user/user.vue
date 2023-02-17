<script lang="tsx" setup>
import { getRoleList, delRole, editRole, getRoleMenuList } from '@/service/api/user';
import { toRefs, reactive, onMounted, ref, nextTick } from 'vue';
import { $cm } from '@/utils/utils';
import { FormInstance } from 'element-plus';
import { TmpFormRef } from '@/types/mgr';
import { useTableField } from '@/hook/table';
import { useForm } from '@/hook/form';
import { createFormItems, formRules } from './formItems';
import { ElTree } from 'element-plus';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import { User } from '@/types/api/types';

const state = reactive({
  dialog: {
    title: '添加用户',
    visible: false
  },
  loading: false,
  formRef: null as unknown as FormInstance,
  rowData: {} as User.Role | null,
  formData: {
    name: '',
    brief: ''
  },
  menuList: [] as any,
  treeRef: null as unknown as InstanceType<typeof ElTree>
});
onMounted(() => getData());

const { tableBase, tableData, setFormatTableData } = await useTableField([
  {
    label: '操作栏',
    prop: 'action',
    width: 180,
    visible: 1,
    render: (args: any) => (
      <div>
        <el-row justify="space-evenly">
          <el-link type="warning" onClick={() => openEditDialog(args)}>
            修改
          </el-link>
          <el-link type="danger" onClick={() => del(args)}>
            删除
          </el-link>
        </el-row>
      </div>
    )
  }
]);

console.log(tableBase);
const getData = async () => {
  state.loading = true;
  const [res] = await getRoleList();
  if (!res) return;
  setFormatTableData(res.data.roleList);
  state.menuList = res.data.menuList;
  state.loading = false;
};

const del = async (args: any) => {
  const { name, id } = args;
  await $cm({
    content: `确定删除用户：${name}`
  });
  await delRole({
    id
  });
  getData();
};

const { formCreate, upFormData } = useForm(createFormItems, formRules);
async function openEditDialog(args?: any) {
  state.rowData = args || null;
  state.dialog.title = '添加用户';
  if (args) {
    state.dialog.title = '修改用户';
    const [res] = await getRoleMenuList({
      role_id: args.id
    });
    upFormData(args, state.formData);
    state.dialog.visible = true;
    nextTick(() => {
      state.treeRef?.setCheckedKeys(res?.data || [], false);
    });
    return;
  }
  state.dialog.visible = true;
}

const formEl = ref<TmpFormRef>();
const close = () => {
  state.rowData = null;
  state.formData = {
    name: '',
    brief: ''
  };
  state.dialog.visible = false;
};

const handleSubmit = async () => {
  const menuIdStr = JSON.stringify(state.treeRef?.getCheckedKeys(false));
  const [res] = await editRole({
    id: state.rowData?.id,
    ...state.formData,
    menuIds: menuIdStr
  });
  if (res) getData();
  close();
};

const { dialog, formData, formRef, loading, menuList, treeRef } = toRefs(state);
</script>

<template>
  <app-table :loading="loading" :table-base="tableBase.tabStr" :table-data="tableData">
    <template #tableHeader>
      <el-button type="primary" @click="openEditDialog()">添加用户</el-button>
    </template>
  </app-table>

  <Dialog
    :dialog-visible="dialog.visible"
    :title="dialog.title"
    :form-ref="formRef"
    @close-dialog="close"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="formData"
      :form="formCreate"
      @handler-submit="handleSubmit"
      @cancel="close"
    >
      <template #special>
        <el-col :span="24" class="admeasure-router">
          <el-form-item label="分配页面">
            <el-tree ref="treeRef" :data="menuList" node-key="id" highlight-current show-checkbox />
          </el-form-item>
        </el-col>
      </template>
    </m-form>
  </Dialog>
</template>

<style scoped lang="scss">
.pd {
  padding-bottom: 20px;
}
</style>

<style>
.admeasure-router .el-tree {
  width: 100% !important;
}
</style>
