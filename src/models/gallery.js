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
    nowFile: { id: 0, name: '未分类' },
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
    changeNewFile(prev) {
      return {
        ...prev,
        newFile: !prev.newFile,
        newFileName: '',
      }
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
        },
      });
    },
    *fileRefresh(_, { call, put }) {
      const res = yield call(getFile);
      console.log(res);
      const dirs = [{ id: 0, name: '未分类' }];
      Array.prototype.push.apply(dirs, res.data.dirs);
      if (1 || res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            files: dirs,
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
    *dealNewFile(_, { call, select, put }) {
      const { newFileName } = yield select(state => state.gallery);
      yield put({
        type: 'changeNewFile',
      });
      if (newFileName !== '') {
        const res = yield call(newFile, newFileName);
        console.log(res);
        yield put({
          type: 'fileRefresh',
        });
      }
    },
  },
};

export default GalleryModels;
