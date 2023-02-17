import { EpPropMergeType } from 'element-plus/es/utils';
import { Http } from './axios';

export type GetType<T> = T extends (arg: infer P) => void ? P : string;

export type PromiseType<T> = (params: any) => Promise<T>;

export type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;

export type ExtractArrayItemType<T> = T extends (infer U)[] ? U : T;

export type StringType<T> = EpPropMergeType<StringConstructor, T, unknown>;

export type ApiReturn<T, P extends keyof Http<T> = 'post'> = ReturnType<Http<T>[P]>;
