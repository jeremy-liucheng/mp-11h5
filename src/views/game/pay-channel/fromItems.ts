import { InputField } from '@/components/CreateForm/attr';

export const formRules = {
  channel_name: [
    {
      required: true,
      message: '支付渠道不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems() {
  return [
    {
      label: '渠道名称',
      prop: 'channel_name',
      children: [
        {
          useModel: new InputField('channel_name'),
          props: {
            placeholder: '支付渠道名称, 如: 微信-星河科技'
          }
        }
      ]
    }
  ];
}
