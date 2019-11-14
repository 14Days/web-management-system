import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
// import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { login } from '../services/login';
import { showNotification } from '../utils/common';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    loading: false,
  },
  effects: {
    *handleLogin({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const { username, password } = payload;
      const {
        status,
        data: { type: currentAuthority },
      } = yield call(login, username, password);

      showNotification(status, currentAuthority);

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status,
          currentAuthority,
        },
      }); // Login successfully

      if (status === 'success') {
        yield put({
          type: 'user/saveCurrentUser',
          payload: {
            name: username,
            userid: username,
            // 头像获取APT
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        // 跳转到统计信息
        yield put(routerRedux.replace(redirect || '/'));
      }

      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
export default Model;
