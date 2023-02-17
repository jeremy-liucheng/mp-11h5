/// <reference types="vite/client" />

/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'rollup-plugin-external-globals';

declare module 'cos-js-sdk-v5';

declare function initGeetest(params: any, callBack: any): any;

// declare const formProps: FormProps = new FormPropsClass();
// declare const rowProps: RowProps = new RowField();
// declare const formItemProps: Array<FormItemProps> = [];
