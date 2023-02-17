import { FormItemPropClass } from '@/components/CreateForm/modules/Form';
import { PageTabs } from '@/types/field';
import { DialogFormData } from '@/types/mgr';
import { ElMessageBox, ElMessageBoxOptions } from 'element-plus';

// 获取url参数
export function getUrlParams2(paraName: string) {
  const url = document.location.search;
  const reg = new RegExp('(^|&)' + paraName + '=([^&]*)(&|$)', 'i');
  const param = url.substring(1).match(reg);
  return param && param[2];
}

// 克隆数据
export function cloneData(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

/**
 * @export
 * @param {any} obj 需要取值的对象
 * @param {string} keys key值 'a.b.c'
 * @param {any} defaultVal 没有取到值默认值
 * @return {any} 深嵌套对象的值
 */
export function deepGet(obj: any, keys: string, defaultVal: any): any {
  const val = (
    (!Array.isArray(keys)
      ? keys.replace(/\[/g, '.').replace(/\]/g, '').split('.')
      : keys) as Array<any>
  ).reduce((o: any, k: string | number) => (o || {})[k], obj);
  if (typeof val == 'number') return val;
  return val || defaultVal;
}

// 删除弹窗统一处理
export async function $cm({
  content,
  title = 'Warning',
  options = {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }
}: {
  content: string;
  title?: string;
  options?: ElMessageBoxOptions;
}) {
  return new Promise<void>(resolve => {
    ElMessageBox.confirm(content, title, options)
      .then(() => {
        resolve();
      })
      .catch(() => {});
  });
}

/**
 * 时间戳格式转换以及计算
 * */
export function formatTime(time = 0, format = 'YYYY-MM-DD hh:mm:ss'): string {
  const now = new Date().getTime();

  if (!time) time = now;

  while (time.toString().length < 13) time += 0;

  const date = new Date(time);

  date.getMonth();
  /** 参数集 年-月-日 时:分:秒 */
  const arg = {
    year: date.getFullYear(),
    month: String(date.getMonth() + 1),
    day: String(date.getDate()),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  };
  if (arg.month.toString().length === 1) {
    arg.month = `0${arg.month}`;
  }
  if (arg.day.toString().length === 1) {
    arg.day = `0${arg.day}`;
  }

  /** 判断有没有指定的时间格式 */
  switch (format) {
    case 'YYYY-MM-DD hh:mm:ss':
      return `${arg.year}-${arg.month}-${arg.day} ${arg.hours}:${arg.minutes}:${arg.seconds}`;
    case 'YYYY-MM-DD':
      return `${arg.year}-${arg.month}-${arg.day}`;
    case 'YYYYMMDD':
      return `${arg.year}${arg.month}${arg.day}`;
    case 'MM-DD':
      return `${arg.month}-${arg.day}`;
    case 'hh:mm:ss':
      return `${arg.hours}:${arg.minutes}:${arg.seconds}`;
    case 'hh:mm':
      return `${arg.hours}:${arg.minutes}`;
    case 'computed': //判断是不是需要进行计算
      if (now > time) {
        const dt = Math.abs(time - now), //时间已过去多少毫秒
          S = dt / 1000, //秒
          M = S / 60, //分
          H = M / 60, //小时
          D = H / 24, //天
          W = D / 7; //周

        /**
			~~ ==>表示取整数部分 类似与 parseInt
		*/
        if (~~W > 0 && W < 3) {
          return ~~W + '周前';
        } else if (D < 7 && ~~D > 0) {
          return ~~D + '天前';
        } else if (~~H > 0 && H < 24) {
          return ~~H + '小时前';
        } else if (~~M > 0 && M < 60) {
          return ~~M + '分钟前';
        } else if (~~S > 0 && S < 60) {
          return ~~S + '秒前';
        }
      } else {
        console.log('未来的时间');
        return '';
      }
      return `${arg.year}-${arg.month}-${arg.day} ${arg.hours}:${arg.minutes}:${arg.seconds}`;
  }
  return '';
}

/**
 * 判断key是不是存在一个对象
 * @param {string|number|symbol} key
 * @param {object} object
 * @returns {boolean}
 */
export const isValidKey = (
  key: string | number | symbol,
  object: object
): key is keyof typeof object => {
  return key in object;
};

/**
 * 获取表格高度
 */
export const getTableHeight = () => {
  let height = document.documentElement.clientHeight;
  const pd = document.querySelectorAll('.pd');
  Array.from(pd).forEach(e => {
    height -= e.clientHeight;
  });
  const tableHeader = document.querySelectorAll('.table-header .el-card__header');
  Array.from(tableHeader).forEach(e => {
    height -= e.clientHeight + 20;
  });
  height -= 125;
  return height;
};

export function randomString(length = 32): string {
  let chars = '',
    rand,
    i,
    ret,
    mod = 0,
    bits;
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  ret = '';
  mod = 4;
  bits = length * mod || 62;
  while (bits > 0) {
    rand = Math.floor(Math.random() * 0x100000000);
    for (i = 26; i > 0 && bits > 0; i -= mod, bits -= mod) {
      ret += chars[0x3d & (rand >>> i)];
    }
  }

  return ret;
}

const isComplexDataType = (obj: any) =>
  (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

export const deepClone = function (obj: any, hash = new Map()) {
  if (typeof obj !== 'object') return obj;
  if (obj.constructor === Date) return new Date(obj); //日期对象就返回一个新的日期对象
  if (obj.constructor === RegExp) return new RegExp(obj); //正则对象就返回一个新的正则对象

  //如果成环了,参数obj = obj.loop = 最初的obj 会在WeakMap中找到第一次放入的obj提前返回第一次放入WeakMap的cloneObj
  if (hash.has(obj)) return hash.get(obj);

  const allDesc = Object.getOwnPropertyDescriptors(obj); //遍历传入参数所有键的特性
  const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); //继承原型链

  hash.set(obj, cloneObj);
  for (const key of Reflect.ownKeys(obj)) {
    //Reflect.ownKeys(obj)可以拷贝不可枚举属性和符号类型
    // 如果值是引用类型(非函数)则递归调用deepClone
    cloneObj[key] =
      isComplexDataType(obj[key]) && typeof obj[key] !== 'function'
        ? deepClone(obj[key], hash)
        : obj[key];
  }
  return cloneObj;
};

/** 更新form的值 */
export function upFormData<T extends keyof DialogFormData>(
  args: {
    [key: string]: Record<T, DialogFormData[T]>;
  } = {},
  formItems: DialogFormData[],
  data: any
) {
  const objMap = new Map();
  Object.entries(args).forEach(([key, value]) => objMap.set(key, value));
  formItems.forEach(({ prop }) => {
    if (objMap.has(prop)) {
      data.value[prop] = deepClone(objMap.get(prop));
    }
  });
}

// 防抖(立即执行)
export function throttle(this: any, fn: () => void, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  let startTime = Date.now();
  return (...args: any) => {
    const curTime = Date.now();
    const remaining = delay - (curTime - startTime);
    timer && clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(this, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, remaining);
    }
  };
}

export function createFormItemProps(formItem: any, formCreate: any, rules: any) {
  formCreate.setFormItemProps(
    formItem.map((e: any) => {
      return new FormItemPropClass(
        e.prop,
        e.label,
        e.children?.map((k: any) => {
          return (
            k.useModel?.setProps({
              ...k.props
            }) || k
          );
        })
      ).setProps({
        prop: e.prop,
        visible: typeof e.visible === 'boolean' ? e.visible : true,
        labelWidth: e.labelWidth || 'auto',
        applyingTitle: e.applyingTitle,
        applyingRole: e.applyingRole
      });
    })
  );
  formCreate.setFormProps({ rules });
}

export const str2Obj = (str: string) => eval('(' + str + ')');

/**
 *
 *
 * @export
 * @param {string} type  需要判断的类型
 * @param {any} params  需要判断的对象
 * @return {boolean}   返回值
 */
export function IsType(type: string, params: any): boolean {
  return Object.prototype.toString.call(params) === `[object ${type}]`;
}

export function obj2Tree(data: any[], parentId?: any): any {
  return data.reduce((acc, cur) => {
    return acc.concat([
      {
        value: parentId ? `${parentId}-${cur.id}` : cur.id,
        label: cur.label,
        children: cur.children.length ? obj2Tree(cur.children, cur.id) : []
      }
    ]);
  }, []);
}

export function downloadXlsxFile(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function toHourMinute(minutes: number) {
  return Math.floor(minutes / 60) + '小时' + (minutes % 60) + '分';
}

export function timeSlot(step: number) {
  //  step = 间隔的分钟
  const date = new Date();
  date.setHours(0); // 时分秒设置从零点开始
  date.setSeconds(0);
  date.setUTCMinutes(0);

  const timeArr = [];
  const slotNum = (24 * 60) / step; // 算出多少个间隔
  for (let f = 0; f < slotNum; f++) {
    //  stepM * f = 24H*60M
    // arr.push(new Date(Number(date.getTime()) + Number(step*60*1000*f)))   //  标准时间数组
    const time = new Date(Number(date.getTime()) + Number(step * 60 * 1000 * f)); // 获取：零点的时间 + 每次递增的时间
    let hour = '',
      sec = '';
    time.getHours() < 10 ? (hour = '0' + time.getHours()) : (hour = String(time.getHours())); // 获取小时
    time.getMinutes() < 10 ? (sec = '0' + time.getMinutes()) : (sec = String(time.getMinutes())); // 获取分钟
    timeArr.push(hour + ':' + sec);
  }
  return timeArr;
}

// new
export function createTbCSV(args: {
  /** 绑定下载按钮 */
  target?: string;
  /** 当前表格结构 */
  tableStr: PageTabs;
  /** 表格数据 */
  tableData: any[];
}) {
  const { target, tableStr, tableData } = args;
  const { title, tabStr } = tableStr;
  const strArr: string[] = [];
  let str = '';

  // 遍历表结构，定义表头
  tabStr.forEach(v => {
    const { label, hidden } = v;
    if (label && !hidden) {
      strArr.push(label);
    }
  });

  str = `${strArr.join()}\n`;
  // 遍历数据
  tableData.forEach(v => {
    // 每一行的数据
    const row: any[] = [];
    // 遍历表结构，取出每一行的数据
    tabStr.forEach(r => {
      const { prop, hidden } = r;
      if (prop && !hidden) {
        row.push(v[`${prop}_fm`] || v[prop]);
      }
    });
    str += `${row.join()}\n`;
  });
  const btn = document.querySelector(`#${target || 'exc'}`) as any;
  btn.href = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(str)}`;
  btn.download = `${title}.xlsx`;

  return '';
}
