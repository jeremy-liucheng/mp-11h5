<script lang="ts">
export default {
  name: 'menu-list'
};
</script>

<script lang="ts" setup>
import IconSelect from '@/components/IconSelect/iconSelect.vue';
import { delMenu, editMenu, getMenuList } from '@/service/api/menu';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { RouterType } from '@/types/enum';
import { ElForm, ElPopover } from 'element-plus';
import { $cm, deepClone } from '@/utils/utils';
import { VxeTablePropTypes } from 'vxe-table';
import AppTable from '@/components/AppTable/appTable.vue';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';
import { Menu } from '@/types/api/types';

const dataFormRef = ref(ElForm);
const popoverRef = ref(ElPopover);
const modelValue = {
  pid: 0,
  title: '',
  hidden: 0,
  sort: 1,
  component: 'Layout',
  type: 1,
  icon: '',
  path: '',
  keepAlive: 1
};
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  dialog: { visible: false } as any,
  formData: modelValue as any,
  rules: {
    pid: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
    title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    component: [{ required: true, message: '请输入组件完整路径', trigger: 'blur' }]
  },
  menuOptions: [] as any[],
  // Icon选择器显示状态
  iconSelectVisible: false,
  cacheData: {
    menuType: '',
    menuPath: ''
  },
  menuList: [] as Menu.MenuList[],
  tableTreeConfig: {
    rowField: 'id',
    parentField: 'children',
    expandAll: true
  } as VxeTablePropTypes.TreeConfig
});

const {
  loading,
  menuList,
  tableTreeConfig,
  dialog,
  formData,
  rules,
  menuOptions,
  iconSelectVisible,
  cacheData
} = toRefs(state);

const getData = async () => {
  const [res, err] = await getMenuList();
  if (err) return;
  state.loading = false;
  state.menuList = res?.data || [];
};

onMounted(async () => {
  getData();
});

async function loadMenuData() {
  const menuOptions: any[] = [];
  const data = generateMenuList(state.menuList);
  const menuOption = { value: 0, label: '顶级菜单', children: data };
  menuOptions.push(menuOption);
  state.menuOptions = menuOptions;
}

function generateMenuList(params: any) {
  return params.reduce((acc: any, cur: any) => {
    return acc.concat([
      {
        value: cur.id,
        label: cur.title,
        children: cur.children.length ? generateMenuList(cur.children) : []
      }
    ]);
  }, []);
}

/**
 * 新增菜单打开
 */
async function handleAdd(row: any) {
  await loadMenuData();
  dialog.value = {
    title: '添加菜单',
    visible: true
  };
  formData.value.pid = row.id || 0;
}

async function handleUpdate(row: any) {
  await loadMenuData();
  state.dialog = {
    title: '编辑菜单',
    visible: true
  };
  const rowCopy = deepClone(row);
  formData.value = rowCopy;
  cacheData.value.menuType = rowCopy.type;
  cacheData.value.menuPath = rowCopy.path;
}

const handleDelete = async (e: any) => {
  const { id, title } = e;
  await $cm({
    content: `是否删除：${title}`
  });
  await delMenu({
    id,
    showSuccess: true
  });
  getData();
};

function handleMenuTypeChange(menuType: any) {
  if (menuType !== cacheData.value.menuType) {
    formData.value.path = '';
  } else {
    formData.value.path = cacheData.value.menuPath;
  }
}
function cancel() {
  dataFormRef.value.resetFields();
  state.formData = modelValue;
  state.dialog.visible = false;
}
function selected(name: string) {
  state.formData.icon = name;
  state.iconSelectVisible = false;
}

function submitForm() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      editMenu({ id: state.formData.id, ...state.formData, showSuccess: true }).then(() => {
        getData();
        cancel();
      });
    }
  });
}
</script>

<template>
  <app-table :loading="loading" :table-data="menuList" :table-base="[]">
    <template #tableHeader>
      <el-button type="primary" @click="handleAdd({})">新增</el-button>
    </template>
    <template #default>
      <vxe-table
        :column-config="{ resizable: true }"
        :tree-config="tableTreeConfig"
        :data="menuList"
        height="100%"
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

        <vxe-column field="sort" align="center" title="排序" width="100"> </vxe-column>
        <vxe-column field="create_time" align="center" title="创建时间" width="220"> </vxe-column>
        <vxe-column field="update_time" align="center" title="修改时间" width="220"> </vxe-column>

        <vxe-column title="操作" align="center" width="200">
          <template #default="{ row }">
            <el-row justify="space-evenly">
              <el-link
                v-if="row.type === RouterType.CATALOG || row.type === RouterType.MENU"
                type="success"
                @click.stop="handleAdd(row)"
              >
                新增
              </el-link>

              <el-link type="primary" @click.stop="handleUpdate(row)"> 编辑 </el-link>
              <el-link type="danger" @click.stop="handleDelete(row)"> 删除 </el-link>
            </el-row>
          </template>
        </vxe-column>
      </vxe-table>
    </template>
  </app-table>

  <el-dialog v-model="dialog.visible" :title="dialog.title" width="750px" @close="cancel">
    <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="父级菜单" prop="parentId">
        <el-tree-select
          v-model="formData.pid"
          placeholder="选择上级菜单"
          :data="menuOptions"
          filterable
          check-strictly
          :render-after-expand="false"
        />
      </el-form-item>

      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="formData.type" @change="handleMenuTypeChange">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3">外链</el-radio>
          <el-radio :label="4">页签</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formData.type == RouterType.EXTLINK" label="外链地址" prop="path">
        <el-input v-model="formData.path" placeholder="请输入外链完整路径" />
      </el-form-item>

      <el-form-item
        v-if="formData.type == RouterType.CATALOG || formData.type == RouterType.MENU"
        label="路由路径"
        prop="path"
      >
        <el-input
          v-if="formData.type == RouterType.CATALOG"
          v-model="formData.path"
          placeholder="/system  (目录以/开头)"
        />
        <el-input v-else v-model="formData.path" placeholder="user" />
      </el-form-item>

      <!-- 组件页面完整路径 -->
      <el-form-item v-if="formData.type === RouterType.MENU" label="页面路径" prop="component">
        <el-input v-model="formData.component" placeholder="system/user/index" style="width: 95%">
          <template v-if="formData.parentId !== RouterType.CATALOG" #prepend>src/views/</template>
          <template v-if="formData.parentId !== RouterType.CATALOG" #append>.vue</template>
        </el-input>
      </el-form-item>

      <!-- 权限标识 -->
      <!-- <el-form-item v-if="formData.type == 'BUTTON'" label="权限标识" prop="perm">
          <el-input v-model="formData.perm" placeholder="sys:user:add" />
        </el-form-item> -->

      <el-form-item v-if="formData.type !== RouterType.TAB" label="图标" prop="icon">
        <el-popover ref="popoverRef" placement="bottom-start" :width="570" trigger="click">
          <template #reference>
            <el-input
              v-model="formData.icon"
              placeholder="点击选择图标"
              readonly
              @click="iconSelectVisible = true"
            >
              <template #prefix>
                <svg-icon :name="formData.icon" />
              </template>
            </el-input>
          </template>

          <icon-select @selected="selected" />
        </el-popover>
      </el-form-item>

      <!-- <el-form-item v-if="formData.type == RouterType.CATEGORY" label="跳转路由">
          <el-input v-model="formData.redirect" placeholder="跳转路由" />
        </el-form-item> -->

      <el-form-item label="状态">
        <el-radio-group v-model="formData.hidden">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="keepAlive">
        <el-radio-group v-model="formData.keepAlive">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          style="width: 100px"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
