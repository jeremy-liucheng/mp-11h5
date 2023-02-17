import request from '@/service/http';
import { Stat } from '@/types/api/types';
import { ApiReturn } from '@/types/utils';
interface StatApi {
  getPlatformDataList: (params: any) => ApiReturn<Stat.PlatformDataList[]>;
  getGamePlatformOnline: (params: any) => ApiReturn<Record<string, { [key: number]: number }>>;
  getAllPlatformOnline: () => ApiReturn<Stat.AllPlatformOnline>;
  getGameCurPlatformOnline: (params: any) => ApiReturn<{ count: number }>;
}

const baseUrl = '/stat';
const cpsApi: StatApi = {
  getPlatformDataList(params: any) {
    return request.get(baseUrl, {
      cmd: 'getPlatformDataList',
      ...params
    });
  },
  getAllPlatformOnline() {
    return request.get(baseUrl, {
      cmd: 'getAllPlatformOnline'
    });
  },
  getGamePlatformOnline(params: any) {
    return request.get(baseUrl, {
      cmd: 'getGamePlatformOnline',
      ...params
    });
  },
  getGameCurPlatformOnline(params: any) {
    return request.get(baseUrl, {
      cmd: 'getGameCurPlatformOnline',
      ...params
    });
  }
};

export const {
  getAllPlatformOnline,
  getGameCurPlatformOnline,
  getGamePlatformOnline,
  getPlatformDataList
} = cpsApi;
