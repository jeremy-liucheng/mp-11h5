import { throttle } from '@/utils/utils';
import { Directive, DirectiveBinding } from 'vue';

export const directives = [{}];

export const loadMore: Directive = {
  mounted(_el, { value, arg }: DirectiveBinding) {
    const oEl = document.querySelector(`.${arg}`);
    if (oEl) {
      oEl.addEventListener(
        'scroll',
        throttle(() => {
          const { scrollHeight, scrollTop, clientHeight } = oEl;
          const diff = scrollHeight - scrollTop - clientHeight;
          if (diff <= 0 && value) {
            value();
          }
        }, 500),
        {
          passive: true
        }
      );
    }
  }
};
