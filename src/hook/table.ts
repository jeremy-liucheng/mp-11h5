import { reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { getUserMenuFieldList } from '@/service/api/menu';
import { PageTabs, TableStrMap } from '@/types/field';
import { FormatType } from '@/types/enum';

/**
 * 百分比格式化
 *
 * @author arvin
 * @export
 * @param {number} n 需要格式化的值
 * @returns {number|string} 格式化后的值
 */
export function percent(n: number): number | string {
  if (typeof n == 'number' && n) return `${(n * 100).toFixed(2)}%`;
  return n;
}

/**
 * 保留小数
 *
 * @author arvin
 * @export
 * @param {number} n
 * @param {(1 | 2)} b
 * @returns {number|string} 格式化后的值
 */
export function fixed(n: number, b: '1' | '2'): number {
  if (typeof n == 'number' && n) return parseFloat(n.toFixed(+b));
  return n;
}

export function enumType(value: number, $enum: any[]) {
  return $enum[value];
}

export function prefixRmb(value: string) {
  return `￥${value}`;
}

export function formatterData(field: any, value: string | number): string | number {
  const { formatType } = field;
  switch (formatType) {
    case FormatType.one:
    case FormatType.two:
      return fixed(value as number, formatType);
    case FormatType.percent:
      return percent(value as number);
    case FormatType.enum:
      return enumType(value as number, JSON.parse(field.enum));
    case FormatType.prefixRmb:
      return prefixRmb(value as string);
    default:
  }
  if (typeof value === 'number') return Math.round(value);
  return value;
}

/**
 * @export
 * @template TableData
 * @param {TableStrMap[]} [ext=[]] 扩展的一些字段
 * @param {*} [status] 显示所有页签字段
 * @return {*}
 */
export async function useTableField<TableData>(ext: TableStrMap[] = [], status?: any) {
  const route = useRoute();
  const state = reactive<{
    tableData: TableData[];
    tableBase: PageTabs;
    completeTableBase: PageTabs[];
  }>({
    tableBase: {
      title: '',
      tabStr: <any>[]
    } as PageTabs,
    tableData: [],
    completeTableBase: []
  });
  const [res] = await getUserMenuFieldList({
    menuId: route.meta.id
  });
  if (status) {
    state.completeTableBase = res?.data || [];
  } else {
    state.tableBase = {
      title: res?.data[0].title || '',
      tabStr: [...(res?.data[0].tabStr || []), ...ext]
    };
  }

  function setFormatTableData(data: any, tableBase?: PageTabs) {
    if (!data) {
      return (state.tableData = []);
    }
    data.forEach((e: any) => {
      Object.keys(e).forEach((j: any) => {
        const r = (tableBase || (state.tableBase as PageTabs)).tabStr.find(v => v.prop == j);
        if (r) e[`${j}_fm`] = formatterData(r, e[j]);
      });
    });
    state.tableData = data;
  }

  return { ...toRefs(state), setFormatTableData };
}

export function usePagination(handle?: any) {
  const state = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 100
  });
  function setTotal(total = 0) {
    state.total = total;
  }
  // 表格分页变化
  const pageChange = ({ currentPage, pageSize }: any) => {
    state.currentPage = currentPage;
    state.pageSize = pageSize;
    handle();
  };
  return {
    ...toRefs(state),
    setTotal,
    pageChange
  };
}
