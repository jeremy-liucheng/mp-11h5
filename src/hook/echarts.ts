import * as echarts from 'echarts/core';
import {
  // 系列类型的定义后缀都为 SeriesOption
  LineChart,
  LineSeriesOption,
  GaugeSeriesOption,
  GaugeChart
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
  GridComponent,
  GridComponentOption,
  MarkLineComponent,
  MarkLineComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | MarkLineComponentOption
  | ToolboxComponentOption
  | GaugeSeriesOption
>;

export function echartsInterface() {
  echarts.use([
    GaugeChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    MarkLineComponent,
    ToolboxComponent
  ]);
  return {
    echarts
  };
}
