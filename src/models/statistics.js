import { getRecord } from '../services/statistics'

const StatisticsModel = {
  namespace: 'statistics',
  state: {
    last: Date(),
    loading: false,
    interval: 1,
    numNewuser: 1,
    numNewrecommend: 1,
    nameStylelike: 'fengge',
    numStylelike: 1,
    nameStylecollect: 'fengge',
    numStylecollect: 1,
    nameStylecomment: 'fengge',
    numStylecomment: 1,
    nameDesignpost: 'desi',
    numDesignpost: 1,
    nameDesignfollow: 'desi',
    numDesignfollow: 1,
    nameDesigncomment: 'desi',
    numDesigncomment: 1,
    nameDesignlike: 'desi',
    numDesignlike: 1,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
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
      // call api
      const dateNow = Date();
      const { interval } = yield select(state => state.statistics);
      const dateEnd = dateNow + interval;
      console.log('daend:', dateEnd);
      const res = yield call(getRecord, {
        start_date: dateNow,
        end_date: dateEnd,
      });
      if (res.status === 'success') {
        console.log('okk');
      }
      // yield call(() => {
      //   return new Promise(resolve => {
      //     setTimeout(resolve, 1000);
      //   });
      // });
      // set date
      console.log(res);
      yield put({
        type: 'save',
        payload: {
          last: dateNow,
          loading: false,
          numNewuser: res.data.register,
          numNewrecommend: res.data.recommend,
          nameStylelike: res.data.style.like.tag,
          numStylelike: res.data.style.like.num,
          nameStylecollect: res.data.style.collect.tag,
          numStylecollect: res.data.style.collect.num,
          nameStylecomment: res.data.style.comment.tag,
          numStylecomment: res.data.style.comment.num,
          nameDesignpost: res.data.designer.post.name,
          numDesignpost: res.data.designer.post.num,
          nameDesignfollow: res.data.designer.follow.name,
          numDesignfollow: res.data.designer.follow.num,
          nameDesigncomment: res.data.designer.comment.name,
          numDesigncomment: res.data.designer.comment.num,
          nameDesignlike: res.data.designer.like.name,
          numDesignlike: res.data.designer.like.num,
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
