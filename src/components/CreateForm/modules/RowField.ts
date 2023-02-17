import { StringType } from '@/types/utils';

export interface RowProps {
  // 栅格间隔
  gutter?: number;
  // flex 布局下的水平排列方式
  justify?: 'center' | 'space-around' | 'space-between' | 'space-evenly' | 'end' | 'start';
  // flex 布局下的垂直排列方式
  align?: 'top' | 'bottom' | 'middle';
  // 自定义元素标签
  tag?: string;
}
export class RowField implements RowProps {
  // 栅格间隔
  gutter = 9;
  // flex 布局下的水平排列方式
  justify = 'center' as StringType<
    'center' | 'space-around' | 'space-between' | 'space-evenly' | 'end' | 'start'
  >;
  // flex 布局下的垂直排列方式
  align = 'middle' as StringType<'top' | 'bottom' | 'middle'>;
  // 自定义元素标签
  tag = 'div';
}
