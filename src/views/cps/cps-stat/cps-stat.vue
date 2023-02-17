<script setup lang="tsx">
import { FromItemData } from '@/types/mgr';
import { reactive, ref, toRefs, watchEffect, onActivated } from 'vue';
import { getCpsData, downloadCpsDataCompare } from '@/service/api/cps';
import { usePagination, useTableField } from '@/hook/table';
import useStore from '@/store';
import LineChart from '@/components/Chart/charts.vue';
import { TableStrMap } from '@/types/field';
import { useRouter } from 'vue-router';
import useMixin from './mixin';
import { FormInstance } from 'element-plus';
import AppTable from '@/components/AppTable/appTable.vue';
import Dialog from '@/components/Dialog/dialog.vue';
import Search from '@/components/Search/search.vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const { preview, saveChartData, chartsOptions } = useMixin();
const state = reactive({
  loading: false,
  searchConfig: [
    {
      type: 'daterange',
      model: 'time',
      label: '查询时间',
      placeholder: '请选择时间'
    },
    {
      type: 'select',
      model: 'sumType',
      label: '查询类型',
      style: {
        width: '100px'
      },
      options: [
        {
          label: '游戏',
          value: 1
        },
        {
          label: '渠道',
          value: 2
        }
      ]
    },
    {
      type: 'select',
      model: 'sortType',
      label: '排序类型',
      style: {
        width: '140px'
      },
      onPersistent: true,
      options: [
        {
          label: '收入',
          value: 'activeUserPayMoney'
        },
        {
          label: '新增收入',
          value: 'newUserPayMoney'
        },
        {
          label: '老活跃收入',
          value: 'oldUserPayMoney'
        },
        {
          label: '新增',
          value: 'newUser'
        },
        {
          label: '日均活跃',
          value: 'avgActive'
        },
        {
          label: '累计活跃',
          value: 'activeUser'
        },
        {
          label: '付费人数',
          value: 'payUser'
        },
        {
          label: '付费率',
          value: 'chargeRate'
        },
        {
          label: '日均ARPU',
          value: 'avgArpu'
        },
        {
          label: '日均ARPPU',
          value: 'avgArppu'
        }
      ]
    }
  ] as FromItemData[],
  search: { sortType: 'activeUserPayMoney' },
  chartsObj: {
    sumIncome: {}, //总收入
    sumNew: {}, // 总新增
    sumActive: {}, //总活跃
    chartsOptions
  } as any,
  dialog: {
    visible: false,
    title: '数据折线图',
    visibleCompare: false
  },
  form: {
    times: [
      {
        key: 1,
        value: ''
      }
    ]
  }
});

const manipulate: TableStrMap[] = [
  {
    label: '操作栏',
    prop: 'action',
    visible: 1,
    type: 'html',
    render: (args: any) => (
      <div>
        <el-link type="primary" onClick={() => details(args)}>
          明细
        </el-link>
      </div>
    )
  }
];

const { tableBase, tableData, setFormatTableData } = await useTableField(manipulate);
const { total, setTotal, pageChange, currentPage, pageSize } = usePagination();
console.log(tableBase.value);
async function getData() {
  console.time('数据请求');
  state.loading = true;
  const [res] = await getCpsData({
    $storeKey: ['time', 'sumType'],
    sortType: state.search.sortType,
    page: currentPage.value,
    pageSize: pageSize.value
  });
  saveChartData(state, res);
  setFormatTableData(res?.data.list);
  state.loading = false;
  setTotal(res?.data.total);
}

onActivated(() => {
  console.log('active');
});

watchEffect(() => {
  const {
    searchModel: { sumType }
  } = useStore();
  switch (sumType) {
    case 1:
      tableBase.value.tabStr[1].label = '游戏ID';
      tableBase.value.tabStr[1].prop = 'gameid';
      break;
    default:
      tableBase.value.tabStr[1].label = '渠道ID';
      tableBase.value.tabStr[1].prop = 'chid';
      break;
  }
});

const router = useRouter();
function details({ gameid, chid }: any) {
  router.push({
    path: 'stat-details',
    query: {
      gameid,
      chid
    }
  });
}

const removeTime = () => {
  state.form.times.pop();
};

const addTime = () => {
  state.form.times.push({
    key: Date.now(),
    value: ''
  });
};

const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (valid) {
      const compareTimes = JSON.stringify(state.form.times.map(({ value }) => value));
      downloadCpsDataCompare({
        sortType: state.search.sortType,
        compareTimes
      });
      close();
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  state.form = {
    times: [
      {
        key: 1,
        value: ''
      }
    ]
  };
  formEl.resetFields();
};

function close() {
  state.dialog.visible = false;
  state.dialog.visibleCompare = false;
  resetForm(formRef.value);
}

const { searchConfig, search, chartsObj, dialog, form, loading } = toRefs(state);
</script>

<template>
  <Search :search="search" :from-data="searchConfig" :handle="getData" @ready="getData">
    <template #ext-btn>
      <el-button type="primary" @click="dialog.visibleCompare = true"> 对比数据 </el-button>
    </template>
  </Search>
  <div class="pd line-charts">
    <el-card>
      <el-row justify="space-evenly" style="height: 70px">
        <el-col v-for="v in chartsObj" v-show="v.prop" :key="v.title" :span="6">
          <div class="charts-box">
            <div>{{ v.total }}</div>
            <div>
              {{ v.title
              }}<el-link @click="preview(v.prop, state)">
                <svg-icon name="shuju">查看</svg-icon>
              </el-link>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>

  <app-table
    :loading="loading"
    :table-base="tableBase.tabStr"
    :table-data="tableData"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @page-change="pageChange"
  >
  </app-table>

  <Dialog :dialog-visible="dialog.visible" :title="dialog.title" @close-dialog="close">
    <line-chart
      :options="chartsObj.chartsOptions"
      height="400px"
      :data="chartsObj.chartsOptions.series.data"
    />
  </Dialog>

  <Dialog
    :width="600"
    :dialog-visible="dialog.visibleCompare"
    title="对比数据"
    @close-dialog="close"
  >
    <el-form ref="formRef" :model="form" label-width="120px" class="demo-dynamic">
      <el-form-item
        v-for="(v, index) in form.times"
        :key="v.key"
        label="对比时间"
        :prop="'times.' + index + '.value'"
        :rules="{ required: true, message: '时间不能为空' }"
      >
        <el-date-picker
          v-model="v.value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          format="YYYY/MM/DD"
          value-format="YYYYMMDD"
          end-placeholder="结束时间"
          :default-value="[new Date(), new Date()]"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="addTime">添加对比时间</el-button>
        <el-button v-if="form.times.length > 1" class="mt-2" @click.prevent="removeTime()"
          >删除对比时间</el-button
        >
        <el-button @click="resetForm(formRef)">重置</el-button>
        <el-button type="primary" @click="submitForm(formRef)">下载</el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<style scoped lang="scss">
.pd {
  padding-bottom: 10px;
}
.charts-box {
  text-align: center;
  height: 70px;
  div:nth-child(1) {
    font-size: 40px;
  }
  div:nth-child(2) {
    font-size: 16px;
  }
  a {
    font-size: 14px !important;
    vertical-align: middle;
  }
}
</style>
