import {
  commitDelete,
  createAccount,
  fetchSearInfo,
  fetchtAllAccount,
  updateUser,
  // uploadAvatar,
} from '../services/account';
import { showNotification } from '../utils/common';

export default {
  namespace: 'account',
  state: {
    pageIndex: 0,
    total: 0,
    user: [],
    loading: {
      create: false,
      find: false,
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
      const ret = JSON.parse(JSON.stringify(user)); // 否则引用没变不渲染
      return {
        ...state,
        user: ret,
      };
    },
    update(state, { payload }) {
      const { userID, username } = payload;
      const { user } = state;
      user[userID].username = username;
      const ret = JSON.parse(JSON.stringify(user)); // 否则引用没变不渲染
      return {
        ...state,
        user: ret,
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
      yield put({
        type: 'save',
        payload: {
          loading: {
            create: false,
            find: false,
          },
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
    // 查找用户
    *handleSearch({ payload }, { put }) {
      const { key } = payload;
      const res = yield fetchSearInfo(key);

      showNotification(res.status, res.status === 'success' ? '查询成功' : '查询失败');
      if (res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            total: res.data.total,
            user: res.data.user,
          },
        });
      }
      yield put({
        type: 'triggerLoading',
        payload: {
          page: 'find',
        },
      });
    },
    // // 提交修改信息
    // *handleSettings({ payload }, { put, call }) {
    //   const { file } = payload;
    //   // 先上传图片获取 id
    //   const avaForm = new FormData();
    //   avaForm.append('avatar', file);
    //   const avaRes = yield call(uploadAvatar, avaForm);
    //   // 上传成功之后得到 id
    //   if (avaRes === 'success') {
    //     const new_id = avaRes.avatar_id;
    //     /**
    //      * TODO {我不知道 old_id}
    //      * TODO 之前的上传推荐消息的也要改 1 fileReader 预览   2 File提交
    //      */
    //   } else {
    //     // TODO 头像上传失败
    //   }
    //
    //   // TODO 完成后要更新当前用户信息 currentUser
    // },
  },
};
