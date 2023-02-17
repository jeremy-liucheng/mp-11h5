<script lang="tsx" setup>
import { reactive, ref, toRefs, onMounted, nextTick } from 'vue';
import { createFormItems, formRules } from './fromItems';
import { useForm } from '@/hook/form';
import { useRouter } from 'vue-router';
import { TmpFormRef } from '@/types/mgr';
import { applyMarchant, verify } from '@/service/api/user';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const state = reactive({
  modelValue: {
    password: '',
    checkPass: '',
    bank_type: '0',
    qq: '',
    mobile: '',
    bank_account: ''
  } as any,
  captchaObj: {} as any,
  captcha: null as any,
  passwordType: 'password'
});

const handleSubmit = async () => {
  state.captcha.show();
};

const formEl = ref<TmpFormRef>();
const submit = () => {
  formEl.value?.submit?.(formEl.value.formRef);
};

const router = useRouter();
function toLogin() {
  router.push({ path: '/login' });
}

onMounted(async () => {
  const [{ data }] = await verify();
  initGeetest(
    {
      ...data,
      product: 'popup',
      offline: !data.success
    },
    function (captchaObj: any) {
      captchaObj.onSuccess(async function () {
        var result = captchaObj.getValidate();
        state.captchaObj.challenge = result.geetest_challenge;
        state.captchaObj.validate = result.geetest_validate;
        state.captchaObj.seccode = result.geetest_seccode;
        const [res] = await applyMarchant({
          ...state.modelValue,
          ...state.captchaObj,
          showSuccess: true
        });
        if (res) (formEl.value as any).resetForm();
      });

      captchaObj.appendTo('#popup-captcha');
      state.captcha = captchaObj;
      // 这里可以调用验证实例 captchaObj 的实例方法
    }
  );
});

const validatePass = (rule: any, value: any, callback: any) => {
  const match = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (value === '') {
    callback(new Error('请输入商户密码'));
  } else if (!match.test(value)) {
    callback(new Error('密码最少8位并且包含一个字母'));
  } else {
    if (state.modelValue.checkPass !== '') {
      if (!formEl.value?.formRef) return;
      formEl.value?.formRef.validateField('checkPass', () => null);
    }
    callback();
  }
};
const checkPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入商户密码'));
  } else if (value !== state.modelValue.password) {
    callback(new Error('确认商户密码错误'));
  } else {
    callback();
  }
};
const rules = {
  password: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: checkPass, trigger: 'blur' }]
};

const passwordRef = ref();
function showPwd() {
  if (state.passwordType === 'password') {
    state.passwordType = '';
  } else {
    state.passwordType = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

const { formCreate } = useForm(createFormItems, { ...formRules, ...rules });
const { modelValue, passwordType } = toRefs(state);
</script>

<template>
  <div class="layout">
    <h1 class="page-header">申请商户账号</h1>
    <el-button type="primary" @click="toLogin"> 返回登陆 </el-button>
    <div class="form-container">
      <m-form
        ref="formEl"
        :model-value="modelValue"
        :form="formCreate"
        @handler-submit="handleSubmit"
      >
        <template #special>
          <el-col :span="24">
            <el-form-item label="商户密码" prop="password">
              <el-input
                ref="passwordRef"
                :key="passwordType"
                v-model="modelValue.password"
                class="password"
                placeholder="请输入商户密码"
                :type="passwordType"
              >
                <template #append>
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon
                      color="black"
                      :name="passwordType === 'password' ? 'eye' : 'open-eye'"
                    />
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                :key="passwordType"
                v-model="modelValue.checkPass"
                placeholder="请确认商户密码"
                :type="passwordType"
              />
            </el-form-item>
          </el-col>
        </template>
        <template #default>
          <el-button type="primary" @click="submit"> 立即申请 </el-button>
        </template>
      </m-form>
    </div>
    <div id="popup-captcha"></div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  width: 800px;
  margin: 0 auto;
  height: 100%;
  .form-container {
    margin-top: 10px;
  }
  #popup-captcha {
    height: 200px;
  }
  .show-pwd {
    cursor: pointer;
  }
}
</style>
