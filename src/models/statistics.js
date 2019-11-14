import { getRecord } from '../services/statistics'

const StatisticsModel = {
  namespace: 'statistics',
  state: {
    last: Date(), // 更新时间（拉取时间的截止时间）
    loading: false, // 是否处于加载状态
    interval: 1, // 当前查询的时间间隔
    numNewuser: 1,
    numNewrecommend: 1,
    styleLike: [],
    styleCollect: [],
    styleComment: [],
    designerPost: [],
    designerFollow: [],
    designerComment: [],
    designerLike: [],
  },
  reducers: {
    // 直接存储
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 添加 key 键并存储
    update(state, { payload }) {
      // 为数组内每一元素添加 key 键， 该键用于排名
      const styleLike = payload.styleLike.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const styleCollect = payload.styleCollect.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const styleComment = payload.styleComment.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const designerPost = payload.designerPost.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const designerFollow = payload.designerFollow.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const designerComment = payload.designerComment.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      const designerLike = payload.designerLike.map((ele, index) => ({
        ...ele,
        key: index + 1,
      }));
      return {
        ...state,
        ...payload,
        styleLike,
        styleCollect,
        styleComment,
        designerPost,
        designerFollow,
        designerComment,
        designerLike,
      }
    },
  },
  effects: {
    // 根据state请求并更新state（刷新时使用
    *refresh(_, { put, call, select }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      // 计算日期
      const dayEnd = new Date();
      const { interval } = yield select(state => state.statistics);
      const dayStart = new Date();
      dayStart.setDate(dayEnd.getDate() - interval);
      // 调用 api
      const res = yield call(getRecord, {
        start_date: dayStart,
        end_date: dayEnd,
      });
      if (res.status === 'success') {
        console.log('okk');
      }
      // 调用update更新state（添加key键（用于排名））
      yield put({
        type: 'update',
        payload: {
          last: dayEnd.toString(),
          loading: false,
          numNewuser: res.data.register,
          numNewrecommend: res.data.recommend,
          styleLike: res.data.style.like,
          styleCollect: res.data.style.collect,
          styleComment: res.data.style.comment,
          designerPost: res.data.designer.post,
          designerFollow: res.data.designer.follow,
          designerComment: res.data.designer.comment,
          designerLike: res.data.designer.like,
        },
      });
    },
    // 先改变state时间间隔，然后调用refresh按照当前state更新信息（切换间隔时使用
    *fetch({ payload }, { put }) {
      const { interval } = payload;
      yield put({
        type: 'save',
        payload: {
          interval,
        },
      });
      yield put({
        type: 'refresh',
      });
    },
  },
};

export default StatisticsModel;
