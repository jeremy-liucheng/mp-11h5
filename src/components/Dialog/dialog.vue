<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    top="5vh"
    :center="center"
    :destroy-on-close="true"
    :before-close="handleClose"
    v-bind="$attrs"
  >
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus';
import { toRefs, watch } from 'vue';

const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  formRef?: FormInstance | undefined;
  center?: boolean;
}>();

const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>();

const { dialogVisible, title, formRef } = toRefs(props);

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const handleClose = (done: () => void) => {
  emit('closeDialog');
  done();
};

watch(dialogVisible, e => {
  if (!e) {
    formRef && resetForm(formRef.value);
  }
});
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
