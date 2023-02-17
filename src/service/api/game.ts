import request from '@/service/http';
import useStore from '@/store';
import { Game } from '@/types/api/types';
import { AxiosReturn, CRUDapiReturn, ResType } from '@/types/axios';
import { ApiReturn } from '@/types/utils';
import { useRoute } from 'vue-router';

interface GameApi {
  getGameCateList: (params: any) => ApiReturn<Game.GameCateList[]>;
  getGameList: (params?: any) => ApiReturn<Game.GameList[], 'get'>;
  getGameInfo: (params: any) => ApiReturn<Game.GameInfo>;
  addGame: (params: any) => ApiReturn<CRUDapiReturn>;
  editGame: (params: any) => ApiReturn<CRUDapiReturn>;
  getGameProductList: (params: any) => ApiReturn<Game.GameProduct>;
  addGameProduct: (params: any) => ApiReturn<CRUDapiReturn>;
  batchAddGameProduct: (params: any) => ApiReturn<CRUDapiReturn>;
  editGameProduct: (params: any) => ApiReturn<CRUDapiReturn>;
  delGameProduct: (params: any) => ApiReturn<CRUDapiReturn>;
  dumpAllGameProduct: (params: any) => AxiosReturn<ResType<any>>;
  getZoneList: (params: any) => ApiReturn<Game.GameZone[]>;
  addZone: (params: any) => ApiReturn<CRUDapiReturn>;
  getMchGame: (params: any) => ApiReturn<Game.MuchGame[], 'get'>;
  delZone: (params: any) => ApiReturn<CRUDapiReturn>;
  getSumList: (params: any) => ApiReturn<Game.SumList, 'get'>;
  getCopyrightList: (params: any) => ApiReturn<Game.CopyrightList[], 'get'>;
  uploadCopyright: (params: any) => ApiReturn<CRUDapiReturn>;
  editCopyright: (params: any) => ApiReturn<CRUDapiReturn>;
  addPayChannel: (params: any) => ApiReturn<CRUDapiReturn>;
  getPayChannelList: (params: any) => ApiReturn<Game.PayChannel[], 'get'>;
  getChannelMoneys: (params: any) => ApiReturn<Game.ChannelMoney[], 'get'>;
  getOrderList: (params: any) => ApiReturn<Game.Order, 'get'>;
}

const gameApi: GameApi = {
  getGameCateList(params) {
    return request.post('/game', {
      cmd: 'getGameCateList',
      ...params
    });
  },
  getGameList(params) {
    return request.get('/game', {
      cmd: 'getGameList',
      ...params
    });
  },
  getMchGame(params) {
    const {
      meta: { id }
    } = useRoute();
    return request.get('/game', {
      cmd: 'getMchGame',
      menuId: id,
      ...params
    });
  },
  getGameInfo(params) {
    return request.get('/game', {
      cmd: 'getGameInfo',
      ...params
    });
  },
  addGame(params) {
    return request.post('/game', {
      cmd: 'addGame',
      ...params,
      showSuccess: true
    });
  },
  editGame(params) {
    return request.post('/game', {
      cmd: 'editGame',
      ...params,
      showSuccess: true
    });
  },
  getGameProductList(params) {
    return request.post('/game', {
      cmd: 'getGameProductList',
      ...params
    });
  },
  addGameProduct(params) {
    return request.post('/game', {
      cmd: 'addGameProduct',
      ...params,
      showSuccess: true
    });
  },
  batchAddGameProduct(params) {
    return request.post('/game', {
      cmd: 'batchAddGameProduct',
      ...params,
      showSuccess: true
    });
  },
  editGameProduct(params) {
    return request.post('/game', {
      cmd: 'editGameProduct',
      ...params,
      showSuccess: true
    });
  },
  delGameProduct(params) {
    return request.post('/game', {
      cmd: 'delGameProduct',
      ...params,
      showSuccess: true
    });
  },
  dumpAllGameProduct(params) {
    return request.post('/game', {
      cmd: 'dumpAllGameProduct',
      ...params
    });
  },
  getZoneList(params) {
    return request.get('/game', {
      cmd: 'getZoneList',
      ...params
    });
  },
  addZone(params) {
    return request.post('/game', {
      cmd: 'addZone',
      ...params
    });
  },
  delZone(params) {
    return request.post('/game', {
      cmd: 'delZone',
      ...params
    });
  },
  getSumList(params) {
    return request.get('/order', {
      cmd: 'getSumList',
      ...params
    });
  },
  getCopyrightList(params) {
    return request.get('/platform', {
      cmd: 'getCopyrightList',
      ...params
    });
  },
  uploadCopyright({ gameid, type, params }) {
    const { user } = useStore();
    return request.post(
      `/platform?cmd=uploadCopyright&gameid=${gameid}&type=${type}&session=${user.session}`,
      params
    );
  },
  editCopyright(params) {
    return request.get('/platform', {
      cmd: 'editCopyright',
      ...params
    });
  },
  getPayChannelList(params) {
    return request.get('/platform', {
      cmd: 'getPayChannelList',
      ...params
    });
  },
  addPayChannel(params) {
    return request.get('/platform', {
      cmd: 'addPayChannel',
      ...params
    });
  },
  getChannelMoneys(params: any) {
    return request.get('/stat', {
      cmd: 'getChannelMoneys',
      ...params
    });
  },
  getOrderList(params: any) {
    return request.get('/order', {
      cmd: 'getOrderList',
      ...params
    });
  }
};

export const {
  getOrderList,
  batchAddGameProduct,
  getGameCateList,
  getGameList,
  getGameInfo,
  addGame,
  editGame,
  getGameProductList,
  editGameProduct,
  delGameProduct,
  addGameProduct,
  getMchGame,
  getZoneList,
  addZone,
  delZone,
  getSumList,
  getCopyrightList,
  uploadCopyright,
  editCopyright,
  getPayChannelList,
  addPayChannel,
  getChannelMoneys
} = gameApi;
