<script lang="tsx" setup>
import { useRouter, useRoute } from 'vue-router';
import { reactive, ref, toRefs } from 'vue';
import { getRegisterInfo, auditRegister } from '@/service/api/commercial';
import { useTableField } from '@/hook/table';
import { createFormItems, formRules } from './fromItems';
import { Options, TmpFormRef } from '@/types/mgr';
import { useForm } from '@/hook/form';
import { Fields } from '@/types/field';

const router = useRouter();
const route = useRoute();
const back = () => router.push('verify');

const state = reactive({
  descriptionsItems: [] as any,
  modelValue: {
    mch_id: '',
    cps_type: '',
    rate_type: ''
  },
  commercialList: [] as Options[],
  status: 1
});
const { tableBase, tableData, setFormatTableData } = await useTableField();
async function getData() {
  const [res] = await getRegisterInfo({
    nick: route.query.nick
  });
  if (!res) return;
  const { info, shangwu } = res.data;
  state.commercialList = shangwu.map(e => ({ label: e.name, value: e.mch_id }));
  state.status = info.status;
  setFormatTableData([info]);

  state.descriptionsItems = tableBase.value.tabStr
    .map(({ prop, label }) => {
      const t = tableData.value[0] as keyof Fields;
      if (typeof info[prop] === 'number' || t[prop]) {
        return {
          key: Date.now(),
          label,
          value: t[`${prop}_fm`] || t[prop]
        };
      }
    })
    .filter(e => e);
}

await getData();

const formEl = ref<TmpFormRef>();

const handleSubmit = async (formEl: TmpFormRef | undefined, status: number) => {
  formEl?.formRef.validate(async valid => {
    if (valid) {
      const { mch_id, cps_type, rate_type } = state.modelValue;
      await auditRegister({
        nick: route.query.nick,
        mch_id,
        cps_type,
        rate_type,
        showSuccess: true,
        status
      });
      getData();
    }
  });
};

const { descriptionsItems, modelValue, status } = toRefs(state);
const { formCreate } = useForm(createFormItems, formRules, state.commercialList);
</script>

<template>
  <el-card>
    <el-button type="primary" @click="back()"> 返回发行审核 </el-button>
  </el-card>

  <div class="mt20">
    <el-card>
      <el-descriptions title="申请客户详情" :column="1" border>
        <el-descriptions-item
          v-for="v in descriptionsItems"
          :key="v.key"
          :label="v.label"
          label-class-name="my-label"
          >{{ v.value }}</el-descriptions-item
        >
      </el-descriptions>
      <div v-if="!status" class="verify-container mt20">
        <m-form ref="formEl" :model-value="modelValue" :form="formCreate">
          <template #default>
            <el-button type="success" @click="handleSubmit(formEl, 1)">审核通过</el-button>
            <el-button type="danger" @click="handleSubmit(formEl, 2)">审核不通过 </el-button>
          </template>
        </m-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}
</style>

<style lang="scss">
.my-label {
  width: 200px !important;
}
.verify-container {
  padding: 0 20px 0 20px˝;
  .el-select-v2__wrapper,
  .el-select-v2 {
    width: 100% !important;
  }
}
</style>
