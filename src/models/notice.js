import { Modal } from 'antd';
import { getNotice, commitNotice } from '../services/notice';

// 模拟请求过程
// function timecount() {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, 1000);
//   });
// }

// 用于成功后在页面上调出成功弹窗提示
function showSuccess() {
  return new Promise(resolve => {
    Modal.success({
      content: '公告发布成功！',
      centered: true,
    });
    resolve();
  });
}

const NoticeModels = {
  namespace: 'notice',
  state: {
    last: Date(), // 最后更新时间
    loading: false, // 页面整体加载
    postView: false, // 对话框显示
    postLoading: false, // 发送公告状态
    postType: 0, // 发送公告类型
    content: '', // 发送公告内容
    data: [], // 获取到的公告信息
    count: 0, // 获取到的公告条数
    currentNotice: 0, // 当前公告
    currentView: false, // 公告详情显示状态
    searchDrawer: false, // 搜索抽屉显示状态
    searchWord: '', // 搜索词
  },
  reducers: {
    save(prev, { payload }) {
      return {
        ...prev,
        ...payload,
      };
    },
    // 清除发布公告对话框相关信息
    exitPost(prev) {
      return {
        ...prev,
        content: '',
        postType: 0,
        postView: false,
        postLoading: false,
      };
    },
  },
  effects: {
    // 发送公告
    *send(_, { call, put, select }) {
      yield put({
        type: 'notice/save',
        payload: {
          postLoading: true,
        },
      });
      const { content, type } = yield select(state => state.notice);
      const params = {
        content,
        type: type - 1,
      };
      const res = yield call(commitNotice, params);
      console.log(res);
      // 清空对话框相关state并退出对话框
      yield put({
        type: 'notice/exitPost',
      });
      // 弹出成功弹窗
      yield call(showSuccess);
      yield put({
        type: 'notice/refresh',
      });
    },
    // 获取公告信息
    *refresh(_, { call, put }) {
      yield put({
        type: 'notice/save',
        payload: {
          loading: true,
        },
      });
      const res = yield call(getNotice);
      console.log(res);
      yield put({
        type: 'notice/save',
        payload: {
          last: Date(),
          loading: false,
          data: res.data.notice,
          count: res.data.count,
        },
      });
    },
  },
};

export default NoticeModels;
