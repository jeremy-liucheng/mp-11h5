<template>
  <el-select-v2
    v-model="value"
    :style="field.style"
    :placeholder="field.placeholder"
    :clearable="field.clearable"
    :disabled="field.disabled"
    :name="field.name"
    :readonly="field.readonly"
    :validate-event="field.validateEvent"
    :options="field.options"
  ></el-select-v2>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import { SelectFieldInterface } from './SelectField';

export default defineComponent({
  name: 'MSelect',
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },
    field: {
      type: Object as PropType<SelectFieldInterface>,
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
