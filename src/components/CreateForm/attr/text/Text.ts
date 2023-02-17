export interface DateFieldInterface {
  mold: string;
  // 原生属性
  name: string;
  // 样式
  style?: string;
  // 是否禁用
  disabled: boolean;
  // value格式化方式
  format: string;
}
export class DateField implements DateFieldInterface {
  mold = 'checkbox';
  // 原生属性
  name: string;
  // 样式
  style = '';
  // 是否禁用
  disabled = false;
  // value格式化方式
  format = 'x';
  constructor(name: string) {
    this.name = name;
  }
  setProps<T extends keyof DateField>(props: Record<T, DateField[T]>) {
    Object.assign(this, props);
    return this;
  }
}
