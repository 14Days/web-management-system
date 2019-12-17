import {
  commitDelete,
  createAccount,
  fetchSearInfo,
  fetchtAllAccount,
  putSettings,
  updateUser,
  uploadAvatar,
} from '../services/account';
import { getUserInfo } from '../services/login';
import { showNotification } from '../utils/common';
import { pullWebAvaURL } from '../utils/url';

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
      user.splice(payload.index, 1);
      const ret = JSON.parse(JSON.stringify(user)); // 否则引用没变不渲染
      return {
        ...state,
        user: ret,
      };
    },
    update(state, { payload }) {
      console.log('update reducers');
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
    *handleDelete({ payload }, { put, call }) {
      const { userID, index } = payload;
      try {
        const res = yield call(commitDelete, [userID]); // 这里用数组包起来是为了对接口
        showNotification(res.status, res.data || res.err_msg);
        if (res.status === 'success') {
          yield put({
            type: 'delete',
            payload: {
              index,
            },
          });
        }
      } catch (e) {
        showNotification('error', '删除失败了- -');
      }
    },
    // 修改密码
    *handleUpdate({ payload }, { put, call }) {
      const { index, password, selectID } = payload;
      try {
        const res = yield call(updateUser, selectID, password);
        showNotification(res.status, res.data || res.err_msg);
        if (res.status === 'success') {
          yield put({
            type: 'update',
            payload: {
              index,
              password,
            },
          });
        }
      } catch (e) {
        showNotification('error', '修改失败');
      }
    },
    // 新建账户
    *handleCreate({ payload }, { put, call }) {
      const { username, password } = payload;
      try {
        yield call(createAccount, username, password);
      } catch (e) {
        showNotification('error', '创建失败，用户名已存在或服务器错误');
      } finally {
        yield put({
          type: 'triggerLoading',
          payload: {
            page: 'create',
          },
        });
      }
    },
    // 查找用户
    *handleSearch({ payload }, { put }) {
      const { key } = payload;
      try {
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
      } catch (e) {
        showNotification('error', '查找失败');
      } finally {
        yield put({
          type: 'triggerLoading',
          payload: {
            page: 'find',
          },
        });
      }
    },
    // 提交修改信息
    *handleSettings({ payload }, { put, call }) {
      const { userid, info } = payload;
      const { avatarFile, ...other } = info;
      let avaRes;
      if (avatarFile) {
        try {
          // 获取头像 id
          const avaForm = new FormData();
          avaForm.append('avatar', avatarFile);
          avaRes = yield call(uploadAvatar, avaForm);
          console.log('avaRes', avaRes);
          if (avaRes.status === 'success') {
            other.avatar.new_id = avaRes.data.avatar_id;
          }
        } catch (e) {
          console.log(e);
          showNotification('error', '头像上传失败');
        }
      } else {
        avaRes = true;
      }

      if (avaRes) {
        console.log(other);
        try {
          const putRes = yield call(putSettings, userid, other);
          if (putRes) {
            showNotification('success', '修改成功');
          }
        } catch (e) {
          console.log(e);
          showNotification('error', '修改失败');
        }
      }

      // 完成后要更新当前用户信息 currentUser
      // 获取个人详细信息
      const { data } = yield call(getUserInfo, userid);
      // 在这里拼好头像的url
      data.avatar.name = `${pullWebAvaURL}${data.avatar.name}`;
      // 保存个人信息
      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          name: `${data.nickname}`,
          userid,
          // 在这里展开所有的个人详细信息，保存在 user model 里面
          ...data,
        },
      });
    },
  },
};
