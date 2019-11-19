import { deleteMessage, fetchMessage, upload, uploadMessage } from '../services/Message';
import { showNotification } from '../utils/common';

export default {
  namespace: 'message',
  state: {
    message: [],
    loading: {
      upload: false,
      page: false,
    },
    upload: {
      content: '',
      img: [],
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
    uploadSuccess(state, { payload }) {
      const {
        upload: { img },
      } = state;
      const { imgID, url, status } = payload;
      const uid = img.length === 0 ? 0 : img[img.length - 1].uid + 1;
      img.push({
        uid,
        imgID,
        status,
        url,
      });
      return {
        ...state,
        upload: {
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
    uploadMessageSuccess(state, { payload }) {
      const { content, url, id } = payload;
      const { message } = state;
      message.unshift({
        id,
        content,
        img_url: url,
      });
      return {
        ...state,
        message,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          loading: {
            page: true,
            upload: false,
          },
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
          loading: {
            page: false,
            upload: false,
          },
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
    // 上传图片
    *handleUpload({ payload }, { put, call }) {
      const { file } = payload;
      const img = new FormData();
      img.append('img', file);
      const res = yield call(upload, img);
      yield put({
        type: 'uploadSuccess',
        payload: {
          imgID: res.data.img_id || undefined,
          url: res.data.url,
          status: res.status === 'success' ? 'done' : 'error',
        },
      });
    },
    *handleUploadMessage({ payload }, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          loading: {
            page: false,
            upload: true,
          },
        },
      });
      const { content, img, url } = payload;
      const res = yield call(uploadMessage, content, img);
      console.log(res);
      showNotification(
        res.status,
        res.status === 'success' ? '上传成功' : res.err_msg || '上传失败',
      );
      if (res.status === 'success') {
        // 把这条推荐消息放到列表的第一个
        yield put({
          type: 'uploadMessageSuccess',
          payload: {
            content,
            url,
            id: res.data.id,
          },
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
      yield put({
        type: 'save',
        payload: {
          loading: {
            page: false,
            upload: false,
          },
        },
      });
    },
  },
};
