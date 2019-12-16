import { Modal } from 'antd';
import {
  getFile,
  newFile,
  renameFile,
  deleteFile,
  getImg,
  moveImg,
  deleteImg
} from '../services/gallery';

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
    nowFile: {
      id: 0,
      name: '未归档',
    },
    page: 0,
    count: 0,
    last: Date(),
    newFile: false,
    newFileName: '',
    editFile: {
      id: 0,
      name: '未归档',
    },
    editFileState: false,
    toDeleteFile: {
      id: 0,
      name: '未归档',
    },
    toDeleteFileState: false,
    selected: [],
  },
  reducers: {
    save(prev, { payload }) {
      return {
        ...prev,
        ...payload,
      };
    },
    saveFileName(prev, { payload }) {
      const { name } = payload;
      return {
        ...prev,
        editFile: {
          ...prev.editFile,
          name,
        },
      }
    },
    changeNewFile(prev) {
      return {
        ...prev,
        newFile: !prev.newFile,
        newFileName: '',
      }
    },
    dealSelected(prev, { payload }) {
      const { index } = payload;
      let selected;
      if (prev.imgs[index].choose) {
        prev.imgs[index].choose = false;
        selected = prev.selected.filter(item => {
          if (item.img_id === prev.imgs[index].img_id) {
            return false;
          }
          return true;
        });
      } else {
        prev.imgs[index].choose = true;
        selected = prev.selected.filter(() => true);
        selected.push(prev.imgs[index]);
      }
      console.log(selected);
      return {
        ...prev,
        selected,
      }
    },
    cleanSelected(prev) {
      prev.selected = [];
      prev.imgs.forEach((item, index) => {
          prev.imgs[index].choose = false;
        });
      console.log(prev);
      return {
        ...prev,
      };
    },
  },
  effects: {
    * allRefresh(_, { put }) {
      yield put({
        type: 'fileRefresh',
      });
      yield put({
        type: 'save',
        payload: {
          nowFile: {
            id: 0,
            name: '未归档',
          },
        },
      })
      yield put({
        type: 'imgRefresh',
      });
    },
    * fileRefresh(_, { call, put }) {
      const res = yield call(getFile);
      console.log(res);
      const dirs = [{
        id: 0,
        name: '未归档',
      }];
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
    * imgRefresh(_, { call, select, put }) {
      const { nowFile, selected } = yield select(state => state.gallery);
      const res = yield call(getImg, nowFile.id, 0, 12);
      console.log(res);
      if (res.status === 'success') {
        res.data.images.forEach((item, index) => {
          let flag = false;
          selected.forEach(ele => {
            if (ele.img_id === item.img_id) {
              flag = true;
            }
          })
          res.data.images[index].choose = flag;
        });
        yield put({
          type: 'save',
          payload: {
            imgs: res.data.images,
            count: res.data.count,
            last: Date(),
            page: 0,
          },
        })
      }
    },
    * dealNewFile(_, { call, select, put }) {
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
    * dealRenameFile(_, { call, select, put }) {
      const { editFile } = yield select(state => state.gallery);
      const { id, name } = editFile;
      if (name !== '') {
        yield put({
          type: 'save',
          payload: {
            editFileState: false,
          },
        });
        const { files } = yield select(state => state.gallery);
        files.forEach((item, index) => {
          if (item.id === id) {
            files[index].name = name;
          }
        });
        yield put({
          type: 'save',
          payload: {
            files,
          },
        })
        const res = yield call(renameFile, id, name);
        if (res.status === 'success') {
          yield put({
            type: 'fileRefresh',
          });
        }
      }
    },
    * dealDeleteFile(_, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
          toDeleteFileState: false,
        },
      })
      const { toDeleteFile } = yield select(state => state.gallery);
      const res = yield call(deleteFile, toDeleteFile.id);
      console.log(res)
      yield put({
        type: 'fileRefresh',
      })
    },
    * morePage(_, { call, select, put }) {
      const { nowFile, page, count, imgs, selected } = yield select(state => state.gallery);
      if ((page + 1) * 12 < count) {
        const res = yield call(getImg, nowFile.id, page + 1, 12);
        if (res.status === 'success') {
          res.data.images.forEach((item, index) => {
            let flag = false;
            selected.forEach(ele => {
              if (ele.img_id === item.img_id) {
                flag = true;
              }
            });
            res.data.images[index].choose = flag;
          });
          Array.prototype.push.apply(imgs, res.data.images);
          yield put({
            type: 'save',
            payload: {
              imgs,
              page: page + 1,
            },
          });
        }
      }
    },
  },
};

export default GalleryModels;
