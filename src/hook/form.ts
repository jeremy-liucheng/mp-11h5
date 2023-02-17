import { FormCreate } from '@/components/CreateForm/modules/FormCreate';
import { DialogFormData } from '@/types/mgr';
import { createFormItemProps, deepClone } from '@/utils/utils';
import { reactive } from 'vue';

export function useForm(createFormItems: any, formRules: any, ext?: any) {
  const formItems = reactive<DialogFormData[]>(createFormItems(ext));
  const formCreate = new FormCreate();
  createFormItemProps(formItems, formCreate, formRules);
  /** 更新form的值 */
  function upFormData<T extends keyof DialogFormData>(
    args: Record<T, DialogFormData[T]>,
    data: any
  ) {
    const objMap = new Map();
    Object.entries(args).forEach(([key, value]) => objMap.set(key, value));
    formItems.forEach(({ prop }) => {
      if (objMap.has(prop)) {
        data[prop] = deepClone(objMap.get(prop));
      }
    });
  }
  return {
    formCreate,
    upFormData
  };
}
