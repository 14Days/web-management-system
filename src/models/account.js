import { fetchtAllAccount, commitDelete } from '../services/account';
import { showNotification } from '../utils/common';

export default {
  namespace: 'account',
  state: {
    pageIndex: 0,
    total: 0,
    user: [],
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
      showNotification(res.status, res.data || res.error);
      if (res.status === 'success') {
        yield put({
          type: 'delete',
          payload: {
            userID,
          },
        });
      }
    },
  },
};
