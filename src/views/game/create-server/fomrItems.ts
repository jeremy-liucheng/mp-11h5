import { InputField, DateField } from '@/components/CreateForm/attr';

export const formRules = {
  title: [
    {
      required: true,
      message: '区服名称不能为空',
      trigger: 'blur'
    }
  ],
  open_time: [
    {
      required: true,
      message: '开服时间不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems() {
  return [
    {
      label: 'ID',
      prop: 'id',
      applyingTitle: ['修改开服服务'],
      children: [
        {
          useModel: new InputField('id'),
          props: {
            disabled: true
          }
        }
      ]
    },
    {
      label: '区服名称',
      prop: 'title',
      children: [
        {
          useModel: new InputField('title'),
          props: {
            placeholder: '请输入区服名称'
          }
        }
      ]
    },
    {
      label: '开服时间',
      prop: 'open_time',
      children: [
        {
          useModel: new DateField('open_time'),
          props: {
            placeholder: '选择时间'
          }
        }
      ]
    }
  ];
}
