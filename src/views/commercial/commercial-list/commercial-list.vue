<script lang="tsx" setup>
import { useForm } from '@/hook/form';
import { useTableField } from '@/hook/table';
import { getMpMarchants } from '@/service/api/commercial';
import { PageTabs } from '@/types/field';
import { $cm, deepClone } from '@/utils/utils';
import { onMounted, reactive, ref, toRaw, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import {
  configureFormItems,
  configureFormRules,
  cpsFormItems,
  cpsFormRules,
  linkFormItems,
  linkFormRules,
  pwdFormItems,
  pwdFormRules
} from './formItems';
import { ExtItem, TmpFormRef } from '@/types/mgr';
import { ArrowDown } from '@element-plus/icons-vue';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const state = reactive({
  activeName: 0,
  loading: true,
  tabList: new Map() as any,
  DATA: [] as any[],
  tableBase: { title: '', tabStr: [] } as PageTabs,
  dialog: {
    title: '',
    configureVisible: false,
    linkVisible: false,
    modifyPwdVisible: false,
    modifyCpsVisible: false
  } as any,
  configureModelValue: {
    ext: [],
    type: []
  } as any,
  linkModelValue: {},
  modifyPwdModelValue: {},
  modifyCpsModelValue: {}
});

const tableFieldEnum = new Map([
  ['H5CPS', 'field1'],
  ['小游戏CPS', 'field1'],
  ['APP投放', 'field2'],
  ['买量', 'field3'],
  ['推广', 'field4'],
  ['返回弹窗', 'field4'],
  ['积分墙', 'field4'],
  ['微信MP广告', 'field4'],
  ['广告', 'field4'],
  ['员工', 'field5'],
  ['商务', 'field6'],
  ['下架', 'field7']
]);

const handleMap = new Map([
  [
    'field1',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-row justify="space-evenly">
            <el-link type="primary" onClick={() => configure(args)}>
              配置
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/income', gameid: args.gameid })}
            >
              统计
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
            >
              分成比例
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/statistics', gameid: args.gameid })}
            >
              对账
            </el-link>
            <el-dropdown
              trigger="click"
              v-slots={{
                dropdown: () => {
                  return (
                    <el-dropdown-menu>
                      <el-dropdown-item
                        onClick={() =>
                          navigateTo({ path: '/game/statistics', gameid: args.gameid })
                        }
                      >
                        子渠道
                      </el-dropdown-item>
                      <el-dropdown-item onClick={() => link(args)}>链接</el-dropdown-item>
                      <el-dropdown-item onClick={() => takeDown(args)}>下架</el-dropdown-item>
                      <el-dropdown-item onClick={() => modifyPwd(args)}>修改密码</el-dropdown-item>
                      <el-dropdown-item onClick={() => modifyCps(args)}>修改信息</el-dropdown-item>
                    </el-dropdown-menu>
                  );
                }
              }}
            >
              <span class="el-dropdown-link">
                更多
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
            </el-dropdown>
          </el-row>
        )
      }
    ]
  ],
  [
    'field2',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-row justify="space-evenly">
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
            >
              投放数据
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/income', gameid: args.gameid })}
            >
              单游戏数据
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
            >
              投放链接
            </el-link>
          </el-row>
        )
      }
    ]
  ],
  [
    'field3',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-row justify="space-evenly">
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
            >
              价格
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/income', gameid: args.gameid })}
            >
              统计
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
            >
              子渠道
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
            >
              接入方式
            </el-link>
            <el-link type="primary" onClick={() => modifyPwd(args)}>
              修改密码
            </el-link>
          </el-row>
        )
      }
    ]
  ],
  [
    'field4',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-row justify="space-evenly">
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
            >
              配置
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/income', gameid: args.gameid })}
            >
              统计
            </el-link>
            <el-link
              type="primary"
              onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
            >
              链接
            </el-link>
          </el-row>
        )
      }
    ]
  ],
  [
    'field5',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-link
            type="primary"
            onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
          >
            查看权限
          </el-link>
        )
      }
    ]
  ],
  [
    'field6',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        type: 'html',
        visible: 1,
        width: 300,
        render: (args: any) => (
          <el-link
            type="primary"
            onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
          >
            统计数据
          </el-link>
        )
      }
    ]
  ],
  [
    'field7',
    [
      {
        label: '操作栏',
        prop: 'action',
        fixed: 'right',
        width: 300,
        type: 'html',
        visible: 1,
        render: (args: any) => (
          <el-link type="primary" onClick={() => recovery(args)}>
            恢复
          </el-link>
        )
      }
    ]
  ]
]);

const router = useRouter();
function navigateTo({ gameid, path }: any) {
  router.push({
    path,
    query: { gameid }
  });
}

const { formCreate: configureFormCreate } = useForm(configureFormItems, configureFormRules);
const { formCreate: linkFormCreate } = useForm(linkFormItems, linkFormRules);
const { formCreate: pwdFormCreate } = useForm(pwdFormItems, pwdFormRules);
const { formCreate: cpsFormCreate } = useForm(cpsFormItems, cpsFormRules);
// 修改配置

// 删除格外参数
const removeDynamic = (item: ExtItem, key: string) => {
  const index = state.configureModelValue.ext.indexOf(item);
  if (index !== -1) {
    state.configureModelValue[key].splice(index, 1);
  }
};

// 添加额外参数
const addExtItem = (key: string) => {
  state.configureModelValue[key].push({
    date: Date.now(),
    value: '',
    key: ''
  });
};

// 配置弹窗
function configure(row: any) {
  const rowData = deepClone(toRaw(row));
  console.log(rowData, state.configureModelValue, '=====>rowData');
  state.dialog.title = '发行配置';
  state.dialog.configureVisible = true;
}

// 链接弹窗
function link(row: any) {
  const rowData = deepClone(toRaw(row));
  console.log(rowData, state.linkModelValue, '=====>rowData');
  state.dialog.title = '链接';
  state.dialog.linkVisible = true;
}

// 下架
async function takeDown({ id, name }: any) {
  await $cm({
    content: `是否下架：${name}`
  });
  console.log(id);
}

// 恢复
async function recovery({ id, name }: any) {
  await $cm({
    content: `是否恢复：${name}`
  });
  console.log(id);
}

// 修改密码
function modifyPwd(row: any) {
  const rowData = deepClone(toRaw(row));
  console.log(rowData, state.modifyPwdModelValue, '=====>rowData');
  state.dialog.title = '修改密码';
  state.dialog.modifyPwdVisible = true;
}

// 修改cps
function modifyCps(row: any) {
  const rowData = deepClone(toRaw(row));
  console.log(rowData, state.modifyCpsModelValue, '=====>rowData');
  state.dialog.title = '修改商户信息';
  state.dialog.modifyCpsVisible = true;
}

const formEl = ref<TmpFormRef>();
function closeDialog(visible: string) {
  formEl.value?.resetForm();
  state.dialog[visible] = false;
}

function handleSubmit(modelValue: any) {
  console.log(modelValue);
}

async function getData() {
  state.loading = true;
  const { completeTableBase, tableData, setFormatTableData } = await useTableField([], -1);
  const [res] = await getMpMarchants();
  const dataMap = new Map();
  res?.data.forEach((v, i) => {
    const tableBase = completeTableBase.value.find(e => v.name === e.title) || {
      title: '',
      tabStr: []
    };
    setFormatTableData(v.list, tableBase);
    const fieldEnum = tableFieldEnum.get(v.name) || '';
    dataMap.set(v.name, {
      sum_data: v.sum_data,
      id: i,
      tableData: tableData.value,
      tableBase: {
        title: tableBase.title,
        tabStr: [...tableBase.tabStr, ...(handleMap.get(fieldEnum) || [])]
      }
    });
  });
  state.tabList = dataMap;
  state.loading = false;
}

const table = ref<any>();

onMounted(() => {
  getData();
});

const {
  activeName,
  loading,
  configureModelValue,
  linkModelValue,
  tabList,
  dialog,
  modifyPwdModelValue,
  modifyCpsModelValue
} = toRefs(state);
</script>

<template>
  <el-tabs v-model="activeName" v-loading="loading" type="card" class="demo-tabs card">
    <el-tab-pane v-for="([k, value], i) in tabList" :key="value.id" :label="k" :name="value.id">
      <app-table
        v-if="activeName === i"
        ref="table"
        :loading="loading"
        :table-base="value.tableBase.tabStr"
        :table-data="value.tableData"
      >
        <template #tableHeader>
          <div v-show="[1, 2].includes(activeName)">
            <el-button type="primary">用户归属查询</el-button>
            <el-button type="primary">用户角色查询</el-button>
            <el-button type="primary">CPS商户明细查询</el-button>
            <el-button type="primary">分成比例修改记录</el-button>
          </div>
          <div v-show="[4].includes(activeName)">
            <el-button type="primary">买量渠道概括</el-button>
            <el-button type="primary">买量渠道每日数据</el-button>
          </div>
          <div v-show="[6].includes(activeName)">
            <el-button type="primary">返回弹窗统计数据</el-button>
          </div>
        </template>
      </app-table>
    </el-tab-pane>
  </el-tabs>

  <Dialog
    :dialog-visible="dialog.configureVisible"
    :title="dialog.title"
    @close-dialog="closeDialog('configureVisible')"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="configureModelValue"
      :form="configureFormCreate"
      @handler-submit="handleSubmit(configureModelValue)"
      @cancel="closeDialog('configureVisible')"
    >
      <template #special>
        <el-col :span="24">
          <el-form-item label="配置参数">
            <template v-if="!!configureModelValue.ext.length">
              <el-row v-for="v in configureModelValue.ext" :key="v.id" :gutter="20">
                <el-col :span="8">
                  <el-input v-model="v.key">
                    <template #prepend>Key</template>
                  </el-input>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="v.value">
                    <template #prepend>Value</template>
                    <template #append>
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="v.value"
                        placement="top-start"
                      >
                        <span class="search-icon">
                          <svg-icon name="search" />
                        </span>
                      </el-tooltip>
                      <span class="close-icon" @click.prevent="removeDynamic(v, 'ext')"
                        >x</span
                      ></template
                    >
                  </el-input>
                </el-col>
              </el-row>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-link :underline="false" type="primary" @click="addExtItem('ext')">
              + 添加额外参数</el-link
            >
          </el-form-item>
        </el-col>
      </template>
    </m-form>
  </Dialog>

  <Dialog
    :dialog-visible="dialog.linkVisible"
    :title="dialog.title"
    @close-dialog="closeDialog('linkVisible')"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="linkModelValue"
      :form="linkFormCreate"
      @handler-submit="handleSubmit(linkModelValue)"
      @cancel="closeDialog('linkVisible')"
    >
    </m-form>
  </Dialog>

  <Dialog
    :dialog-visible="dialog.modifyPwdVisible"
    :title="dialog.title"
    @close-dialog="closeDialog('modifyPwdVisible')"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modifyPwdModelValue"
      :form="pwdFormCreate"
      @handler-submit="handleSubmit(modifyPwdModelValue)"
      @cancel="closeDialog('modifyPwdVisible')"
    >
    </m-form>
  </Dialog>

  <Dialog
    :dialog-visible="dialog.modifyCpsVisible"
    :title="dialog.title"
    @close-dialog="closeDialog('modifyCpsVisible')"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modifyCpsModelValue"
      :form="cpsFormCreate"
      @handler-submit="handleSubmit(modifyCpsModelValue)"
      @cancel="closeDialog('modifyCpsVisible')"
    >
    </m-form>
  </Dialog>
</template>

<style scoped>
:global(.el-dropdown-link) {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
