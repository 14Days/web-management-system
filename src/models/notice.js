import { Modal } from 'antd';
import { getNotice, commitNotice, detailNotice, deleteNotcie, changeNotice } from '../services/notice';

// 模拟请求过程
function fetchSearch() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}

// 用于成功后在页面上调出成功弹窗提示
function showSuccess() {
  return new Promise(resolve => {
    Modal.success({
      content: '通知发布成功！',
      centered: true,
    });
    resolve();
  });
}

const NoticeModels = {
  namespace: 'notice',
  state: {
    last: Date(), // 最后更新时间
    // 页面整体
    loading: false, // 页面整体加载
    count: 0, // 获取到的通知条数
    data: [], // 获取到的通知信息
    pageNow: 0, // 当前已加载的页数
    endTime: '', // 当次请求的最后时间（refresh算一次，而fetchMore不算）
    moreLoading: false, // fetchMore状态
    // 发布对话框
    postView: false, // 发布对话框显示
    postLoading: false, // 发布通知状态
    postType: 0, // 发送通知类型
    title: '', // 发送通知名
    content: '', // 发送通知内容
    isTop: false, // 发送通知是否置顶
    // 详情对话框
    currentId: 0, // 当前详情noticeID
    currentNotice: {}, // 当前详情通知
    currentLoading: true, // 当前详情加载状态
    currentView: false, // 通知详情显示状态
    deleteLoading: false,
    // 搜索抽屉
    searchDrawer: false, // 搜索抽屉显示状态
    searchWord: '', // 搜索词
    searchRes: [], // 搜索结果
    searchLoading: false, // 搜索加载状态
    // 编辑对话框
    editTitle: '',
    editContent: '', // 正在编辑的内容
    editIsTop: false, // 正在编辑的是否顶置
    editView: false, // 编辑对话框显示
    editLoading: false, // 编辑发送状态
  },
  reducers: {
    save(prev, { payload }) {
      return {
        ...prev,
        ...payload,
      };
    },
    // 退出发布对话框
    exitPost(prev) {
      return {
        ...prev,
        // 还原内容
        title: '',
        content: '',
        postType: 0,
        // 还原状态
        postView: false,
        postLoading: false,
      };
    },
  },
  effects: {
    // 发布对话框-发送通知
    *send(_, { call, put, select }) {
      // 发布对话框显示加载
      yield put({
        type: 'notice/save',
        payload: {
          postLoading: true,
        },
      });
      // 发送请求
      const { title, content, type, isTop } = yield select(state => state.notice);
      const res = yield call(commitNotice, title, content, type, isTop);
      // ****** res 处理 *****
      console.log(res);
      // 退出发布对话框
      yield put({
        type: 'notice/exitPost',
      });
      // 弹出成功弹窗
      yield call(showSuccess);
      // 刷新页面（避免旧数据误导）
      yield put({
        type: 'notice/refresh',
      });
    },
    // 初始化通知信息
    *refresh(_, { call, put, select }) {
      // 得到截止时间， 初始化状态
      const date = new Date();
      const endTime = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()}-${date.getDate().toString()}`;
      // 显示加载状态，还原当前页为0，设置截止时间
      yield put({
        type: 'notice/save',
        payload: {
          loading: true,
          pageNow: 0,
          endTime,
        },
      });
      // 发送请求 （api请求流程与fetchmore不同，这里不用查验count
      const limit = 0;
      const page = 0;
      const startTime = '1970-1-1';
      const res = yield call(getNotice, limit, page, startTime, endTime);
      // ****** res 处理 *****
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
    * fetchMore(_, { call, put, select }) {
      const { pageNow, count, endTime, data } = yield select(state => state.notice);
      if ((pageNow + 1) * 8 < count) {
        // 按现在的页数中的内容，还未加载完全时
        yield put({
          type: 'save',
          payload: {
            moreLoading: true,
          },
        });
        const startTime = '1970-1-1';
        const limit = 8;
        const res = yield call(getNotice, limit, pageNow, startTime, endTime);
        // 拼接data
        Array.prototype.push.apply(data, res.data.notice)
        console.log(data);
        yield put({
          type: 'save',
          payload: {
            data,
            pageNow: pageNow + 1,
            moreLoading: false,
          },
        })
      }
    },
    // 获得搜索结果
    * search(_, { call, put, select }) {
      const { searchWord, searchLoading } = yield select(state => state.notice);
      if ((!searchLoading) && searchWord.length >= 2) {
        yield put({
          type: 'save',
          payload: {
            searchLoading: true,
          },
        })
        const param = {
          searchWord,
        }
        const res = yield call(fetchSearch, param);
        yield put({
          type: 'save',
          payload: {
            searchLoading: false,
          },
        })
      }
    },
    // 获取公告详情
    * fetchInfo({ payload }, { call, put, select }) {
      const { currentId } = payload;
      yield put({
        type: 'save',
        payload: {
          currentLoading: true,
          currentView: true,
          currentId,
        },
      })
      const res = yield call(detailNotice, currentId);
      console.log('infoo')
      console.log(res.data);
      yield put({
        type: 'save',
        payload: {
          currentLoading: false,
          currentNotice: res.data,
        },
      })
    },
    // 删除公告详情
    * handleChange(_, { call, put, select }) {
      console.log('?');
      yield put({
        type: 'save',
        payload: {
          editLoading: true,
        },
      });
    },
  },
};

export default NoticeModels;
