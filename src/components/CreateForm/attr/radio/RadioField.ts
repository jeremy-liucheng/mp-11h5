export interface RadioFieldInterface {
  // 要显示的组件类型
  mold: string;
  // 原生属性
  name: string;
  // 样式
  style?: string;
  // 输入框占位文本
  placeholder?: string;
  // 是否可清空
  clearable?: boolean;
  // 是否禁用
  disabled?: boolean;
  // 输入框尺寸，只在 type !="textarea" 时有效
  size?: string;
  // 原生属性，自动补全
  autocomplete?: string;
  // 原生属性，是否只读
  readonly?: boolean;
  // 输入时是否触发表单的校验
  validateEvent?: boolean;
  // 选项
  options: Array<any>;
}
export class RadioField implements RadioFieldInterface {
  mold = 'radio';
  // 原生属性
  name: string;
  // 类型
  // 样式
  style = '';
  // 最大输入长度
  // 原生属性，最小输入长度
  minlength = 0;
  // 输入框占位文本
  placeholder = '';
  // 是否可清空
  clearable = false;
  // 是否显示切换密码图标
  showPassword = false;
  // 是否禁用
  disabled = false;
  // 输入框尺寸，只在 type !="textarea" 时有效
  size = 'large';
  // 原生属性，自动补全
  autocomplete = 'off';
  // 原生属性，是否只读
  readonly = false;
  // 输入时是否触发表单的校验
  validateEvent = true;
  // 选项
  options = <any>[];
  // 设置属性
  constructor(name: string) {
    this.name = name;
  }
  setProps<T extends keyof RadioField>(props: Record<T, RadioField[T]>) {
    Object.assign(this, props);
    return this;
  }
}
