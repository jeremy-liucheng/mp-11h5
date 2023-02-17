import request from '@/service/http';
import { AxiosReturn } from '@/types/axios';
interface SearchApi {
  gameSearchList: () => AxiosReturn<any>;
}
const searchApi: SearchApi = {
  gameSearchList() {
    return request.post('/admin', {
      cmd: 'getGameList'
    });
  }
};

export const { gameSearchList } = searchApi;
