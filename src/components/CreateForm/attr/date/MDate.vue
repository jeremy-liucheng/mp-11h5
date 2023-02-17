<template>
  <el-date-picker
    v-model.number="value"
    :style="field.style"
    :type="field.type"
    :disabled="field.disabled"
    :name="field.name"
    :format="field.format"
    :value-format="field.valueFormat"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import { DateFieldInterface } from './DateField';

export default defineComponent({
  name: 'MCheckbox',
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },
    field: {
      type: Object as PropType<DateFieldInterface>,
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
