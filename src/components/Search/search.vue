<script lang="ts" setup>
import { reactive, watch } from 'vue';
import useStore from '@/store';
import { FromItemData } from '@/types/mgr';

const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  }
];

const props = defineProps<{
  fromData: FromItemData[];
  search: any;
  handle?: any;
}>();

const emit = defineEmits<{
  (e: 'ready'): void;
}>();

const fromData = reactive(props.fromData);

const { searchModel } = useStore();

(async () => {
  for (let i = 0; i < fromData.length; i += 1) {
    const api = fromData[i].api;
    const params = fromData[i].params;
    if (api && params) {
      await searchModel[api]({ params });
      continue;
    }
    if (api) {
      await searchModel[api]();
      continue;
    }
  }
})().then(() => {
  emit('ready');
});

const form = reactive(props.search);

watch(
  form,
  value => {
    fromData.forEach(({ onPersistent, model }: any) => {
      if (!onPersistent) {
        searchModel[model] = value[model];
      }
    });
  },
  {
    deep: true
  }
);

fromData.forEach(({ onPersistent, model }: any) => {
  if (!onPersistent) {
    form[model] = searchModel[model];
  }
});

// watchEffect(() => {
//   fromData.forEach(({ onPersistent, model }: any) => {
//     if (!onPersistent) {
//       searchModel[model] = value[model];
//       form[model] = searchModel[model];
//     }
//   });
// });
</script>

<template>
  <div class="search">
    <el-card>
      <el-form
        :inline="true"
        :model="search"
        class="search_bar"
        :body-style="{ marginBottom: '-18px' }"
      >
        <template v-for="v in fromData" :key="v">
          <el-form-item :label="v.label" :label-width="v.labelWidth">
            <el-input
              v-if="v.type === 'input'"
              v-model="form[v.model]"
              :placeholder="v.placeholder"
              :style="v.style"
            />
            <el-select
              v-if="v.type === 'select'"
              v-model="form[v.model]"
              :remote="!!v.remoteMethod"
              :remote-method="v.remoteMethod"
              clearable
              filterable
              :multiple="v.multiple"
              collapse-tags
              collapse-tags-tooltip
              :placeholder="v.placeholder"
              style="width: 280px"
              :style="v.style"
            >
              <el-option
                v-for="k in v.options || (v.storeField && searchModel[v.storeField])"
                :key="k.value"
                :label="k.label"
                :value="k.value"
              />
            </el-select>
            <el-date-picker
              v-if="v.type === 'daterange'"
              v-model="form[v.model]"
              type="daterange"
              :shortcuts="shortcuts"
              range-separator="至"
              start-placeholder="开始时间"
              format="YYYY/MM/DD"
              value-format="YYYYMMDD"
              end-placeholder="结束时间"
              :default-value="[new Date(), new Date()]"
            />
            <el-date-picker
              v-if="v.type === 'datetime'"
              v-model="form[v.model]"
              type="datetime"
              format="YYYY/MM/DD"
              value-format="YYYYMMDD"
              placeholder="Select date and time"
            />
            <el-date-picker
              v-if="v.type === 'year'"
              v-model="form[v.model]"
              type="year"
              placeholder="Select date and time"
            />
            <el-date-picker
              v-if="v.type === 'month'"
              v-model="form[v.model]"
              type="month"
              format="YYYY/MM"
              value-format="YYYY/MM"
              placeholder="Select date and time"
            />
          </el-form-item>
        </template>
        <slot> </slot>
        <el-form-item>
          <el-button v-if="handle" type="primary" @click="handle">查询</el-button>
          <slot name="ext-btn"> </slot>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss">
.search {
  .el-form-item {
    margin-bottom: 0px !important;
  }
  padding-bottom: 10px;
}
</style>
