<script lang="ts">
import { defineComponent, reactive, watch, ref, defineExpose } from 'vue';
import { FormCreate } from '@/components/CreateForm/modules/FormCreate';
import { MInput, MSelect, MRadio, MCheckbox, MDate, MCheckboxGroup } from './attr';
import { FormInstance } from 'element-plus';
import useStore from '@/store';

export default defineComponent({
  name: 'MyFrom',
  components: { MInput, MSelect, MRadio, MCheckbox, MDate, MCheckboxGroup },
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {};
      }
    },
    form: {
      type: FormCreate,
      required: true
    },
    title: {
      type: String,
      require: true,
      default: ''
    }
  },
  emits: ['update:modelValue', 'handlerSubmit', 'cancel'],
  setup(props, context) {
    const data = reactive(props.modelValue);
    watch(data, value => {
      context.emit('update:modelValue', value);
    });
    const formRef = ref<FormInstance>();
    const submit = (formEl: FormInstance | undefined) => {
      formEl?.validate(valid => {
        if (valid) {
          context.emit('handlerSubmit', true);
        }
      });
    };

    const computedVisible = (args: any) => {
      const { applyingTitle, applyingRole } = args;
      const {
        user: { role }
      } = useStore();
      if (applyingTitle) {
        return applyingTitle.includes(props.title);
      }
      if (applyingRole) {
        return applyingRole.includes(role);
      }
      return true;
    };

    const resetForm = () => {
      formRef?.value?.resetFields();
    };

    defineExpose({
      submit,
      resetForm
    });

    const cancel = () => context.emit('cancel');

    return {
      ...props.form,
      data,
      submit,
      formRef,
      computedVisible,
      resetForm,
      cancel
    };
  }
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="data"
    :rules="formProps.rules"
    :inline="formProps.inline"
    :label-position="formProps.labelPosition"
    :label-width="formProps.labelWidth"
    :label-suffix="formProps.labelSuffix"
    :hide-required-asterisk="formProps.hideRequiredAsterisk"
    :show-message="formProps.showMessage"
    :inline-message="formProps.inlineMessage"
    :status-icon="formProps.statusIcon"
    :validate-on-rule-change="formProps.validateOnRuleChange"
    :size="formProps.size"
    :disabled="formProps.disabled"
  >
    <el-row
      :align="rowProps.align"
      :gutter="rowProps.gutter"
      :justify="rowProps.justify"
      :tag="rowProps.tag"
    >
      <el-col v-if="formProps.title" class="mb20" :span="formProps.titleSpan">
        <h2>{{ formProps.title }}</h2>
      </el-col>
      <el-col
        v-for="item in formItemProps"
        :key="item.name"
        class="mb20"
        :span="item.span"
        :style="item.style"
      >
        <el-form-item
          v-if="computedVisible(item)"
          :prop="item.prop"
          :label="item.label"
          :label-width="item.labelWidth"
        >
          <template v-for="field in item.fields" :key="field.name">
            <el-col :span="field.span">
              <component
                :is="'m-' + field.mold"
                v-if="field.type !== 'simple'"
                v-model="data[field.name]"
                :field="field"
              ></component>
              <el-link v-else type="primary">{{ (field as any).content }}</el-link>
            </el-col>
          </template>
        </el-form-item>
      </el-col>
      <slot name="special" />
      <slot name="default">
        <div class="flex flex-vc">
          <el-button
            type="default"
            theme="default"
            class="form-submit-cancel"
            variant="base"
            @click="cancel"
            >取消</el-button
          >
          <el-button
            type="primary"
            theme="primary"
            class="form-submit-confirm"
            @click="submit(formRef)"
          >
            确认
          </el-button>

          <slot name="extBtn"> </slot>
        </div>
      </slot>
    </el-row>
  </el-form>
</template>
