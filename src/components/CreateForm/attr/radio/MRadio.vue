<template>
  <el-radio-group
    v-model="value"
    :style="field.style"
    :placeholder="field.placeholder"
    :disabled="field.disabled"
    :name="field.name"
    :options="field.options"
  >
    <el-radio v-for="v in field.options" :key="v.label" :label="v.value"> {{ v.label }} </el-radio>
  </el-radio-group>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue';
import { RadioFieldInterface } from './RadioField';

export default defineComponent({
  name: 'MRadio',
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },
    field: {
      type: Object as PropType<RadioFieldInterface>,
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
