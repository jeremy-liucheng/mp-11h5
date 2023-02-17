export interface ResType<T> {
  error: number;
  msg?: string;
  data: T;
  sumMoney?: number;
  total: number;
}

export type Err = Pick<ResType<null>, 'error' | 'msg'>;

export type CRUDapiReturn = Pick<ResType<null>, 'error' | 'msg'>;

export interface Http<T> {
  get(url: string, params?: unknown): Promise<[ResType<T> | null, null | Err]>;
  post(url: string, params?: unknown): Promise<[ResType<T> | null, null | Err]>;
}

export interface RequestParams {
  gameid?: string;
  $storeKey?: Array<string>;
  cmd?: string;
}

export type AxiosReturn<T, P extends keyof Http<T> = 'post'> = ReturnType<Http<T>[P]>;
