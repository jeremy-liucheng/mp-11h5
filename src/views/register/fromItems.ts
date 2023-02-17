import { SelectField, InputField } from '@/components/CreateForm/attr';

export const formRules = {
  nick: [
    {
      required: true,
      message: '商户账号不能为空',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '商户名称不能为空',
      trigger: 'blur'
    }
  ],
  bank_type: [
    {
      required: true,
      message: '所属银行不能为空',
      trigger: 'change'
    }
  ],
  open_bank_name: [
    {
      required: true,
      message: '开户名称不能为空',
      trigger: 'blur'
    }
  ],
  bank_account: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: string, callback: any) => {
        const match = /^[1-9]\d{9,29}$/;
        if (!match.test(value)) {
          callback(new Error('银行账号格式错误'));
        }
        callback();
      }
    }
  ],
  qq: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: string, callback: any) => {
        const match = /^[1-9][0-9]{4,10}$/;
        if (!match.test(value)) {
          callback(new Error('QQ号格式错误'));
        }
        callback();
      }
    }
  ],
  mobile: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule: any, value: string, callback: any) => {
        const match = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
        if (!match.test(value)) {
          callback(new Error('手机号格式错误'));
        }
        callback();
      }
    }
  ],
  open_user_name: [
    {
      required: true,
      message: '开户姓名不能为空',
      trigger: 'blur'
    }
  ]
};

export function createFormItems() {
  return [
    {
      label: '商户账户',
      prop: 'nick',
      children: [
        {
          useModel: new InputField('nick'),
          props: {
            placeholder: '请输入你的登录账号，YouGuang'
          }
        }
      ]
    },

    {
      label: '商户名称',
      prop: 'name',
      children: [
        {
          useModel: new InputField('name'),
          props: {
            placeholder: '请输入您的商户名称，如游光网络'
          }
        }
      ]
    },
    {
      label: '所属银行',
      prop: 'bank_type',
      children: [
        {
          useModel: new SelectField('bank_type'),
          props: {
            options: [
              {
                label: '工商银行',
                value: '0'
              },
              {
                label: '建设银行',
                value: '1'
              },
              {
                label: '农业银行',
                value: '2'
              },
              {
                label: '中国邮政',
                value: '3'
              },
              {
                label: '中国银行',
                value: '4'
              },
              {
                label: '中信银行',
                value: '5'
              },
              {
                label: '光大银行',
                value: '6'
              },
              {
                label: '民生银行',
                value: '7'
              },
              {
                label: '招商银行',
                value: '8'
              },
              {
                label: '平安银行',
                value: '9'
              },
              {
                label: '金华银行',
                value: '10'
              },
              {
                label: '其他银行',
                value: '11'
              }
            ]
          }
        }
      ]
    },
    {
      label: '开户银行',
      prop: 'open_bank_name',
      children: [
        {
          useModel: new InputField('open_bank_name'),
          props: {
            placeholder: '请输入您的开户银行'
          }
        }
      ]
    },
    {
      label: '开户姓名',
      prop: 'open_user_name',
      children: [
        {
          useModel: new InputField('open_user_name'),
          props: {
            placeholder: '请输入您的开户姓名'
          }
        }
      ]
    },
    {
      label: '银行账号',
      prop: 'bank_account',
      children: [
        {
          useModel: new InputField('bank_account'),
          props: {
            placeholder: '请输入您的银行账号'
          }
        }
      ]
    },
    {
      label: '腾讯QQ',
      prop: 'qq',
      children: [
        {
          useModel: new InputField('qq'),
          props: {
            placeholder: '请输入您的腾讯QQ'
          }
        }
      ]
    },
    {
      label: '联系手机',
      prop: 'mobile',
      children: [
        {
          useModel: new InputField('mobile'),
          props: {
            placeholder: '请输入您联系手机'
          }
        }
      ]
    }
  ];
}
