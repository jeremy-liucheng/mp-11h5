export interface DateFieldInterface {
  mold: string;
  // 原生属性
  name: string;
  // 类型
  type:
    | 'date'
    | 'year'
    | 'month'
    | 'dates'
    | 'week'
    | 'datetime'
    | 'datetimerange'
    | 'daterange'
    | 'monthrange';
  // 样式
  style?: string;
  // 是否禁用
  disabled: boolean;
  // value格式化方式
  format?: string;
  // value格式化方式
  valueFormat?: string;
}
export class DateField implements DateFieldInterface {
  mold = 'date';
  // 原生属性
  name: string;
  // 类型
  type = 'datetime' as
    | 'date'
    | 'year'
    | 'month'
    | 'dates'
    | 'week'
    | 'datetime'
    | 'datetimerange'
    | 'daterange'
    | 'monthrange';
  // 样式
  style = '';
  // 是否禁用
  disabled = false;
  // value格式化方式
  format = 'YYYY-MM-DD HH:mm:ss';
  // value格式化方式
  valueFormat = 'X';
  constructor(name: string) {
    this.name = name;
  }
  setProps<T extends keyof DateField>(props: Record<T, DateField[T]>) {
    Object.assign(this, props);
    return this;
  }
}
