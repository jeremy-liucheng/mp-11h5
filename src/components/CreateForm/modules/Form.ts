import { StringType } from '@/types/utils';
import {
  InputFieldInterface,
  RadioFieldInterface,
  SelectFieldInterface,
  CheckboxFieldInterface
} from '../attr';

export interface FormProps {
  // 表单名称
  title?: string;
  titleSpan?: number;
  operateSpan?: number;
  // 表单验证规则
  rules?: object;
  // 行内表单模式
  inline?: boolean;
  // 表单域标签的位置， 如果值为 left 或者 right 时，则需要设置 label-width
  labelPosition?: 'right' | 'top' | 'left';
  // 表单域标签的宽度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 支持 auto
  labelWidth?: string | number;
  // 表单域标签的后缀
  labelSuffix?: string;
  // 是否显示必填字段的标签旁边的红色星号
  hideRequiredAsterisk?: boolean;
  // 是否显示校验错误信息
  showMessage?: boolean;
  // 是否以行内形式展示校验信息
  inlineMessage?: boolean;
  // 是否在输入框中显示校验结果反馈图标
  statusIcon?: boolean;
  // 是否在 rules 属性改变后立即触发一次验证
  validateOnRuleChange?: boolean;
  // 用于控制该表单内组件的尺寸
  size?: 'default' | 'small' | 'large' | '';
  // 是否禁用该表单内的所有组件。 若设置为 true，则表单内组件上的 disabled 属性不再生效
  disabled?: boolean;
  // 是否禁用该表单内的所有组件。 若设置为 true，则表单内组件上的 disabled 属性不再生效
}
export class FormPropsClass implements FormProps {
  // 表单名称
  title = '';
  titleSpan = 18;
  operateSpan = 12;
  // 表单验证规则
  rules: object = {};
  // 行内表单模式
  inline = false;
  // 表单域标签的位置， 如果值为 left 或者 right 时，则需要设置 label-width
  // 可选值   left / right / top
  labelPosition = 'right' as StringType<'right' | 'top' | 'left'>;
  // 表单域标签的宽度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 支持 auto。
  labelWidth: string | number = 'auto';
  // 表单域标签的后缀
  labelSuffix = '';
  // 是否显示必填字段的标签旁边的红色星号
  hideRequiredAsterisk = true;
  // 是否显示校验错误信息
  showMessage = true;
  // 是否以行内形式展示校验信息
  inlineMessage = false;
  // 是否在输入框中显示校验结果反馈图标
  statusIcon = false;
  // 是否在 rules 属性改变后立即触发一次验证
  validateOnRuleChange = true;
  // 用于控制该表单内组件的尺寸
  size = 'default' as StringType<'default' | 'small' | 'large' | ''>;
  // 是否禁用该表单内的所有组件。 若设置为 true，则表单内组件上的 disabled 属性不再生效
  disabled = false;

  setProps<T extends keyof FormPropsClass>(props: Record<T, FormPropsClass[T]>) {
    Object.assign(this, props);
    return this;
  }
}

export interface FormItemProps {
  name: string;
  // 文件
  fields: Array<InputFieldInterface>;
  // 标签
  label?: string;
  // 样式
  style?: string;
  // 栅格占据的列数
  span?: number;
  // 表单域 model 字段， 在使用 validate、resetFields 方法的情况下，该属性是必填的
  prop?: string;
  // 表单域标签的宽度，例如 '50px'。 支持 auto。
  labelWidth?: string | number;
  // 是否必填，如不设置，则会根据校验规则自动生成
  required?: boolean;
  // 表单验证规则, 具体配置见下表, 更多内容参考 async-validator
  rules?: object | Array<object>;
  // 表单域验证错误信息, 设置该值会使表单验证状态变为 error，并显示该错误信息
  error?: string;
  // 是否显示校验错误信息
  showMessage?: boolean;
  // 以行内形式展示校验信息
  inlineMessage?: boolean;
  // 控制组件在此表单项中的大小
  size?: string;

  visible?: boolean;

  applyingTitle?: Array<any>;

  applyingRole?: Array<any>;
}

export class FormItemPropClass implements FormItemProps {
  name = '';
  // 文件
  fields: Array<InputFieldInterface> = [];
  // 样式
  style = '';
  // 栅格占据的列数
  span = 24;
  // 表单域 model 字段， 在使用 validate、resetFields 方法的情况下，该属性是必填的
  prop = '';
  // 标签
  label = '';
  // 表单域标签的宽度，例如 '50px'。 支持 auto。
  labelWidth: string | number = 'auto';
  // 是否必填，如不设置，则会根据校验规则自动生成
  required = false;
  // 表单验证规则, 具体配置见下表, 更多内容参考 async-validator
  rules: object | Array<object> = {};
  // 表单域验证错误信息, 设置该值会使表单验证状态变为 error，并显示该错误信息
  error = '';
  // 是否显示校验错误信息
  showMessage = true;
  // 以行内形式展示校验信息
  inlineMessage = false;
  // 控制组件在此表单项中的大小
  size = '';
  // 控制组件在此表单项中的大小
  visible = true;

  applyingTitle = undefined;

  applyingRole = undefined;
  constructor(
    name: string,
    label: string,
    fields: Array<
      InputFieldInterface | SelectFieldInterface | RadioFieldInterface | CheckboxFieldInterface
    >
  ) {
    this.name = name;
    this.label = label;
    this.fields = fields;
  }
  // 设置属性
  setProps<T extends keyof FormItemPropClass>(props: Record<T, FormItemPropClass[T]>) {
    Object.assign(this, props);
    return this;
  }
}
