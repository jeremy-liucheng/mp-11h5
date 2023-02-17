import useStore from '@/store';
import { Ref, ref, unref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

export function useRouteQuery() {
  const { query } = useRoute();
  return query;
}

export function useRouteParams() {
  const { params } = useRoute();
  return params;
}

export function useCurrentGameInfo() {
  const {
    query: { gameid }
  } = useRoute();
  const gName = ref('');
  watchEffect(() => {
    const {
      searchModel: { gameList }
    } = useStore();
    gName.value = gameList?.find(e => e.value === Number(gameid))?.label;
  });
  return { gameid, gName };
}

export function useInterval(
  fn: () => void,
  delay: Ref<number | undefined> | number | undefined,
  options?: {
    immediate?: boolean;
  }
) {
  const immediate = options?.immediate;

  if (immediate) {
    fn();
  }

  if (unref(delay) === undefined || typeof unref(delay) !== 'number' || unref(delay)! < 0) return;
  const _delay = unref(delay);
  const timer: NodeJS.Timer = setInterval(() => {
    fn();
  }, _delay);

  return timer;
}
