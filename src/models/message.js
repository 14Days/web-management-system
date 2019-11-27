import {
  deleteMessage,
  fetchMessage,
  updateMessge,
  upload,
  uploadMessage,
} from '../services/message';
import { showNotification } from '../utils/common';
import { pullImgURL } from '../utils/url';

export default {
  namespace: 'message',
  state: {
    total: 0,
    message: [],
    upload: {
      content: '',
      img: [],
    },
    update: {
      content: '',
      img: [],
      old: [],
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
      const { message } = state;
      const { index } = payload;
      message.splice(index, 1);
      const ret = JSON.parse(JSON.stringify(message));
      return {
        ...state,
        message: ret,
      };
    },
    // 上传单张图片
    uploadSuccess(state, { payload }) {
      // 用本地 url
      const { imgID, url, status, model } = payload;
      const {
        [model]: { img },
      } = state;
      console.log('uploadSuccess', payload);
      const uid = img.length === 0 ? 0 : img[img.length - 1].uid + 1;
      img.push({
        uid,
        imgID,
        status,
        url,
      });
      const origin = state[model];
      return {
        ...state,
        [model]: {
          ...origin,
          img,
        },
      };
    },
    deleteUpload(state, { payload }) {
      const {
        upload: { img },
      } = state;
      const { uid } = payload;
      img.splice(uid, 1);

      return {
        ...state,
        upload: {
          img,
        },
      };
    },
    /**
     * 修改推荐消息
     * imgID: 30
     * status: "done"
     * uid: 0
     * url:
     */
    updateMessagePrepare(state, { payload }) {
      // index 是被点击修改的推荐消息的下标
      const { index } = payload;
      const { message } = state;
      const handle = message[index];
      let update = {};
      // message.img_url.{id, name}
      const format = [];
      const old = [];
      handle.img_url.forEach((item, i) => {
        format.push({
          imgID: item.id,
          url: `${pullImgURL}${item.name}`,
          status: 'done',
          uid: i,
        });
        old.push(item.id);
      });
      update = {
        content: handle.content,
        img: format,
        old,
      };
      console.log('uuuupdate', update);
      return {
        ...state,
        update,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call }) {
      const res = yield call(fetchMessage);
      if (res.status === 'error') {
        showNotification('error', '拉取失败');
      } else {
        yield put({
          type: 'save',
          payload: {
            message: res.data.res,
            total: res.data.count,
          },
        });
      }
    },
    *handleDelete({ payload }, { put, call }) {
      const { id, index } = payload;
      try {
        const res = yield call(deleteMessage, [id]); // 对接口变成数组

        if (res.status === 'success') {
          showNotification('success', '删除成功');
          yield put({
            type: 'delete',
            payload: {
              index,
            },
          });
        }
      } catch (e) {
        showNotification('error', '删除失败');
      }
    },
    // 上传图片
    *handleUpload({ payload }, { put, call }) {
      const { file, url, model } = payload;
      const img = new FormData();
      img.append('img', file);
      try {
        const res = yield call(upload, img);
        yield put({
          type: 'uploadSuccess',
          payload: {
            imgID: res.data.img_id || undefined,
            url,
            status: res.status === 'success' ? 'done' : 'error',
            model,
          },
        });
      } catch (e) {
        showNotification('error', '图片上传失败');
      }
    },
    *handleUploadMessage({ payload }, { put, call }) {
      const { content, img } = payload;
      try {
        const res = yield call(uploadMessage, content, img);
        console.log('res', res);
        showNotification(
          res.status,
          res.status === 'success' ? '上传成功' : res.err_msg || '上传失败',
        );
        if (res.status === 'success') {
          yield put({
            type: 'handleInit',
          });
          // 清空已上传图片列表
          yield put({
            type: 'save',
            payload: {
              upload: {
                content: '',
                img: [],
              },
            },
          });
        }
      } catch (e) {
        showNotification('error', '上传失败');
      }
    },
    *handleUpdateMessage({ payload }, { put, call, select }) {
      const { content, img } = payload;
      const {
        update: { old },
      } = yield select(state => state.message);
      console.log('content', content);
      console.log('img', img);
      console.log('old', old);
      try {
        const res = yield call(updateMessge, content, img, old);
        console.log('res', res);
        showNotification(
          res.status,
          res.status === 'success' ? '修改成功' : res.err_msg || '修改失败',
        );
        if (res.status === 'success') {
          yield put({
            type: 'handleInit',
          });
        }
      } catch (e) {
        showNotification('error', '修改失败');
      }
    },
  },
};
