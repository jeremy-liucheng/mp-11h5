<script setup lang="ts">
import { FromItemData } from '@/types/mgr';
import { toRefs, reactive, watch } from 'vue';
import { downLoadApi, getSum } from '@/service/api/commercial';
import useStore from '@/store';
import Search from '@/components/Search/search.vue';

const {
  downGameHistorySum,
  downloadPaySum,
  downloadYearRoundBill,
  downloadAllGameSumBill,
  downloadMonthRoundBill,
  downloadAllGameRefund,
  downloadYearRoundGameRefund,
  downloadRefundRedPackList,
  downloadBillDetail,
  downloadCompanyTransfer,
  downloadDiscountBill,
  downloadDiscountCoupon
} = downLoadApi();

const state = reactive({
  searchConfig: [
    {
      type: 'month',
      model: 'month',
      label: '选择年月'
    },
    {
      type: 'daterange',
      model: 'time',
      label: '选择日期'
    },
    {
      type: 'select',
      model: 'gameid',
      label: '游戏',
      storeField: 'gameList',
      api: 'setGameList'
    }
  ] as FromItemData[],
  downLoadList: [
    {
      label: '游戏历史数据',
      api: downGameHistorySum,
      id: 1
    },
    {
      label: '下载汇总支付',
      api: downloadPaySum,
      id: 2
    },
    {
      label: '整年游戏汇总账单',
      api: downloadYearRoundBill,
      id: 3
    },
    {
      label: '全部游戏汇总账单',
      api: downloadAllGameSumBill,
      id: 4
    },
    {
      label: '月份至月份下载',
      api: downloadMonthRoundBill,
      id: 5
    },
    {
      label: '全部游戏退款明细',
      api: downloadAllGameRefund,
      id: 6
    },
    {
      label: '整年游戏退款明细',
      api: downloadYearRoundGameRefund,
      id: 7
    },
    {
      label: '全部游戏微信红包退款明细',
      api: downloadRefundRedPackList,
      id: 8
    },
    {
      label: '下载对账单',
      api: downloadBillDetail,
      id: 9
    },
    {
      label: '红包发放汇总',
      api: downloadCompanyTransfer,
      id: 10
    },
    {
      label: '实名认证抵扣金额明细',
      api: downloadDiscountBill,
      id: 11
    },
    {
      label: '抵用券使用明细',
      api: downloadDiscountCoupon,
      id: 12
    }
  ],
  sumData: {
    total: 0,
    refund: 0
  }
});
function down() {
  console.log('test123');
}

const { searchModel } = useStore();
async function getData() {
  const [year, month] = searchModel.month?.split('/') || [];
  const [res] = await getSum({
    $storeKey: ['gameid'],
    year,
    month
  });
  if (!res) return;
  state.sumData = res.data;
}

watch(
  () => [searchModel.time, searchModel.gameid, searchModel.month],
  () => {
    getData();
  }
);

const { searchConfig, downLoadList, sumData } = toRefs(state);
</script>

<template>
  <Search :search="{}" :from-data="searchConfig" @ready="getData">
    <template #ext-btn>
      <el-row :gutter="20">
        <el-col :span="10"><el-input v-model="sumData.total" disabled /></el-col>
        <el-col :span="4"><el-button type="primary" @click="down">下载</el-button></el-col></el-row
      >
    </template>
  </Search>

  <el-card class="down-btn-list">
    <el-row justify="space-around">
      <el-col v-for="v in downLoadList" :key="v.id"
        ><div>
          <el-button type="primary" @click="v.api">{{ v.label }}</el-button>
        </div></el-col
      >
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.down-btn-list {
  div:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>
