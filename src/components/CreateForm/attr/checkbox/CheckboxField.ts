export interface CheckboxFieldInterface {
  mold: string;
  // 原生属性
  name: string;
  // 样式
  style?: string;
  // 是否禁用
  disabled?: boolean;
  // 可被勾选的 checkbox 的最小数量
  min?: number;
  // 可被勾选的 checkbox 的最大数量
  max?: number;
  // 为屏幕阅读器准备的标签
  label: string;
  // 当按钮为活跃状态时的边框和背景颜色
  fill?: string;
  // 当按钮为活跃状态时的字体颜色
  textColor?: string;
  // 当按钮为活跃状态时的字体颜色
  validateEvent?: boolean;
  // 选项
  options: Array<any>;
}
export class CheckboxField implements CheckboxFieldInterface {
  mold = 'checkbox';
  // 原生属性
  name: string;
  // 样式
  style = '';
  // 是否禁用
  disabled = false;
  // 可被勾选的 checkbox 的最小数量
  min = 1;
  // 可被勾选的 checkbox 的最大数量
  max = 1;
  // 为屏幕阅读器准备的标签
  label = '';
  // 当按钮为活跃状态时的边框和背景颜色
  fill = '#409EFF';
  // 当按钮为活跃状态时的字体颜色
  textColor = '#ffffff';
  // 当按钮为活跃状态时的字体颜色
  validateEvent = true;
  // 选项
  options = <any>[];
  // 设置属性
  constructor(name: string) {
    this.name = name;
  }
  setProps<T extends keyof CheckboxField>(props: Record<T, CheckboxField[T]>) {
    Object.assign(this, props);
    return this;
  }
}
