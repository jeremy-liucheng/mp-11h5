<script setup lang="ts">
import { onBeforeMount, reactive, ref, toRefs, watch, nextTick } from 'vue';
import { ElForm, ElInput } from 'element-plus';
import router from '@/router';
import useStore from '@/store';
import { useRoute } from 'vue-router';
import { verify } from '@/service/api/user';
import { ElMessage } from 'element-plus';
import SvgIcon from '@/components/SvgIcon/svgIcon.vue';

const { user } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

const state = reactive({
  redirect: '',
  loginForm: {
    username: '',
    passwd: ''
  } as any,
  loginRules: {
    username: [{ required: true, trigger: 'blur' }],
    passwd: [{ required: true, trigger: 'blur' }]
  },
  loading: false,
  loadingCaptcha: true,
  passwordType: 'password',
  // 大写提示禁用
  otherQuery: {},
  domainHref: import.meta.env.VITE_APP_LOGIN_URL,
  logo: import.meta.env.VITE_APP_LOGO_URL,
  captchaObj: null as any
});

// function validatePassword(rule: any, value: any, callback: any) {
//   if (value.length <= 6) {
//     callback(new Error('The password can not be less than 6 digits'));
//   } else {
//     callback();
//   }
// }

const { loginForm, loginRules, loading, domainHref, logo, passwordType } = toRefs(state);

function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = '';
  } else {
    passwordType.value = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

/**
 *  登录处理
 */

function handleLogin() {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      state.captchaObj.show();
    }
  });
}

function handle(captchaObj: any) {
  captchaObj.onSuccess(function () {
    var result = captchaObj.getValidate();
    if (!result) {
      return ElMessage({
        message: '验证码错误',
        grouping: true,
        type: 'error'
      });
    }
    state.loginForm.challenge = result.geetest_challenge;
    state.loginForm.validate = result.geetest_validate;
    state.loginForm.seccode = result.geetest_seccode;
    user
      .login(state.loginForm)
      .then(() => {
        router.push({ path: state.redirect || '/', query: state.otherQuery });
      })
      .catch(() => {});
  });
  captchaObj.appendTo('#popup-captcha');
  state.captchaObj = captchaObj;
}

onBeforeMount(async () => {
  const [res] = await verify();
  initGeetest(
    {
      gt: res?.data.gt,
      challenge: res?.data.challenge,
      offline: !res?.data.success,
      product: 'popup'
    },
    handle
  );
});

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}
</script>

<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title flex flex-hc flex-vc">
          <img class="logo" :src="logo" alt="" />爱微游商户平台
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon name="jiaose" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入商户登陆名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="passwd">
        <span class="svg-container">
          <svg-icon name="quanxian" />
        </span>
        <el-input
          ref="passwordRef"
          :key="passwordType"
          v-model="loginForm.passwd"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          auto-complete="on"
          @keyup.enter="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="passwordType === 'password' ? 'eye' : 'open-eye'" />
        </span>
      </el-form-item>

      <!-- <div
        id="captchaBox"
        v-loading="loadingCaptcha"
        class="flex flex-vc"
        element-loading-background="rgba(122, 122, 122, 0)"
      ></div> -->

      <el-row justify="space-between">
        <el-col :span="18"
          ><el-button
            size="default"
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click.prevent="handleLogin"
            >登陆
          </el-button></el-col
        >
        <el-col :span="4" class="flex flex-hc">
          <el-link type="primary" :href="domainHref">域帐号登录</el-link>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div id="popup-captcha"></div>
</template>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
      vertical-align: center;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;
    .el-input__wrapper {
      padding: 0;
      background: transparent;
      box-shadow: none;
      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 36px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-right: 0px !important;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
  #captchaBox {
    height: 200px;
  }
  #loading-tip {
    color: white;
  }
  .gt_widget,
  .gt_slider {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}

.thirdparty-button {
  position: absolute;
  right: 40px;
  bottom: 6px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}
</style>
