import { InputField } from '@/components/CreateForm/attr';

export const formRules = {};

export function createFormItems() {
  return [
    {
      label: '版号url',
      prop: 'url',
      children: [
        {
          useModel: new InputField('url'),
          props: {
            placeholder: '请输入版号url'
          }
        }
      ]
    }
  ];
}
