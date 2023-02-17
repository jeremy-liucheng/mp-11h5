import { RouteLocationNormalized } from 'vue-router';

/**
 * 系统类型声明
 */
export interface AppState {
  device: string;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
}

export interface UserState {
  session: string;
  nickname: string;
  avatar: string;
  role: number;
}

/**
 * 标签状态类型声明
 */
export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
}

export interface TagsViewState {
  visitedViews: TagView[];
  cachedViews: string[];
}

export interface SearchModel {
  gameList?: Array<{ [key: string]: any }>;
  serverList?: Array<{ [key: string]: any }>;
  channelList?: Array<{ [key: string]: any }>;
  channel?: Array<{ [key: string]: any }>;
  gameid?: string | number;
  date?: string;
  gameids?: Array<unknown>;
  uid?: string;
  openid?: string;
  keyword?: string;
  serverid?: Array<unknown>;
  chid?: number | string;
  rolename?: string;
  sortType?: number;
  time?: string[];
  cateId?: number;
  gameCateList?: Array<{ [key: string]: any }>;
  money?: { maxMoney: string; minMoney: string };
  sumType?: number;
  transId?: string;
  deliveryResult?: number;
  year?: string;
  month?: string;
}
