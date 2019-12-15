import {
  deleteMessage,
  fetchMessage,
  getDetail,
  updateMessge,
  upload,
  uploadMessage,
} from '../services/message';
import { formatAppAvaUrl, showNotification } from '../utils/common';
import { pullImgURL } from '../utils/url';

export default {
  namespace: 'message',
  state: {
    total: 0,
    message: [],
    upload: {
      inc: 0,
      content: '',
      img: [],
    },
    update: {
      inc: 0,
      content: '',
      img: [],
      old: [],
      messageID: 0,
    },
    detail: {
      comment: [],
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return {
        ...state,
        upload: {
          content: '',
          img: [],
        },
      };
    },
    // 上传图片显示加载中
    loading(state, { payload }) {
      const { model } = payload;
      const up = state[model];
      const { inc } = up;
      const img = JSON.parse(JSON.stringify(up.img));
      img.push({
        uid: inc,
        status: 'uploading',
      });
      return {
        ...state,
        [model]: {
          ...up,
          img,
        },
      };
    },
    // 上传单张图片
    uploadSuccess(state, { payload }) {
      // 用本地 url
      const { imgID, url, status, model } = payload;
      const {
        [model]: { img, inc },
      } = state;
      const ret = JSON.parse(JSON.stringify(img));
      ret.forEach(e => {
        if (e.uid === inc) {
          e.status = status;
          e.imgID = imgID;
          e.url = url;
        }
      });
      const origin = state[model];
      return {
        ...state,
        [model]: {
          ...origin,
          img: ret,
          inc: inc + 1,
        },
      };
    },
    delete(state, { payload }) {
      const { uid, model } = payload;
      const up = state[model];
      console.log(model, up);

      const res = up.img.filter(e => e.uid !== uid); // 找出不等于 uid 的
      return {
        ...state,
        [model]: {
          ...up,
          img: res,
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
      const format = []; // 把原来的图片格式化成 Upload 组件兼容的格式
      const old = []; // 保存原来图片的 id
      let inc = 0; // 自增计数器
      handle.img_url.forEach(item => {
        format.push({
          imgID: item.id,
          url: `${pullImgURL}${item.name}`,
          status: 'done',
          uid: inc,
        });
        inc += 1;
        old.push(item.id);
      });
      update = {
        content: handle.content,
        img: format,
        old,
        messageID: handle.id,
        inc,
      };
      return {
        ...state,
        update,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call }) {
      try {
        const res = yield call(fetchMessage);
        console.log('请求推荐消息', res);
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
      } catch (e) {
        showNotification('error', '拉取失败');
      }
    },
    *handleDelete({ payload }, { put, call }) {
      const { id } = payload;
      try {
        const res = yield call(deleteMessage, [id]); // 对接口变成数组

        if (res.status === 'success') {
          showNotification('success', '删除成功');
          yield put({
            type: 'handleInit',
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
          // 清空已上传图片列表
          yield put({
            type: 'clear',
          });
          yield put({
            type: 'handleInit',
          });
        }
      } catch (e) {
        showNotification('error', '上传失败');
      }
    },
    *handleUpdateMessage({ payload }, { put, call, select }) {
      const { content, img } = payload;
      const {
        update: { old, messageID },
      } = yield select(state => state.message);
      try {
        const res = yield call(updateMessge, messageID, content, img, old);
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
    *getDetail({ payload }, { put, call }) {
      try {
        const res = yield call(getDetail, payload);
        console.log(res);
        if (res.status === 'success') {
          // 拼接头像 url
          res.data.comment.forEach(item => {
            item.user.avatar = formatAppAvaUrl(item.user.avatar);
          });
          const { thumb_user: thumbs } = res.data;
          let thumbInfo;
          for (let i = 0; i < thumbs.length; i += 1) {
            if (i > 6 || i === thumbs.length - 1) {
              thumbInfo += `等${thumbs.length}人点赞`;
            } else {
              thumbInfo += i === thumbs.length - 1 ? thumbs[i] : `${thumbs[i]}、`;
            }
          }
          yield put({
            type: 'save',
            payload: {
              detail: {
                ...res.data,
                thumbInfo,
              },
            },
          });
        }
      } catch (e) {
        showNotification('error', '获取评论失败');
      }
    },
  },
};
