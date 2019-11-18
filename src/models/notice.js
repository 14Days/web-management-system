import { Modal } from 'antd';
import { commitNotice, getNotice } from '../services/notice';

// 模拟请求过程
function fetchSearch() {
  return new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}

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
    searchRes: [], // 搜索结果
    searchLoading: false, // 搜索加载状态
    pageNow: 0, // 当前已加载的页数
    endTime: '', // 当次请求的最后时间（refresh算一次，而fetchMore不算）
    moreLoading: false, // fetchMore状态
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
    // 初始化公告信息
    *refresh(_, { call, put }) {
      // 得到截止时间， 初始化状态
      const date = new Date();
      const endTime = `${date.getFullYear().toString()}-${(
        date.getMonth() + 1
      ).toString()}-${date.getDate().toString()}`;
      yield put({
        type: 'notice/save',
        payload: {
          loading: true,
          pageNow: 0,
          endTime,
        },
      });
      // api请求流程与fetchmore不同，这里不用查验count
      const param = {
        start_time: '1970-1-1',
        end_time: endTime,
        page: 0,
        limit: 8,
      };
      const res = yield call(getNotice, param);
      console.log(res);
      // 将结果直接替换旧的结果
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
    // 加载下一页
    *fetchMore(_, { call, put, select }) {
      const { pageNow, count, endTime, data } = yield select(state => state.notice);
      if ((pageNow + 1) * 8 < count) {
        // 按现在的页数中的内容，还未加载完全时
        yield put({
          type: 'save',
          payload: {
            moreLoading: true,
          },
        });
        const param = {
          start_time: '1970-1-1',
          end_time: endTime,
          page: pageNow + 1, // 请求新一页
          limit: 8,
        };
        const res = yield call(getNotice, param);
        console.log('wahtthe hell');
        Array.prototype.push.apply(data, res.data.notice);
        console.log(data);
        yield put({
          type: 'save',
          payload: {
            data,
            pageNow: pageNow + 1,
            moreLoading: false,
          },
        });
      }
    },
    *search(_, { call, put, select }) {
      const { searchWord, searchLoading } = yield select(state => state.notice);
      if (!searchLoading && searchWord.length >= 2) {
        yield put({
          type: 'save',
          payload: {
            searchLoading: true,
          },
        });
        const param = {
          searchWord,
        };
        const res = yield call(fetchSearch, param);
        console.log(res);
        yield put({
          type: 'save',
          payload: {
            searchLoading: false,
          },
        });
      }
    },
  },
};

export default NoticeModels;
