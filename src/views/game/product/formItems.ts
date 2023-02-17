import { CheckboxField, InputField } from '@/components/CreateForm/attr';
import { h } from 'vue';

export const formRules = {
  product_name: [
    {
      required: true,
      message: '商品名称不能为空',
      trigger: 'blur'
    }
  ],
  des: [
    {
      required: true,
      message: '商品描述不能为空',
      trigger: 'blur'
    }
  ],
  cost: [
    {
      required: true,
      message: '商品定价不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems() {
  return [
    {
      label: '商品名称ID',
      prop: 'product_id',
      applyingTitle: ['修改商品信息'],
      children: [
        {
          useModel: new InputField('product_id')
        }
      ]
    },
    {
      label: '商品名称',
      prop: 'product_name',
      children: [
        {
          useModel: new InputField('product_name'),
          props: {
            placeholder: '请输入商品名称'
          }
        }
      ]
    },
    {
      label: '商品描述',
      prop: 'des',
      children: [
        {
          useModel: new InputField('des'),
          props: {
            placeholder: '请输入商品描述'
          }
        }
      ]
    },
    {
      label: '商品定价(精确到0.01元)',
      prop: 'cost',
      children: [
        {
          useModel: new InputField('cost'),
          props: {
            placeholder: '请输入商品定价',
            slots: [
              {
                name: 'prepend',
                content: h(
                  'span',
                  {
                    class: 'cost'
                  },
                  '￥'
                )
              }
            ]
          }
        }
      ]
    },
    {
      prop: 'hide',
      label: '是否下架',
      children: [
        {
          useModel: new CheckboxField('hide'),
          props: {
            options: [
              {
                label: '下架',
                trueLabel: 1,
                falseLabel: 0
              }
            ]
          }
        }
      ]
    }
  ];
}
