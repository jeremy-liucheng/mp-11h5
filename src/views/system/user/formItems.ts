import { InputField } from '@/components/CreateForm/attr';

export const formRules = {
  name: [
    {
      required: true,
      message: '用户名称不能为空',
      trigger: 'blur'
    }
  ],
  brief: [
    {
      required: true,
      message: '请输入简介',
      trigger: 'blur'
    }
  ]
};

export function createFormItems() {
  return [
    {
      label: '用户名称',
      prop: 'name',
      children: [
        {
          useModel: new InputField('name'),
          props: {
            placeholder: '请输入用户名称'
          }
        }
      ]
    },
    {
      label: '简介',
      prop: 'brief',
      children: [
        {
          useModel: new InputField('brief'),
          props: {
            placeholder: '请输入简介'
          }
        }
      ]
    }
  ];
}
