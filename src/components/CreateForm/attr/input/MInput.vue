<template>
  <el-input
    v-model="value"
    :type="field.type"
    :style="field.style"
    :maxlength="field.maxlength"
    :minlength="field.minlength"
    :show-word-limit="field.showWordLimit"
    :placeholder="field.placeholder"
    :clearable="field.clearable"
    :show-password="field.showPassword"
    :disabled="field.disabled"
    :prefix-icon="field.prefixIcon"
    :suffix-icon="field.suffixIcon"
    :rows="field.rows"
    :autosize="field.autosize"
    :autocomplete="field.autocomplete"
    :name="field.name"
    :readonly="field.readonly"
    :max="field.max"
    :min="field.min"
    :step="field.step"
    :resize="field.resize"
    :autofocus="field.autofocus"
    :form="field.form"
    :label="field.label"
    :tabindex="field.tabindex"
    :validate-event="field.validateEvent"
    :input-style="field.inputStyle"
  >
    <template v-if="prependSlot" #prepend>
      <input-slot :content="prependSlot?.content" />
    </template>
    <template v-if="appendSlot" #append>
      <input-slot :content="appendSlot?.content" />
    </template>
  </el-input>
</template>

<script lang="tsx">
import { defineComponent, h, PropType, ref, watchEffect } from 'vue';
import { InputFieldInterface } from './InputField';
import InputSlot from './Slot';

export default defineComponent({
  name: 'MInput',
  components: {
    InputSlot
  },
  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },
    field: {
      type: Object as PropType<InputFieldInterface>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const value = ref(props.modelValue);
    const slots: any = ref(props.field.slots);
    watchEffect(() => {
      context.emit('update:modelValue', value);
    });
    const prependSlot = slots.value?.find((e: any) => e.name === 'prepend');
    const appendSlot = slots.value?.find((e: any) => e.name === 'append');
    return { value, emit: context.emit, prependSlot, appendSlot, h };
  }
});
</script>
