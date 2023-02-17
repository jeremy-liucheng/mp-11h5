<script setup lang="tsx">
import { onActivated, onDeactivated, reactive, ref, toRefs, watchEffect } from 'vue';
import { getGameList, getGameInfo, addGame, editGame } from '@/service/api/game';
import { FromItemData, TmpFormRef } from '@/types/mgr';
import { Role } from '@/types/enum';
import useStore from '@/store';
import { useRouter } from 'vue-router';
import Dialog from '@/components/Dialog/dialog.vue';
import { createFormItems, formRules } from './fromItems';
import { TableStrMap } from '@/types/field';
import { usePagination, useTableField } from '@/hook/table';
import { useForm } from '@/hook/form';
import AppTable from '@/components/AppTable/appTable.vue';
import Search from '@/components/Search/search.vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const {
  user: { role }
} = useStore();

const state = reactive({
  loading: true,
  searchArr: [
    {
      type: 'select',
      model: 'gameid',
      label: '游戏',
      placeholder: '请选择游戏',
      api: 'setGameList',
      storeField: 'gameList'
    },
    {
      type: 'select',
      model: 'cateId',
      label: '游戏类别',
      api: 'setGameCateIdList',
      storeField: 'gameCateList'
    }
  ] as FromItemData[],
  search: {},
  sumMoney: 0,
  hiddenMoney: true, // 显示收益字段,
  dialog: {
    visible: false,
    title: '添加游戏'
  },
  // 添加修改游戏弹窗数据
  modelValue: {
    delivery_url: '',
    security_key: '',
    game_url: '',
    pay_rate: '',
    mch_id: '',
    gameid: '',
    game_type: 0,
    stat_appid: '',
    ext: [],
    close_pay: 0,
    token_type: 0,
    orientation: 0,
    wx_option: 0,
    entry_url: '',
    content_url: '',
    test_url: '',
    money_name: '',
    money_rate: 100,
    publish_type: 0,
    publish_time: 0,
    biz_id: '',
    is_bt: 1,
    cate_id: '',
    inner_ext: [],
    name: ''
  } as any
});

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    fixed: 'right',
    width: 300,
    type: 'html',
    visible: 1,
    render: args => (
      <el-row justify="space-evenly">
        <el-link
          type="primary"
          onClick={() => navigateTo({ path: '/game/product', gameid: args.gameid })}
        >
          商品
        </el-link>
        <el-link
          type="primary"
          onClick={() => navigateTo({ path: '/game/income', gameid: args.gameid })}
        >
          收益
        </el-link>
        <el-link type="warning" onClick={() => generateGame(args)}>
          配置
        </el-link>
        <el-link
          type="primary"
          onClick={() => navigateTo({ path: '/game/create-server', gameid: args.gameid })}
        >
          开新服
        </el-link>
        <el-link
          type="primary"
          onClick={() => navigateTo({ path: '/game/statistics', gameid: args.gameid })}
        >
          统计
        </el-link>
      </el-row>
    )
  }
];

const { total, currentPage, pageSize, pageChange, setTotal } = usePagination(getData);

const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);

async function getData() {
  state.loading = true;
  const [res] = await getGameList({
    $storeKey: ['cateId', 'gameid'],
    page: currentPage.value,
    pageSize: pageSize.value
  });
  if (!res) return (state.loading = false);
  setFormatTableData(res.data);
  state.sumMoney = res.sumMoney || 0;
  setTotal(res?.total);
  state.loading = false;
}

onActivated(() => {
  const unwatch = watchEffect(() => {
    const {
      searchModel: { cateId }
    } = useStore();
    // 联运游戏显示研发 和 联运方
    if (cateId === 2) {
      tableBase.value.tabStr[3] && (tableBase.value.tabStr[3].visible = 0);
      tableBase.value.tabStr[4] && (tableBase.value.tabStr[4].visible = 0);
    }
    if (cateId === 1) {
      tableBase.value.tabStr[3] && (tableBase.value.tabStr[3].visible = 1);
      tableBase.value.tabStr[4] && (tableBase.value.tabStr[4].visible = 1);
    }
    console.log(tableBase.value.tabStr);
  });
  onDeactivated(() => {
    unwatch();
  });
});

const router = useRouter();
function navigateTo({ gameid, path }: any) {
  router.push({
    path,
    query: { gameid }
  });
}
// 显示收益
const trigger = () => {
  state.hiddenMoney = !state.hiddenMoney;
  tableBase.value.tabStr[2].hidden = Number(state.hiddenMoney);
};

// 弹窗标题
const formEl = ref<TmpFormRef>();
const closeDialog = () => {
  formEl.value?.resetForm();
  state.dialog.visible = false;
};

const { formCreate, upFormData } = useForm(createFormItems, formRules);
// 添加游戏编辑游戏前置操作
async function generateGame(args: any) {
  state.dialog.title = args?.gameid ? '修改游戏' : '添加游戏';
  state.dialog.visible = true;
  if (state.dialog.title === '添加游戏') return;
  const [res] = await getGameInfo({
    gameid: args.gameid
  });
  upFormData(res!.data, state.modelValue);
}

const addGameFn = async () => {
  const { ext } = state.modelValue;
  const [res] = await addGame({ ...state.modelValue, ext: JSON.stringify(ext) });
  res && closeDialog();
  getData();
};

const editGameFn = async () => {
  const { ext, inner_ext } = state.modelValue;
  const [res] = await editGame({
    ...state.modelValue,
    ext: JSON.stringify(ext),
    inner_ext: JSON.stringify(inner_ext)
  });
  res && closeDialog();
  getData();
};

const handleSubmit = async () => {
  switch (state.dialog.title) {
    case '修改游戏':
      editGameFn();
      break;
    default:
      addGameFn();
      break;
  }
};

// 私密字段 和 额外字段
interface ExtItem {
  key: string;
  value: string;
  date: number;
}

// 删除格外参数
const removeDynamic = (item: ExtItem, key: string) => {
  const index = state.modelValue.ext.indexOf(item);
  if (index !== -1) {
    state.modelValue[key].splice(index, 1);
  }
};

// 添加额外参数
const addExtItem = (key: string) => {
  state.modelValue[key].push({
    date: Date.now(),
    value: '',
    key: ''
  });
};

const { search, searchArr, loading, hiddenMoney, sumMoney, dialog, modelValue } = toRefs(state);
</script>
<template>
  <Search :search="search" :from-data="searchArr" :handle="getData" @ready="getData">
    <template #ext-btn>
      <el-button type="primary" class="add-game" @click="generateGame({})"> 添加游戏 </el-button>
    </template>
  </Search>
  <app-table
    :loading="loading"
    :table-base="tableBase.tabStr"
    :table-data="tableData"
    :total="total"
    :current-page="currentPage"
    :page-size="pageSize"
    @page-change="pageChange"
  >
    <template #tableHeader>
      <el-button type="primary" :underline="false" @click="trigger">
        {{ hiddenMoney ? '查看收入数据' : `今日累计收入: ￥${sumMoney}` }}
      </el-button>
    </template>
  </app-table>
  <Dialog
    v-if="dialog.visible"
    :dialog-visible="dialog.visible"
    :title="dialog.title"
    @close-dialog="closeDialog"
  >
    <m-form
      ref="formEl"
      :title="dialog.title"
      :model-value="modelValue"
      :form="formCreate"
      @handler-submit="handleSubmit"
      @cancel="closeDialog"
    >
      <template #special>
        <el-col :span="24">
          <el-form-item label="额外参数(请参照接入文档进行填写)" label-width="155px">
            <template v-if="!!modelValue.ext.length">
              <el-row v-for="v in modelValue.ext" :key="v.id" :gutter="20">
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
        <el-col v-show="dialog.title === '修改游戏' && role === Role.Manager" :span="24"
          ><el-form-item label="私有参数" label-width="155px">
            <template v-if="!!modelValue.inner_ext.length">
              <el-row v-for="v in modelValue.inner_ext" :key="v.id" :gutter="20">
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
                      <span class="close-icon" @click.prevent="removeDynamic(v, 'inner_ext')"
                        >x</span
                      ></template
                    >
                  </el-input>
                </el-col>
              </el-row>
            </template>
          </el-form-item></el-col
        >
        <el-col v-show="dialog.title === '修改游戏' && role === Role.Manager" :span="24">
          <el-form-item>
            <el-link :underline="false" type="primary" @click="addExtItem('inner_ext')">
              + 添加私有参数</el-link
            >
          </el-form-item>
        </el-col>
      </template>
    </m-form>
  </Dialog>
</template>

<style lang="scss" scoped>
.footer {
  width: 920px;
}
.search-icon {
  display: inline-block;
  width: 30px;
  border-right: 2px;
  :hover {
    cursor: pointer;
  }
  + .close-icon:hover {
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.el-input-group__append {
  background-color: var(--el-color-primary);
  color: white;
  :hover {
    cursor: pointer;
  }
}
</style>
