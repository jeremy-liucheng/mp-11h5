<template>
  <el-row>
    <el-link>{{ value }}</el-link>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { DateFieldInterface } from './Text';

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
    watch(value, newValue => {
      if (newValue !== props.modelValue) {
        context.emit('update:modelValue', newValue);
        return true;
      }
      return false;
    });
    return { value };
  }
});
</script>
