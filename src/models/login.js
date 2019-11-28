import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
// import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { getUserInfo, login } from '../services/login';
import { pullAvaURL } from '../utils/url';

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

      try {
        const {
          status,
          data: { type, user_id: userID },
        } = yield call(login, username, password);

        const authority = ['root', 'admin', 'designer'];

        // 保存当前登录用户权限
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: authority[type - 1],
          },
        }); // Login successfully

        if (status === 'success') {
          // 获取个人详细信息
          const getInfo = yield call(getUserInfo, userID);
          // 在这里拼好头像的url
          getInfo.data.avatar.name = `${pullAvaURL}${getInfo.data.avatar.name}`;
          // 保存个人信息
          yield put({
            type: 'user/saveCurrentUser',
            payload: {
              name: `${getInfo.data.nickname}`,
              userid: userID,
              // 在这里展开所有的个人详细信息，保存在 user model 里面
              ...getInfo.data,
            },
          });

          // 官方跳转
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
      } catch (e) {
        // 取消 loading
        yield put({
          type: 'save',
          payload: {
            loading: false,
          },
        });
      }
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
