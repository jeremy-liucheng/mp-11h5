import { defineStore } from 'pinia';
import { login, checkSession, accPwdLogin } from '@/service/api/user';
import { localStorage } from '@/utils/storage';
import { getUrlParams2 } from '@/utils/utils';
import { UserState } from '@/types/store';
import { User } from '@/types/api/types';

export default defineStore({
  id: 'user',
  state: (): UserState => ({
    session: localStorage.get('session', true) || '',
    nickname: '',
    avatar: 'https://cdn.11h5.com/static/image/logo_x.png',
    role: -1
  }),
  getters: {},
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    async getUserInfo() {
      let res: User.LoginType | null = null,
        err: any = true;

      const debug = getUrlParams2('debug') || undefined;
      if (this.session || debug) {
        [res, err] = await checkSession(debug);
      }
      if (!res && err) {
        [res, err] = await login();
      }
      const {
        sessdata: { nick },
        session
      } = res!;
      this.nickname = nick;
      this.role = 1;
      this.session = session;
      localStorage.set('session', session, true);
    },
    resetSession() {
      return new Promise(resolve => {
        localStorage.remove('session');
        this.RESET_STATE();
        resolve(null);
      });
    },
    async login(data: any) {
      const { username, passwd, challenge, validate, seccode } = data;
      const [res] = await accPwdLogin({
        username: username.trim(),
        passwd,
        challenge,
        validate,
        seccode
      });
      const {
        data: { session }
      } = res!;
      this.session = session;
      localStorage.set('session', session, true);
    }
  }
});
