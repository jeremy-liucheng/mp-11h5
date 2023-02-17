<template>
  <el-checkbox
    v-for="v in field.options"
    :key="v.label"
    v-model="value"
    :style="field.style"
    :disabled="field.disabled"
    :name="field.name"
    :validate-event="field.validateEvent"
    :options="field.options"
    :label="v.value"
    :true-label="v.trueLabel"
    :false-label="v.falseLabel"
    >{{ v.label }}</el-checkbox
  >
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import { CheckboxFieldInterface } from './CheckboxField';

export default defineComponent({
  name: 'MCheckbox',
  props: {
    modelValue: {
      type: [Number, String],
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
