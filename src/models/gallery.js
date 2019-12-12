import { Modal } from 'antd';
import { getFile, newFile, renameFile, deleteFile, getImg, moveImg, deleteImg } from '../services/gallery';

// 用于快速搜索计算延时
function delayWaiting(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// 用于成功后在页面上调出成功弹窗提示
function showSuccess(message) {
  return new Promise(resolve => {
    Modal.success({
      content: message,
      centered: true,
    });
    resolve();
  });
}

// 用于成功后在页面上调出成功弹窗提示
function showFail(message) {
  return new Promise(resolve => {
    Modal.error({
      content: message,
      centered: true,
    });
    resolve();
  });
}

const GalleryModels = {
  namespace: 'gallery',
  state: {
    fileLoading: false,
    imgLoading: false,
    imgs: [],
    files: [],
    nowFile: { id: 0 },
    page: 0,
    count: 0,
    last: Date(),
    newFile: false,
    newFileName: '',
  },
  reducers: {
    save(prev, { payload }) {
      return {
        ...prev,
        ...payload,
      };
    },
  },
  effects: {
    *allRefresh(_, { put }) {
      yield put({
        type: 'fileRefresh',
      });
      yield put({
        type: 'save',
        payload: {
          nowFile: { id: 0, name: '未分类' },
        },
      })
      yield put({
        type: 'imgRefresh',
        payload: {
          fileId: 0,
        }
      });
    },
    *fileRefresh(_, { call, select, put }) {
      const res = yield call(getFile);
      console.log(res);
      if (1 || res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            files: res.data.dirs,
            last: Date(),
          },
        })
      }
    },
    *imgRefresh({ payload }, { call, select, put }) {
      let { fileId } = payload;
      const gallery = yield select(state => state.gallery);
      if (fileId === -1) {
        fileId = gallery.nowFile.id;
      }
      const { page } = gallery;
      const res = yield call(getImg, fileId, page, 12);
      console.log(res);
      if (1 || res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            imgs: res.data.images,
            count: res.data.count,
            last: Date(),
          },
        })
      }
    },
  },
};

export default GalleryModels;
