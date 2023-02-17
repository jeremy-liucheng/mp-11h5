<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';
import { getMenuList } from '@/service/api/menu';
import { onMounted, reactive, toRefs } from 'vue';
import { RouterType } from '@/types/enum';
import DictItem from './components/DictItem.vue';
import { VxeTablePropTypes } from 'vxe-table';
import AppTable from '@/components/AppTable/appTable.vue';
import { Menu } from '@/types/api/types';

const state = reactive({
  loading: true,
  menuList: [] as Menu.MenuList[],
  id: 0,
  typeName: '',
  tableTreeConfig: {
    rowField: 'id',
    parentField: 'children',
    expandAll: true
  } as VxeTablePropTypes.TreeConfig
});

const getData = async () => {
  const [res, err] = await getMenuList();
  if (err) return;
  state.loading = false;
  state.menuList = res?.data || [];
};

onMounted(async () => {
  getData();
});

const rowClick = ({ row }: any) => {
  state.id = row.id;
  state.typeName = row.title;
};

const { loading, menuList, id, tableTreeConfig, typeName } = toRefs(state);
</script>

<template>
  <el-row :gutter="10" :style="{ height: '100%' }">
    <el-col :span="10" :xs="24" :style="{ height: '100%' }">
      <app-table :loading="loading" :table-data="menuList" :table-base="[]">
        <template #default>
          <vxe-table
            :column-config="{ resizable: true }"
            :tree-config="tableTreeConfig"
            :data="menuList"
            height="100%"
            @cell-click="rowClick"
          >
            <vxe-column field="title" title="菜单名称" tree-node>
              <template #default="{ row }">
                <svg-icon :name="row.icon" />
                {{ row.title }}
              </template>
            </vxe-column>

            <vxe-column field="type" align="center" title="菜单名称" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.type === RouterType.CATALOG" type="warning">目录</el-tag>
                <el-tag v-if="row.type === RouterType.MENU" type="success">菜单</el-tag>
                <el-tag v-if="row.type === RouterType.EXTLINK" type="info">外链</el-tag>
                <el-tag v-if="row.type === RouterType.TAB">页签</el-tag>
              </template>
            </vxe-column>

            <vxe-column field="hidden" align="center" title="状态" width="150">
              <template #default="{ row }">
                <el-tag v-if="!row.hidden" type="success">显示</el-tag>
                <el-tag v-else type="info">隐藏</el-tag>
              </template>
            </vxe-column>
          </vxe-table>
        </template>
      </app-table>
    </el-col>
    <el-col :span="14" :xs="24" :style="{ height: '100%' }">
      <template #header>
        <svg-icon name="dict" />
        字典列表
        <el-tag v-if="typeName" type="success" size="small">{{ typeName }}</el-tag>
      </template>
      <dict-item :id="id"></dict-item>
    </el-col>
  </el-row>
</template>
