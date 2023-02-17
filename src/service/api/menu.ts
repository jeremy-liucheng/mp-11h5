import request from '@/service/http';
import { Menu } from '@/types/api/types';
import { CRUDapiReturn } from '@/types/axios';
import { FieldData, PageTabs } from '@/types/field';
import { ApiReturn } from '@/types/utils';
import { RouteRecordRaw } from 'vue-router';
interface MenuApi {
  getUserRoutes: () => ApiReturn<RouteRecordRaw[]>;
  getMenuList: () => ApiReturn<Menu.MenuList[]>;
  editMenu: (params: any) => ApiReturn<CRUDapiReturn>;
  delMenu: (params: any) => ApiReturn<CRUDapiReturn>;
  getMenuFieldList: (params: any) => ApiReturn<FieldData[]>;
  editMenuField: (params: any) => ApiReturn<CRUDapiReturn>;
  getUserMenuFieldList: (params: any) => ApiReturn<PageTabs[]>;
  updateMenuField: (params: any) => ApiReturn<CRUDapiReturn>;
  delMenuField: (params: any) => ApiReturn<CRUDapiReturn>;
}

const routerApi: MenuApi = {
  getUserRoutes() {
    return request.get('/menu', {
      cmd: 'getUserMenuList'
    });
  },
  getMenuList() {
    return request.get('/menu', {
      cmd: 'getMenuList'
    });
  },
  editMenu(params) {
    return request.post('/menu', {
      cmd: 'editMenu',
      ...params
    });
  },
  delMenu(params) {
    return request.post('/menu', {
      cmd: 'delMenu',
      ...params
    });
  },
  getMenuFieldList(params) {
    return request.get('/menu', {
      cmd: 'getMenuFieldList',
      ...params
    });
  },
  editMenuField(params) {
    return request.post('/menu', {
      cmd: 'editMenuField',
      ...params
    });
  },
  getUserMenuFieldList(params) {
    return request.post('/menu', {
      cmd: 'getUserMenuFieldList',
      ...params
    });
  },
  updateMenuField(params) {
    return request.post('/menu', {
      cmd: 'updateMenuField',
      ...params
    });
  },
  delMenuField(params) {
    return request.post('/menu', {
      cmd: 'delMenuField',
      ...params
    });
  }
};

export const {
  getUserRoutes,
  getMenuList,
  getUserMenuFieldList,
  getMenuFieldList,
  editMenuField,
  editMenu,
  delMenu,
  updateMenuField,
  delMenuField
} = routerApi;
