import request from '@/service/http';
import { getUrlParams2 } from '@/utils/utils';
import useStore from '@/store';
import { AxiosReturn, CRUDapiReturn, Err } from '@/types/axios';
import { User } from '@/types/api/types';

interface UserApi {
  login: () => Promise<[User.LoginType | null, null | Err]>;
  accPwdLogin: (params: any) => AxiosReturn<User.LoginType>;
  verify: () => AxiosReturn<User.Verify>;
  checkSession: (debug?: string) => Promise<[User.LoginType | null, null | Err]>;
  editRole: (params: any) => AxiosReturn<CRUDapiReturn>;
  delRole: (params: any) => AxiosReturn<CRUDapiReturn>;
  getRoleMenuList: (params: any) => AxiosReturn<User.UserMenuFieldList>;
  applyMarchant: (params: any) => AxiosReturn<any>;
  getRoleList: () => AxiosReturn<User.RoleList>;
}

const userApi: UserApi = {
  login() {
    const session = getUrlParams2('session');
    return request.get('/login', {
      cmd: 'unifiedLogin',
      session
    }) as Promise<[User.LoginType | null, null | Err]>;
  },
  accPwdLogin(params: any) {
    return request.post('/login', {
      cmd: 'accpwd',
      ...params
    });
  },
  verify() {
    return request.get('/login', {
      cmd: 'verify'
    });
  },
  checkSession(debug?: string) {
    const { user } = useStore();
    const session = getUrlParams2('session');
    return request.post('/login', {
      cmd: 'check',
      session: debug ? session : user.session
    }) as Promise<[User.LoginType | null, null | Err]>;
  },
  getRoleList() {
    return request.post('/menu', {
      cmd: 'getRoleList'
    });
  },
  editRole(params) {
    return request.post('/menu', {
      cmd: 'editRole',
      showSuccess: true,
      ...params
    });
  },
  delRole(params) {
    return request.post('/menu', {
      cmd: 'delRole',
      showSuccess: true,
      ...params
    });
  },
  getRoleMenuList(params) {
    return request.post('/menu', {
      cmd: 'getRoleMenuList',
      ...params
    });
  },
  applyMarchant(params) {
    return request.post('/login', {
      cmd: 'applyMarchant',
      ...params
    });
  }
};

export const {
  login,
  accPwdLogin,
  getRoleMenuList,
  checkSession,
  getRoleList,
  editRole,
  delRole,
  verify,
  applyMarchant
} = userApi;
