import { getGameCateList, getMchGame } from '@/service/api/game';
import { getMchChannelList } from '@/service/api/cps';
import { SearchModel } from '@/types/store';
import { formatTime } from '@/utils/utils';
import { defineStore } from 'pinia';

export default defineStore({
  id: 'searchModel',
  state: (): SearchModel => ({
    gameList: [],
    channelList: [],
    gameCateList: [],
    gameid: '',
    date: '',
    chid: '',
    sortType: 1,
    keyword: '',
    transId: '',
    deliveryResult: 0,
    time: [formatTime(Date.now(), 'YYYYMMDD'), formatTime(Date.now(), 'YYYYMMDD')],
    cateId: 1,
    money: {
      minMoney: '',
      maxMoney: ''
    },
    sumType: 1,
    year: '',
    month: ''
  }),
  getters: {},
  actions: {
    async setGameList(params?: any) {
      const [res] = await getMchGame({ ...params });
      this.gameList = res?.data.map(res => ({
        label: res.name,
        value: res.gameid
      }));
    },
    async setGameCateIdList(params?: any) {
      const [res] = await getGameCateList(params);
      this.gameCateList = res?.data.map(res => ({
        label: res.title,
        value: res.id
      }));
    },
    async setChannelList(params?: any) {
      const [res] = await getMchChannelList(params);
      this.channelList = res?.data.map((res: { name: any; id: any }) => ({
        label: res.name,
        value: res.id
      }));
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义key
        key: 'search_store',
        // 自定义存储方式，默认sessionStorage
        storage: localStorage,
        // // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
        paths: [
          'sumType',
          'gameList',
          'channelList',
          'gameCateList',
          'gameid',
          'date',
          'keyword',
          'transId',
          'deliveryResult',
          'time',
          'cateId',
          'sumType',
          'sortType',
          'chid',
          'year',
          'month'
        ]
      }
    ]
  }
});
