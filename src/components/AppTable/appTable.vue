<template>
  <vxe-toolbar ref="xToolbar">
    <template #buttons>
      <slot name="tableHeader"> </slot>
    </template>
    <template #tools>
      <el-dropdown @command="exportOptions">
        <el-button type="primary">
          导出选项<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="exportDataEvent"> 导出所有数据</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button style="margin-left: 10px" type="primary" :icon="Filter" circle />
    </template>
  </vxe-toolbar>
  <div class="table" :class="className">
    <slot>
      <vxe-table
        ref="table"
        show-overflow
        :column-config="{ resizable: true }"
        :expand-config="{ labelField: 'labelField' }"
        :scroll-y="scrollY"
        :loading="loading"
        height="100%"
        align="center"
        :data="tableData"
        :span-method="scrollY.enabled ? undefined : mergeRowMethod"
      >
        <vxe-column
          v-for="{ id, type, prop, label, fixed, width, render, visible, hidden } in tableBase"
          :key="id"
          :type="type"
          :field="prop"
          :title="label"
          :fixed="fixed"
          :visible="!!visible"
          :width="width"
          :hidden-col="hidden"
        >
          <template v-if="type !== 'seq' && type !== 'expand'" #default="{ row }">
            <template v-if="!render">
              <span>{{ row[prop + '_fm'] || row[prop] }}</span>
            </template>
            <template v-else>
              <E-expand :column="row" :row="row" :render="render" />
            </template>
          </template>
          <template v-else #content="{ row: expandRow }">
            <ul class="expand-wrapper">
              <li>
                <span>ID：</span>
                <span>{{ expandRow.id }}</span>
              </li>
              <li>
                <span>Name：</span>
                <span>{{ expandRow.name }}</span>
              </li>
              <li>
                <span>Date</span>
                <span>{{ expandRow.date }}</span>
              </li>
            </ul>
          </template>
        </vxe-column>
      </vxe-table>
    </slot>
  </div>
  <vxe-pager
    v-if="total"
    :current-page="currentPage"
    :page-size="pageSize"
    perfect
    :total="total"
    :page-sizes="[
      10,
      40,
      100,
      200,
      { label: '大量数据', value: 1000 },
      { label: '全量数据', value: 200000 }
    ]"
    :layouts="[
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
      'Sizes',
      'FullJump',
      'Total'
    ]"
    @page-change="handleCurrentChange"
  >
  </vxe-pager>
</template>

<script lang="ts">
export default {
  name: 'Mtable'
};
</script>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import { VxeTableInstance, VxeTablePropTypes, VxeToolbarInstance } from 'vxe-table';
import EExpand from './eExpand';
import { ArrowDown, Filter } from '@element-plus/icons-vue';
import { TableStrMap } from '@/types/field';

const props = withDefaults(
  defineProps<{
    tableBase: TableStrMap[];
    tableData: any;
    loading: boolean;
    pageSize?: number;
    total?: number;
    currentPage?: number;
    className?: string;
    mergeFields?: any;
    scrollY?: any;
  }>(),
  {
    pageSize: 100,
    total: 0,
    currentPage: 1,
    className: '',
    mergeFields: [],
    scrollY: { enabled: true }
  }
);

const emits = defineEmits<{
  (e: 'pageChange', args: any): void;
}>();

const table = ref<VxeTableInstance>();

const xToolbar = ref<VxeToolbarInstance>();
nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = table.value;
  const $toolbar = xToolbar.value;
  $table?.connect($toolbar as VxeToolbarInstance);
});

const handleCurrentChange = ({ pageSize, currentPage }: any) => {
  emits('pageChange', { currentPage, pageSize });
};

// 通用行合并函数（将相同多列数据合并为一行）
const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = props.mergeFields;
  const cellValue = row[column.field];
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1];
    let nextRow = visibleData[_rowIndex + 1];
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 };
    } else {
      let countRowspan = 1;
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex];
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 };
      }
    }
  }
};

function exportDataEvent() {
  const $table = table.value;
  $table?.exportData({
    type: 'csv',
    filename: 'xxx',
    message: false,
    columnFilterMethod: ({ column: { type } }) => type !== 'html'
  });
}

function exportOptions(command: string) {
  switch (command) {
    case 'exportDataEvent':
      exportDataEvent();
      break;
    default:
      break;
  }
}

defineExpose({
  table
});
</script>

<style scoped>
.vxe-toolbar {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
