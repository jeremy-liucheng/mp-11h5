<script lang="tsx" setup>
import { editCopyright, getCopyrightList } from '@/service/api/game';
import { onMounted, reactive, ref, nextTick } from 'vue';
import Upload from '@/components/Upload/uploadSoftRecord.vue';
import { SoftRecord } from '@/types/enum';
import useStore from '@/store';
import { TmpFormRef } from '@/types/mgr';
import { createFormItems, formRules } from './formItems';
import { useForm } from '@/hook/form';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';

const tableBase: any = reactive({
  title: '',
  tabStr: [
    {
      prop: 'name',
      label: '游戏名称',
      width: 280,
      visible: 1
    },
    {
      prop: 'certificate_path',
      label: '软件著作权证书',
      width: 220,
      type: 'html',
      visible: 1,
      render: (args: any) => renderCell(args, 'certificate_path')
    },
    {
      prop: 'file_path',
      label: '版号文件',
      width: 220,
      type: 'html',
      visible: 1,
      render: (args: any) => renderCell(args, 'file_path')
    },
    {
      prop: 'url',
      label: '备案链接',
      width: 220,
      type: 'html',
      visible: 1,
      render: (args: any) => renderCell(args, 'url')
    }
  ]
});

function renderCell(rowData: any, prop: string) {
  return (
    <el-row gutter={20} justify="space-evenly">
      {rowData[prop] ? (
        <>
          {prop !== 'url' && (
            <el-link type="primary" onClick={() => preView({ rowData, type: SoftRecord[prop] })}>
              查看
            </el-link>
          )}
          <el-link type="primary" onClick={() => upload({ rowData, type: SoftRecord[prop] })}>
            修改
          </el-link>
        </>
      ) : (
        <el-link type="primary" onClick={() => upload({ rowData, type: SoftRecord[prop] })}>
          上传
        </el-link>
      )}
    </el-row>
  );
}
const tableData = ref<any>([]);
const tableRef = ref();
const loading = ref(true);

onMounted(async () => {
  const [res, err] = await getCopyrightList({});
  if (err) return;
  tableData.value = res!.data;

  nextTick(() => {
    loading.value = false;
  });
});

const previewUrl = ref('');
const softRecordTitle = ref('');
const preView = async ({ rowData, type }: any) => {
  softRecordTitle.value = `${rowData.name}---软件著作权证书`;
  const {
    user: { session }
  } = useStore();
  previewUrl.value = `${
    import.meta.env.VITE_APP_BASE_API
  }/platform/?cmd=readCopyrightDetail&gameid=${rowData.gameid}&type=${type}&session=${session}`;
};

const uploadDialogVisible = ref(false);
const uploadUrlDialogVisible = ref(false);
const params = ref();
const upload = async ({ rowData, type }: any) => {
  if (typeof type !== 'number') {
    uploadUrlDialogVisible.value = true;
    uploadUrl(rowData);
    return;
  }
  uploadDialogVisible.value = true;
  params.value = { ...rowData, type };
};

const modelValue = ref({
  url: ''
});

const { formCreate, upFormData } = useForm(createFormItems, formRules);

const formEl = ref<TmpFormRef>();
const rowDataCopy = {
  gameid: 0
};
const uploadUrl = (rowData: any) => {
  rowDataCopy.gameid = rowData.gameid;
  upFormData(rowData, modelValue);
};

const handleSubmit = async () => {
  editCopyright({ ...modelValue.value, gameid: rowDataCopy.gameid, showSuccess: true });
  uploadUrlDialogVisible.value = false;
};
</script>

<template>
  <app-table
    ref="tableRef"
    :loading="loading"
    :table-data="tableData"
    :table-base="tableBase.tabStr"
  ></app-table>
  <Dialog
    :dialog-visible="uploadDialogVisible"
    title="上传文件"
    @close-dialog="uploadDialogVisible = false"
  >
    <Upload :params="params" />
    <template #footer>
      <el-button @click="uploadDialogVisible = false">取消</el-button>
    </template>
  </Dialog>
  <Dialog
    :dialog-visible="previewUrl !== ''"
    :title="softRecordTitle"
    center
    @close-dialog="previewUrl = ''"
  >
    <div class="img-preview">
      <el-image style="width: 100%; height: 100%" :src="previewUrl" fit="contain">
        <template #error>
          <div class="error-slot">
            <embed :src="previewUrl" type="application/pdf" width="100%" height="600px" />
          </div>
        </template>
      </el-image>
    </div>
    <template #footer>
      <el-button @click="previewUrl = ''">取消</el-button>
    </template>
  </Dialog>
  <Dialog
    :dialog-visible="uploadUrlDialogVisible"
    title="修改游戏版号"
    @close-dialog="uploadUrlDialogVisible = false"
  >
    <MForm
      ref="formEl"
      :model-value="modelValue"
      :form="formCreate"
      @handler-submit="handleSubmit"
      @cancel="uploadUrlDialogVisible = false"
    >
      <template #special>
        <el-link type="danger">样例：</el-link>
        <el-image
          style="width: 100%; height: 100%"
          src="https://mp.11h5.com/images/copyright_url.png"
      /></template>
    </MForm>
  </Dialog>
</template>

<style scoped lang="scss">
.img-preview {
  width: 100%;
  height: 600px;
}
</style>
