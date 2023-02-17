<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: 'page401'
};
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function home() {
  router.push('/dashboard');
}
</script>

<template>
  <div class="errPage-container">
    <el-col :span="24">
      <el-result icon="error" title="Error 401" sub-title="没有访问权限">
        <template #extra>
          <el-button type="primary" @click="home">返回首页</el-button>
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<style scoped>
.errPage-container {
  height: 100%;
}
</style>
