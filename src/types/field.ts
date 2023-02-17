import { FormatType } from '@/types/enum';
import { VxeColumnPropTypes } from 'vxe-table';

export interface FieldData {
  /** 字段对应的中文名称 */
  label?: string;
  enum?: { [key: string]: any };
  handle?: string;
  type?: VxeColumnPropTypes.Type;
  link?: boolean;
  renderType?: 'routerLink' | 'btn' | 'link';
  width?: number;
  infixLabel?: string;
  formatType?: FormatType;
  textColor?: string;
  dataKey?: string;
  sort?: boolean;
  isHiddenLabel?: boolean;
  path?: string;
  routerName?: string;
  hidden?: number; // 导出隐藏显示
  order?: number;
  visible?: number; // 表格隐藏显示
  fixed?: VxeColumnPropTypes.Fixed;
  id?: number;
  render?: (args: any) => JSX.Element;
}
/** 字段 */
export interface Fields {
  serverid?: FieldData;
  dayMoney?: FieldData;
  channel?: FieldData;
  rolename?: FieldData;
  recvrolename?: FieldData;
  timestr?: FieldData;
  gameName?: FieldData;
  forbidDays?: FieldData;
  endtime?: FieldData;
  reason?: FieldData;
  username?: FieldData;
  edit?: FieldData;
  uid?: FieldData;
  money?: FieldData;
  allMoney?: FieldData;
  roleid?: FieldData;
  alliance?: FieldData;
  role?: FieldData;
  time?: FieldData;
  del?: FieldData;
  checkLabels?: FieldData;
  matchKeywords?: FieldData;
  keyWord?: FieldData;
  ruleName?: FieldData;
  id?: FieldData;
  name?: FieldData;
  create_time?: FieldData;
  gameid?: FieldData;
  mch_name?: FieldData;
  developer?: FieldData;
  product?: FieldData;
  income?: FieldData;
  createServer?: FieldData;
  statistics?: FieldData;
  product_id?: FieldData;
  product_name?: FieldData;
  des?: FieldData;
  hide?: FieldData;
  cost?: FieldData;
  title?: FieldData;
  open_time?: FieldData;
  searchTotal?: FieldData;
  date?: FieldData;
  dayTotal?: FieldData;
  channel_name?: FieldData;
  brief?: FieldData;
  action?: FieldData;
  chid?: FieldData;
  count?: FieldData;
}

export interface TableStrMap extends FieldData {
  /** 字段 */
  prop: keyof Fields;
}

export interface PageTabs {
  /** 分页标签名称 */
  title: string;
  /** 分页表格结构 */
  tabStr: TableStrMap[];
  /** 分页表格结构 */
}
