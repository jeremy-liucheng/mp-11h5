import { StyleValue } from 'vue';

export interface InputFieldInterface {
  // 要显示的组件类型
  mold: string;
  // 原生属性
  name: string;
  // 类型
  type?: string;
  // 样式
  style?: string;
  // 最大输入长度
  maxlength?: string | number;
  // 原生属性，最小输入长度
  minlength?: number;
  // 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
  showWordLimit?: boolean;
  // 输入框占位文本
  placeholder?: string;
  // 是否可清空
  clearable?: boolean;
  // 是否显示切换密码图标
  showPassword?: boolean;
  // 是否禁用
  disabled?: boolean;
  // 输入框尺寸，只在 type !="textarea" 时有效
  size?: string;
  // 自定义前缀图标
  prefixIcon?: string;
  // 自定义后缀图标
  suffixIcon?: string;
  // 输入框行数，只对 type="textarea" 有效
  rows?: number;
  // textarea高度是否自适应，只在 type="textarea" 时生效。 Can accept an object e.g. { minRows?: 2 maxRows?: 6 }
  autosize?: boolean | object;
  // 原生属性，自动补全
  autocomplete?: string;
  // 原生属性，是否只读
  readonly?: boolean;
  // 原生属性，设置最大值
  max?: number | string;
  // 原生属性，设置最小值
  min?: number | string;
  // 原生属性，设置输入字段的合法数字间隔
  step?: number | string;
  // 控制是否能被用户缩放
  resize?: 'vertical' | 'none' | 'both' | 'horizontal';
  // 原生属性，自动获取焦点
  autofocus?: boolean;
  // 原生属性
  form?: string;
  // 输入框关联的 label 文字
  label?: string;
  // 输入框的 tabindex
  tabindex?: string | number;
  // 输入时是否触发表单的校验
  validateEvent?: boolean;
  // input 元素或 textarea 元素的 style
  inputStyle?: StyleValue;
  // slot
  slots?: any;
  // 内容宽度
  span?: number;
}
export class InputField implements InputFieldInterface {
  mold = 'input';
  // 原生属性
  name: string;
  // 类型
  type = 'text';
  // 样式
  style = '';
  // 最大输入长度
  maxlength: string | number = 200;
  // 原生属性，最小输入长度
  minlength = 0;
  // 是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效
  showWordLimit = false;
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
  // 自定义前缀图标
  prefixIcon = '';
  // 自定义后缀图标
  suffixIcon = '';
  // 输入框行数，只对 type="textarea" 有效
  rows = 2;
  // textarea高度是否自适应，只在 type="textarea" 时生效。 Can accept an object e.g. { minRows: 2 maxRows: 6 }
  autosize = false;
  // 原生属性，自动补全
  autocomplete = 'off';
  // 原生属性，是否只读
  readonly = false;
  // 原生属性，设置最大值
  max: number | string = '';
  // 原生属性，设置最小值
  min: number | string = '';
  // 原生属性，设置输入字段的合法数字间隔
  step: string | number = '';
  // 原生属性，自动获取焦点
  autofocus = false;
  // 原生属性
  form = '';
  // 输入框关联的 label 文字
  label = '';
  // 输入框的 tabindex
  tabindex = '';
  // 输入时是否触发表单的校验
  validateEvent = true;
  // slot
  slots: any;
  // 设置属性,
  span = 24;
  constructor(name: string) {
    this.name = name;
  }
  setProps<T extends keyof InputField>(props: Record<T, InputField[T]>) {
    Object.assign(this, props);
    return this;
  }
}
