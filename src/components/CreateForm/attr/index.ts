import { defineAsyncComponent } from 'vue';

export { InputField, type InputFieldInterface } from './input/InputField';
export { SelectField, type SelectFieldInterface } from './select/SelectField';
export { RadioField, type RadioFieldInterface } from './radio/RadioField';
export { CheckboxField, type CheckboxFieldInterface } from './checkbox/CheckboxField';
export { DateField, type DateFieldInterface } from './date/DateField';
// export { default as MSelect } from './select/MSelect.vue';
// export { default as MInput } from './input/MInput.vue';
// export { default as MRadio } from './radio/MRadio.vue';
// export { default as MCheckbox } from './checkbox/MCheckbox.vue';
// export { default as MCheckboxGroup } from './checkbox/MCheckboxGroup.vue';
// export { default as MDate } from './date/MDate.vue';

export const MSelect = defineAsyncComponent(() => import('./select/MSelect.vue'));
export const MInput = defineAsyncComponent(() => import('./input/MInput.vue'));
export const MRadio = defineAsyncComponent(() => import('./radio/MRadio.vue'));
export const MCheckbox = defineAsyncComponent(() => import('./checkbox/MCheckbox.vue'));
export const MCheckboxGroup = defineAsyncComponent(() => import('./checkbox/MCheckboxGroup.vue'));
export const MDate = defineAsyncComponent(() => import('./date/MDate.vue'));
