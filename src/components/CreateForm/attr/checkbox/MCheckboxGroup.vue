<template>
  <el-checkbox-group v-model="value">
    <el-checkbox
      v-for="v in field.options"
      :key="v.label"
      :label="v.value"
      :validate-event="field.validateEvent"
      :style="field.style"
      :disabled="field.disabled"
      :name="field.name"
    >
      {{ v.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import { CheckboxFieldInterface } from './CheckboxField';

export default defineComponent({
  name: 'MCheckbox',
  props: {
    modelValue: {
      type: [Array<number>],
      default: ''
    },
    field: {
      type: Object as PropType<CheckboxFieldInterface>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const value = ref(props.modelValue);
    watchEffect(() => {
      context.emit('update:modelValue', value);
    });
    return { value };
  }
});
</script>
