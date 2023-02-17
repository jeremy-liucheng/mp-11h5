<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { ref } from 'vue';

const locale = ref(zhCn);
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style></style>
