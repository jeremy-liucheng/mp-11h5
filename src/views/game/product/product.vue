<script lang="tsx" setup>
import TabNav from '@/components/TabNav/tabNav.vue';
import { FromItemData, TmpFormRef } from '@/types/mgr';
import { reactive, ref, toRefs } from 'vue';
import {
  batchAddGameProduct,
  delGameProduct,
  editGameProduct,
  getGameProductList,
  addGameProduct
} from '@/service/api/game';
import { $cm, createTbCSV } from '@/utils/utils';
import Upload from '@/components/Upload/uploadExcel.vue';
import { useCurrentGameInfo } from '@/hook/utils';
import { createFormItems, formRules } from './formItems';
import { TableStrMap } from '@/types/field';
import { usePagination, useTableField } from '@/hook/table';
import { useForm } from '@/hook/form';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import Search from '@/components/Search/search.vue';

const { gameid, gName } = useCurrentGameInfo();

const state = reactive({
  searchArr: [
    {
      type: 'input',
      model: 'keyword',
      label: '商品名称',
      placeholder: '请输入商品名称'
    }
  ] as FromItemData[],
  search: {
    money: {
      minMoney: '',
      maxMoney: ''
    }
  },
  loading: false,
  modelValue: {
    hide: 1,
    cost: '',
    product_name: '',
    des: '',
    product_id: ''
  },
  dialog: {
    title: '添加商品信息',
    productVisible: false,
    uploadVisible: false
  }
});

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    width: 180,
    type: 'html',
    visible: 1,
    render: args => (
      <el-row justify="space-evenly">
        <el-link type="warning" onClick={() => generateGame(args)}>
          修改
        </el-link>
        <el-link type="danger" onClick={() => del(args)}>
          删除
        </el-link>
      </el-row>
    )
  }
];
const { tableBase, setFormatTableData, tableData } = await useTableField(manipulate);

const { total, currentPage, pageSize, pageChange, setTotal } = usePagination(getData);
async function getData() {
  state.loading = true;
  const [res, err] = await getGameProductList({
    gameid,
    $storeKey: ['keyword'],
    minMoney: state.search.money.minMoney,
    maxMoney: state.search.money.maxMoney,
    page: currentPage.value,
    pageSize: pageSize.value
  });
  if (err) return;
  setFormatTableData(res!.data.list);
  setTotal(res!.data.total);
  state.loading = false;
}

const { formCreate, upFormData } = useForm(createFormItems, formRules);

const generateGame = async (args: any) => {
  state.dialog.title = args?.product_id ? '修改商品信息' : '添加商品信息';
  state.dialog.productVisible = true;
  if (state.dialog.title === '添加商品信息') return;
  upFormData(args, state.modelValue);
};
const formEl = ref<TmpFormRef>();
const handleSubmit = async () => {
  switch (state.dialog.title) {
    case '修改商品信息':
      editGameProduct({ ...state.modelValue, gameid, showSuccess: true });
      break;
    default:
      addGameProduct({ ...state.modelValue, gameid, showSuccess: true });
      break;
  }
  closeDialog();
  getData();
};

const closeDialog = () => {
  state.dialog.productVisible = false;
  formEl.value?.resetForm();
  state.modelValue = {
    hide: 1,
    cost: '',
    product_name: '',
    des: '',
    product_id: ''
  };
};

const del = async (args: { product_id: number; product_name: string }) => {
  const { product_id, product_name } = args;
  await $cm({
    content: `是否删除条件：${product_name}`
  });
  await delGameProduct({
    gameid,
    product_id
  });
  getData();
};

const batchAdd = () => (state.dialog.uploadVisible = true);
const uploadSuccess = async (args: any) => {
  await batchAddGameProduct({
    gameid,
    products: JSON.stringify(args)
  });
  getData();
};

const downLoadTem = () => {
  createTbCSV({
    tableStr: {
      title: '商品模版',
      tabStr: [
        {
          prop: 'id',
          label: '商品名:product_name'
        },
        {
          prop: 'id',
          label: '商品描述:des'
        },
        {
          prop: 'id',
          label: '金额(单位：元):cost'
        },
        {
          prop: 'id',
          label: '是否下架（填数字，0显示，1隐藏）:hide'
        }
      ]
    },
    tableData: []
  });
};

const { search, searchArr, modelValue, dialog, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchArr" :handle="getData" @ready="getData">
    <el-form-item label="金额">
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

    <template #ext-btn>
      <el-button type="primary" @click="generateGame({})"> 添加游戏商品 </el-button>
      <el-button type="primary" @click="batchAdd()"> 批量添加游戏商品 </el-button>
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
    <template #tableHeader>
      <Tab-Nav title="商品列表" :g-name="gName" />
    </template>
  </app-table>

  <Dialog :dialog-visible="dialog.productVisible" :title="dialog.title" @close-dialog="closeDialog">
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modelValue"
      :form="formCreate"
      @handler-submit="handleSubmit"
      @cancel="closeDialog"
    />
  </Dialog>

  <Dialog
    :dialog-visible="dialog.uploadVisible"
    title="上传文件"
    @close-dialog="dialog.uploadVisible = false"
  >
    <Upload @upload-success="uploadSuccess">
      <template #tip>
        <el-link type="primary" class="el-upload__tip" @click="downLoadTem"
          >上传模版下载
          <el-link type="danger"><a id="exc">(上传只适用于上传模版的表头,请下载后填写)</a></el-link>
        </el-link>
      </template>
    </Upload>
  </Dialog>
</template>
