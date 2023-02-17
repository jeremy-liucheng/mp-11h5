import { createApp, App as AppType, Directive, defineAsyncComponent } from 'vue';
import App from './App.vue';
import router from '@/router';
import {
  ElRow,
  ElLink,
  ElLoading,
  ElSwitch,
  ElInputNumber,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElInput,
  ElSelect,
  ElUpload,
  ElBreadcrumb,
  ElButton,
  ElCard,
  ElCol,
  ElCheckbox,
  ElDialog,
  ElBreadcrumbItem,
  ElMain,
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElDescriptions,
  ElDescriptionsItem,
  ElAside,
  ElScrollbar,
  ElSelectV2,
  ElCheckboxGroup,
  ElAlert,
  ElContainer,
  ElConfigProvider,
  ElMessage,
  ElMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElSubMenu,
  ElTooltip,
  ElPagination,
  ElImage,
  ElTabPane,
  ElTabs,
  ElRadioGroup,
  ElTag,
  ElTreeSelect,
  ElRadio
} from 'element-plus';
// import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

import '@/permission';

// 自定义样式
import '@/assets/styles/index.scss';
// import 'vxe-table/lib/style.css';

import {
  // 全局对象
  Column,
  Table,
  Toolbar,
  Pager,
  Select,
  Export,
  Icon,
  Input,
  Button
} from 'vxe-table';
const app = createApp(App);
// 自定义指令
import * as directive from '@/directive';

// 全局组件

Object.keys(directive).forEach(key => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});

function useTable(app: AppType) {
  app
    .use(Column)
    .use(Button)
    .use(Icon)
    .use(Input)
    .use(Export)
    .use(Toolbar)
    .use(Pager)
    .use(Select)
    .use(Table);
}

function useElementPlus(app: AppType) {
  app
    .use(ElLink)
    .use(ElRadio)
    .use(ElLoading)
    .use(ElRow)
    .use(ElInputNumber)
    .use(ElSwitch)
    .use(ElDropdownMenu)
    .use(ElDropdown)
    .use(ElTabPane)
    .use(ElTabs)
    .use(ElDropdownItem)
    .use(ElIcon)
    .use(ElInput)
    .use(ElSelect)
    .use(ElUpload)
    .use(ElBreadcrumb)
    .use(ElButton)
    .use(ElCard)
    .use(ElCol)
    .use(ElImage)
    .use(ElCheckbox)
    .use(ElDialog)
    .use(ElBreadcrumbItem)
    .use(ElMain)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElDatePicker)
    .use(ElDescriptions)
    .use(ElDescriptionsItem)
    .use(ElAside)
    .use(ElContainer)
    .use(ElScrollbar)
    .use(ElSelectV2)
    .use(ElCheckboxGroup)
    .use(ElConfigProvider)
    .use(ElMenu)
    .use(ElMenuItemGroup)
    .use(ElMenuItem)
    .use(ElMessage)
    .use(ElSubMenu)
    .use(ElTooltip)
    .use(ElPagination)
    .use(ElRadioGroup)
    .use(ElTag)
    .use(ElTreeSelect)
    .use(ElAlert);
}

function useComp(app: AppType) {
  app.component(
    'MForm',
    defineAsyncComponent(() => import('@/components/CreateForm/myForm.vue'))
  );
}

useComp(app);

// 注册全局组件
app
  .use(useElementPlus)
  .use(useTable)
  .use(createPinia().use(piniaPluginPersist))
  .use(router)
  .mount('#app');
