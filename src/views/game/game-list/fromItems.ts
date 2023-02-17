import {
  CheckboxField,
  SelectField,
  DateField,
  InputField,
  RadioField
} from '@/components/CreateForm/attr';

import useStore from '@/store';
import { Role } from '@/types/enum';
import { randomString } from '@/utils/utils';
import { h } from 'vue';

export function randomSecurityKey(modelValue: any) {
  modelValue.value.security_key = randomString();
}

export const formRules = {
  name: [
    {
      required: true,
      message: '游戏名称不能为空',
      trigger: 'blur'
    }
  ],
  security_key: [
    {
      required: true,
      message: '发货密钥不能为空',
      trigger: 'blur'
    }
  ],
  delivery_url: [
    {
      required: true,
      message: '发货地址不能为空',
      trigger: 'blur'
    }
  ],
  money_name: [
    {
      required: true,
      message: '游戏币名称不能为空',
      trigger: 'blur'
    }
  ],
  money_rate: [
    {
      required: true,
      message: '游戏货币充值比例不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems(modelValue: any) {
  const {
    searchModel: { gameCateList }
  } = useStore();
  return [
    {
      label: '游戏id',
      prop: 'gameid',
      applyingTitle: ['修改游戏'],
      children: [
        {
          useModel: new InputField('gameid'),
          props: {
            disabled: true
          }
        }
      ]
    },
    {
      prop: 'cate_id',
      label: '选择游戏、程序分类',
      children: [
        {
          useModel: new SelectField('cate_id'),
          props: {
            placeholder: '选择游戏',
            options: gameCateList
          }
        }
      ]
    },
    {
      prop: 'name',
      label: '游戏名称',
      children: [
        {
          useModel: new InputField('name'),
          props: {
            placeholder: '请填写游戏名称'
          }
        }
      ]
    },
    {
      prop: 'content_url',
      label: '游戏内容地址',
      children: [
        {
          useModel: new InputField('content_url'),
          props: {
            placeholder: '请填写进入游戏内容地址'
          }
        }
      ]
    },
    {
      prop: 'test_url',
      label: '测试游戏内容地址',
      children: [
        {
          useModel: new InputField('test_url'),
          props: {
            placeholder: '请填写进入测试游戏内容地址'
          }
        }
      ]
    },
    {
      prop: 'security_key',
      label: '发货密钥',
      children: [
        {
          useModel: new InputField('security_key'),
          props: {
            placeholder: '请填写发货密钥',
            slots: [
              {
                name: 'append',
                content: h(
                  'div',
                  {
                    class: 'secretKey_input',
                    onClick() {
                      randomSecurityKey(modelValue);
                    }
                  },
                  '生成发货密钥'
                )
              }
            ]
          }
        }
      ]
    },
    {
      prop: 'delivery_url',
      label: '发货地址',
      children: [
        {
          useModel: new InputField('delivery_url'),
          props: {
            placeholder: '请填写发货地址'
          }
        }
      ]
    },
    {
      prop: 'money_name',
      label: '游戏币名称',
      children: [
        {
          useModel: new InputField('money_name'),
          props: {
            placeholder: '请填写游戏币名称'
          }
        }
      ]
    },
    {
      prop: 'money_rate',
      label: '游戏货币充值比例',
      children: [
        {
          useModel: new InputField('money_rate'),
          props: {
            placeholder: '请填写游戏货币充值比例'
          }
        }
      ]
    },
    {
      prop: 'orientation',
      label: '横竖屏',
      children: [
        {
          useModel: new RadioField('orientation'),
          props: {
            options: [
              {
                label: '竖屏',
                value: 0
              },
              {
                label: '横屏',
                value: 1
              }
            ]
          }
        }
      ]
    },
    {
      prop: 'biz_id',
      label: '游戏防沉迷备案识别码',
      children: [
        {
          useModel: new InputField('biz_id'),
          props: {
            placeholder: '请填写游戏防沉迷备案识别码'
          }
        }
      ]
    },
    {
      prop: 'game_type',
      label: '游戏类型',
      applyingRole: [Role.Manager, Role.Operator],
      children: [
        {
          useModel: new SelectField('game_type'),
          props: {
            placeholder: '选择游戏',
            options: [
              {
                label: '自研游戏',
                value: 0
              },
              {
                label: '外联游戏',
                value: 1
              },
              {
                label: '内联游戏',
                value: 3
              },
              {
                label: '应用宝内联游戏',
                value: 4
              }
            ]
          }
        }
      ]
    },
    {
      prop: 'is_bt',
      label: '是否bt游戏',
      applyingRole: [Role.Manager, Role.Operator],
      children: [
        {
          useModel: new CheckboxField('is_bt'),
          props: {
            options: [
              {
                label: '是bt游戏',
                trueLabel: 1,
                falseLabel: 0
              }
            ]
          }
        }
      ]
    },
    {
      prop: 'stat_appid',
      label: '统计appid',
      applyingRole: [Role.Manager, Role.Operator],
      children: [
        {
          useModel: new InputField('stat_appid'),
          prop: {
            placeholder: '请填写统计appid'
          }
        }
      ]
    },
    {
      prop: 'hide',
      label: '是否隐藏',
      children: [
        {
          useModel: new CheckboxField('hide'),
          props: {
            options: [
              {
                label: '隐藏',
                trueLabel: 1,
                falseLabel: 0
              }
            ]
          }
        }
      ],
      applyingTitle: ['修改游戏'],
      applyingRole: [Role.Manager, Role.Operator]
    },
    {
      prop: 'token_type',
      label: 'token类型',
      children: [
        {
          useModel: new RadioField('token_type'),
          props: {
            options: [
              {
                label: 'Token',
                value: 0
              },
              {
                label: 'UserToken',
                value: 1
              }
            ]
          }
        }
      ],
      applyingRole: [Role.Manager, Role.Operator]
    },
    {
      prop: 'wx_option',
      label: '是否显示微信菜单',
      children: [
        {
          useModel: new RadioField('wx_option'),
          props: {
            options: [
              {
                label: '隐藏',
                value: 0
              },
              {
                label: '显示',
                value: 1
              }
            ]
          }
        }
      ],
      applyingRole: [Role.Manager, Role.Operator]
    },
    {
      prop: 'entry_url',
      label: '游戏入口',
      children: [
        {
          useModel: new InputField('entry_url'),
          props: {
            placeholder: '请输入游戏入口'
          }
        }
      ],
      applyingRole: [Role.Manager, Role.Operator]
    },
    {
      prop: 'use_vucoupon',
      label: '是否开启微游卷',
      applyingRole: [Role.Manager, Role.Operator],
      children: [
        {
          useModel: new CheckboxField('use_vucoupon'),
          props: {
            options: [
              {
                label: '开启',
                value: 1
              }
            ]
          }
        }
      ],
      applyingTitle: ['修改游戏']
    },
    {
      prop: 'publish_type',
      applyingRole: [Role.Manager, Role.Operator],
      label: '发布类型',
      children: [
        {
          useModel: new SelectField('publish_type'),
          props: {
            options: [
              {
                label: '接入中',
                value: 0
              },
              {
                label: '封测',
                value: 1
              },
              {
                label: '正式上线',
                value: 2
              }
            ]
          }
        }
      ],
      applyingTitle: ['修改游戏']
    },
    {
      prop: 'publish_time',
      label: '发布时间',
      children: [
        {
          useModel: new DateField('publish_time')
        }
      ],
      applyingTitle: ['修改游戏'],
      applyingRole: [Role.Manager, Role.Operator]
    },
    {
      prop: 'recommend',
      label: '是否是推荐新游',
      applyingRole: [Role.Manager, Role.Operator],
      children: [
        {
          useModel: new CheckboxField('recommend'),
          props: {
            options: [
              {
                label: '是',
                trueValue: 1,
                falseValue: 1
              }
            ]
          }
        }
      ],
      applyingTitle: ['修改游戏']
    },
    {
      prop: 'ext'
    },
    {
      prop: 'inner_ext'
    }
  ];
}
