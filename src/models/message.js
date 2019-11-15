import { deleteMessage, fetchMessage } from '../services/Message';
import { showNotification } from '../utils/common';

export default {
  namespace: 'message',
  state: {
    message: [],
    loading: true,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    delete(state, { payload }) {
      const { message } = state;
      const { index } = payload;
      message.splice(index, 1);
      const ret = JSON.parse(JSON.stringify(message));
      return {
        ...state,
        message: ret,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      const res = yield call(fetchMessage);
      showNotification(res.status, res.status === 'success' ? '拉取推荐消息成功' : '拉取失败');
      if (res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            message: res.data,
          },
        });
      }

      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
    },
    *handleDelete({ payload }, { put, call }) {
      const { id, index } = payload;
      const res = yield call(deleteMessage, id);
      showNotification(res.status, res.data || res.err_msg);

      if (res.status === 'success') {
        yield put({
          type: 'delete',
          payload: {
            index,
          },
        });
      }
    },
  },
};
