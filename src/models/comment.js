import { getDetail } from '../services/comment';
import { showNotification } from '../utils/common';

export default {
  namespace: 'comment',
  state: {
    check: false,
    comment: [],
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call }) {
      // 根据路由解析出 id
      const messageID = window.location.href.split('/').pop();
      try {
        const res = yield call(getDetail, messageID);
        if (res.status === 'success') {
          yield put({
            type: 'save',
            payload: {
              check: true,
              comment: res.data.comment,
            },
          });
        }
      } catch (e) {
        showNotification('error', '获取评论失败');
      }
    },
  },
};
