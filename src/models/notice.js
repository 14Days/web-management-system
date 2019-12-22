import { Modal, message } from 'antd';
import { getNotice, commitNotice, detailNotice, deleteNotcie, changeNotice, searchNotice } from '../services/notice';

// 用于快速搜索计算延时
function delayWaiting(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// 用于成功后在页面上调出成功弹窗提示
function showSuccess(msg) {
  return new Promise(resolve => {
    message.success({
      content: msg,
      centered: true,
    });
    resolve();
  });
}

// 用于成功后在页面上调出成功弹窗提示
function showFail(msg) {
  return new Promise(resolve => {
    message.error({
      content: msg,
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
    deleteLoading: false, // 删除加载状态
    // 搜索抽屉
    searchDrawer: false, // 搜索抽屉显示状态
    searchWord: '', // 搜索词
    searchCount: 0, // 搜索结果数量
    searchPage: 0, // 搜索结果页面
    searchRes: [], // 搜索结果
    searchResWord: '', // 正在展示的结果的搜索词
    searchLoading: false, // 搜索加载状态
    searchPageLoading: false, // 搜索下一页状态
    // 编辑对话框
    editTitle: '',
    editContent: '', // 正在编辑的内容
    editIsTop: false, // 正在编辑的是否顶置
    editView: false, // 编辑对话框显示
    editLoading: false, // 编辑发送状态
    searchCurrentView: false,
    searchEditView: false,
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
      const { title, content, postType, isTop } = yield select(state => state.notice);
      const res = yield call(commitNotice, title, content, postType, isTop);
      // ****** res 处理 *****
      // 退出发布对话框
      yield put({
        type: 'exitPost',
      });
      // 弹出成功弹窗
      if (res.status === 'success') {
        yield call(showSuccess, '通知发送成功！');
      } else {
        yield call(showFail, `抱歉，通知发送失败。 ${res.status}`);
      }
      // 刷新页面（避免旧数据误导）
      yield put({
        type: 'refresh',
      });
    },
    // 初始化通知信息
    *refresh(_, { call, put }) {
      // 显示加载状态，还原当前页为0，设置截止时间
      yield put({
        type: 'notice/save',
        payload: {
          loading: true,
          pageNow: 0,
        },
      });
      // 发送请求 （api请求流程与fetchmore不同，这里不用查验count
      const limit = 8;
      const page = 0;
      const res = yield call(getNotice, limit, page);
      // ****** res 处理 *****
      console.log(res);
      // 将结果直接替换旧的结果
      if (res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            last: Date(),
            loading: false,
            data: res.data.notice,
            count: res.data.count,
          },
        });
      } else {
        yield call(showFail, `抱歉，通知拉取失败。 ${res.status}`);
      }
    },
    // 加载下一页
    *fetchMore(_, { call, put, select }) {
      const { pageNow, count, data } = yield select(state => state.notice);
      if ((pageNow + 1) * 8 < count) {
        // 按现在的页数中的内容，还未加载完全时
        yield put({
          type: 'save',
          payload: {
            moreLoading: true,
          },
        });
        const limit = 8;
        const res = yield call(getNotice, limit, pageNow + 1);
        // 拼接data
        Array.prototype.push.apply(data, res.data.notice);
        if (res.status !== 'success') {
          yield call(showFail, `抱歉，通知加载失败。 ${res.status}`);
        } else {
          yield put({
            type: 'save',
            payload: {
              data,
              pageNow: pageNow + 1,
              moreLoading: false,
            },
          });
        }
      }
    },
    // 获得搜索结果
    *search(_, { call, put, select }) {
      const { searchWord } = yield select(state => state.notice);
      if (searchWord.length < 2) return;
      yield put({
        type: 'save',
        payload: {
          searchLoading: true,
        },
      });
      const limit = 8;
      const page = 0;
      const res = yield call(searchNotice, limit, page, searchWord);
      if (res.status === 'success') {
        yield put({
          type: 'save',
          payload: {
            searchCount: res.data.count,
            searchLoading: false,
            searchRes: res.data.notice,
            searchResWord: searchWord,
            searchPage: 0,
          },
        });
      } else {
        yield call(showFail, `抱歉，通知搜索失败。 ${res.status}`);
      }
    },
    // 快速搜索
    *fastSearch(_, { put, call, select }) {
      let { searchWord, searchLoading } = yield select(state => state.notice);
      if (!searchLoading && searchWord.length >= 2) {
        // 0.7s后若搜索词不变则自动搜索
        yield call(delayWaiting, 700);
        const oldWord = searchWord;
        searchWord = yield select(state => state.notice.searchWord);
        searchLoading = yield select(state => state.notice.searchLoading);
        if (!searchLoading && searchWord === oldWord) {
          yield put({
            type: 'search',
          });
        }
      }
    },
    // 搜索结果下一页
    *searchNextPage(_, { put, call, select }) {
      const { searchResWord, searchCount, searchPage } = yield select(state => state.notice);
      if ((searchPage + 1) * 8 < searchCount) {
        yield put({
          type: 'save',
          payload: {
            searchLoading: true,
          },
        });
        const limit = 8;
        const page = searchPage + 1;
        const res = yield call(searchNotice, limit, page, searchResWord);
        const { searchRes } = yield select(state => state.notice);
        Array.prototype.push.apply(searchRes, res.data.notice);
        if (res.status === 'success') {
          yield put({
            type: 'save',
            payload: {
              searchPage: page,
              searchLoading: false,
              searchRes,
            },
          });
        } else {
          yield call(showFail, `抱歉，搜索结果加载失败。 ${res.status}`);
        }
      }
    },
    // 获取公告详情
    *fetchInfo({ payload }, { call, put }) {
      const { currentId, search } = payload;
      if (search) {
        yield put({
          type: 'save',
          payload: {
            currentLoading: true,
            searchCurrentView: true,
            currentId,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            currentLoading: true,
            currentView: true,
            currentId,
          },
        });
      }
      const res = yield call(detailNotice, currentId);
      yield put({
        type: 'save',
        payload: {
          currentLoading: false,
          currentNotice: res.data,
        },
      });
      if (res.status !== 'success') {
        yield call(showFail, `抱歉，通知详情拉取失败。 ${res.status}`);
      }
    },
    // 编辑公告详情
    *handleChange({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          editLoading: true,
        },
      });
      const {
        currentId,
        currentNotice,
        editTitle,
        editContent,
        editIsTop,
      } = yield select(state => state.notice);
      const { search } = payload;
      const res = yield call(
        changeNotice,
        currentId,
        editTitle,
        editContent,
        currentNotice.type,
        editIsTop,
      );
      if (search === true) {
        yield put({
          type: 'save',
          payload: {
            editLoading: false,
            searchEditView: false,
            searchCurrentView: false,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            editLoading: false,
            editView: false,
          },
        });
      }
      if (res.status === 'success') {
        yield call(showSuccess, '通知修改成功！');
      } else {
        yield call(showFail, `抱歉，通知修改失败。 ${res.status}`);
      }
      yield put({
        type: 'refresh',
      });
      yield put({
        type: 'fastSearch',
      });
    },
    // 删除公告
    *handleDelete({ payload }, { call, put, select }) {
      const { search } = payload;
      yield put({
        type: 'save',
        payload: {
          deleteLoading: true,
        },
      });
      const { currentId } = yield select(state => state.notice);
      const res = yield call(deleteNotcie, currentId);
      if (search === true) {
        yield put({
          type: 'save',
          payload: {
            deleteLoading: false,
            searchCurrentView: false,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            deleteLoading: false,
            currentView: false,
          },
        });
      }
      if (res.status === 'success') {
        yield call(showSuccess, '通知删除成功！');
      } else {
        yield call(showFail, `抱歉，通知删除失败。 ${res.status}`);
      }
      yield put({
        type: 'refresh',
      });
    },
  },
};

export default NoticeModels;
