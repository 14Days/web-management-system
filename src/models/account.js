import { fetchtAllAccount, commitDelete, updateUser, createAccount } from '../services/account';
import { showNotification } from '../utils/common';

export default {
  namespace: 'account',
  state: {
    pageIndex: 0,
    total: 0,
    user: [],
    loading: {
      create: false,
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    delete(state, { payload }) {
      const { user } = state;
      user.splice(payload.userID, 1);
      return {
        ...state,
        user,
      };
    },
    update(state, { payload }) {
      const { userID, username } = payload;
      const { user } = state;
      user[userID].username = username;
      return {
        ...state,
        user,
      };
    },
    triggerLoading(state, { payload }) {
      const { loading } = state;
      loading[payload.page] = !loading[payload.page];
      const ret = JSON.parse(JSON.stringify(loading)); // 否则引用没变不渲染
      return {
        ...state,
        loading: ret,
      };
    },
  },
  effects: {
    // 初始化页面
    *handleInit(_, { put }) {
      const res = yield fetchtAllAccount();
      yield put({
        type: 'save',
        payload: {
          total: res.data.total,
          user: res.data.user,
        },
      });
    },
    // 提交删除
    *handleDelete({ payload }, { put }) {
      const { userID } = payload;
      const res = yield commitDelete([userID]); // 这里用数组包起来是为了对接口
      showNotification(res.status, res.data || res.err_msg);
      if (res.status === 'success') {
        yield put({
          type: 'delete',
          payload: {
            userID,
          },
        });
      }
    },
    // 修改密码
    *handleUpdate({ payload }, { put }) {
      const { userID, username, password } = payload;
      const res = yield updateUser(username, password);
      showNotification(res.status, res.data || res.err_msg);
      if (res.status === 'success') {
        yield put({
          type: 'update',
          payload: {
            userID,
            username,
          },
        });
      }
    },
    // 新建账户
    *handleCreate({ payload }, { put }) {
      const { username, password } = payload;
      const res = yield createAccount(username, password);
      showNotification(res.status, res.data || res.err_msg);
      yield put({
        type: 'triggerLoading',
        payload: {
          page: 'create',
        },
      });
    },
  },
};
