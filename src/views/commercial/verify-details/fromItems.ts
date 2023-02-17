import { RadioField, SelectField } from '@/components/CreateForm/attr';

export const formRules = {
  mch_id: [
    {
      required: true,
      message: '商务id不能为空',
      trigger: 'blur'
    }
  ],
  cps_type: [
    {
      required: true,
      message: '发行类型不能为空',
      trigger: 'blur'
    }
  ],
  rate_type: [
    {
      required: true,
      message: '开票类型不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems(options: any) {
  return [
    {
      label: '商务负责人',
      prop: 'mch_id',
      children: [
        {
          useModel: new SelectField('mch_id'),
          props: {
            options
          }
        }
      ]
    },
    {
      label: '发行类型',
      prop: 'cps_type',
      children: [
        {
          useModel: new RadioField('cps_type'),
          props: {
            options: [
              {
                label: 'H5',
                value: 1
              },
              {
                label: '微信小游戏',
                value: 2
              },
              {
                label: 'APP',
                value: 8
              }
            ]
          }
        }
      ]
    },
    {
      label: '开票类型',
      prop: 'rate_type',
      children: [
        {
          useModel: new SelectField('rate_type'),
          props: {
            placeholder: '请选择开票类型',
            options: [
              {
                label:
                  '	普通发票或者不能开票 - 自研游戏50%，联运游戏42%，传奇20%，微信小游戏50%，推荐新游50%',
                value: 1
              },
              {
                label:
                  '	3%增值税专用发票 - 自研游戏55%，联运游戏45%，传奇20%，微信小游戏55%，推荐新游55%',
                value: 2
              },
              {
                label:
                  '	6%增值税专用发票 - 自研游戏60%，联运游戏50%，传奇20%，微信小游戏60%，推荐新游60%',
                value: 3
              }
            ]
          }
        }
      ]
    }
  ];
}
