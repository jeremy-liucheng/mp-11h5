import request from '@/service/http';
import useStore from '@/store';
import { Cps } from '@/types/api/types';
import { ApiReturn } from '@/types/utils';
import { downloadXlsxFile } from '@/utils/utils';
interface CpsApi {
  getCpsRankList: (params: any) => ApiReturn<Cps.CpsRankList>;
  getCpsGameRankList: (params: any) => ApiReturn<any>;
  getCpsData: (params: any) => ApiReturn<Cps.CpsData>;
  getMchChannelList: (params: any) => ApiReturn<{ id: number; name: string }[]>;
  downloadCpsDataCompare: (params: any) => boolean;
}

const baseUrl = '/cps';
const cpsApi: CpsApi = {
  getCpsRankList(params: any) {
    return request.get(baseUrl, {
      cmd: 'getCpsRankList',
      ...params
    });
  },
  getMchChannelList(params) {
    return request.get(baseUrl, {
      cmd: 'getMchChannleList',
      ...params
    });
  },
  getCpsGameRankList(params: any) {
    return request.get(baseUrl, {
      cmd: 'getCpsGameRankList',
      ...params
    });
  },
  getCpsData(params: any) {
    const { cmd = 'getCpsData' } = params;
    return request.get(baseUrl, {
      cmd,
      ...params
    });
  },
  downloadCpsDataCompare(params: any) {
    const {
      searchModel: { time, sumType },
      user: { session }
    } = useStore();
    const { compareTimes, sortType } = params;
    const url = `${
      import.meta.env.VITE_APP_BASE_API
    }${baseUrl}?cmd=downloadCpsDataCompare&compareTimes=${compareTimes}&sortType=${sortType}&sumType=${sumType}&startTime=${
      time![0]
    }&endTime=${time![1]}&session=${session}`;
    downloadXlsxFile(url);
    return true;
  }
};

export const {
  getCpsRankList,
  downloadCpsDataCompare,
  getMchChannelList,
  getCpsData,
  getCpsGameRankList
} = cpsApi;
