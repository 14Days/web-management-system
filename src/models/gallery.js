import { message } from 'antd';
import {
  getFile,
  newFile,
  renameFile,
  deleteFile,
  getImg,
  moveImg,
  deleteImg,
} from '../services/gallery';
import { upload, uploadMessage } from '../services/message';

// 用于成功后在页面上调出成功弹窗提示
function showSuccess(msg) {
  return new Promise(resolve => {
    message.success(msg);
    resolve();
  });
}

// 用于成功后在页面上调出错误弹窗提示
function showFail(msg) {
  return new Promise(resolve => {
    message.error(msg);
    resolve();
  });
}

const GalleryModels = {
  namespace: 'gallery',
  state: {
    fileLoading: false, // 图集表加载
    imgLoading: false, // 图片表加载
    imgs: [], // 当前显示图片
    files: [], // 图集
    nowFile: { // 当前图集
      id: 0,
      name: '未归档',
    },
    page: 0, // 当前页
    count: 0, // 图片总数
    last: Date(), // 最后刷新时间
    newFile: false, // 新建图集激活状态
    newFileName: '', // 新建图集命名
    editFile: { // 重命名图集目标 & 名
      id: 0,
      name: '未归档',
    },
    editFileState: false, // 重命名图集激活状态
    toDeleteFile: { // 删除图集目标
      id: 0,
      name: '未归档',
    },
    toDeleteFileState: false, // 删除图集激活状态
    selected: [], // 当前选中图片
    toMoveImg: { // 移动图片目标
      file_id: 0,
      img_id: 0,
      name: '',
    },
    toMoveImgState: false, // 移动图片激活状态
    toMoveImgDist: 0, // 移动图片目的图集
    toDeleteImg: { // 删除图片目标
      file_id: 0,
      img_id: 0,
      name: '',
    },
    toDeleteImgState: false, // 删除图片激活状态
    toPostImg: '', // 发布推荐内容
    toPostImgState: false, // 发布推荐激活状态
    uploadState: false, // 上传图片激活状态
    uploadImg: [], // 上传图片表，供 Upload 组件使用
  },
  reducers: {
    save(prev, { payload }) {
      return {
        ...prev,
        ...payload,
      };
    },
    // 重命名图集：存储图集名称
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
    // 新建图集
    changeNewFile(prev) {
      return {
        ...prev,
        newFile: !prev.newFile,
        newFileName: '',
      }
    },
    // 点选图片
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
      return {
        ...prev,
        selected,
      }
    },
    // 清空图片点选
    cleanSelected(prev) {
      prev.selected = [];
      prev.imgs.forEach((item, index) => {
          prev.imgs[index].choose = false;
        });
      return {
        ...prev,
      };
    },
  },
  effects: {
    // 全刷新
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
    // 图集表刷新
    * fileRefresh(_, { call, put }) {
      const res = yield call(getFile);
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
    // 图片刷新
    * imgRefresh(_, { call, select, put }) {
      const { nowFile, selected } = yield select(state => state.gallery);
      const res = yield call(getImg, nowFile.id, 0, 12);
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
    // 新建图集
    * dealNewFile(_, { call, select, put }) {
      const { newFileName } = yield select(state => state.gallery);
      yield put({
        type: 'changeNewFile',
      });
      if (newFileName !== '') {
        const res = yield call(newFile, newFileName);
        if (res.status === 'success') {
          yield call(showSuccess, '图集创建成功');
        } else {
          yield call(showFail, `图集创建失败：${res.status}`);
        }
        yield put({
          type: 'fileRefresh',
        });
      }
    },
    // 重命名图集
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
        });
        const res = yield call(renameFile, id, name);
        if (res.status === 'success') {
          yield call(showSuccess, '图集重命名成功');
        } else {
          yield call(showSuccess, `图集重命名失败：${res.status}`);
        }
        yield put({
          type: 'fileRefresh',
        });
      }
    },
    // 删除图集
    * dealDeleteFile(_, { call, select, put }) {
      yield put({
        type: 'save',
        payload: {
          toDeleteFileState: false,
        },
      });
      const { toDeleteFile } = yield select(state => state.gallery);
      const res = yield call(deleteFile, toDeleteFile.id);
      if (res.status === 'success') {
        yield call(showSuccess, '图集删除成功');
      } else {
        yield call(showFail, `图集删除失败：${res.status}`)
      }
      yield put({
        type: 'fileRefresh',
      })
    },
    // 移动图片
    * dealMoveImg(_, { call, select, put }) {
      const { toMoveImg, toMoveImgDist } = yield select(state => state.gallery);
      const res = yield call(moveImg, toMoveImgDist, toMoveImg.img_id);
      if (res.status === 'success') {
        yield call(showSuccess, '移动图片成功');
      } else {
        yield call(showFail, `移动图片失败：${res.status}`)
      }
      yield put({
        type: 'imgRefresh',
      });
      yield put({
        type: 'save',
        payload: {
          toMoveImgState: false,
        },
      });
    },
    // 拉取下一分页
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
    // 删除图片
    * dealDeleteImg(_, { select, put, call }) {
      const { toDeleteImg, selected } = yield select(state => state.gallery);
      const newSelected = selected.filter(item => toDeleteImg.img_id !== item.img_id);
      yield put({
        type: 'save',
        payload: {
          selected: newSelected,
        },
      });
      const res = yield call(deleteImg, toDeleteImg.img_id);
      if (res.status === 'success') {
        yield call(showSuccess, '图片删除成功');
      } else {
        yield call(showFail, `图片删除失败：${res.status}`)
      }
      yield put({
        type: 'save',
        payload: {
          toDeleteImgState: false,
        },
      });
      yield put({
        type: 'imgRefresh',
      });
    },
    // 发布推荐消息
    * dealPostImg(_, { select, call, put }) {
      const { selected, toPostImg, nowFile } = yield select(state => state.gallery);
      const imgs = [];
      selected.forEach(item => {
        imgs.push(item.img_id);
      });
      const res = yield call(uploadMessage, toPostImg, imgs);
      yield put({
        type: 'save',
        payload: {
          toPostImgState: false,
        },
      });
      if (res.status === 'success') {
        yield call(showSuccess, '发布成功！');
        yield put({
          type: 'cleanSelected',
        });
      } else {
        yield call(showSuccess, `抱歉，发布失败：${res.status}`);
      }
      yield put({
        type: 'imgRefresh',
        payload: {
          fileId: nowFile.id,
        },
      });
    },
    // 上传图片
    * handleUpload({ payload }, { select, call, put }) {
      const { file } = payload;
      const img = new FormData();
      img.append('img', file);
      try {
        const res = yield call(upload, img);
        if (res.status === 'success') {
          yield put({
            type: 'save',
            payload: {
              uploadState: false,
            },
          });
          yield call(showSuccess, '上传成功！');
          const { nowFile } = yield select(state => state.gallery);
          yield put({
            type: 'imgRefresh',
            payload: {
              fileId: nowFile.id,
            },
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              uploadState: false,
            },
          });
          yield call(showFail, `抱歉，上传失败：${res.status}`);
        }
      } catch (e) {
        yield put({
          type: 'save',
          payload: {
            uploadState: false,
          },
        });
        yield call(showFail, '抱歉，图片上传出错。');
      }
    },
  },
};

export default GalleryModels;
