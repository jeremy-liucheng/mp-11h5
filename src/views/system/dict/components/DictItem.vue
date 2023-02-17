<script setup lang="tsx">
import { reactive, ref, toRefs, watchEffect } from 'vue';
import { getMenuFieldList, editMenuField, updateMenuField, delMenuField } from '@/service/api/menu';
import { FormInstance } from 'element-plus';
import { $cm, str2Obj } from '@/utils/utils';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import { FieldData, TableStrMap } from '@/types/field';

const props = defineProps<{
  id: number;
}>();
const state = reactive({
  loading: false,
  data: [] as FieldData[],
  dialogVisible: false,
  formData: {
    fieldObjArr: '',
    ext: [] as any
  },
  tableBase: [
    {
      prop: 'label',
      label: '字段名称',
      width: 180,
      visible: 1
    },
    {
      prop: 'prop',
      label: '字段映射',
      width: 120,
      visible: 1
    },
    {
      prop: 'visible',
      label: '是否启用',
      width: 100,
      visible: 1,
      render: (args: any) => {
        return (
          <el-switch
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            v-model={args.visible}
            active-value={1}
            inactive-value={0}
            onChange={() => switchChange(args)}
          />
        );
      }
    },
    {
      prop: 'listOrder',
      label: '权重',
      width: 180,
      visible: 1,
      render: (args: any) => (
        <el-row justify="space-evenly">
          <el-input-number
            v-model={args.listOrder}
            min={1}
            max={100}
            onChange={() => {
              listOrderChange(args);
            }}
          />
        </el-row>
      )
    },
    {
      prop: 'enum',
      label: '枚举',
      width: 180,
      visible: 1,
      type: 'expand',
      render: (args: any) => (
        <el-row justify="space-evenly">
          {Object.entries(args.enum).map(([key, _value]) => {
            console.log(key);
            return key;
          })}
        </el-row>
      )
    },
    {
      label: '操作栏',
      prop: 'action',
      visible: 1,
      render: (args: any) => (
        <el-row justify="space-evenly">
          <el-link type="warning" onClick={() => generate(args)}>
            修改
          </el-link>
          <el-link type="danger" onClick={() => del(args)}>
            删除
          </el-link>
        </el-row>
      )
    }
  ] as TableStrMap[],
  rowData: null as any
});
const { id } = toRefs(props);
watchEffect(() => {
  getData();
});

async function getData() {
  state.loading = true;
  const [res, err] = await getMenuFieldList({
    menuId: id.value
  });
  if (err) return (state.loading = false);
  state.data = res!.data;
  state.loading = false;
}

const handleAdd = async () => {
  dialogVisible.value = true;
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const formRef = ref<FormInstance>();
const closeDialog = () => {
  state.rowData = null;
  dialogVisible.value = false;
  state.formData.ext = [];
  resetForm(formRef.value);
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (valid) {
      let res: unknown;
      if (!state.rowData) {
        [res] = await editMenuField({
          menuId: id.value,
          fieldObjArr: JSON.stringify(str2Obj(state.formData.fieldObjArr)),
          showSuccess: true
        });
      } else {
        const fieldStr = state.formData.ext.reduce(
          (acc: any, pre: any) => !pre.id && { ...acc, ...pre },
          {}
        );
        delete fieldStr.key;
        [res] = await updateMenuFieldHandle(fieldStr);
      }
      res && getData();
      closeDialog();
    } else {
      return false;
    }
  });
};

async function updateMenuFieldHandle(fieldStr: any) {
  return await updateMenuField({
    id: state.rowData.id,
    fieldObjStr: JSON.stringify(fieldStr),
    showSuccess: true
  });
}

function generate(args: any) {
  state.rowData = args;
  Object.entries(args).forEach(([key, val]) => {
    state.formData.ext.push({ [key]: val, key });
  });
  dialogVisible.value = true;
}

async function del(args: any) {
  const { id, label } = args;
  await $cm({
    content: `是否删除：${label}`
  });
  await delMenuField({
    id,
    showSuccess: true
  });
  getData();
}
function switchChange(args: any) {
  updateMenuField({
    id: args.id,
    fieldObjStr: JSON.stringify(args),
    showSuccess: true
  });
}
function listOrderChange(args: any) {
  updateMenuField({
    id: args.id,
    fieldObjStr: JSON.stringify(args),
    showSuccess: true
  });
}

const removeDynamic = (item: any) => {
  const index = state.formData.ext.indexOf(item);
  if (index !== -1) {
    state.formData.ext.splice(index, 1);
  }
};

const addExtItem = () => {
  state.formData.ext.push({
    key: '',
    value: ''
  });
};
const { data, formData, dialogVisible, tableBase, rowData, loading } = toRefs(state);
</script>

<template>
  <app-table :loading="loading" :table-base="tableBase" :table-data="data">
    <template #tableHeader>
      <el-button type="success" @click="handleAdd">新增</el-button>
    </template>
  </app-table>

  <Dialog :dialog-visible="dialogVisible" title="添加字段" @close-dialog="closeDialog">
    <el-form ref="formRef" :model="formData" label-width="100px">
      <el-form-item v-if="!rowData" label="字段数组对象" prop="fieldObjArr">
        <el-input
          v-model="formData.fieldObjArr"
          type="textarea"
          :rows="30"
          placeholder="请输入字段数组对象"
        />
      </el-form-item>
      <div v-else>
        <el-form-item label="额外参数(请参照接入文档进行填写)" label-width="155px">
          <el-row
            v-for="(v, i) of formData.ext"
            v-show="v.key !== 'enum'"
            :key="v.key"
            :gutter="20"
          >
            <el-col :span="8">
              <el-input v-model="v.key">
                <template #prepend>Key</template>
              </el-input>
            </el-col>
            <el-col :span="16">
              <el-input v-model="formData.ext[i][v.key]">
                <template #prepend>Value</template>
                <template #append>
                  <span class="close-icon" @click.prevent="removeDynamic(v)">x</span></template
                >
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-col :span="24">
          <el-form-item>
            <el-link :underline="false" type="primary" @click="addExtItem()">
              + 添加额外参数</el-link
            >
          </el-form-item>
        </el-col>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </div>
    </template>
  </Dialog>
</template>
