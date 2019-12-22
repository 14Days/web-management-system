import {
  deleteMessage,
  fetchMessage,
  getDetail,
  updateMessge,
  upload,
  uploadMessage,
} from '../services/message';
import { formatAppAvaUrl, formatImgUrl, showNotification } from '../utils/common';
import { pullImgURL } from '../utils/url';

const loadImg = url =>
  new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img.height);
    };
  });

export default {
  namespace: 'message',
  state: {
    total: 0,
    page: 0,
    limit: 3,
    loadAll: false,
    leftMsg: [],
    rightMsg: [],
    leftHeight: 0,
    rightHeight: 0,
    upload: {
      inc: 0,
      content: '',
      img: [],
    },
    update: {
      index: 0, // sideMsg下标
      side: '', // 左边右边？
      inc: 0,
      content: '',
      img: [],
      imgInfos: [],
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
          inc: 0,
        },
      };
    },
    sidePush(state, { payload }) {
      const { message: m, height, side } = payload;
      const { [`${side}Msg`]: msgArr, [`${side}Height`]: h } = state;
      msgArr.push(m);
      return {
        ...state,
        [`${side}Msg`]: JSON.parse(JSON.stringify(msgArr)),
        [`${side}Height`]: h + height,
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
          // 把刚刚正在上传的图片显示出来状态改为 done
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
      const { message: handle, index, side } = payload;
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
        side,
        index,
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
    saveUpdate(state, { payload }) {
      // 保存修改在本地
      const { side, index, message } = payload;
      const { [`${side}Msg`]: arr } = state;
      const ret = JSON.parse(JSON.stringify(arr));
      // 🤷‍啊
      message.comment = message.comment.length;
      message.thumb = message.thumb_user.length;
      message.img_url = message.img; // 获取详情的接口和获取列表接口不一样
      // 🤷‍啊

      ret[index] = message;
      // TODO: 重新请求这个 message

      return {
        ...state,
        [`${side}Msg`]: ret,
      };
    },
    deleteMsg(
      state,
      {
        payload: { side, index },
      },
    ) {
      const { [`${side}Msg`]: arr } = state;
      const ret = JSON.parse(JSON.stringify(arr));
      ret.splice(index, 1);
      return {
        ...state,
        [`${side}Msg`]: ret,
      };
    },
  },
  effects: {
    *handleInit(_, { put, call, select }) {
      yield put({
        type: 'save',
        payload: {
          leftMsg: [],
          rightMsg: [],
          page: 0,
          loadAll: false,
        },
      });
      try {
        const { page, limit } = yield select(state => state.message);
        const res = yield call(fetchMessage, page, limit);
        console.log('请求推荐消息', res);
        if (res.status === 'error') {
          showNotification('error', '拉取失败');
        } else {
          yield put({
            type: 'save',
            payload: {
              total: res.data.count,
              page: page + 1,
            },
          });
          yield put({
            type: 'waterfall',
            payload: {
              message: res.data.res,
            },
          });
        }
      } catch (e) {
        showNotification('error', '拉取失败');
      }
    },
    *handleLoadMore(_, { put, call, select }) {
      try {
        const { page, limit } = yield select(state => state.message);
        const res = yield call(fetchMessage, page, limit);
        console.log('请求推荐消息', res);
        if (res.status === 'error') {
          showNotification('error', '拉取失败');
        } else {
          yield put({
            type: 'save',
            payload: {
              total: res.data.count,
              page: page + 1,
            },
          });
          if (res.data.res.length === 0) {
            yield put({
              type: 'save',
              payload: {
                loadAll: true,
              },
            });
          } else {
            yield put({
              type: 'waterfall',
              payload: {
                message: res.data.res,
              },
            });
          }
        }
      } catch (e) {
        showNotification('error', '拉取失败');
      }
    },
    *waterfall({ payload }, { put }) {
      const { message } = payload;
      for (let i = 0; i < message.length; i += 1) {
        yield put({
          type: 'selectSide',
          payload: message[i],
        });
      }
    },
    *selectSide({ payload: message }, { put, call, select }) {
      const height = yield call(loadImg, formatImgUrl(message.img_url[0].name));
      const { leftHeight, rightHeight } = yield select(state => state.message);
      yield put({
        type: 'sidePush',
        payload: {
          side: rightHeight > leftHeight ? 'left' : 'right',
          message,
          height,
        },
      });
    },
    *handleDelete({ payload }, { put, call }) {
      const { side, index, message } = payload;
      const { id } = message;
      try {
        const res = yield call(deleteMessage, [id]); // 对接口变成数组

        if (res.status === 'success') {
          showNotification('success', '删除成功');
          yield put({
            type: 'deleteMsg',
            payload: {
              index,
              side,
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
        showNotification(
          res.status,
          res.status === 'success' ? '上传成功' : res.err_msg || '上传失败',
        );
        if (res.status === 'success') {
          // 清空已上传图片列表
          yield put({
            type: 'clear',
          });
          // 保存上传的
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
        update: { old, messageID, index, side },
      } = yield select(state => state.message);
      try {
        const res = yield call(updateMessge, messageID, content, img, old);
        showNotification(
          res.status,
          res.status === 'success' ? '修改成功' : res.err_msg || '修改失败',
        );
        if (res.status === 'success') {
          try {
            const detail = yield call(getDetail, messageID);
            if (detail.status === 'success') {
              yield put({
                type: 'saveUpdate',
                payload: {
                  side,
                  index,
                  message: detail.data,
                },
              });
            }
          } catch (e) {
            showNotification('error', '更新信息失败');
          }
        }
      } catch (e) {
        showNotification('error', '修改失败');
      }
    },
    *getMessageDetail(
      {
        payload: {
          message: { id },
        },
      },
      { put, call },
    ) {
      yield put({
        type: 'save',
        payload: {
          detail: {},
        },
      });
      try {
        const res = yield call(getDetail, id);
        console.log(res);
        if (res.status === 'success') {
          // 拼接头像 url
          res.data.comment.forEach(item => {
            item.user.avatar = formatAppAvaUrl(item.user.avatar);
          });
          const { thumb_user: thumbs } = res.data;
          let thumbList = thumbs.length ? '' : '还没有人点赞哦';
          for (let i = 0; i < thumbs.length; i += 1) {
            if (i > 6 || i === thumbs.length - 1) {
              thumbList += `${thumbs[i]}等${thumbs.length}人点赞`;
              break;
            } else {
              thumbList += `${thumbs[i]}、`;
            }
          }
          yield put({
            type: 'save',
            payload: {
              detail: {
                ...res.data,
                thumbList,
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
