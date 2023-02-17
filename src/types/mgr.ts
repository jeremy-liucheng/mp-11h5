import { FormInstance } from 'element-plus';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { SearchModel } from './store';

// 表格数据
export type TableData<T> = { [key: string]: T };

// 点击表格行的数据
export type AppTableBackRowData<T> = { rowData: T };

// 表格组件的props值
export type AppTablePropType = any;
export interface FromItemData {
  model: keyof SearchModel; // 对应Store里model的字段 保持持久化
  label: string; // 输入框label
  type: string; // 输入框类型和element type保持一致
  labelWidth?: string | number; // label宽度
  placeholder?: string; // 无输入显示
  multiple?: boolean; // 多选
  api?: 'setGameList' | 'setGameCateIdList'; // 自动触发的service/api里的接口
  storeField?: 'gameCateList' | 'gameList' | 'serverList' | 'channelList'; // 使用store里的下拉框数据
  params?: any; // 和api一起使用调用api的时候自动带上数组里的字段
  options?: Array<{
    // 使用默认值
    [key: string]: any;
  }>;
  remoteMethod?: any;
  style?: any;
  onPersistent?: boolean;
}

export interface SpanMethodProps {
  row: any;
  column: TableColumnCtx<any>;
  rowIndex: number;
  columnIndex: number;
}

export type DialogFormData = any;

export interface TmpFormRef {
  resetForm: () => void;
  submit?: (formEl: any) => void;
  formRef: FormInstance;
}

export interface ExtItem {
  key: string;
  value: string;
  date: number;
}

export interface Options {
  label: string;
  value: any;
}
